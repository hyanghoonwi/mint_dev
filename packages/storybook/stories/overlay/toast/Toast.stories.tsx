import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { Toast } from "@futurewiz-rms/mint";

const variants = ["normal", "positive", "cautionary", "negative"] as const;

const meta = {
  title: "Components/Overlay/Toast",
  component: Toast,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    variant: { control: "inline-radio", options: variants },
    shape: { control: "inline-radio", options: ["default", "pill"] },
  },
  args: {
    children: "메시지에 마침표를 찍어요.",
    style: { width: 300 },
  },
} satisfies Meta<typeof Toast>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Normal: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByText("메시지에 마침표를 찍어요.")).toBeInTheDocument();
  },
};

// 완료는 positive, 주의는 cautionary, 오류는 negative. 종류에 맞는 아이콘이 앞에 붙는다
export const Variants: Story = {
  render: () => (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 300px)", gap: 16 }}>
      {variants.map((variant) => (
        <Toast key={variant} variant={variant}>
          메시지에 마침표를 찍어요.
        </Toast>
      ))}
    </div>
  ),
};

// default는 모서리 12, pill은 알약 모양
export const Shapes: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, width: 300 }}>
      <Toast>저장했어요.</Toast>
      <Toast shape="pill">저장했어요.</Toast>
    </div>
  ),
};
