import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import { CheckIcon, CopyIcon, IconButton, Text, useClipboard } from "@futurewiz-rms/mint";

const ADDRESS = "0x71C7656EC7ab88b098defB751B7401B5f6d8976F";

const meta = {
  title: "Hooks/useClipboard",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** 테스트에서 실제 클립보드 대신 쓰는 가짜(헤드리스 브라우저는 권한이 없다) */
const mockClipboard = (writeText: (text: string) => Promise<void>) =>
  Object.defineProperty(navigator, "clipboard", { value: { writeText }, configurable: true });

// 지갑 주소 복사: 복사하면 아이콘과 이름이 잠시 바뀐다
export const CopyAddress: Story = {
  render: function Render() {
    const { copy, copied } = useClipboard({ timeout: 500 });
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <Text variant="body-3-regular" lines={1} style={{ maxWidth: 200 }}>
          {ADDRESS}
        </Text>
        <IconButton
          size="sm"
          icon={copied ? <CheckIcon /> : <CopyIcon />}
          aria-label={copied ? "복사했어요" : "주소 복사"}
          onClick={() => copy(ADDRESS)}
        />
      </div>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const writeText = fn(async () => {});
    mockClipboard(writeText);
    await step("누르면 주소를 복사하고 이름이 바뀜", async () => {
      await userEvent.click(canvas.getByRole("button", { name: "주소 복사" }));
      await expect(writeText).toHaveBeenCalledWith(ADDRESS);
      await expect(canvas.getByRole("button", { name: "복사했어요" })).toBeInTheDocument();
    });
    await step("timeout이 지나면 돌아옴", async () => {
      await waitFor(() =>
        expect(canvas.getByRole("button", { name: "주소 복사" })).toBeInTheDocument(),
      );
    });
  },
};

// 실패하면 error에 오류가 담긴다
export const Failure: Story = {
  render: function Render() {
    const { copy, error } = useClipboard();
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <IconButton icon={<CopyIcon />} aria-label="복사" onClick={() => copy("text")} />
        {error && (
          <Text variant="caption-1-regular" color="danger">
            복사하지 못했어요
          </Text>
        )}
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    mockClipboard(async () => {
      throw new Error("denied");
    });
    await userEvent.click(canvas.getByRole("button", { name: "복사" }));
    await expect(await canvas.findByText("복사하지 못했어요")).toBeInTheDocument();
  },
};
