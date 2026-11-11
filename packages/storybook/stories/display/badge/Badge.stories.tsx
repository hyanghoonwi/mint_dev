import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { Badge } from "@futurewiz-rms/mint";

const colors = ["brand", "neutral", "danger", "success", "warning"] as const;

const meta = {
  title: "Components/Display/Badge",
  component: Badge,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    variant: { control: "inline-radio", options: ["fill", "weak"] },
    color: { control: "select", options: colors },
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
  },
  args: {
    children: "NEW",
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Fill: Story = {};

export const Weak: Story = {
  args: { variant: "weak", color: "success", children: "완료" },
};

// 색은 의미로 고른다: brand 강조 · neutral 일반 · danger 오류·임박 · success 완료 · warning 주의
export const Colors: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {(["fill", "weak"] as const).map((variant) => (
        <div key={variant} style={{ display: "flex", gap: 8 }}>
          {colors.map((color) => (
            <Badge key={color} variant={variant} color={color}>
              {color}
            </Badge>
          ))}
        </div>
      ))}
    </div>
  ),
};

// 높이 20 · 24 · 28px. 같은 화면에서는 하나로 맞춘다
export const Sizes: Story = {
  render: () => (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <Badge size="sm">NEW</Badge>
      <Badge size="md">NEW</Badge>
      <Badge size="lg">NEW</Badge>
    </div>
  ),
};

// 구간별 값: 모바일 sm(20) → 태블릿(768px~) md(24)
export const Responsive: Story = {
  args: { size: { base: "sm", tablet: "md" }, children: "NEW" },
  play: async ({ canvas }) => {
    await expect(canvas.getByText("NEW")).toHaveClass(
      "text-caption-2-semibold",
      "tablet:text-caption-1-semibold",
    );
  },
};
