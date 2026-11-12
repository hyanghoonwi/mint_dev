import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { Divider, Text } from "@futurewiz-rms/mint";

const meta = {
  title: "Components/Layout/Divider",
  component: Divider,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  argTypes: {
    orientation: { control: "inline-radio", options: ["horizontal", "vertical"] },
    variant: { control: "inline-radio", options: ["default", "strong", "thick"] },
    inset: { control: "boolean" },
  },
} satisfies Meta<typeof Divider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <div style={{ width: 320 }}>
      <Divider {...args} data-testid="divider" />
    </div>
  ),
  play: async ({ canvas }) => {
    // 장식이라 보조기기에서 읽지 않는다
    const divider = canvas.getByTestId("divider");
    await expect(divider).toHaveAttribute("aria-hidden", "true");
    await expect(divider.getBoundingClientRect().height).toBe(1);
  },
};

// default 일반 구분 · strong 더 또렷하게 · thick 8px 띠(영역 구분)
export const Variants: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, width: 320 }}>
      <Divider />
      <Divider variant="strong" />
      <Divider variant="thick" />
    </div>
  ),
};

// 좌우 20px 여백(가로선만)
export const Inset: Story = {
  args: { inset: true },
  render: (args) => (
    <div style={{ width: 320, background: "var(--mint-background-default)" }}>
      <Text as="p" variant="body-2-regular" className="p-5">
        알림 설정
      </Text>
      <Divider {...args} />
      <Text as="p" variant="body-2-regular" className="p-5">
        개인정보 보호
      </Text>
    </div>
  ),
};

// 세로선은 flex 줄 안에서 높이를 채운다
export const Vertical: Story = {
  render: () => (
    <div style={{ display: "flex", alignItems: "center", gap: 12, height: 20 }}>
      <Text variant="body-4-regular" color="secondary">
        최신순
      </Text>
      <Divider orientation="vertical" />
      <Text variant="body-4-regular" color="secondary">
        인기순
      </Text>
      <Divider orientation="vertical" variant="strong" />
      <Text variant="body-4-regular" color="secondary">
        거래량순
      </Text>
    </div>
  ),
};
