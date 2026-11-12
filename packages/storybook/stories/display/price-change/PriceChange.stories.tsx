import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { PriceChange } from "@futurewiz-rms/mint";

const directions = ["up", "down", "flat"] as const;

const meta = {
  title: "Components/Display/PriceChange",
  component: PriceChange,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    direction: { control: "inline-radio", options: directions },
    type: { control: "inline-radio", options: ["amount", "percent"] },
    variant: { control: "inline-radio", options: ["text", "weak"] },
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
  },
  args: {
    direction: "up",
    children: "1,200",
  },
} satisfies Meta<typeof PriceChange>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Amount: Story = {
  play: async ({ canvas }) => {
    // 화살표는 숨기고 방향을 글자로 읽어 준다
    await expect(canvas.getByText("상승")).toHaveClass("sr-only");
    await expect(canvas.getByText("1,200")).toBeInTheDocument();
  },
};

export const Percent: Story = {
  args: { type: "percent", direction: "down", children: "1.20%" },
  play: async ({ canvas }) => {
    await expect(canvas.getByText("-1.20%")).toBeInTheDocument();
  },
};

// 방향 × 종류: 금액은 화살표(▲ ▼ −), 퍼센트는 부호(+, -, 보합은 없음)
export const Directions: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {(["amount", "percent"] as const).map((type) => (
        <div key={type} style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {directions.map((direction) => (
            <PriceChange key={direction} direction={direction} type={type}>
              {type === "amount" ? "1,200" : direction === "flat" ? "0.00%" : "3.42%"}
            </PriceChange>
          ))}
        </div>
      ))}
    </div>
  ),
};

// 연한 배경
export const Weak: Story = {
  render: () => (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <PriceChange direction="up" variant="weak">
        100,000
      </PriceChange>
      <PriceChange direction="up" variant="weak" type="percent">
        3.42%
      </PriceChange>
      <PriceChange direction="down" variant="weak">
        100
      </PriceChange>
      <PriceChange direction="down" variant="weak" type="percent">
        1.20%
      </PriceChange>
      <PriceChange direction="flat" variant="weak" type="percent">
        0.00%
      </PriceChange>
    </div>
  ),
};

// sm 표·목록 · md 기본 · lg 요약 카드
export const Sizes: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {(["text", "weak"] as const).map((variant) => (
        <div key={variant} style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {(["sm", "md", "lg"] as const).map((size) => (
            <PriceChange key={size} direction="up" variant={variant} size={size}>
              1,200
            </PriceChange>
          ))}
        </div>
      ))}
    </div>
  ),
};

// 구간별 값: 모바일·태블릿 sm(12px) → 데스크톱(1024px~) md(14px)
export const Responsive: Story = {
  args: { size: { base: "sm", desktop: "md" }, type: "percent", children: "3.42%" },
  play: async ({ canvas }) => {
    await expect(canvas.getByText("+3.42%").parentElement).toHaveClass(
      "text-caption-1-medium",
      "desktop:text-body-4-semibold",
    );
  },
};
