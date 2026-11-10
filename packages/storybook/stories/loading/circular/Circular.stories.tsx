import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, Circular } from "@futurewiz-rms/mint";

const meta = {
  title: "Components/Loading/Circular",
  component: Circular,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    color: { control: "inline-radio", options: ["default", "brand", "on-fill"] },
    size: { control: { type: "number", min: 12, max: 64, step: 4 } },
    label: { control: "text" },
  },
} satisfies Meta<typeof Circular>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Brand: Story = {
  args: { color: "brand" },
};

// on-fill은 진한 배경 위에서 쓰는 흰색이다
export const OnFill: Story = {
  args: { color: "on-fill" },
  decorators: [
    (Story) => (
      <div style={{ background: "var(--mint-fill-brand)", padding: 16, borderRadius: 12 }}>
        <Story />
      </div>
    ),
  ],
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      {[12, 16, 20, 28, 40].map((size) => (
        <Circular key={size} size={size} color="brand" />
      ))}
    </div>
  ),
};

// 버튼의 loading은 버튼 크기에 맞춰 원 크기가 달라진다: xs 12 · sm 16 · md 16 · lg 20
export const InButton: Story = {
  render: () => (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <Button size="xs" loading>
        확인
      </Button>
      <Button size="sm" loading>
        확인
      </Button>
      <Button size="md" loading>
        확인
      </Button>
      <Button size="lg" loading>
        확인
      </Button>
    </div>
  ),
};
