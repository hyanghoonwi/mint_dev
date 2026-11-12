import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, fn, userEvent } from "storybook/test";
import { Button, Snackbar } from "@futurewiz-rms/mint";

const variants = ["normal", "positive", "cautionary", "negative"] as const;

const meta = {
  title: "Components/Display/Snackbar",
  component: Snackbar,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    variant: { control: "inline-radio", options: variants },
    icon: { control: "boolean" },
  },
  args: {
    heading: "메시지에 마침표를 찍어요.",
    description: "설명은 필요할 때만 써요.",
  },
} satisfies Meta<typeof Snackbar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

// 다음 행동 버튼 하나. 닫기 버튼(X)은 선택
export const WithAction: Story = {
  args: {
    heading: "관심 코인에서 뺐어요.",
    description: undefined,
    action: { label: "되돌리기", onClick: fn() },
    onClose: fn(),
  },
  play: async ({ canvas, args }) => {
    await userEvent.click(canvas.getByRole("button", { name: "되돌리기" }));
    await expect(args.action?.onClick).toHaveBeenCalled();
    await userEvent.click(canvas.getByRole("button", { name: "닫기" }));
    await expect(args.onClose).toHaveBeenCalled();
  },
};

// 종류에 맞는 아이콘(icon)
export const Variants: Story = {
  render: () => (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 356px)", gap: 16 }}>
      {variants.map((variant) => (
        <Snackbar
          key={variant}
          variant={variant}
          icon
          heading="메시지에 마침표를 찍어요."
          description="설명은 필요할 때만 써요."
        />
      ))}
    </div>
  ),
};

// 본문 안에 그대로 두는 컴포넌트다. 닫기를 누르면 사용하는 쪽이 상태를 바꿔 숨긴다
export const Dismissible: Story = {
  render: function Render() {
    const [open, setOpen] = useState(true);
    return open ? (
      <Snackbar
        heading="새 버전이 준비됐어요."
        description="다시 불러오면 바로 적용돼요."
        action={{ label: "새로고침", onClick: () => {} }}
        onClose={() => setOpen(false)}
      />
    ) : (
      <Button color="secondary" onClick={() => setOpen(true)}>
        다시 보기
      </Button>
    );
  },
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: "닫기" }));
    await expect(canvas.queryByText("새 버전이 준비됐어요.")).not.toBeInTheDocument();
  },
};
