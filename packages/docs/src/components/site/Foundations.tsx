"use client";

import { Grid } from "@futurewiz-rms/mint";

// Figma `Specimen / Typography`(32:61) 모양: 역할 묶음 → 크기별 줄(왼쪽 수치, 오른쪽 굵기별 보기 문장)
const weightNames: Record<string, string> = {
  regular: "Regular 400",
  medium: "Medium 500",
  semibold: "SemiBold 600",
  bold: "Bold 700",
};

const typeGroups: {
  role: string;
  title: string;
  description: string;
  tracking: Record<number, string>;
  weights: string[];
  sample: string;
  sizes: [step: number, size: number, lineHeight: number][];
}[] = [
  {
    role: "display",
    title: "Display",
    description: "랜딩, 히어로 등 가장 큰 문구 · 한 화면에 하나만 써요.",
    tracking: { 1: "-2%", 2: "-2%", 3: "-2%" },
    weights: ["semibold", "bold"],
    sample: "큰 문구 Aa 123",
    sizes: [
      [1, 52, 68],
      [2, 40, 52],
      [3, 36, 48],
    ],
  },
  {
    role: "title",
    title: "Title",
    description: "페이지 제목, 큰 섹션 제목에 써요.",
    tracking: { 1: "-2%", 2: "-1.5%", 3: "-1.5%" },
    weights: ["medium", "semibold", "bold"],
    sample: "타이틀 Aa 123",
    sizes: [
      [1, 32, 44],
      [2, 28, 38],
      [3, 24, 34],
    ],
  },
  {
    role: "heading",
    title: "Heading",
    description: "섹션, 카드, 모달 제목에 써요.",
    tracking: { 1: "-1%", 2: "-1%", 3: "-0.5%" },
    weights: ["medium", "semibold", "bold"],
    sample: "섹션 제목을 입력하세요 Aa 123",
    sizes: [
      [1, 22, 32],
      [2, 20, 30],
      [3, 18, 26],
    ],
  },
  {
    role: "body",
    title: "Body",
    description:
      "기본 본문은 Body 2(16px)예요. Body 1은 아티클 같은 긴 글, Body 3은 카드·리스트 설명, Body 4는 표처럼 밀도 높은 UI, Body 5는 보조 본문에 써요.",
    tracking: { 1: "0%", 2: "0%", 3: "0%", 4: "0%", 5: "0%" },
    weights: ["regular", "medium", "semibold", "bold"],
    sample: "다람쥐 헌 쳇바퀴에 타고파. The quick brown fox",
    sizes: [
      [1, 17, 28],
      [2, 16, 24],
      [3, 15, 22],
      [4, 14, 22],
      [5, 13, 20],
    ],
  },
  {
    role: "label",
    title: "Label",
    description: "버튼, 탭, 칩, 입력 라벨에 써요. 한 줄 전용이라 두 줄이 될 수 있으면 Body를 써요.",
    tracking: { 1: "0%", 2: "0%", 3: "0%" },
    weights: ["medium", "semibold", "bold"],
    sample: "버튼 라벨 Label 123",
    sizes: [
      [1, 16, 20],
      [2, 14, 20],
      [3, 12, 16],
    ],
  },
  {
    role: "caption",
    title: "Caption",
    description: "날짜, 도움말, 각주에 써요.",
    tracking: { 1: "0%", 2: "0%" },
    weights: ["regular", "medium", "semibold"],
    sample: "날짜와 도움말 Caption 123",
    sizes: [
      [1, 12, 18],
      [2, 11, 16],
    ],
  },
];

/** 글꼴 견본(Figma Typeface): 회색 칸에 Pretendard 보기 문장 */
export function Typeface() {
  return (
    <div className="docs-typeface" aria-label="Pretendard 프리텐다드 Aa123">
      <span aria-hidden="true">
        Pretendard프리텐다드<span className="docs-typeface__accent">Aa123</span>
      </span>
    </div>
  );
}

/** 글자 스타일 견본. 보기 문장마다 실제 클래스를 그대로 써서 그린다(모든 글자 클래스가 MINT 스타일에 들어 있다) */
export function TypeScale() {
  return (
    <div className="docs-type">
      {typeGroups.map((group) => (
        <section key={group.role} className="docs-type__group">
          <h3 className="docs-type__title">{group.title}</h3>
          <p className="docs-type__desc">{group.description}</p>
          {group.sizes.map(([step, size, lineHeight]) => (
            <div key={step} className="docs-type__size">
              <div className="docs-type__meta">
                <strong>
                  {group.title} {step}
                </strong>
                <span>
                  {size}px / {lineHeight}px
                </span>
                <span>
                  줄 간격 {(lineHeight / size).toFixed(2)} · 자간 {group.tracking[step]}
                </span>
              </div>
              <div className="docs-type__weights">
                {group.weights.map((weight) => {
                  const variant = `${group.role}-${step}-${weight}`;
                  return (
                    <div key={weight} className="docs-type__row">
                      <span className="docs-type__weight">
                        {weightNames[weight]}
                        <code>{variant}</code>
                      </span>
                      <span className={`docs-type__sample text-${variant}`}>{group.sample}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </section>
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
      {spacing.map(([name, pixels, number]) => (
        <div key={name} className="docs-spacing__row">
          <code>{name}</code>
          <span className="docs-mono-caption">{pixels}px</span>
          <span className="docs-spacing__class">
            p-{number} · gap-{number} · m-{number}
          </span>
          <span className="docs-spacing__bar" style={{ width: pixels }} />
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

// 반경 토큰(core shape.css의 --radius-*). 클래스는 Tailwind가 찾을 수 있게 통째로 적는다
const radii: [cls: string, px: string, usage: string][] = [
  ["rounded-4", "4px", "체크박스 상자, 작은 표시(PriceChange sm)"],
  ["rounded-8", "8px", "배지, 칩, 썸네일, 작은 버튼(xs)"],
  ["rounded-12", "12px", "버튼, 입력, 세그먼트"],
  ["rounded-16", "16px", "카드, 틀(Framed), Alert"],
  ["rounded-20", "20px", "큰 카드·시트처럼 넓은 면"],
  ["rounded-full", "999px", "원형(아바타, 아이콘 버튼, 점)"],
];

/** 반경 견본: 모서리 모양 / 클래스 / px / 쓰는 곳 */
export function RadiusScale() {
  return (
    <div className="docs-shape-grid">
      {radii.map(([className, pixels, usage]) => (
        <div key={className} className="docs-shape-card">
          <span className={`docs-shape-card__radius ${className}`} />
          <code>{className}</code>
          <span className="docs-mono-caption">{pixels}</span>
          <span className="docs-shape-card__usage">{usage}</span>
        </div>
      ))}
    </div>
  );
}

// 그림자 토큰(core shape.css의 --shadow-*)
const shadows: [cls: string, value: string, usage: string][] = [
  ["shadow-floating", "0 8px 24px · 24%", "토스트, 메뉴, 툴팁처럼 떠 있는 요소"],
  ["shadow-drawer", "0 2px 30px · 10% + −16px 0 60px · 10%", "오른쪽에서 나오는 패널"],
];

/** 그림자 견본: 흰 면에 그림자를 입혀 보여 준다 */
export function ShadowSamples() {
  return (
    <div className="docs-shape-grid docs-shape-grid--shadow">
      {shadows.map(([className, value, usage]) => (
        <div key={className} className="docs-shape-card">
          <span
            className={`docs-shape-card__shadow rounded-12 bg-background-floated ${className}`}
          />
          <code>{className}</code>
          <span className="docs-mono-caption">{value}</span>
          <span className="docs-shape-card__usage">{usage}</span>
        </div>
      ))}
    </div>
  );
}
