/*
 * 인트로의 파티클 장면(three.js). 점 수천 개가 세 가지 모습 사이를 오간다.
 *   A. 민트 잎(수학식으로 만든 점 데이터)  →  B. 3D 공간으로 흩어짐(노이즈 소용돌이 + 카메라 접근)
 *   →  C. UI 컴포넌트 와이어프레임 격자(카드·버튼·텍스트 줄의 윤곽선 위에 정렬)
 * 위치 계산은 전부 정점 셰이더에서 하고, 스크롤 진행도는 uniform 두 개(흩어짐·정렬)로만 넘긴다.
 * 점은 작고 선명한 원이다(가산 혼합·번짐 없음). three는 이 파일이 불려 올 때만 내려받는다(동적 import).
 */
import type * as THREE from "three";

export interface GridLayout {
  w: number;
  h: number;
  cols: number;
  rows: number;
  cellW: number;
  cellH: number;
  gap: number;
  /** 격자 중심의 화면 위쪽부터의 거리(px) */
  originY: number;
}

export interface ParticleScene {
  setProgress(p: number): void;
  resize(w: number, h: number, layout: GridLayout): void;
  setVisible(visible: boolean): void;
  dispose(): void;
}

const FOV = 40;
const FINAL_Z = 6;
const START_Z = 7;
/** 세로 화면(폭이 좁음)에서는 잎이 화면 밖으로 잘리지 않게 카메라를 더 멀리 둔다 */
const START_Z_PORTRAIT = 11.5;

/* ───────────── 난수·수학 ───────────── */

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const seg = (p: number, a: number, b: number) => clamp((p - a) / (b - a));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

function hex(c: string): [number, number, number] {
  const n = parseInt(c.slice(1), 16);
  return [(n >> 16) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}
const mix3 = (a: number[], b: number[], t: number): [number, number, number] => [
  lerp(a[0], b[0], t),
  lerp(a[1], b[1], t),
  lerp(a[2], b[2], t),
];

/* ───────────── A. MINT 로고 점 데이터 ───────────── */

const LEAF_BASE = hex("#0fa678");
const LEAF_MID = hex("#3be3a6");
// 밝은 배경(흰 화면) 위라 사이트 로고처럼 민트 잎 + 검은 잎으로 그린다(text/strong · gray-700)
const LOGO_WHITE = hex("#191d24");
const LOGO_WHITE_DIM = hex("#444b5a");

type Pt = [number, number];

/**
 * 브랜드 심볼(public/brand/mint_symbol_*.svg)의 잎 네 장. 좌표는 심볼 viewBox(12~53) 그대로이고,
 * 곡선 두 개(밑동→끝, 끝→밑동)로 이루어진 닫힌 도형이다. mint는 민트색, 아니면 흰색 잎.
 */
const LOGO_LEAVES: { curve: [Pt, Pt, Pt, Pt, Pt, Pt, Pt]; mint: boolean }[] = [
  {
    curve: [
      [34.63, 30.38],
      [35.39, 20.57],
      [43.19, 12.77],
      [53.01, 12],
      [52.25, 21.82],
      [44.45, 29.62],
      [34.63, 30.38],
    ],
    mint: true,
  },
  {
    curve: [
      [30.38, 34.63],
      [29.62, 44.45],
      [21.82, 52.25],
      [12, 53.01],
      [12.77, 43.19],
      [20.57, 35.39],
      [30.38, 34.63],
    ],
    mint: true,
  },
  {
    curve: [
      [34.63, 34.63],
      [44.45, 35.39],
      [52.25, 43.19],
      [53.01, 53.01],
      [43.19, 52.25],
      [35.39, 44.45],
      [34.63, 34.63],
    ],
    mint: false,
  },
  {
    curve: [
      [30.38, 30.38],
      [20.57, 29.62],
      [12.77, 21.82],
      [12, 12],
      [21.82, 12.77],
      [29.62, 20.57],
      [30.38, 30.38],
    ],
    mint: false,
  },
];
const LOGO_CENTER = 32.5;

function bezier(a: Pt, b: Pt, c: Pt, d: Pt, t: number): Pt {
  const m = 1 - t;
  const w = [m * m * m, 3 * m * m * t, 3 * m * t * t, t * t * t];
  return [
    w[0] * a[0] + w[1] * b[0] + w[2] * c[0] + w[3] * d[0],
    w[0] * a[1] + w[1] * b[1] + w[2] * c[1] + w[3] * d[1],
  ];
}

/** 잎 한 장의 윤곽을 짧은 선분으로 펼친 다각형 */
function leafPolygon(c: [Pt, Pt, Pt, Pt, Pt, Pt, Pt]): Pt[] {
  const pts: Pt[] = [];
  const N = 28;
  for (let i = 0; i <= N; i++) pts.push(bezier(c[0], c[1], c[2], c[3], i / N));
  for (let i = 1; i < N; i++) pts.push(bezier(c[3], c[4], c[5], c[6], i / N));
  return pts;
}

function insidePolygon(x: number, y: number, poly: Pt[]) {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i];
    const [xj, yj] = poly[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

/** 폴리곤 윤곽까지의 최단 거리(심볼 좌표 단위) */
function distanceToEdge(x: number, y: number, poly: Pt[]) {
  let best = Infinity;
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i];
    const b = poly[(i + 1) % poly.length];
    const vx = b[0] - a[0];
    const vy = b[1] - a[1];
    const t = clamp(((x - a[0]) * vx + (y - a[1]) * vy) / Math.max(vx * vx + vy * vy, 1e-9));
    best = Math.min(best, Math.hypot(x - (a[0] + vx * t), y - (a[1] + vy * t)));
  }
  return best;
}

/**
 * 로고의 잎 네 장을 조각(점)으로 채운다. 윤곽선은 그리지 않는다.
 * 안쪽은 고르게 채우고, 가장자리로 갈수록 성기게 만들어 일부를 바깥으로 흘려 보내서
 * 경계가 선이 아니라 모자이크 조각이 흩어지듯 풀리게 한다. 끝이 앞으로 살짝 나오는 깊이를 준다.
 */
function generateLogo(count: number, rng: () => number) {
  const SIZE = 3.5; // 로고 한 변(세계 단위)
  const scale = SIZE / 41;
  const pos = new Float32Array(count * 3);
  const col = new Float32Array(count * 3);
  const perLeaf = Math.floor(count / 4);

  let idx = 0;
  LOGO_LEAVES.forEach((leaf, k) => {
    const poly = leafPolygon(leaf.curve);
    const xs = poly.map((q) => q[0]);
    const ys = poly.map((q) => q[1]);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);
    const total = k === 3 ? count - idx : perLeaf;
    const depthSign = k % 2 === 0 ? 1 : -1;

    for (let n = 0; n < total; n++) {
      let x = 0;
      let y = 0;
      // 가장자리 가까이에서는 받아들일 확률을 낮춰 밀도가 서서히 줄어들게 한다
      for (let tries = 0; tries < 60; tries++) {
        x = lerp(minX, maxX, rng());
        y = lerp(minY, maxY, rng());
        if (!insidePolygon(x, y, poly)) continue;
        const e = distanceToEdge(x, y, poly);
        if (rng() < clamp(0.3 + e / 2.6)) break;
      }
      // 일부 조각은 경계 밖으로 흘러나간다(지수 분포라 대부분은 가깝고 몇 개만 멀리 간다)
      if (rng() < 0.12) {
        const a = rng() * Math.PI * 2;
        const r = -Math.log(1 - rng() * 0.98) * 1.1;
        x += Math.cos(a) * r;
        y += Math.sin(a) * r;
      }

      const dx = x - LOGO_CENTER;
      const dy = y - LOGO_CENTER;
      const d = clamp(Math.hypot(dx, dy) / 28); // 중심 0 → 끝 1
      const z = depthSign * (0.04 + 0.34 * d * d) + (rng() - 0.5) * 0.05;
      pos[idx * 3] = dx * scale;
      pos[idx * 3 + 1] = -dy * scale + 0.2;
      pos[idx * 3 + 2] = z;

      // 색: 조각마다 톤이 다르다(모자이크). 로고 색 그대로 민트 두 장, 흰 두 장
      const tone = clamp(0.25 * d + 0.75 * rng());
      const c: [number, number, number] = leaf.mint
        ? mix3(LEAF_BASE, LEAF_MID, tone)
        : mix3(LOGO_WHITE_DIM, LOGO_WHITE, tone);
      const j = 0.82 + rng() * 0.3;
      col[idx * 3] = Math.min(1, c[0] * j);
      col[idx * 3 + 1] = Math.min(1, c[1] * j);
      col[idx * 3 + 2] = Math.min(1, c[2] * j);
      idx++;
    }
  });
  return { pos, col };
}

/* ───────────── C. UI 와이어프레임 점 데이터 ───────────── */

interface Path {
  pts: Pt[];
  color: [number, number, number];
}

// 와이어프레임 선: 진한 선(gray-900) · 옅은 선(gray-400)
const WHITE: [number, number, number] = hex("#191d24");
const WIRE_DIM: [number, number, number] = hex("#a2aab9");
const MINT: [number, number, number] = LEAF_MID;

function rrect(cx: number, cy: number, w: number, h: number, r: number): Pt[] {
  const rr = Math.min(r, w / 2, h / 2);
  const pts: Pt[] = [];
  const corner = (ox: number, oy: number, a0: number) => {
    for (let s = 0; s <= 8; s++) {
      const a = a0 + (s / 8) * (Math.PI / 2);
      pts.push([ox + Math.cos(a) * rr, oy + Math.sin(a) * rr]);
    }
  };
  const x0 = cx - w / 2;
  const x1 = cx + w / 2;
  const y0 = cy - h / 2;
  const y1 = cy + h / 2;
  corner(x1 - rr, y0 + rr, -Math.PI / 2);
  corner(x1 - rr, y1 - rr, 0);
  corner(x0 + rr, y1 - rr, Math.PI / 2);
  corner(x0 + rr, y0 + rr, Math.PI);
  pts.push(pts[0]);
  return pts;
}

function circle(cx: number, cy: number, r: number): Pt[] {
  const pts: Pt[] = [];
  for (let s = 0; s <= 28; s++) {
    const a = (s / 28) * Math.PI * 2;
    pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]);
  }
  return pts;
}

const line = (x0: number, y0: number, x1: number, y1: number): Pt[] => [
  [x0, y0],
  [x1, y1],
];

/**
 * 카드 한 장 안의 와이어프레임. 실제 카드(Intro.tsx cell)의 MINT 컴포넌트 모양을 같은 순서로 대략 그린다.
 * 진한 선은 주인공(선택·채움), 옅은 선은 나머지다
 */
function cardPaths(i: number, cx: number, cy: number, w: number, h: number): Path[] {
  const out: Path[] = [{ pts: rrect(cx, cy, w, h, 16), color: WHITE }];
  const u = h * 0.1; // 칸 높이 기준 단위
  const push = (pts: Pt[], color: [number, number, number]) => out.push({ pts, color });
  switch (i) {
    case 0: // Button
      push(rrect(cx, cy, w * 0.36, u * 2.6, u * 0.6), MINT);
      push(line(cx - w * 0.06, cy, cx + w * 0.06, cy), MINT);
      break;
    case 1: // SegmentedControl: 트랙 + 가운데 선택 칩
      push(rrect(cx, cy, w * 0.6, u * 2.6, u * 0.6), WIRE_DIM);
      push(rrect(cx, cy, w * 0.18, u * 1.8, u * 0.4), WHITE);
      break;
    case 2: // Chip 셋(첫째 선택)
      for (let k = 0; k < 3; k++) {
        push(
          rrect(cx + (k - 1) * w * 0.22, cy, w * 0.18, u * 2.2, u * 0.5),
          k === 0 ? WHITE : WIRE_DIM,
        );
      }
      break;
    case 3: // Checkbox + Radio
      push(rrect(cx - w * 0.16, cy - u * 1.4, u * 1.4, u * 1.4, u * 0.3), MINT);
      push(line(cx - w * 0.08, cy - u * 1.4, cx + w * 0.16, cy - u * 1.4), WIRE_DIM);
      push(circle(cx - w * 0.16, cy + u * 1.4, u * 0.7), MINT);
      push(line(cx - w * 0.08, cy + u * 1.4, cx + w * 0.16, cy + u * 1.4), WIRE_DIM);
      break;
    case 4: // AvatarGroup(겹친 원 4개)
      for (let k = 0; k < 4; k++) {
        push(circle(cx + (k - 1.5) * u * 2.1, cy, u * 1.4), k === 3 ? WIRE_DIM : WHITE);
      }
      break;
    case 5: // Badge 셋
      for (let k = 0; k < 3; k++) {
        push(
          rrect(cx + (k - 1) * w * 0.2, cy, w * 0.15, u * 1.5, u * 0.3),
          k === 0 ? MINT : WIRE_DIM,
        );
      }
      break;
    case 6: // IconButton 셋
      for (let k = 0; k < 3; k++) {
        push(circle(cx + (k - 1) * u * 3, cy, u * 1.2), k === 2 ? MINT : WIRE_DIM);
      }
      break;
    case 7: // PageDots + PageCounter
      for (let k = 0; k < 5; k++) {
        push(circle(cx + (k - 2) * u * 0.9, cy - u * 1.2, u * 0.25), k === 1 ? WHITE : WIRE_DIM);
      }
      push(rrect(cx, cy + u * 1.2, w * 0.2, u * 1.6, u * 0.8), WHITE);
      break;
    case 8: // Skeleton: 원 + 두 줄
      push(circle(cx - w * 0.22, cy, u * 1.3), WIRE_DIM);
      push(line(cx - w * 0.1, cy - u * 0.6, cx + w * 0.3, cy - u * 0.6), WIRE_DIM);
      push(line(cx - w * 0.1, cy + u * 0.6, cx + w * 0.1, cy + u * 0.6), WIRE_DIM);
      break;
    case 9: // Text: 제목 + 설명
      push(line(cx - w * 0.2, cy - u * 0.8, cx + w * 0.2, cy - u * 0.8), WHITE);
      push(line(cx - w * 0.16, cy + u * 0.8, cx + w * 0.16, cy + u * 0.8), WIRE_DIM);
      break;
    case 10: // Circular + 로딩 버튼
      push(circle(cx - w * 0.2, cy, u * 0.9), MINT);
      push(rrect(cx + w * 0.08, cy, w * 0.3, u * 2.4, u * 0.6), MINT);
      break;
    default: // FramedCheckbox: 틀 + 체크 + 두 줄
      push(rrect(cx, cy, w * 0.66, u * 4, u * 0.8), MINT);
      push(rrect(cx - w * 0.24, cy - u * 0.6, u * 1.2, u * 1.2, u * 0.3), MINT);
      push(line(cx - w * 0.16, cy - u * 0.6, cx + w * 0.18, cy - u * 0.6), WIRE_DIM);
      push(line(cx - w * 0.16, cy + u * 0.8, cx + w * 0.1, cy + u * 0.8), WIRE_DIM);
  }
  return out;
}

/** 격자 칸 전체의 경로를 만들고, 길이에 비례해 count개의 점을 고르게 뿌린다. 좌표는 픽셀(중심 0, y는 아래로) */
function generateGrid(count: number, layout: GridLayout, rng: () => number) {
  const { cols, rows, cellW, cellH, gap } = layout;
  const total = cols * rows;
  const paths: Path[] = [];
  for (let i = 0; i < total; i++) {
    const cx = ((i % cols) - (cols - 1) / 2) * cellW;
    const cy = (Math.floor(i / cols) - (rows - 1) / 2) * cellH;
    paths.push(...cardPaths(i, cx, cy, cellW - gap, cellH - gap));
  }

  // 구간(선분) 목록과 누적 길이
  const segs: { a: Pt; b: Pt; len: number; color: [number, number, number] }[] = [];
  let length = 0;
  for (const path of paths) {
    for (let k = 0; k < path.pts.length - 1; k++) {
      const a = path.pts[k];
      const b = path.pts[k + 1];
      const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
      if (len > 0) {
        segs.push({ a, b, len, color: path.color });
        length += len;
      }
    }
  }

  const xy = new Float32Array(count * 2);
  const col = new Float32Array(count * 3);
  let si = 0;
  let acc = 0;
  for (let j = 0; j < count; j++) {
    const s = ((j + rng() * 0.8) / count) * length;
    while (si < segs.length - 1 && acc + segs[si].len < s) {
      acc += segs[si].len;
      si++;
    }
    const sg = segs[si];
    const t = clamp((s - acc) / sg.len);
    xy[j * 2] = lerp(sg.a[0], sg.b[0], t);
    xy[j * 2 + 1] = lerp(sg.a[1], sg.b[1], t);
    col[j * 3] = sg.color[0];
    col[j * 3 + 1] = sg.color[1];
    col[j * 3 + 2] = sg.color[2];
  }
  return { xy, col };
}

/* ───────────── 셰이더 ───────────── */

const NOISE = /* glsl */ `
vec3 mod289(vec3 x){return x - floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x - floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute(permute(permute(i.z + vec4(0.0, i1.z, i2.z, 1.0)) + i.y + vec4(0.0, i1.y, i2.y, 1.0)) + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m * m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}
`;

const VERTEX = /* glsl */ `
${NOISE}
attribute vec3 aGrid;
attribute vec3 aGridColor;
attribute vec3 aColor;
attribute vec4 aRand;
attribute float aDelay;

uniform float uTime;
uniform float uP1;     // 흩어짐 0~1
uniform float uP2;     // 정렬 0~1
uniform float uPR;
uniform float uSize;
uniform float uSizeGrid;
uniform float uSafe;   // 글자 자리를 비울 정도
uniform float uFade;
uniform float uAspect;

varying vec3 vColor;
varying float vAlpha;

float easeInOut(float t){ return t < 0.5 ? 4.0*t*t*t : 1.0 - pow(-2.0*t + 2.0, 3.0)/2.0; }

void main() {
  // 1) 로고: 가만히 있는다(울렁임 없음)
  vec3 leaf = position;
  float t = uTime;

  // 2) 흩어짐: 결속이 풀린 점이 소용돌이치며 카메라 쪽으로 퍼진다(점마다 시작 시점이 다르다)
  float t1 = clamp((uP1 - aRand.x * 0.4) / 0.6, 0.0, 1.0);
  float e1 = easeInOut(t1);
  vec3 dir = normalize(vec3(aRand.y - 0.5, aRand.z - 0.5, aRand.w * 0.9 + 0.1) * vec3(2.2, 1.7, 2.0));
  float dist = 1.6 + aRand.x * 4.6;
  vec3 q = leaf * 0.45 + vec3(0.0, 0.0, t * 0.08);
  vec3 swirl = vec3(snoise(q + 2.0), snoise(q + 11.0), snoise(q + 23.0));
  vec3 scatter = leaf + dir * dist + swirl * 1.5;
  vec3 p1 = mix(leaf, scatter, e1);

  // 3) 정렬: 곡선이 아니라 직선으로, 자석에 붙듯 빠르게 붙는다
  float t2 = clamp((uP2 - aDelay) / 0.55, 0.0, 1.0);
  float e2 = 1.0 - pow(2.0, -10.0 * t2);
  e2 = t2 >= 1.0 ? 1.0 : e2;
  vec3 pos = mix(p1, aGrid, e2);

  vec4 mv = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * mv;

  // 점 크기: 가까우면 크고 멀면 작다. 격자가 되면 작고 선명하게
  float size = mix(uSize, uSizeGrid, e2);
  gl_PointSize = clamp(size * uPR * (7.0 / -mv.z), 1.0 * uPR, 11.0 * uPR);

  vColor = mix(aColor, aGridColor, e2);

  // 투명도: 너무 가까운 점은 사라지고, 글자 자리(화면 가운데)는 흩어지는 동안 비운다
  vec2 ndc = gl_Position.xy / gl_Position.w;
  float centerDist = length(ndc * vec2(uAspect * 0.38, 0.8));
  float safe = mix(1.0, smoothstep(0.12, 0.5, centerDist), uSafe * 0.96 * (1.0 - e2));
  float nearFade = smoothstep(0.5, 1.8, -mv.z);
  vAlpha = safe * nearFade * uFade * mix(0.9, 1.0, e2);
}
`;

const FRAGMENT = /* glsl */ `
varying vec3 vColor;
varying float vAlpha;
void main() {
  // 작고 선명한 원점(번짐 없음)
  float d = length(gl_PointCoord - 0.5);
  float a = 1.0 - smoothstep(0.38, 0.5, d);
  if (a < 0.02 || vAlpha < 0.01) discard;
  gl_FragColor = vec4(vColor, a * vAlpha);
}
`;

/* ───────────── 장면 ───────────── */

export async function createParticleScene(
  canvas: HTMLCanvasElement,
  initial: GridLayout,
  options: { reducedMotion: boolean },
): Promise<ParticleScene> {
  const T = await import("three");

  const portrait = initial.w < 768;
  const COUNT = portrait ? 5200 : 10500;

  const renderer = new T.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: false,
    powerPreference: "high-performance",
  });
  const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
  renderer.setPixelRatio(pixelRatio);
  renderer.setClearColor(0x000000, 0);

  const scene = new T.Scene();
  const camera = new T.PerspectiveCamera(FOV, initial.w / initial.h, 0.1, 50);
  let startZ = portrait ? START_Z_PORTRAIT : START_Z;
  camera.position.set(0, 0, startZ);

  const rng = mulberry32(20260511);
  const leaf = generateLogo(COUNT, rng);

  const geometry = new T.BufferGeometry();
  const aRand = new Float32Array(COUNT * 4);
  for (let i = 0; i < COUNT * 4; i++) aRand[i] = rng();
  const aGrid = new Float32Array(COUNT * 3);
  const aGridColor = new Float32Array(COUNT * 3);
  const aDelay = new Float32Array(COUNT);

  geometry.setAttribute("position", new T.BufferAttribute(leaf.pos, 3));
  geometry.setAttribute("aColor", new T.BufferAttribute(leaf.col, 3));
  geometry.setAttribute("aRand", new T.BufferAttribute(aRand, 4));
  geometry.setAttribute("aGrid", new T.BufferAttribute(aGrid, 3));
  geometry.setAttribute("aGridColor", new T.BufferAttribute(aGridColor, 3));
  geometry.setAttribute("aDelay", new T.BufferAttribute(aDelay, 1));
  // 점이 화면 어디로 가든 잘리지 않게 한다
  geometry.boundingSphere = new T.Sphere(new T.Vector3(), 50);

  const uniforms = {
    uTime: { value: 0 },
    uP1: { value: 0 },
    uP2: { value: 0 },
    uPR: { value: pixelRatio },
    uSize: { value: portrait ? 3.9 : 2.5 },
    uSizeGrid: { value: portrait ? 2.1 : 1.9 },
    uSafe: { value: 0 },
    uFade: { value: 1 },
    uAspect: { value: initial.w / initial.h },
  };
  const material = new T.ShaderMaterial({
    uniforms,
    vertexShader: VERTEX,
    fragmentShader: FRAGMENT,
    transparent: true,
    depthWrite: false,
  });
  const points = new T.Points(geometry, material);
  points.frustumCulled = false;
  scene.add(points);

  // 격자 목표 좌표(픽셀 → 세계 단위). 카메라가 FINAL_Z에 있을 때 DOM 카드와 정확히 겹친다
  const buildGrid = (layout: GridLayout) => {
    const gridRng = mulberry32(777);
    const grid = generateGrid(COUNT, layout, gridRng);
    const visibleH = 2 * Math.tan((FOV * Math.PI) / 360) * FINAL_Z;
    const scale = visibleH / layout.h;
    const halfW = (layout.cols * layout.cellW) / 2;
    const order = new Uint32Array(COUNT);
    for (let i = 0; i < COUNT; i++) order[i] = i;
    // 잎 점과 격자 점을 무작위로 짝짓는다(섞는다)
    for (let i = COUNT - 1; i > 0; i--) {
      const j = Math.floor(gridRng() * (i + 1));
      const t = order[i];
      order[i] = order[j];
      order[j] = t;
    }
    for (let i = 0; i < COUNT; i++) {
      const s = order[i];
      const px = grid.xy[s * 2];
      const py = grid.xy[s * 2 + 1];
      aGrid[i * 3] = px * scale;
      aGrid[i * 3 + 1] = (layout.h / 2 - (layout.originY + py)) * scale;
      aGrid[i * 3 + 2] = 0;
      aGridColor[i * 3] = grid.col[s * 3];
      aGridColor[i * 3 + 1] = grid.col[s * 3 + 1];
      aGridColor[i * 3 + 2] = grid.col[s * 3 + 2];
      // 왼쪽에서 오른쪽으로 쓸리듯 붙고, 점마다 조금씩 어긋난다
      aDelay[i] = clamp((px / halfW + 1) / 2) * 0.32 + aRand[i * 4 + 1] * 0.1;
    }
    (geometry.getAttribute("aGrid") as THREE.BufferAttribute).needsUpdate = true;
    (geometry.getAttribute("aGridColor") as THREE.BufferAttribute).needsUpdate = true;
    (geometry.getAttribute("aDelay") as THREE.BufferAttribute).needsUpdate = true;
  };
  buildGrid(initial);
  renderer.setSize(initial.w, initial.h, false);

  /* 스크롤 진행도를 부드럽게 따라가고(감쇠), 카메라·셰이더 값을 갱신한다 */
  let target = 0;
  let smooth = 0;
  let visible = true;
  let raf = 0;
  let last = performance.now();
  let mouseX = 0;
  let mouseY = 0;
  let camX = 0;
  let camY = 0;

  const onPointer = (e: PointerEvent) => {
    mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    mouseY = (e.clientY / window.innerHeight) * 2 - 1;
  };
  if (!options.reducedMotion) window.addEventListener("pointermove", onPointer, { passive: true });

  const frame = (now: number) => {
    raf = requestAnimationFrame(frame);
    if (!visible) {
      last = now;
      return;
    }
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    smooth += (target - smooth) * (1 - Math.exp(-dt * 7));
    const p = smooth;

    uniforms.uTime.value += options.reducedMotion ? 0 : dt;
    uniforms.uP1.value = seg(p, 0.3, 0.6);
    uniforms.uP2.value = seg(p, 0.6, 0.86);
    // 글자가 정중앙에 오므로 첫 장면부터 글자 뒤를 비워 두고(시인성), 격자가 되기 전에 다시 채운다
    uniforms.uSafe.value = 1 - seg(p, 0.52, 0.66);
    uniforms.uFade.value = 1 - seg(p, 0.92, 0.975);

    // 카메라: 흩어지는 동안 다가오고, 정렬하면서 격자 거리로 물러난다
    const dolly = easeInOut(seg(p, 0.3, 0.55));
    const back = easeInOut(seg(p, 0.58, 0.86));
    const z = lerp(lerp(startZ, 4.3, dolly), FINAL_Z, back);
    // 포인터를 따라 아주 조금 움직인다(격자가 완성되면 0으로 돌아와 DOM 카드와 어긋나지 않는다)
    const parallax = 1 - seg(p, 0.6, 0.86);
    camX += (mouseX * 0.35 * parallax - camX) * 0.05;
    camY += (-mouseY * 0.22 * parallax - camY) * 0.05;
    camera.position.set(camX, camY, z);
    camera.lookAt(0, 0, 0);
    points.rotation.z = lerp(0, 0.5, easeInOut(seg(p, 0.3, 0.6))) * (1 - seg(p, 0.6, 0.72));

    renderer.render(scene, camera);
  };
  raf = requestAnimationFrame(frame);

  return {
    setProgress(p) {
      target = clamp(p);
    },
    resize(w, h, layout) {
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      uniforms.uAspect.value = w / h;
      const narrow = w < 768;
      startZ = narrow ? START_Z_PORTRAIT : START_Z;
      uniforms.uSize.value = narrow ? 3.9 : 2.5;
      buildGrid(layout);
    },
    setVisible(v) {
      visible = v;
    },
    dispose() {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onPointer);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    },
  };
}
