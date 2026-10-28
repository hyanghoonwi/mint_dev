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
