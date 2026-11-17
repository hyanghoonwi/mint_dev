import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";
import {
  Box,
  FileItem,
  FileUploader,
  useFileUpload,
  type FileUploadHelpers,
} from "@futurewiz-rms/mint";

const meta = {
  title: "Hooks/useFileUpload",
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div style={{ width: "100%", maxWidth: 360 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** 서버 업로드 흉내: 100ms마다 25%씩. 이름에 "fail"이 있으면 실패, 중단 신호가 오면 멈춘다 */
function fakeUpload(file: File, { onProgress, signal }: FileUploadHelpers) {
  return new Promise<void>((resolve, reject) => {
    let percent = 0;
    const timer = setInterval(() => {
      percent += 25;
      onProgress(percent);
      if (percent >= 100) {
        clearInterval(timer);
        if (file.name.includes("fail")) reject(new Error("failed"));
        else resolve();
      }
    }, 100);
    signal.addEventListener("abort", () => {
      clearInterval(timer);
      reject(signal.reason);
    });
  });
}

const pngFile = (name: string, bytes = 1024) =>
  new File([new Uint8Array(bytes)], name, { type: "image/png" });

const fileInput = (canvasElement: HTMLElement) =>
  canvasElement.querySelector<HTMLInputElement>('input[type="file"]')!;

// 고르자마자 올리고 진행률이 차오른 뒤 완료된다. 이미지는 미리보기 주소(blob:)로 썸네일이 보이고, 지우면 사라진다
export const AutoUpload: Story = {
  render: function Render() {
    const upload = useFileUpload({ maxSize: 5000, upload: fakeUpload });
    return (
      <Box gap={12}>
        <FileUploader label="첨부" multiple {...upload.uploaderProps} />
        {upload.items.map((item) => (
          <FileItem key={item.id} {...upload.itemProps(item)} />
        ))}
      </Box>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.upload(fileInput(canvasElement), [
      pngFile("photo.png"),
      pngFile("big.png", 9000),
    ]);
    await expect(await canvas.findByRole("progressbar", { name: /photo.png/ })).toBeVisible();
    // 용량을 넘은 파일은 실패로 남고, 다시 시도 없이 이유만 보인다
    await expect(canvas.getByText(/보다 큰 파일이에요/)).toBeVisible();
    await waitFor(() => expect(canvas.getByRole("img", { name: "완료" })).toBeVisible());
    await expect(canvasElement.querySelector('img[src^="blob:"]')).not.toBeNull();
    await expect(canvas.queryByRole("button", { name: "다시 시도" })).toBeNull();
    await userEvent.click(canvas.getByRole("button", { name: "photo.png 삭제" }));
    await expect(canvas.queryByText("photo.png")).toBeNull();
  },
};

// 실패하면 이유와 다시 시도가 보이고, 올리는 중에 ×를 누르면 취소되어 목록에서 빠진다
export const FailAndCancel: Story = {
  render: function Render() {
    const upload = useFileUpload({ upload: fakeUpload });
    return (
      <Box gap={12}>
        <FileUploader label="첨부" multiple {...upload.uploaderProps} />
        {upload.items.map((item) => (
          <FileItem key={item.id} {...upload.itemProps(item)} />
        ))}
      </Box>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.upload(fileInput(canvasElement), [pngFile("fail.png"), pngFile("slow.png")]);
    await userEvent.click(await canvas.findByRole("button", { name: "slow.png 올리기 취소" }));
    await expect(canvas.queryByText("slow.png")).toBeNull();
    await waitFor(() => expect(canvas.getByText("업로드에 실패했어요")).toBeVisible());
    await expect(canvas.getByRole("button", { name: "다시 시도" })).toBeVisible();
  },
};

// 개수를 넘으면 넘는 파일은 받지 않고, 평소 도움말 대신 오류가 보인다. 하나를 지우면 오류가 사라진다
export const MaxFiles: Story = {
  render: function Render() {
    const upload = useFileUpload({ maxFiles: 2 });
    return (
      <Box gap={12}>
        <FileUploader
          label="첨부"
          helper="2개까지 올릴 수 있어요"
          multiple
          {...upload.uploaderProps}
        />
        {upload.items.map((item) => (
          <FileItem key={item.id} {...upload.itemProps(item)} />
        ))}
      </Box>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.upload(fileInput(canvasElement), [
      pngFile("a.png"),
      pngFile("b.png"),
      pngFile("c.png"),
    ]);
    await expect(canvas.getByText("파일은 2개까지 올릴 수 있어요")).toBeVisible();
    await expect(canvas.queryByText("c.png")).toBeNull();
    await userEvent.click(canvas.getByRole("button", { name: "a.png 삭제" }));
    await expect(canvas.getByText("2개까지 올릴 수 있어요")).toBeVisible();
  },
};
