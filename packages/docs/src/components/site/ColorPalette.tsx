"use client";

// Colors 페이지의 색 목록. Semantic / Atomic 탭으로 나눈다.
//  - Atomic: Figma `Color - Atomic`(6:2) 견본 모양(색 칸 · 이름 · 값 · 흰 배경 대비 · 용도) + `Token`(18:2) 표
//  - Semantic: `Token` 표 모양에 실제로 쓰는 클래스 이름(bg-fill-brand 등)을 적는다
// 색 값은 MINT 스타일의 CSS 변수에서 읽는다(문서에 숫자를 따로 적지 않아서 실제 값과 어긋나지 않는다).
// 브라우저에서만 읽을 수 있어서 서버 렌더에서는 빈 값이고, 화면이 뜬 뒤 채워진다.
import { useMemo, useSyncExternalStore } from "react";
import { atomicSections } from "./atomicColors";
import { TabsClient } from "./TabsClient";

// 색은 테마와 상관없이 고정이라 구독할 것이 없다
const subscribeNothing = () => () => {};

/** CSS 변수 이름 목록 → { 변수: 값(대문자) }. 매번 같은 값이 나오도록 문자열로 읽은 뒤 객체로 바꾼다 */
function useCssValues(names: string[]) {
  const snapshot = useSyncExternalStore(
    subscribeNothing,
    () => {
      const style = getComputedStyle(document.documentElement);
      return names.map((name) => `${name}=${style.getPropertyValue(name).trim()}`).join(";");
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
            const [name, value] = pair.split("=");
            // 짧은 hex(#000, #fff)는 6자리로 늘려서 Figma 표기와 맞춘다
            const short = /^#([0-9a-f])([0-9a-f])([0-9a-f])$/i.exec(value);
            const hex = short
              ? `#${short[1]}${short[1]}${short[2]}${short[2]}${short[3]}${short[3]}`
              : value;
            return [name, hex.toUpperCase()];
          }),
      ) as Record<string, string>,
    [snapshot],
  );
}

/** #RRGGBBAA의 투명도(0~1). 불투명이면 null */
function alphaOf(hex: string) {
  const value = hex.replace("#", "");
  return value.length === 8 ? parseInt(value.slice(6, 8), 16) / 255 : null;
}

/** 흰 배경 대비(WCAG). 예: "5.70 : 1" */
function contrastOnWhite(hex: string) {
  const value = hex.replace("#", "");
  if (value.length !== 6) return "";
  const [r, g, b] = [0, 2, 4].map((i) => {
    const c = parseInt(value.slice(i, i + 2), 16) / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return `${(1.05 / (luminance + 0.05)).toFixed(2)} : 1`;
}

/** 값 칸: 불투명은 hex, 투명도가 있으면 "α 0.03" */
function displayValue(hex: string | undefined) {
  if (!hex) return "";
  const alpha = alphaOf(hex);
  return alpha === null ? hex : `α ${alpha.toFixed(2)}`;
}

const atomicVar = (token: string) => `--color-atomic-${token}`;

const semanticGroups: {
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
      ["danger", "red-400", "오류, 위험"],
      ["success", "green-400", "성공"],
      ["warning", "orange-800", "경고"],
      ["on-fill", "white", "채움 배경 위 텍스트"],
      ["on-fill-warning", "gray-900", "경고 채움 배경 위 텍스트"],
      ["up", "red-600", "시세 상승 글자"],
      ["down", "blue-600", "시세 하락 글자"],
      ["flat", "gray-600", "시세 보합 글자"],
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
      ["neutral", "gray-800", "중립 채움(Neutral 버튼, 선택된 Chip)"],
      ["neutral-pressed", "gray-700", "중립 채움 눌림"],
      ["neutral-weak", "gray-100", "중립 옅은 배경(Secondary, Chip 기본)"],
      ["neutral-weak-pressed", "gray-200", "중립 옅은 배경 눌림"],
      ["neutral-medium", "gray-200", "중립 중간 배경(배경 있는 아이콘 버튼)"],
      ["neutral-medium-pressed", "gray-300", "중립 중간 배경 눌림"],
      ["danger", "red-400", "위험 채움(Destructive)"],
      ["danger-pressed", "red-500", "위험 눌림"],
      ["danger-weak", "red-50", "위험 옅은 배경"],
      ["success", "green-400", "성공 채움"],
      ["success-weak", "green-50", "성공 옅은 배경"],
      ["warning", "orange-500", "경고 채움"],
      ["warning-weak", "orange-50", "경고 옅은 배경"],
      ["up", "red-500", "시세 상승 채움"],
      ["up-weak", "red-50", "시세 상승 옅은 배경"],
      ["down", "blue-500", "시세 하락 채움"],
      ["down-weak", "blue-50", "시세 하락 옅은 배경"],
      ["alpha-50", "grayAlpha-50", "투명 막 50"],
      ["alpha-100", "grayAlpha-100", "투명 막 100"],
      ["alpha-200", "grayAlpha-200", "투명 막 200"],
      ["alpha-300", "grayAlpha-300", "투명 막 300"],
      ["alpha-400", "grayAlpha-400", "투명 막 400"],
      ["alpha-500", "grayAlpha-500", "투명 막 500"],
      ["alpha-600", "grayAlpha-600", "투명 막 600"],
      ["alpha-700", "grayAlpha-700", "투명 막 700"],
      ["alpha-800", "grayAlpha-800", "투명 막 800"],
      ["alpha-900", "grayAlpha-900", "투명 막 900"],
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
      ["danger", "red-400", "위험 아이콘"],
      ["success", "green-400", "성공 아이콘"],
      ["warning", "orange-700", "경고 아이콘"],
      ["on-fill", "white", "채움 배경 위 아이콘"],
      ["up", "red-500", "시세 상승 화살표"],
      ["down", "blue-500", "시세 하락 화살표"],
    ],
  },
  {
    group: "chart",
    title: "Chart · 분류",
    prefix: "bg",
    tokens: [
      ["1", "blue-500", "분류 색 1(Blue)"],
      ["1-weak", "blue-50", "분류 옅은 배경 1(Blue)"],
      ["2", "teal-500", "분류 색 2(Teal)"],
      ["2-weak", "teal-50", "분류 옅은 배경 2(Teal)"],
      ["3", "green-500", "분류 색 3(Green)"],
      ["3-weak", "green-50", "분류 옅은 배경 3(Green)"],
      ["4", "orange-500", "분류 색 4(Orange)"],
      ["4-weak", "orange-50", "분류 옅은 배경 4(Orange)"],
      ["5", "violet-500", "분류 색 5(Violet)"],
      ["5-weak", "violet-50", "분류 옅은 배경 5(Violet)"],
      ["6", "pink-500", "분류 색 6(Pink)"],
      ["6-weak", "pink-50", "분류 옅은 배경 6(Pink)"],
      ["7", "gray-500", "분류 색 7(Gray)"],
      ["7-weak", "gray-50", "분류 옅은 배경 7(Gray)"],
    ],
  },
];

const semanticVar = (group: string, name: string) => `--mint-${group}-${name}`;

/** Atomic 탭: 분류별 견본 + 전체 Token 표 */
function AtomicPanel() {
  const names = atomicSections.flatMap((s) => s.swatches.map(([token]) => atomicVar(token)));
  const values = useCssValues(names);
  return (
    <div className="docs-colors">
      {atomicSections.map((section) => (
        <section key={section.title} className="docs-colors__section">
          <h3 className="docs-colors__title">{section.title}</h3>
          {section.description && <p className="docs-colors__desc">{section.description}</p>}
          <div className="docs-atomic">
            {section.swatches.map(([token, usage]) => {
              const hex = values[atomicVar(token)];
              const contrast =
                token !== "white" && hex && alphaOf(hex) === null ? contrastOnWhite(hex) : "";
              return (
                <div key={token} className="docs-atomic__card">
                  <span
                    className="docs-atomic__chip"
                    style={{ background: `var(${atomicVar(token)})` }}
                  />
                  <span className="docs-atomic__name">{token}</span>
                  <span className="docs-atomic__meta">{displayValue(hex)}</span>
                  {contrast && <span className="docs-atomic__meta">{contrast}</span>}
                  <span className="docs-atomic__usage">{usage}</span>
                </div>
              );
            })}
          </div>
        </section>
      ))}
      <section className="docs-colors__section">
        <h3 className="docs-colors__title">Token</h3>
        <p className="docs-colors__desc">
          코드에서는 CSS 변수로 써요. 예: <code>var(--color-atomic-blue-500)</code>
        </p>
        <div className="docs-token" role="table" aria-label="Atomic 토큰">
          <div className="docs-token__head" role="row">
            <span role="columnheader">Token</span>
            <span role="columnheader">Value</span>
          </div>
          {atomicSections.map((section) => (
            <div key={section.title} className="docs-token__group" role="rowgroup">
              {section.swatches.map(([token]) => (
                <div key={token} className="docs-token__row" role="row">
                  <span className="docs-token__name" role="cell">
                    <span
                      className="docs-token__dot"
                      style={{ background: `var(${atomicVar(token)})` }}
                    />
                    <code>{atomicVar(token)}</code>
                  </span>
                  <span className="docs-token__value" role="cell">
                    {displayValue(values[atomicVar(token)])}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

/** Semantic 탭: 분류별 Token 표. 이름 칸에 실제로 쓰는 클래스를 적는다 */
function SemanticPanel() {
  const names = semanticGroups.flatMap((g) => g.tokens.map(([name]) => semanticVar(g.group, name)));
  const values = useCssValues(names);
  return (
    <div className="docs-colors">
      <div className="docs-token docs-token--semantic" role="table" aria-label="Semantic 토큰">
        <div className="docs-token__head" role="row">
          <span role="columnheader">Class</span>
          <span role="columnheader">Value</span>
          <span role="columnheader">Atomic · 용도</span>
        </div>
        {semanticGroups.map((g) => (
          <div key={g.group} className="docs-token__group" role="rowgroup">
            <p className="docs-token__group-title">{g.title}</p>
            {g.tokens.map(([name, atomic, usage]) => {
              const variable = semanticVar(g.group, name);
              return (
                <div key={name} className="docs-token__row" role="row">
                  <span className="docs-token__name" role="cell">
                    <span className="docs-token__dot" style={{ background: `var(${variable})` }} />
                    <code>{`${g.prefix}-${g.group}-${name}`}</code>
                  </span>
                  <span className="docs-token__value" role="cell">
                    {displayValue(values[variable])}
                  </span>
                  <span className="docs-token__desc" role="cell">
                    <code>{atomic}</code> {usage}
                  </span>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

/** Colors 페이지의 색 목록. Semantic(기본) / Atomic 탭 */
export function ColorPalette() {
  return (
    <TabsClient labels={["Semantic", "Atomic"]}>
      {[<SemanticPanel key="semantic" />, <AtomicPanel key="atomic" />]}
    </TabsClient>
  );
}
