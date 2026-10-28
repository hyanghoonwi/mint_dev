import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { Button } from "@futurewiz-rms/mint";

const meta = {
  title: "Components/Actions/Button",
  component: Button,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "tint", "line", "danger"],
    },
    size: { control: "inline-radio", options: ["sm", "md", "lg", "xl"] },
    fullWidth: { control: "boolean" },
    disabled: { control: "boolean" },
    leftAddon: { control: false },
    rightAddon: { control: false },
  },
  args: {
    children: "시세 보기",
    onClick: fn(),
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: { variant: "primary" },
};

export const Tint: Story = {
  args: { variant: "tint" },
};

export const Line: Story = {
  args: { variant: "line" },
};

export const Danger: Story = {
  args: { variant: "danger", children: "탈퇴하기" },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      {(["sm", "md", "lg", "xl"] as const).map((size) => (
        <Button key={size} {...args} size={size}>
          {size}
        </Button>
      ))}
    </div>
  ),
};

// 부모 폭을 꽉 채운다. 모바일 화면 하단 버튼 등에 쓴다
export const FullWidth: Story = {
  args: { fullWidth: true, size: "lg" },
  parameters: { layout: "padded" },
};
