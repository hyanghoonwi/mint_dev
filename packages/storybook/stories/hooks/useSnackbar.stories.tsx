import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import { Button, ToastProvider, useSnackbar, useToast } from "@futurewiz-rms/mint";

const meta = {
  title: "Hooks/useSnackbar",
  parameters: {
    layout: "centered",
    docs: {
      source: {
        code: `const snackbar = useSnackbar();
snackbar("관심 코인에서 삭제했어요.", { action: { label: "되돌리기", onClick: undo } });`,
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const undo = fn();

// 토스트와 같은 ToastProvider 안에서 useSnackbar로 띄운다
export const Default: Story = {
  render: function Render() {
    return (
      <ToastProvider snackbarDuration={600}>
        <Buttons />
      </ToastProvider>
    );
  },
  play: async ({ canvas }) => {
    const body = within(document.body);
    await userEvent.click(canvas.getByRole("button", { name: "삭제" }));
    const snackbar = await body.findByRole("status");
    await expect(snackbar).toHaveTextContent("관심 코인에서 삭제했어요.");
    // 버튼을 누르면 onClick이 불리고 닫힌다
    await userEvent.click(body.getByRole("button", { name: "되돌리기" }));
    await expect(undo).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(body.queryByRole("status")).not.toBeInTheDocument());
    // snackbarDuration(600ms)이 지나면 저절로 사라진다
    await userEvent.click(canvas.getByRole("button", { name: "삭제" }));
    await body.findByRole("status");
    await waitFor(() => expect(body.queryByRole("status")).not.toBeInTheDocument(), {
      timeout: 2000,
    });
  },
};

// 닫기 버튼과 아이콘, 오류는 alert로 읽힌다
export const Closable: Story = {
  render: function Render() {
    return (
      <ToastProvider>
        <Buttons />
      </ToastProvider>
    );
  },
  play: async ({ canvas }) => {
    const body = within(document.body);
    await userEvent.click(canvas.getByRole("button", { name: "실패" }));
    const alert = await body.findByRole("alert");
    await expect(alert).toHaveTextContent("주문하지 못했어요.");
    await userEvent.click(within(alert).getByRole("button", { name: "닫기" }));
    await waitFor(() => expect(body.queryByRole("alert")).not.toBeInTheDocument());
  },
};

// 토스트와 한 자리에 섞여 쌓인다. dismiss()는 자기 종류만 닫는다
export const WithToast: Story = {
  render: function Render() {
    return (
      <ToastProvider>
        <Buttons />
      </ToastProvider>
    );
  },
  play: async ({ canvas }) => {
    const body = within(document.body);
    await userEvent.click(canvas.getByRole("button", { name: "토스트" }));
    await userEvent.click(canvas.getByRole("button", { name: "삭제" }));
    const region = await body.findByRole("region", { name: "알림" });
    await waitFor(() => expect(within(region).getAllByRole("status")).toHaveLength(2));
    await userEvent.click(canvas.getByRole("button", { name: "스낵바 모두 닫기" }));
    await waitFor(() => expect(within(region).getAllByRole("status")).toHaveLength(1));
    await expect(within(region).getByRole("status")).toHaveTextContent("저장했어요.");
  },
};

function Buttons() {
  const snackbar = useSnackbar();
  const toast = useToast();
  return (
    <div style={{ display: "flex", gap: 8 }}>
      <Button
        color="secondary"
        onClick={() =>
          snackbar("관심 코인에서 삭제했어요.", { action: { label: "되돌리기", onClick: undo } })
        }
      >
        삭제
      </Button>
      <Button
        color="secondary"
        onClick={() => snackbar.negative("주문하지 못했어요.", { icon: true, closable: true })}
      >
        실패
      </Button>
      <Button color="secondary" onClick={() => toast.positive("저장했어요.")}>
        토스트
      </Button>
      <Button color="secondary" onClick={() => snackbar.dismiss()}>
        스낵바 모두 닫기
      </Button>
    </div>
  );
}
