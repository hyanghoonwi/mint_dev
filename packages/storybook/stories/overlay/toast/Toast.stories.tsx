import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent } from "storybook/test";
import { StarIcon, Toast } from "@futurewiz-rms/mint";

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
    icon: { control: "boolean" },
    action: { control: "inline-radio", options: ["none", "ghost", "button"] },
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

// 오른쪽 버튼: ghost는 글자만, button은 배경이 있다. 누르면 onAction이 불린다
export const Action: Story = {
  args: { variant: "negative", action: "button", actionLabel: "다시 시도", onAction: fn() },
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, width: 300 }}>
      <Toast {...args} />
      <Toast action="ghost" actionLabel="되돌리기">
        삭제했어요.
      </Toast>
      <Toast variant="positive" shape="pill" action="ghost" actionLabel="보기">
        업로드했어요.
      </Toast>
    </div>
  ),
  play: async ({ canvas, args }) => {
    await userEvent.click(canvas.getByRole("button", { name: "다시 시도" }));
    await expect(args.onAction).toHaveBeenCalled();
  },
};

// 아이콘: 기본은 종류별 아이콘, false면 없음, 노드를 넘기면 그 아이콘
export const Icons: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, width: 300 }}>
      <Toast>종류에 맞는 아이콘이에요.</Toast>
      <Toast icon={false}>아이콘 없이 글자만 보여요.</Toast>
      <Toast icon={<StarIcon variant="fill" />}>관심 코인에 담았어요.</Toast>
    </div>
  ),
};
