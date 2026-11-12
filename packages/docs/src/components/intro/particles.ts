/*
 * 인트로의 파티클 장면(three.js). 점 수천 개가 세 가지 모습 사이를 오간다.
 *   A. 민트 잎(수학식으로 만든 점 데이터)  →  B. 3D 공간으로 흩어짐(노이즈 소용돌이 + 카메라 접근)
 *   →  C. UI 컴포넌트 와이어프레임 격자(카드·버튼·텍스트 줄의 윤곽선 위에 정렬)
 * 위치 계산은 전부 정점 셰이더에서 하고, 스크롤 진행도는 uniform 두 개(흩어짐·정렬)로만 넘긴다.
 * 점은 작고 선명한 원이다(가산 혼합·번짐 없음). three는 이 파일이 불려 올 때만 내려받는다(동적 import).
 */
import type * as THREE from "three";

export interface GridLayout {
  width: number;
  height: number;
  columns: number;
  rows: number;
  cellWidth: number;
  cellHeight: number;
  gap: number;
  /** 격자 중심의 화면 위쪽부터의 거리(px) */
  originY: number;
}

export interface ParticleScene {
  setProgress(progress: number): void;
  resize(width: number, height: number, layout: GridLayout): void;
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
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let mixed = state;
    mixed = Math.imul(mixed ^ (mixed >>> 15), mixed | 1);
    mixed ^= mixed + Math.imul(mixed ^ (mixed >>> 7), mixed | 61);
    return ((mixed ^ (mixed >>> 14)) >>> 0) / 4294967296;
  };
}

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const rangeProgress = (progress: number, start: number, end: number) =>
  clamp((progress - start) / (end - start));
const lerp = (start: number, end: number, amount: number) => start + (end - start) * amount;
const easeInOut = (progress: number) =>
  progress < 0.5 ? 4 * progress * progress * progress : 1 - Math.pow(-2 * progress + 2, 3) / 2;

function hex(color: string): [number, number, number] {
  const value = parseInt(color.slice(1), 16);
  return [(value >> 16) / 255, ((value >> 8) & 255) / 255, (value & 255) / 255];
}
const mix3 = (start: number[], end: number[], amount: number): [number, number, number] => [
  lerp(start[0], end[0], amount),
  lerp(start[1], end[1], amount),
  lerp(start[2], end[2], amount),
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

function bezier(start: Pt, control1: Pt, control2: Pt, end: Pt, progress: number): Pt {
  const remaining = 1 - progress;
  const weights = [
    remaining * remaining * remaining,
    3 * remaining * remaining * progress,
    3 * remaining * progress * progress,
    progress * progress * progress,
  ];
  return [
    weights[0] * start[0] +
      weights[1] * control1[0] +
      weights[2] * control2[0] +
      weights[3] * end[0],
    weights[0] * start[1] +
      weights[1] * control1[1] +
      weights[2] * control2[1] +
      weights[3] * end[1],
  ];
}

/** 잎 한 장의 윤곽을 짧은 선분으로 펼친 다각형 */
function leafPolygon(curve: [Pt, Pt, Pt, Pt, Pt, Pt, Pt]): Pt[] {
  const points: Pt[] = [];
  const samplesPerCurve = 28;
  for (let sample = 0; sample <= samplesPerCurve; sample++) {
    points.push(bezier(curve[0], curve[1], curve[2], curve[3], sample / samplesPerCurve));
  }
  for (let sample = 1; sample < samplesPerCurve; sample++) {
    points.push(bezier(curve[3], curve[4], curve[5], curve[6], sample / samplesPerCurve));
  }
  return points;
}

function insidePolygon(x: number, y: number, polygon: Pt[]) {
  let inside = false;
  for (
    let index = 0, previousIndex = polygon.length - 1;
    index < polygon.length;
    previousIndex = index++
  ) {
    const [currentX, currentY] = polygon[index];
    const [previousX, previousY] = polygon[previousIndex];
    if (
      currentY > y !== previousY > y &&
      x < ((previousX - currentX) * (y - currentY)) / (previousY - currentY) + currentX
    ) {
      inside = !inside;
    }
  }
  return inside;
}

/** 폴리곤 윤곽까지의 최단 거리(심볼 좌표 단위) */
function distanceToEdge(x: number, y: number, polygon: Pt[]) {
  let best = Infinity;
  for (let index = 0; index < polygon.length; index++) {
    const start = polygon[index];
    const end = polygon[(index + 1) % polygon.length];
    const edgeX = end[0] - start[0];
    const edgeY = end[1] - start[1];
    const projection = clamp(
      ((x - start[0]) * edgeX + (y - start[1]) * edgeY) /
        Math.max(edgeX * edgeX + edgeY * edgeY, 1e-9),
    );
    best = Math.min(
      best,
      Math.hypot(x - (start[0] + edgeX * projection), y - (start[1] + edgeY * projection)),
    );
  }
  return best;
}

/**
 * 로고의 잎 네 장을 조각(점)으로 채운다. 윤곽선은 그리지 않는다.
 * 안쪽은 고르게 채우고, 가장자리로 갈수록 성기게 만들어 일부를 바깥으로 흘려 보내서
 * 경계가 선이 아니라 모자이크 조각이 흩어지듯 풀리게 한다. 끝이 앞으로 살짝 나오는 깊이를 준다.
 */
function generateLogo(count: number, random: () => number) {
  const SIZE = 3.5; // 로고 한 변(세계 단위)
  const scale = SIZE / 41;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const perLeaf = Math.floor(count / 4);

  let pointIndex = 0;
  LOGO_LEAVES.forEach((leaf, leafIndex) => {
    const polygon = leafPolygon(leaf.curve);
    const xValues = polygon.map((point) => point[0]);
    const yValues = polygon.map((point) => point[1]);
    const minX = Math.min(...xValues);
    const maxX = Math.max(...xValues);
    const minY = Math.min(...yValues);
    const maxY = Math.max(...yValues);
    const total = leafIndex === 3 ? count - pointIndex : perLeaf;
    const depthSign = leafIndex % 2 === 0 ? 1 : -1;

    for (let leafPointIndex = 0; leafPointIndex < total; leafPointIndex++) {
      let x = 0;
      let y = 0;
      // 가장자리 가까이에서는 받아들일 확률을 낮춰 밀도가 서서히 줄어들게 한다
      for (let tries = 0; tries < 60; tries++) {
        x = lerp(minX, maxX, random());
        y = lerp(minY, maxY, random());
        if (!insidePolygon(x, y, polygon)) continue;
        const edgeDistance = distanceToEdge(x, y, polygon);
        if (random() < clamp(0.3 + edgeDistance / 2.6)) break;
      }
      // 일부 조각은 경계 밖으로 흘러나간다(지수 분포라 대부분은 가깝고 몇 개만 멀리 간다)
      if (random() < 0.12) {
        const angle = random() * Math.PI * 2;
        const driftDistance = -Math.log(1 - random() * 0.98) * 1.1;
        x += Math.cos(angle) * driftDistance;
        y += Math.sin(angle) * driftDistance;
      }

      const offsetX = x - LOGO_CENTER;
      const offsetY = y - LOGO_CENTER;
      const distanceFromCenter = clamp(Math.hypot(offsetX, offsetY) / 28); // 중심 0 → 끝 1
      const z =
        depthSign * (0.04 + 0.34 * distanceFromCenter * distanceFromCenter) +
        (random() - 0.5) * 0.05;
      positions[pointIndex * 3] = offsetX * scale;
      positions[pointIndex * 3 + 1] = -offsetY * scale + 0.2;
      positions[pointIndex * 3 + 2] = z;

      // 색: 조각마다 톤이 다르다(모자이크). 로고 색 그대로 민트 두 장, 흰 두 장
      const tone = clamp(0.25 * distanceFromCenter + 0.75 * random());
      const color: [number, number, number] = leaf.mint
        ? mix3(LEAF_BASE, LEAF_MID, tone)
        : mix3(LOGO_WHITE_DIM, LOGO_WHITE, tone);
      const brightness = 0.82 + random() * 0.3;
      colors[pointIndex * 3] = Math.min(1, color[0] * brightness);
      colors[pointIndex * 3 + 1] = Math.min(1, color[1] * brightness);
      colors[pointIndex * 3 + 2] = Math.min(1, color[2] * brightness);
      pointIndex++;
    }
  });
  return { positions, colors };
}

/* ───────────── C. UI 와이어프레임 점 데이터 ───────────── */

interface Path {
  points: Pt[];
  color: [number, number, number];
}

// 와이어프레임 선: 진한 선(gray-900) · 옅은 선(gray-400)
const WHITE: [number, number, number] = hex("#191d24");
const WIRE_DIM: [number, number, number] = hex("#a2aab9");
const MINT: [number, number, number] = LEAF_MID;

function roundedRectangle(
  centerX: number,
  centerY: number,
  width: number,
  height: number,
  radius: number,
): Pt[] {
  const cornerRadius = Math.min(radius, width / 2, height / 2);
  const points: Pt[] = [];
  const corner = (cornerCenterX: number, cornerCenterY: number, startAngle: number) => {
    for (let step = 0; step <= 8; step++) {
      const angle = startAngle + (step / 8) * (Math.PI / 2);
      points.push([
        cornerCenterX + Math.cos(angle) * cornerRadius,
        cornerCenterY + Math.sin(angle) * cornerRadius,
      ]);
    }
  };
  const left = centerX - width / 2;
  const right = centerX + width / 2;
  const top = centerY - height / 2;
  const bottom = centerY + height / 2;
  corner(right - cornerRadius, top + cornerRadius, -Math.PI / 2);
  corner(right - cornerRadius, bottom - cornerRadius, 0);
  corner(left + cornerRadius, bottom - cornerRadius, Math.PI / 2);
  corner(left + cornerRadius, top + cornerRadius, Math.PI);
  points.push(points[0]);
  return points;
}

function circle(centerX: number, centerY: number, radius: number): Pt[] {
  const points: Pt[] = [];
  for (let step = 0; step <= 28; step++) {
    const angle = (step / 28) * Math.PI * 2;
    points.push([centerX + Math.cos(angle) * radius, centerY + Math.sin(angle) * radius]);
  }
  return points;
}

const line = (startX: number, startY: number, endX: number, endY: number): Pt[] => [
  [startX, startY],
  [endX, endY],
];

/**
 * 카드 한 장 안의 와이어프레임. 실제 카드(Intro.tsx cell)의 MINT 컴포넌트 모양을 같은 순서로 대략 그린다.
 * 진한 선은 주인공(선택·채움), 옅은 선은 나머지다
 */
function cardPaths(
  cardIndex: number,
  centerX: number,
  centerY: number,
  width: number,
  height: number,
): Path[] {
  const paths: Path[] = [
    { points: roundedRectangle(centerX, centerY, width, height, 16), color: WHITE },
  ];
  const unit = height * 0.1; // 칸 높이 기준 단위
  const push = (points: Pt[], color: [number, number, number]) =>
    paths.push({ points: points, color });
  switch (cardIndex) {
    case 0: // Button
      push(roundedRectangle(centerX, centerY, width * 0.36, unit * 2.6, unit * 0.6), MINT);
      push(line(centerX - width * 0.06, centerY, centerX + width * 0.06, centerY), MINT);
      break;
    case 1: // SegmentedControl: 트랙 + 가운데 선택 칩
      push(roundedRectangle(centerX, centerY, width * 0.6, unit * 2.6, unit * 0.6), WIRE_DIM);
      push(roundedRectangle(centerX, centerY, width * 0.18, unit * 1.8, unit * 0.4), WHITE);
      break;
    case 2: // Chip 셋(첫째 선택)
      for (let itemIndex = 0; itemIndex < 3; itemIndex++) {
        push(
          roundedRectangle(
            centerX + (itemIndex - 1) * width * 0.22,
            centerY,
            width * 0.18,
            unit * 2.2,
            unit * 0.5,
          ),
          itemIndex === 0 ? WHITE : WIRE_DIM,
        );
      }
      break;
    case 3: // Checkbox + Radio
      push(
        roundedRectangle(
          centerX - width * 0.16,
          centerY - unit * 1.4,
          unit * 1.4,
          unit * 1.4,
          unit * 0.3,
        ),
        MINT,
      );
      push(
        line(
          centerX - width * 0.08,
          centerY - unit * 1.4,
          centerX + width * 0.16,
          centerY - unit * 1.4,
        ),
        WIRE_DIM,
      );
      push(circle(centerX - width * 0.16, centerY + unit * 1.4, unit * 0.7), MINT);
      push(
        line(
          centerX - width * 0.08,
          centerY + unit * 1.4,
          centerX + width * 0.16,
          centerY + unit * 1.4,
        ),
        WIRE_DIM,
      );
      break;
    case 4: // AvatarGroup(겹친 원 4개)
      for (let itemIndex = 0; itemIndex < 4; itemIndex++) {
        push(
          circle(centerX + (itemIndex - 1.5) * unit * 2.1, centerY, unit * 1.4),
          itemIndex === 3 ? WIRE_DIM : WHITE,
        );
      }
      break;
    case 5: // Badge 셋
      for (let itemIndex = 0; itemIndex < 3; itemIndex++) {
        push(
          roundedRectangle(
            centerX + (itemIndex - 1) * width * 0.2,
            centerY,
            width * 0.15,
            unit * 1.5,
            unit * 0.3,
          ),
          itemIndex === 0 ? MINT : WIRE_DIM,
        );
      }
      break;
    case 6: // IconButton 셋
      for (let itemIndex = 0; itemIndex < 3; itemIndex++) {
        push(
          circle(centerX + (itemIndex - 1) * unit * 3, centerY, unit * 1.2),
          itemIndex === 2 ? MINT : WIRE_DIM,
        );
      }
      break;
    case 7: // PageDots + PageCounter
      for (let itemIndex = 0; itemIndex < 5; itemIndex++) {
        push(
          circle(centerX + (itemIndex - 2) * unit * 0.9, centerY - unit * 1.2, unit * 0.25),
          itemIndex === 1 ? WHITE : WIRE_DIM,
        );
      }
      push(
        roundedRectangle(centerX, centerY + unit * 1.2, width * 0.2, unit * 1.6, unit * 0.8),
        WHITE,
      );
      break;
    case 8: // Skeleton: 원 + 두 줄
      push(circle(centerX - width * 0.22, centerY, unit * 1.3), WIRE_DIM);
      push(
        line(
          centerX - width * 0.1,
          centerY - unit * 0.6,
          centerX + width * 0.3,
          centerY - unit * 0.6,
        ),
        WIRE_DIM,
      );
      push(
        line(
          centerX - width * 0.1,
          centerY + unit * 0.6,
          centerX + width * 0.1,
          centerY + unit * 0.6,
        ),
        WIRE_DIM,
      );
      break;
    case 9: // Text: 제목 + 설명
      push(
        line(
          centerX - width * 0.2,
          centerY - unit * 0.8,
          centerX + width * 0.2,
          centerY - unit * 0.8,
        ),
        WHITE,
      );
      push(
        line(
          centerX - width * 0.16,
          centerY + unit * 0.8,
          centerX + width * 0.16,
          centerY + unit * 0.8,
        ),
        WIRE_DIM,
      );
      break;
    case 10: // Circular + 로딩 버튼
      push(circle(centerX - width * 0.2, centerY, unit * 0.9), MINT);
      push(
        roundedRectangle(centerX + width * 0.08, centerY, width * 0.3, unit * 2.4, unit * 0.6),
        MINT,
      );
      break;
    default: // FramedCheckbox: 틀 + 체크 + 두 줄
      push(roundedRectangle(centerX, centerY, width * 0.66, unit * 4, unit * 0.8), MINT);
      push(
        roundedRectangle(
          centerX - width * 0.24,
          centerY - unit * 0.6,
          unit * 1.2,
          unit * 1.2,
          unit * 0.3,
        ),
        MINT,
      );
      push(
        line(
          centerX - width * 0.16,
          centerY - unit * 0.6,
          centerX + width * 0.18,
          centerY - unit * 0.6,
        ),
        WIRE_DIM,
      );
      push(
        line(
          centerX - width * 0.16,
          centerY + unit * 0.8,
          centerX + width * 0.1,
          centerY + unit * 0.8,
        ),
        WIRE_DIM,
      );
  }
  return paths;
}

/** 격자 칸 전체의 경로를 만들고, 길이에 비례해 count개의 점을 고르게 뿌린다. 좌표는 픽셀(중심 0, y는 아래로) */
function generateGrid(count: number, layout: GridLayout, random: () => number) {
  const { columns: columnCount, rows, cellWidth, cellHeight, gap } = layout;
  const total = columnCount * rows;
  const paths: Path[] = [];
  for (let cardIndex = 0; cardIndex < total; cardIndex++) {
    const centerX = ((cardIndex % columnCount) - (columnCount - 1) / 2) * cellWidth;
    const centerY = (Math.floor(cardIndex / columnCount) - (rows - 1) / 2) * cellHeight;
    paths.push(...cardPaths(cardIndex, centerX, centerY, cellWidth - gap, cellHeight - gap));
  }

  // 구간(선분) 목록과 누적 길이
  const segments: { start: Pt; end: Pt; length: number; color: [number, number, number] }[] = [];
  let totalLength = 0;
  for (const path of paths) {
    for (let pointIndex = 0; pointIndex < path.points.length - 1; pointIndex++) {
      const start = path.points[pointIndex];
      const end = path.points[pointIndex + 1];
      const segmentLength = Math.hypot(end[0] - start[0], end[1] - start[1]);
      if (segmentLength > 0) {
        segments.push({ start: start, end: end, length: segmentLength, color: path.color });
        totalLength += segmentLength;
      }
    }
  }

  const coordinates = new Float32Array(count * 2);
  const colors = new Float32Array(count * 3);
  let segmentIndex = 0;
  let lengthBeforeSegment = 0;
  for (let pointIndex = 0; pointIndex < count; pointIndex++) {
    const distanceAlongPaths = ((pointIndex + random() * 0.8) / count) * totalLength;
    while (
      segmentIndex < segments.length - 1 &&
      lengthBeforeSegment + segments[segmentIndex].length < distanceAlongPaths
    ) {
      lengthBeforeSegment += segments[segmentIndex].length;
      segmentIndex++;
    }
    const segment = segments[segmentIndex];
    const progress = clamp((distanceAlongPaths - lengthBeforeSegment) / segment.length);
    coordinates[pointIndex * 2] = lerp(segment.start[0], segment.end[0], progress);
    coordinates[pointIndex * 2 + 1] = lerp(segment.start[1], segment.end[1], progress);
    colors[pointIndex * 3] = segment.color[0];
    colors[pointIndex * 3 + 1] = segment.color[1];
    colors[pointIndex * 3 + 2] = segment.color[2];
  }
  return { coordinates, colors };
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
  const three = await import("three");

  const portrait = initial.width < 768;
  const COUNT = portrait ? 5200 : 10500;

  const renderer = new three.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: false,
    powerPreference: "high-performance",
  });
  const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
  renderer.setPixelRatio(pixelRatio);
  renderer.setClearColor(0x000000, 0);

  const scene = new three.Scene();
  const camera = new three.PerspectiveCamera(FOV, initial.width / initial.height, 0.1, 50);
  let startZ = portrait ? START_Z_PORTRAIT : START_Z;
  camera.position.set(0, 0, startZ);

  const random = mulberry32(20260511);
  const leaf = generateLogo(COUNT, random);

  const geometry = new three.BufferGeometry();
  const aRand = new Float32Array(COUNT * 4);
  for (let index = 0; index < COUNT * 4; index++) aRand[index] = random();
  const aGrid = new Float32Array(COUNT * 3);
  const aGridColor = new Float32Array(COUNT * 3);
  const aDelay = new Float32Array(COUNT);

  geometry.setAttribute("position", new three.BufferAttribute(leaf.positions, 3));
  geometry.setAttribute("aColor", new three.BufferAttribute(leaf.colors, 3));
  geometry.setAttribute("aRand", new three.BufferAttribute(aRand, 4));
  geometry.setAttribute("aGrid", new three.BufferAttribute(aGrid, 3));
  geometry.setAttribute("aGridColor", new three.BufferAttribute(aGridColor, 3));
  geometry.setAttribute("aDelay", new three.BufferAttribute(aDelay, 1));
  // 점이 화면 어디로 가든 잘리지 않게 한다
  geometry.boundingSphere = new three.Sphere(new three.Vector3(), 50);

  const uniforms = {
    uTime: { value: 0 },
    uP1: { value: 0 },
    uP2: { value: 0 },
    uPR: { value: pixelRatio },
    uSize: { value: portrait ? 3.9 : 2.5 },
    uSizeGrid: { value: portrait ? 2.1 : 1.9 },
    uSafe: { value: 0 },
    uFade: { value: 1 },
    uAspect: { value: initial.width / initial.height },
  };
  const material = new three.ShaderMaterial({
    uniforms,
    vertexShader: VERTEX,
    fragmentShader: FRAGMENT,
    transparent: true,
    depthWrite: false,
  });
  const points = new three.Points(geometry, material);
  points.frustumCulled = false;
  scene.add(points);

  // 격자 목표 좌표(픽셀 → 세계 단위). 카메라가 FINAL_Z에 있을 때 DOM 카드와 정확히 겹친다
  const buildGrid = (layout: GridLayout) => {
    const gridRandom = mulberry32(777);
    const grid = generateGrid(COUNT, layout, gridRandom);
    const visibleHeight = 2 * Math.tan((FOV * Math.PI) / 360) * FINAL_Z;
    const scale = visibleHeight / layout.height;
    const halfGridWidth = (layout.columns * layout.cellWidth) / 2;
    const order = new Uint32Array(COUNT);
    for (let index = 0; index < COUNT; index++) order[index] = index;
    // 잎 점과 격자 점을 무작위로 짝짓는다(섞는다)
    for (let index = COUNT - 1; index > 0; index--) {
      const swapIndex = Math.floor(gridRandom() * (index + 1));
      const swapped = order[index];
      order[index] = order[swapIndex];
      order[swapIndex] = swapped;
    }
    for (let pointIndex = 0; pointIndex < COUNT; pointIndex++) {
      const gridPointIndex = order[pointIndex];
      const gridX = grid.coordinates[gridPointIndex * 2];
      const gridY = grid.coordinates[gridPointIndex * 2 + 1];
      aGrid[pointIndex * 3] = gridX * scale;
      aGrid[pointIndex * 3 + 1] = (layout.height / 2 - (layout.originY + gridY)) * scale;
      aGrid[pointIndex * 3 + 2] = 0;
      aGridColor[pointIndex * 3] = grid.colors[gridPointIndex * 3];
      aGridColor[pointIndex * 3 + 1] = grid.colors[gridPointIndex * 3 + 1];
      aGridColor[pointIndex * 3 + 2] = grid.colors[gridPointIndex * 3 + 2];
      // 왼쪽에서 오른쪽으로 쓸리듯 붙고, 점마다 조금씩 어긋난다
      aDelay[pointIndex] =
        clamp((gridX / halfGridWidth + 1) / 2) * 0.32 + aRand[pointIndex * 4 + 1] * 0.1;
    }
    (geometry.getAttribute("aGrid") as THREE.BufferAttribute).needsUpdate = true;
    (geometry.getAttribute("aGridColor") as THREE.BufferAttribute).needsUpdate = true;
    (geometry.getAttribute("aDelay") as THREE.BufferAttribute).needsUpdate = true;
  };
  buildGrid(initial);
  renderer.setSize(initial.width, initial.height, false);

  /* 스크롤 진행도를 부드럽게 따라가고(감쇠), 카메라·셰이더 값을 갱신한다 */
  let targetProgress = 0;
  let smoothProgress = 0;
  let visible = true;
  let animationFrameId = 0;
  let lastTime = performance.now();
  let mouseX = 0;
  let mouseY = 0;
  let cameraX = 0;
  let cameraY = 0;

  const onPointer = (event: PointerEvent) => {
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = (event.clientY / window.innerHeight) * 2 - 1;
  };
  if (!options.reducedMotion) window.addEventListener("pointermove", onPointer, { passive: true });

  const frame = (now: number) => {
    animationFrameId = requestAnimationFrame(frame);
    if (!visible) {
      lastTime = now;
      return;
    }
    const elapsedSeconds = Math.min(0.05, (now - lastTime) / 1000);
    lastTime = now;
    smoothProgress += (targetProgress - smoothProgress) * (1 - Math.exp(-elapsedSeconds * 7));
    const progress = smoothProgress;

    uniforms.uTime.value += options.reducedMotion ? 0 : elapsedSeconds;
    uniforms.uP1.value = rangeProgress(progress, 0.3, 0.6);
    uniforms.uP2.value = rangeProgress(progress, 0.6, 0.86);
    // 글자가 정중앙에 오므로 첫 장면부터 글자 뒤를 비워 두고(시인성), 격자가 되기 전에 다시 채운다
    uniforms.uSafe.value = 1 - rangeProgress(progress, 0.52, 0.66);
    uniforms.uFade.value = 1 - rangeProgress(progress, 0.92, 0.975);

    // 카메라: 흩어지는 동안 다가오고, 정렬하면서 격자 거리로 물러난다
    const dolly = easeInOut(rangeProgress(progress, 0.3, 0.55));
    const back = easeInOut(rangeProgress(progress, 0.58, 0.86));
    const z = lerp(lerp(startZ, 4.3, dolly), FINAL_Z, back);
    // 포인터를 따라 아주 조금 움직인다(격자가 완성되면 0으로 돌아와 DOM 카드와 어긋나지 않는다)
    const parallax = 1 - rangeProgress(progress, 0.6, 0.86);
    cameraX += (mouseX * 0.35 * parallax - cameraX) * 0.05;
    cameraY += (-mouseY * 0.22 * parallax - cameraY) * 0.05;
    camera.position.set(cameraX, cameraY, z);
    camera.lookAt(0, 0, 0);
    points.rotation.z =
      lerp(0, 0.5, easeInOut(rangeProgress(progress, 0.3, 0.6))) *
      (1 - rangeProgress(progress, 0.6, 0.72));

    renderer.render(scene, camera);
  };
  animationFrameId = requestAnimationFrame(frame);

  return {
    setProgress(progress) {
      targetProgress = clamp(progress);
    },
    resize(width, height, layout) {
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      uniforms.uAspect.value = width / height;
      const narrow = width < 768;
      startZ = narrow ? START_Z_PORTRAIT : START_Z;
      uniforms.uSize.value = narrow ? 3.9 : 2.5;
      buildGrid(layout);
    },
    setVisible(isVisible) {
      visible = isVisible;
    },
    dispose() {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("pointermove", onPointer);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    },
  };
}
