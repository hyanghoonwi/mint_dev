import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { Button, ToastProvider, useToast } from "@futurewiz-rms/mint";

const meta = {
  title: "Hooks/useToast",
  parameters: {
    layout: "centered",
    docs: {
      source: {
        code: `const toast = useToast();
toast.positive("저장했어요.");`,
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

// 앱 최상단을 ToastProvider로 감싸고, 클라이언트 컴포넌트에서 useToast로 띄운다
export const Default: Story = {
  render: function Render() {
    return (
      <ToastProvider duration={400}>
        <Buttons />
      </ToastProvider>
    );
  },
  play: async ({ canvas }) => {
    const body = within(document.body);
    await userEvent.click(canvas.getByRole("button", { name: "저장" }));
    const toast = await body.findByRole("status");
    await expect(toast).toHaveTextContent("저장했어요.");
    // duration(400ms)이 지나면 사라진다
    await waitFor(() => expect(body.queryByRole("status")).not.toBeInTheDocument(), {
      timeout: 2000,
    });
    // 오류는 alert로 읽힌다
    await userEvent.click(canvas.getByRole("button", { name: "실패" }));
    await expect(await body.findByRole("alert")).toHaveTextContent("저장하지 못했어요.");
  },
};

// 위에 띄우기: position="top". offset으로 가장자리에서 띄우는 거리를 정한다
export const Top: Story = {
  render: function Render() {
    return (
      <ToastProvider position="top" offset={80}>
        <Buttons />
      </ToastProvider>
    );
  },
};

// 알약 모양을 기본으로
export const Pill: Story = {
  render: function Render() {
    return (
      <ToastProvider shape="pill">
        <Buttons />
      </ToastProvider>
    );
  },
};

function Buttons() {
  const toast = useToast();
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      <Button color="secondary" onClick={() => toast("알림을 켰어요.")}>
        알림
      </Button>
      <Button color="secondary" onClick={() => toast.positive("저장했어요.")}>
        저장
      </Button>
      <Button color="secondary" onClick={() => toast.cautionary("네트워크가 느려요.")}>
        주의
      </Button>
      <Button color="secondary" onClick={() => toast.negative("저장하지 못했어요.")}>
        실패
      </Button>
    </div>
  );
}
