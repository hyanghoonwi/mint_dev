import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";

const meta = {
  title: "Foundations/Scrollbar",
  tags: ["autodocs"],
  parameters: {
    docs: {
      source: {
        code: '// app/layout.tsx\nimport "@futurewiz-rms/mint/style.css"; // 스크롤바도 함께 적용돼요',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

// Figma Scroll Bar(2204:15703): 폭 8px · 바탕 없음 · 4px 둥근 손잡이(border-strong).
// style.css만 불러오면 모든 스크롤 영역에 적용된다. Chrome·Edge·Safari는 같은 모양, Firefox는 얇은 굵기·색만.
export const Default: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
      <div
        data-testid="box"
        className="rounded-8 border border-border-default"
        style={{ height: 160, width: 240, overflow: "auto" }}
      >
        <p className="p-3 text-body-3-regular text-text-primary" style={{ height: 640 }}>
          세로 스크롤 영역
        </p>
      </div>
      <div
        className="rounded-8 border border-border-default"
        style={{ width: 240, overflow: "auto" }}
      >
        <p className="p-3 text-body-3-regular text-text-primary" style={{ width: 720 }}>
          가로 스크롤 영역
        </p>
      </div>
      <textarea
        aria-label="여러 줄 입력"
        className="rounded-8 border border-border-strong p-3 text-body-3-regular"
        style={{ width: 200, height: 120 }}
        defaultValue={Array.from({ length: 12 }, (_, index) => `${index + 1}번째 줄`).join("\n")}
      />
    </div>
  ),
  play: async ({ canvas }) => {
    // Chrome 계열에서는 손잡이를 꾸밀 수 있도록 scrollbar-width가 걸려 있지 않아야 한다
    const box = canvas.getByTestId("box");
    if (!navigator.userAgent.includes("Firefox")) {
      await expect(getComputedStyle(box).scrollbarWidth).toBe("auto");
    }
  },
};
