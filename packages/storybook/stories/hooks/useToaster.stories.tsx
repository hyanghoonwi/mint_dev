import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { Button, ToasterProvider, useToaster } from "@futurewiz-rms/mint";

const meta = {
  title: "Hooks/useToaster",
  parameters: {
    layout: "centered",
    docs: {
      source: {
        code: `const toaster = useToaster();
toaster.positive("저장했어요.");`,
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

// 앱 최상단을 ToasterProvider로 감싸고, 클라이언트 컴포넌트에서 useToaster로 띄운다
export const Default: Story = {
  render: function Render() {
    return (
      <ToasterProvider duration={400}>
        <Buttons />
      </ToasterProvider>
    );
  },
  play: async ({ canvas }) => {
    const body = within(document.body);
    await userEvent.click(canvas.getByRole("button", { name: "저장" }));
    const message = await body.findByRole("status");
    await expect(message).toHaveTextContent("저장했어요.");
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
      <ToasterProvider position="top" offset={80}>
        <Buttons />
      </ToasterProvider>
    );
  },
};

// 알약 모양을 기본으로
export const Pill: Story = {
  render: function Render() {
    return (
      <ToasterProvider shape="pill">
        <Buttons />
      </ToasterProvider>
    );
  },
};

// 버튼이 있는 토스트: action·actionLabel을 주면 오른쪽에 버튼이 생기고, 누르면 onAction이 불린 뒤 닫힌다
export const WithAction: Story = {
  render: function Render() {
    return (
      <ToasterProvider>
        <UndoButton />
      </ToasterProvider>
    );
  },
  play: async ({ canvas }) => {
    const body = within(document.body);
    await userEvent.click(canvas.getByRole("button", { name: "삭제" }));
    await userEvent.click(await body.findByRole("button", { name: "되돌리기" }));
    await expect(await body.findByText("되돌렸어요.")).toBeInTheDocument();
  },
};

function UndoButton() {
  const toaster = useToaster();
  return (
    <Button
      color="secondary"
      onClick={() =>
        toaster.normal("삭제했어요.", {
          action: "ghost",
          actionLabel: "되돌리기",
          onAction: () => toaster.positive("되돌렸어요."),
        })
      }
    >
      삭제
    </Button>
  );
}

function Buttons() {
  const toaster = useToaster();
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      <Button color="secondary" onClick={() => toaster("알림을 켰어요.")}>
        알림
      </Button>
      <Button color="secondary" onClick={() => toaster.positive("저장했어요.")}>
        저장
      </Button>
      <Button color="secondary" onClick={() => toaster.cautionary("네트워크가 느려요.")}>
        주의
      </Button>
      <Button color="secondary" onClick={() => toaster.negative("저장하지 못했어요.")}>
        실패
      </Button>
    </div>
  );
}
