import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  title: "Foundations/Colors",
  tags: ["autodocs"],
  parameters: { layout: "padded" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const steps = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];

const groups = [
  { name: "base", tokens: ["white", "black"] },
  { name: "gray", tokens: [...steps, 950].map((step) => `gray-${step}`) },
  { name: "grayAlpha", tokens: steps.map((step) => `grayAlpha-${step}`) },
  ...["blue", "red", "orange", "yellow", "green", "lime", "teal", "violet", "purple", "pink"].map(
    (hue) => ({ name: hue, tokens: steps.map((step) => `${hue}-${step}`) }),
  ),
];

// Figma "Color - Atomic"과 같은 값. 라이트·다크와 상관없는 고정값이라 테마를 바꿔도 색이 그대로다
export const AtomicColors: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {groups.map((group) => (
        <section key={group.name} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <h3 className="text-heading-2-bold" style={{ margin: 0 }}>
            {group.name}
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(88px, 1fr))",
              gap: 8,
            }}
          >
            {group.tokens.map((token) => (
              <div key={token} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <div
                  className="rounded-8 border border-border-default"
                  style={{ height: 40, background: `var(--color-atomic-${token})` }}
                />
                <code className="text-caption-1-regular">{token}</code>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  ),
  // 코드 패널에는 갤러리를 그리는 코드가 아니라, 사용하는 쪽이 쓰는 코드를 보여 준다
  parameters: {
    docs: { source: { code: '<div style={{ color: "var(--color-atomic-blue-500)" }}>…</div>' } },
  },
};

const semanticGroups: { name: string; tokens: [name: string, atomic: string, usage: string][] }[] =
  [
    {
      name: "background",
      tokens: [
        ["default", "white", "기본 화면 배경"],
        ["lower", "gray-100", "한 단계 낮은 영역 배경(섹션 구분)"],
        ["upper", "grayAlpha-50", "카드 위에 얹는 약한 배경"],
        ["floated", "white", "떠 있는 요소(모달, 시트) 배경"],
        ["dim", "grayAlpha-300", "모달 뒤 어두운 막"],
      ],
    },
    {
      name: "border",
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
      name: "text",
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
      name: "fill",
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
      name: "icon",
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

// Figma "Color - Semantic". 아토믹을 가리키는 별칭이라 값을 CSS 변수에서 읽는다. 지금은 Light 값만 있다
export const SemanticColors: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {semanticGroups.map((group) => (
        <section key={group.name} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <h3 className="text-heading-2-bold" style={{ margin: 0 }}>
            {group.name}
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
              gap: 12,
            }}
          >
            {group.tokens.map(([name, atomic, usage]) => (
              <div key={name} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <div
                  className="rounded-8 border border-border-default"
                  style={{ height: 48, background: `var(--mint-${group.name}-${name})` }}
                />
                <code className="text-caption-1-medium">
                  {group.name}/{name}
                </code>
                <span className="text-caption-2-regular text-text-tertiary">→ {atomic}</span>
                <span className="text-caption-2-regular text-text-tertiary">{usage}</span>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  ),
  parameters: {
    docs: {
      source: {
        code: '<p className="text-text-primary">본문</p>\n<div className="bg-fill-brand text-text-on-fill">…</div>',
      },
    },
  },
};
