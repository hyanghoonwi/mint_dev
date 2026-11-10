"use client";

import { useMemo, useSyncExternalStore } from "react";
import { Grid } from "@futurewiz-rms/mint";

const steps = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];

const scales: { name: string; tokens: string[] }[] = [
  { name: "gray", tokens: [...steps, 950].map((step) => `gray-${step}`) },
  ...["teal", "green", "blue", "red", "orange", "yellow", "lime", "violet", "purple", "pink"].map(
    (hue) => ({ name: hue, tokens: steps.map((step) => `${hue}-${step}`) }),
  ),
];

// 아토믹 색은 테마와 상관없는 고정값이라 바뀔 일이 없다(구독할 것이 없음)
const subscribeNothing = () => () => {};

// 값은 MINT 스타일에 들어 있는 CSS 변수에서 읽는다(문서에 숫자를 따로 적지 않아서 실제 값과 어긋나지 않는다).
// 브라우저에서만 읽을 수 있어서 서버 렌더에서는 빈 값이고, 화면이 뜬 뒤 채워진다.
// 매번 같은 값이 나와야 하므로 문자열("토큰=값;…")로 읽은 뒤 객체로 바꾼다.
function useAtomicHex(tokens: string[]) {
  const snapshot = useSyncExternalStore(
    subscribeNothing,
    () => {
      const style = getComputedStyle(document.documentElement);
      return tokens
        .map((token) => `${token}=${style.getPropertyValue(`--color-atomic-${token}`).trim()}`)
        .join(";");
    },
    () => "",
  );
  return useMemo(
    () =>
      Object.fromEntries(
        snapshot
          .split(";")
          .filter(Boolean)
          .map((pair) => {
            const [token, value] = pair.split("=");
            return [token, value.toUpperCase()];
          }),
      ) as Record<string, string>,
    [snapshot],
  );
}

function isLight(hex: string) {
  const value = hex.replace("#", "");
  if (value.length < 6) return true;
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(value.slice(i, i + 2), 16) / 255);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b > 0.55;
}

/** 아토믹 컬러를 시안의 색 띠 모양으로 보여 준다 */
export function ColorScales() {
  const all = scales.flatMap((scale) => scale.tokens);
  const hex = useAtomicHex(all);
  return (
    <div className="docs-scales">
      {scales.map((scale) => (
        <div key={scale.name}>
          <p className="docs-scales__name">{scale.name}</p>
          <div className="docs-scale">
            {scale.tokens.map((token) => (
              <div
                key={token}
                className="docs-scale__chip"
                style={{
                  background: `var(--color-atomic-${token})`,
                  color: hex[token] && !isLight(hex[token]) ? "#FFFFFF" : "#0B1612",
                }}
              >
                <span className="docs-scale__step">{token.split("-").pop()}</span>
                <span className="docs-scale__hex">{hex[token] ?? ""}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export const semanticGroups: {
  group: string;
  title: string;
  prefix: string;
  tokens: [name: string, atomic: string, usage: string][];
}[] = [
  {
    group: "background",
    title: "Background · 배경",
    prefix: "bg",
    tokens: [
      ["default", "white", "기본 화면 배경"],
      ["lower", "gray-100", "한 단계 낮은 영역 배경(섹션 구분)"],
      ["upper", "grayAlpha-50", "카드 위에 얹는 약한 배경"],
      ["floated", "white", "떠 있는 요소(모달, 시트) 배경"],
      ["dim", "grayAlpha-300", "모달 뒤 어두운 막"],
    ],
  },
  {
    group: "border",
    title: "Border · 테두리",
    prefix: "border",
    tokens: [
      ["default", "grayAlpha-200", "기본 구분선, 테두리"],
      ["strong", "gray-300", "입력창, Outline 버튼 테두리"],
      ["thick", "gray-100", "두꺼운 구분 영역"],
      ["focus", "gray-900", "키보드 포커스 링"],
      ["disabled", "gray-200", "비활성 테두리"],
      ["brand", "blue-600", "선택, 강조 테두리(브랜드)"],
      ["selected", "gray-900", "선택됨 테두리(Neutral)"],
    ],
  },
  {
    group: "text",
    title: "Text · 글자",
    prefix: "text",
    tokens: [
      ["strong", "gray-900", "가장 강한 텍스트(제목, 버튼)"],
      ["primary", "gray-800", "본문 기본"],
      ["secondary", "gray-700", "보조 설명"],
      ["tertiary", "gray-600", "부가 정보"],
      ["subtle", "gray-500", "플레이스홀더, 힌트"],
      ["disabled", "gray-400", "비활성 텍스트"],
      ["brand", "blue-600", "브랜드 텍스트, 링크"],
      ["brand-pressed", "blue-700", "브랜드 텍스트 눌림"],
      ["danger", "red-600", "오류, 위험"],
      ["success", "green-800", "성공"],
      ["warning", "orange-800", "경고"],
      ["on-fill", "white", "채움 배경 위 텍스트"],
      ["on-fill-warning", "gray-900", "경고 채움 배경 위 텍스트"],
    ],
  },
  {
    group: "fill",
    title: "Fill · 면",
    prefix: "bg",
    tokens: [
      ["brand", "blue-600", "브랜드 채움(Primary 버튼)"],
      ["brand-pressed", "blue-700", "브랜드 눌림"],
      ["brand-weak", "blue-50", "브랜드 옅은 배경"],
      ["brand-weak-pressed", "blue-100", "브랜드 옅은 배경 눌림"],
      ["neutral", "gray-900", "중립 채움(Neutral 버튼, 선택된 Chip)"],
      ["neutral-pressed", "gray-800", "중립 채움 눌림"],
      ["neutral-weak", "gray-100", "중립 옅은 배경(Secondary, Chip 기본)"],
      ["neutral-weak-pressed", "gray-200", "중립 옅은 배경 눌림"],
      ["neutral-medium", "gray-200", "중립 중간 배경(배경 있는 아이콘 버튼)"],
      ["neutral-medium-pressed", "gray-300", "중립 중간 배경 눌림"],
      ["danger", "red-600", "위험 채움(Destructive)"],
      ["danger-pressed", "red-700", "위험 눌림"],
      ["danger-weak", "red-50", "위험 옅은 배경"],
      ["success", "green-500", "성공 채움"],
      ["success-weak", "green-50", "성공 옅은 배경"],
      ["warning", "orange-500", "경고 채움"],
      ["warning-weak", "orange-50", "경고 옅은 배경"],
      ["pressed", "grayAlpha-100", "누름 오버레이(배경 없는 요소의 눌림)"],
      ["disabled", "gray-100", "비활성 채움"],
      ["inverse", "white", "반전 채움"],
      ["white", "white", "흰색 채움(Outline 버튼 배경)"],
    ],
  },
  {
    group: "icon",
    title: "Icon · 아이콘",
    prefix: "text",
    tokens: [
      ["default", "gray-700", "기본 아이콘"],
      ["strong", "gray-900", "강한 아이콘"],
      ["secondary", "gray-600", "보조 아이콘"],
      ["tertiary", "gray-500", "부가 아이콘"],
      ["disabled", "gray-400", "비활성 아이콘"],
      ["brand", "blue-600", "브랜드 아이콘, 켜짐 상태"],
      ["brand-pressed", "blue-700", "브랜드 아이콘 눌림"],
      ["danger", "red-600", "위험 아이콘"],
      ["success", "green-600", "성공 아이콘"],
      ["warning", "orange-700", "경고 아이콘"],
      ["on-fill", "white", "채움 배경 위 아이콘"],
    ],
  },
];

// 값은 MINT 스타일의 CSS 변수에서 읽는다(아토믹을 가리키는 별칭이라 실제 hex로 풀려서 나온다)
export function useSemanticHex() {
  const snapshot = useSyncExternalStore(
    subscribeNothing,
    () => {
      const style = getComputedStyle(document.documentElement);
      return semanticGroups
        .flatMap((g) => g.tokens.map(([name]) => `${g.group}-${name}`))
        .map((token) => `${token}=${style.getPropertyValue(`--mint-${token}`).trim()}`)
        .join(";");
    },
    () => "",
  );
  return useMemo(
    () =>
      Object.fromEntries(
        snapshot
          .split(";")
          .filter(Boolean)
          .map((pair) => {
            const [token, value] = pair.split("=");
            return [token, value.toUpperCase()];
          }),
      ) as Record<string, string>,
    [snapshot],
  );
}

/** 시맨틱 색: 분류별로 쓰는 클래스, 색, 연결된 아토믹 색, 용도 */
export function SemanticColors() {
  const hex = useSemanticHex();
  return (
    <>
      {semanticGroups.map((g) => (
        <div key={g.group} className="docs-table-wrap">
          <p className="docs-scales__name">{g.title}</p>
          <table className="docs-table">
            <thead>
              <tr>
                <th>클래스</th>
                <th>색</th>
                <th>아토믹</th>
                <th>용도</th>
              </tr>
            </thead>
            <tbody>
              {g.tokens.map(([name, atomic, usage]) => {
                const className = `${g.prefix}-${g.group}-${name}`;
                return (
                  <tr key={name}>
                    <td>
                      <code>{className}</code>
                    </td>
                    <td>
                      <span
                        className="docs-swatch"
                        style={{ background: `var(--mint-${g.group}-${name})` }}
                      />{" "}
                      <code>{hex[`${g.group}-${name}`] ?? ""}</code>
                    </td>
                    <td>
                      <code>{atomic}</code>
                    </td>
                    <td>{usage}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ))}
    </>
  );
}

const typeScale: {
  role: string;
  metrics: string;
  weights: string[];
  show: string;
  sample: string;
}[] = [
  {
    role: "display-1",
    metrics: "52 / 68",
    weights: ["semibold", "bold"],
    show: "bold",
    sample: "가장 큰 문구",
  },
  {
    role: "display-2",
    metrics: "40 / 52",
    weights: ["semibold", "bold"],
    show: "bold",
    sample: "가장 큰 문구",
  },
  {
    role: "display-3",
    metrics: "36 / 48",
    weights: ["semibold", "bold"],
    show: "bold",
    sample: "가장 큰 문구",
  },
  {
    role: "title-1",
    metrics: "32 / 44",
    weights: ["medium", "semibold", "bold"],
    show: "bold",
    sample: "페이지 제목",
  },
  {
    role: "title-2",
    metrics: "28 / 38",
    weights: ["medium", "semibold", "bold"],
    show: "bold",
    sample: "페이지 제목",
  },
  {
    role: "title-3",
    metrics: "24 / 34",
    weights: ["medium", "semibold", "bold"],
    show: "bold",
    sample: "페이지 제목",
  },
  {
    role: "heading-1",
    metrics: "22 / 32",
    weights: ["medium", "semibold", "bold"],
    show: "semibold",
    sample: "섹션 제목",
  },
  {
    role: "heading-2",
    metrics: "20 / 30",
    weights: ["medium", "semibold", "bold"],
    show: "semibold",
    sample: "섹션 제목",
  },
  {
    role: "heading-3",
    metrics: "18 / 26",
    weights: ["medium", "semibold", "bold"],
    show: "semibold",
    sample: "섹션 제목",
  },
  {
    role: "body-1",
    metrics: "17 / 28",
    weights: ["regular", "medium", "semibold", "bold"],
    show: "regular",
    sample: "아티클처럼 긴 글",
  },
  {
    role: "body-2",
    metrics: "16 / 24",
    weights: ["regular", "medium", "semibold", "bold"],
    show: "regular",
    sample: "기본 본문",
  },
  {
    role: "body-3",
    metrics: "15 / 22",
    weights: ["regular", "medium", "semibold", "bold"],
    show: "regular",
    sample: "카드·리스트 설명",
  },
  {
    role: "body-4",
    metrics: "14 / 22",
    weights: ["regular", "medium", "semibold", "bold"],
    show: "regular",
    sample: "밀도 높은 UI, 표",
  },
  {
    role: "body-5",
    metrics: "13 / 20",
    weights: ["regular", "medium", "semibold", "bold"],
    show: "regular",
    sample: "보조 본문",
  },
  {
    role: "label-1",
    metrics: "16 / 20",
    weights: ["medium", "semibold", "bold"],
    show: "semibold",
    sample: "버튼 라벨",
  },
  {
    role: "label-2",
    metrics: "14 / 20",
    weights: ["medium", "semibold", "bold"],
    show: "semibold",
    sample: "버튼 라벨",
  },
  {
    role: "label-3",
    metrics: "12 / 16",
    weights: ["medium", "semibold", "bold"],
    show: "semibold",
    sample: "버튼 라벨",
  },
  {
    role: "caption-1",
    metrics: "12 / 18",
    weights: ["regular", "medium", "semibold"],
    show: "regular",
    sample: "날짜 · 도움말",
  },
  {
    role: "caption-2",
    metrics: "11 / 16",
    weights: ["regular", "medium", "semibold"],
    show: "regular",
    sample: "날짜 · 도움말",
  },
];

/** 글자 스타일 목록: 이름·크기 / 보기 문장 / 쓸 수 있는 웨이트 */
export function TypeScale() {
  return (
    <div className="docs-type-scale">
      {typeScale.map((row) => (
        <div key={row.role} className="docs-type-row">
          <div className="docs-type-row__meta">
            <code>{row.role}</code>
            <span className="docs-mono-caption">{row.metrics}</span>
          </div>
          {/* 모든 글자 클래스가 MINT 스타일에 들어 있어서 이름을 조립해도 적용된다 */}
          <span className={`docs-type-row__sample text-${row.role}-${row.show}`}>
            {row.sample} Aa 123
          </span>
          <span className="docs-type-row__weights">{row.weights.join(" · ")}</span>
        </div>
      ))}
    </div>
  );
}

const spacing: [string, number, string][] = [
  ["spacing-4", 4, "1"],
  ["spacing-8", 8, "2"],
  ["spacing-12", 12, "3"],
  ["spacing-16", 16, "4"],
  ["spacing-20", 20, "5"],
  ["spacing-24", 24, "6"],
  ["spacing-32", 32, "8"],
  ["spacing-40", 40, "10"],
  ["spacing-48", 48, "12"],
  ["spacing-64", 64, "16"],
  ["spacing-80", 80, "20"],
  ["spacing-96", 96, "24"],
];

/** 간격 스케일: Figma 이름 / px / 클래스 / 막대 */
export function SpacingScale() {
  return (
    <div className="docs-spacing">
      {spacing.map(([name, px, number]) => (
        <div key={name} className="docs-spacing__row">
          <code>{name}</code>
          <span className="docs-mono-caption">{px}px</span>
          <span className="docs-spacing__class">
            p-{number} · gap-{number} · m-{number}
          </span>
          <span className="docs-spacing__bar" style={{ width: px }} />
        </div>
      ))}
    </div>
  );
}

/** 지금 창 폭 구간의 컬럼 수(4 · 8 · 12)만큼 칸을 보여 준다 */
export function GridColumns() {
  return (
    <div className="docs-panel">
      {/* 칸 12개 중 첫 줄만 보이게 해서(나머지 줄은 높이 0) 현재 구간의 컬럼 수만 나온다 */}
      <Grid style={{ gridTemplateRows: "72px", gridAutoRows: 0, overflow: "hidden" }}>
        {Array.from({ length: 12 }, (_, index) => (
          <Grid.Item key={index} span={{ base: 1 }} className="docs-grid-col">
            {index + 1}
          </Grid.Item>
        ))}
      </Grid>
    </div>
  );
}
