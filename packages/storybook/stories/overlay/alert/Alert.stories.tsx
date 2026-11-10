import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Alert, Button } from "@futurewiz-rms/mint";

const meta = {
  title: "Components/Overlay/Alert",
  component: Alert,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    heading: { control: "text" },
    open: { control: false },
    action: { control: false },
  },
  args: {
    open: false,
    heading: "알림을 켤까요?",
    body: "설정에서 언제든 끌 수 있어요.",
    action: null,
  },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

// 버튼을 눌러 열고, 버튼이나 Esc로 닫는다. 열리면 포커스가 안으로 들어가고 닫히면 버튼으로 돌아온다
// 하단 버튼은 `action`에 직접 넣는다: 보조 행동은 secondary, 주된 행동은 solid
export const Default: Story = {
  render: function Render(args) {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Alert 열기</Button>
        <Alert
          {...args}
          open={open}
          onClose={() => setOpen(false)}
          action={
            <>
              <Button color="secondary" onClick={() => setOpen(false)}>
                취소
              </Button>
              <Button onClick={() => setOpen(false)}>켜기</Button>
            </>
          }
        />
      </>
    );
  },
};

// 되돌릴 수 없거나 위험한 일은 주된 버튼을 destructive로 알린다
export const Destructive: Story = {
  args: {
    heading: "탈퇴할까요?",
    body: "탈퇴하면 관심 코인과 알림 설정이 모두 사라져요.",
  },
  render: function Render(args) {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button color="destructive" onClick={() => setOpen(true)}>
          탈퇴하기
        </Button>
        <Alert
          {...args}
          open={open}
          onClose={() => setOpen(false)}
          action={
            <>
              <Button color="secondary" onClick={() => setOpen(false)}>
                취소
              </Button>
              <Button color="destructive" onClick={() => setOpen(false)}>
                탈퇴
              </Button>
            </>
          }
        />
      </>
    );
  },
};

// 제목 없이 본문만
export const WithoutHeading: Story = {
  args: { heading: undefined, body: "저장하지 않은 내용이 있어요." },
  render: function Render(args) {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Alert 열기</Button>
        <Alert
          {...args}
          open={open}
          onClose={() => setOpen(false)}
          action={
            <>
              <Button color="secondary" onClick={() => setOpen(false)}>
                취소
              </Button>
              <Button onClick={() => setOpen(false)}>나가기</Button>
            </>
          }
        />
      </>
    );
  },
};

// 버튼 하나만
export const SingleAction: Story = {
  args: { heading: "점검 중이에요", body: "잠시 후 다시 시도해 주세요." },
  render: function Render(args) {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Alert 열기</Button>
        <Alert
          {...args}
          open={open}
          onClose={() => setOpen(false)}
          action={<Button onClick={() => setOpen(false)}>확인</Button>}
        />
      </>
    );
  },
};

// 모바일(360)에서도 좌우 여백 20을 지키며 가운데에 뜬다
export const Mobile: Story = {
  ...Default,
  parameters: { layout: "padded" },
  globals: { viewport: { value: "mobile" } },
};
