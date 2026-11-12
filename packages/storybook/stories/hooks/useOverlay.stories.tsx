import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { Alert, Button, OverlayProvider, Text, useOverlay } from "@futurewiz-rms/mint";

const meta = {
  title: "Hooks/useOverlay",
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <OverlayProvider>
        <Story />
      </OverlayProvider>
    ),
  ],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

// 오버레이는 화면 맨 위 레이어(<dialog>)에 그려지므로 문서 전체에서 찾는다
const page = within(document.body);

/** 열린 Alert들(아래에서 위 순서) */
const openAlerts = () =>
  [...document.querySelectorAll<HTMLDialogElement>("dialog[role=alertdialog]")].filter(
    (dialog) => dialog.open,
  );

/** Esc를 누른 것과 같은 cancel 이벤트를 맨 위 Alert에 보낸다 */
const pressEscape = () => {
  const alerts = openAlerts();
  alerts[alerts.length - 1]?.dispatchEvent(new Event("cancel", { cancelable: true }));
};

/** 동기: open으로 열고 버튼의 onClick에서 close로 닫는다 */
export const Open: Story = {
  render: function Render() {
    const overlay = useOverlay();
    return (
      <Button
        onClick={() =>
          overlay.open(({ isOpen, close }) => (
            <Alert
              open={isOpen}
              onClose={close}
              heading="관심 코인에서 뺄까요?"
              body="빼면 이 코인의 가격 알림도 함께 꺼져요."
              action={
                <>
                  <Button color="secondary" onClick={() => close()}>
                    취소
                  </Button>
                  <Button color="destructive" onClick={() => close()}>
                    빼기
                  </Button>
                </>
              }
            />
          ))
        }
      >
        Alert 열기
      </Button>
    );
  },
  play: async ({ canvas, step }) => {
    await step("열기", async () => {
      await userEvent.click(canvas.getByRole("button", { name: "Alert 열기" }));
      await expect(await page.findByRole("alertdialog")).toBeVisible();
      await waitFor(() => expect(document.body.style.overflow).toBe("hidden"));
    });
    await step("버튼으로 닫기", async () => {
      await userEvent.click(page.getByRole("button", { name: "취소" }));
      await waitFor(() => expect(openAlerts()).toHaveLength(0));
      await expect(document.body.style.overflow).toBe("");
    });
    await step("다시 열고 Esc로 닫기", async () => {
      await userEvent.click(canvas.getByRole("button", { name: "Alert 열기" }));
      await waitFor(() => expect(openAlerts()).toHaveLength(1));
      pressEscape();
      await waitFor(() => expect(openAlerts()).toHaveLength(0));
    });
  },
};

/** 비동기: openAsync가 돌려준 Promise를 기다려 사용자가 고른 값을 받는다 */
export const OpenAsync: Story = {
  render: function Render() {
    const overlay = useOverlay();
    const [result, setResult] = useState("아직 고르지 않았어요");
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <Button
          onClick={async () => {
            const confirmed = await overlay.openAsync<boolean>(({ isOpen, close }) => (
              <Alert
                open={isOpen}
                onClose={() => close(false)}
                heading="게시글을 삭제할까요?"
                body="삭제한 글은 되돌릴 수 없어요."
                action={
                  <>
                    <Button color="secondary" onClick={() => close(false)}>
                      취소
                    </Button>
                    <Button color="destructive" onClick={() => close(true)}>
                      삭제
                    </Button>
                  </>
                }
              />
            ));
            setResult(confirmed ? "삭제했어요" : "취소했어요");
          }}
        >
          게시글 삭제
        </Button>
        <Text variant="body-2-regular" color="secondary" role="status">
          {result}
        </Text>
      </div>
    );
  },
  play: async ({ canvas, step }) => {
    const open = () => userEvent.click(canvas.getByRole("button", { name: "게시글 삭제" }));
    await step("삭제를 누르면 true", async () => {
      await open();
      await userEvent.click(await page.findByRole("button", { name: "삭제" }));
      await expect(await canvas.findByText("삭제했어요")).toBeInTheDocument();
      await waitFor(() => expect(openAlerts()).toHaveLength(0));
    });
    await step("취소를 누르면 false", async () => {
      await open();
      await userEvent.click(await page.findByRole("button", { name: "취소" }));
      await expect(await canvas.findByText("취소했어요")).toBeInTheDocument();
    });
    await step("Esc로 닫아도 false", async () => {
      await open();
      await userEvent.click(await page.findByRole("button", { name: "삭제" }));
      await canvas.findByText("삭제했어요");
      await open();
      await waitFor(() => expect(openAlerts()).toHaveLength(1));
      pressEscape();
      await expect(await canvas.findByText("취소했어요")).toBeInTheDocument();
    });
  },
};

/** 쌓기: 열린 Alert 위에서 다시 열면 그 위에 쌓이고, 위에서부터 하나씩 닫힌다. closeAll은 모두 닫는다 */
export const Stacked: Story = {
  render: function Render() {
    const overlay = useOverlay();
    const openSecond = () =>
      overlay.open(({ isOpen, close }) => (
        <Alert
          open={isOpen}
          onClose={close}
          heading="정말 탈퇴할까요?"
          body="탈퇴하면 관심 코인과 알림 설정이 모두 사라져요."
          action={
            <>
              <Button color="secondary" onClick={() => close()}>
                돌아가기
              </Button>
              <Button color="destructive" onClick={() => overlay.closeAll()}>
                탈퇴
              </Button>
            </>
          }
        />
      ));
    return (
      <Button
        onClick={() =>
          overlay.open(({ isOpen, close }) => (
            <Alert
              open={isOpen}
              onClose={close}
              heading="탈퇴 안내"
              body="탈퇴 전에 보유 자산을 확인해 주세요."
              action={
                <>
                  <Button color="secondary" onClick={() => close()}>
                    닫기
                  </Button>
                  <Button onClick={openSecond}>계속</Button>
                </>
              }
            />
          ))
        }
      >
        탈퇴하기
      </Button>
    );
  },
  play: async ({ canvas, step }) => {
    const open = () => userEvent.click(canvas.getByRole("button", { name: "탈퇴하기" }));
    await step("두 겹으로 쌓기", async () => {
      await open();
      await userEvent.click(await page.findByRole("button", { name: "계속" }));
      await waitFor(() => expect(openAlerts()).toHaveLength(2));
      const [first, second] = openAlerts();
      await expect(first).toHaveTextContent("탈퇴 안내");
      await expect(second).toHaveTextContent("정말 탈퇴할까요?");
      // 나중에 연 것이 위에 있어서 포커스도 위쪽 Alert 안에 있다
      await waitFor(() => expect(second.contains(document.activeElement)).toBe(true));
    });
    await step("Esc는 맨 위 하나만 닫고, 스크롤 잠금은 유지", async () => {
      pressEscape();
      await waitFor(() => expect(openAlerts()).toHaveLength(1));
      await expect(openAlerts()[0]).toHaveTextContent("탈퇴 안내");
      await expect(document.body.style.overflow).toBe("hidden");
    });
    await step("남은 것을 닫으면 스크롤이 풀림", async () => {
      await userEvent.click(page.getByRole("button", { name: "닫기" }));
      await waitFor(() => expect(openAlerts()).toHaveLength(0));
      await expect(document.body.style.overflow).toBe("");
    });
    await step("overlay.closeAll()은 열린 것을 모두 닫음", async () => {
      await open();
      await userEvent.click(await page.findByRole("button", { name: "계속" }));
      await waitFor(() => expect(openAlerts()).toHaveLength(2));
      await userEvent.click(page.getByRole("button", { name: "탈퇴" }));
      await waitFor(() => expect(openAlerts()).toHaveLength(0));
      await expect(document.body.style.overflow).toBe("");
    });
    await step("닫힌 Alert는 화면에서 빠짐", async () => {
      await waitFor(() =>
        expect(document.querySelectorAll("dialog[role=alertdialog]")).toHaveLength(0),
      );
    });
  },
};

/** 차례로: 첫 번째 결과를 기다린 뒤 두 번째를 연다 */
export const Sequential: Story = {
  render: function Render() {
    const overlay = useOverlay();
    const [result, setResult] = useState("");
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <Button
          onClick={async () => {
            const agreed = await overlay.openAsync<boolean>(({ isOpen, close }) => (
              <Alert
                open={isOpen}
                onClose={() => close(false)}
                heading="알림을 켤까요?"
                body="설정에서 언제든 끌 수 있어요."
                action={
                  <>
                    <Button color="secondary" onClick={() => close(false)}>
                      취소
                    </Button>
                    <Button onClick={() => close(true)}>켜기</Button>
                  </>
                }
              />
            ));
            if (!agreed) return setResult("결과: 끔");
            await overlay.openAsync<void>(({ isOpen, close }) => (
              <Alert
                open={isOpen}
                onClose={() => close()}
                body="알림을 켰어요."
                action={<Button onClick={() => close()}>확인</Button>}
              />
            ));
            setResult("결과: 켬");
          }}
        >
          알림 설정
        </Button>
        <Text variant="body-2-regular" color="secondary" role="status">
          {result}
        </Text>
      </div>
    );
  },
  play: async ({ canvas, step }) => {
    await step("켜기 → 완료 안내 → 확인", async () => {
      await userEvent.click(canvas.getByRole("button", { name: "알림 설정" }));
      await userEvent.click(await page.findByRole("button", { name: "켜기" }));
      await userEvent.click(await page.findByRole("button", { name: "확인" }));
      await expect(await canvas.findByText("결과: 켬")).toBeInTheDocument();
      await waitFor(() => expect(openAlerts()).toHaveLength(0));
    });
    await step("취소하면 두 번째는 열리지 않음", async () => {
      await userEvent.click(canvas.getByRole("button", { name: "알림 설정" }));
      await userEvent.click(await page.findByRole("button", { name: "취소" }));
      await expect(await canvas.findByText("결과: 끔")).toBeInTheDocument();
      await expect(openAlerts()).toHaveLength(0);
    });
  },
};

/** overlayId: 같은 id가 열려 있으면 다시 열지 않고, openAsync는 진행 중인 Promise를 그대로 돌려준다 */
export const SameOverlayId: Story = {
  render: function Render() {
    const overlay = useOverlay();
    const [results, setResults] = useState<string[]>([]);
    const ask = () =>
      overlay
        .openAsync<boolean>(
          ({ isOpen, close }) => (
            <Alert
              open={isOpen}
              onClose={() => close(false)}
              body="알림을 켤까요?"
              action={<Button onClick={() => close(true)}>켜기</Button>}
            />
          ),
          { overlayId: "notification" },
        )
        .then((value) => setResults((prev) => [...prev, String(value)]));
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <Button
          onClick={() => {
            // 연타처럼 두 번 연다
            ask();
            ask();
          }}
        >
          두 번 열기
        </Button>
        <Text variant="body-2-regular" color="secondary">
          {results.length ? `결과: ${results.join(", ")}` : ""}
        </Text>
      </div>
    );
  },
  play: async ({ canvas, step }) => {
    await step("두 번 열어도 하나만 열림", async () => {
      await userEvent.click(canvas.getByRole("button", { name: "두 번 열기" }));
      await waitFor(() => expect(openAlerts()).toHaveLength(1));
    });
    await step("두 호출이 같은 결과를 받음", async () => {
      await userEvent.click(await page.findByRole("button", { name: "켜기" }));
      await expect(await canvas.findByText("결과: true, true")).toBeInTheDocument();
    });
  },
};

/** 값 없이 닫히면 openAsync는 undefined로 끝난다(close(), closeAll(), exit) */
export const ClosedWithoutValue: Story = {
  render: function Render() {
    const overlay = useOverlay();
    const [result, setResult] = useState("");
    const ask = () =>
      overlay
        .openAsync<boolean>(({ isOpen, close, exit }) => (
          <Alert
            open={isOpen}
            onClose={() => close()}
            body="결과 없이 닫아 볼까요?"
            action={
              <>
                <Button color="secondary" onClick={() => exit()}>
                  바로 빼기
                </Button>
                <Button onClick={() => overlay.closeAll()}>모두 닫기</Button>
              </>
            }
          />
        ))
        .then((value) => setResult(`결과: ${String(value)}`));
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <Button onClick={ask}>열기</Button>
        <Text variant="body-2-regular" color="secondary">
          {result}
        </Text>
      </div>
    );
  },
  play: async ({ canvas, step }) => {
    const open = async () => {
      await userEvent.click(canvas.getByRole("button", { name: "열기" }));
      await waitFor(() => expect(openAlerts()).toHaveLength(1));
    };
    const expectUndefined = async () => {
      await expect(await canvas.findByText("결과: undefined")).toBeInTheDocument();
      await waitFor(() => expect(openAlerts()).toHaveLength(0));
      await expect(document.body.style.overflow).toBe("");
    };
    await step("Esc(close())", async () => {
      await open();
      pressEscape();
      await expectUndefined();
    });
    await step("closeAll()", async () => {
      await open();
      await userEvent.click(page.getByRole("button", { name: "모두 닫기" }));
      await expectUndefined();
    });
    await step("exit()", async () => {
      await open();
      await userEvent.click(page.getByRole("button", { name: "바로 빼기" }));
      await expectUndefined();
    });
  },
};
