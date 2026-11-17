import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import {
  Box,
  FileItem,
  FileUploader,
  useFileUpload,
  type FileUploadHelpers,
} from "@futurewiz-rms/mint";
import sample from "../../navigation/menu/avatar-sample.jpg";

const meta = {
  title: "Components/Form/FileUploader",
  component: FileUploader,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    label: "증빙 서류",
    description: "JPG / PNG / PDF · 최대 10MB",
    helper: "파일은 5개까지 올릴 수 있어요",
    accept: "image/*,.pdf",
    multiple: true,
    onFilesSelect: fn(),
    onFilesReject: fn(),
  },
  argTypes: {
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
    status: { control: "inline-radio", options: ["normal", "negative"] },
    disabled: { control: "boolean" },
    required: { control: "boolean" },
    layout: { control: "inline-radio", options: ["dropzone", "button"] },
  },
  decorators: [
    (Story) => (
      <div style={{ width: "100%", maxWidth: 360 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof FileUploader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

// 크기: 안쪽 여백 Large 32 · Medium 24(기본) · Small 16. 글자·아이콘·버튼도 함께 바뀐다
export const Sizes: Story = {
  render: (args) => (
    <Box gap={24}>
      <FileUploader {...args} size="lg" label="Large" />
      <FileUploader {...args} size="md" label="Medium" />
      <FileUploader {...args} size="sm" label="Small" />
    </Box>
  ),
};

// 상태: 형식·용량 오류(negative) · 필수 · 비활성
export const States: Story = {
  render: (args) => (
    <Box gap={24}>
      <FileUploader
        {...args}
        label="오류"
        helper="10MB보다 큰 파일은 올릴 수 없어요"
        status="negative"
      />
      <FileUploader {...args} label="필수" required />
      <FileUploader {...args} label="비활성" disabled />
    </Box>
  ),
};

// 파일을 끌어 올리면 파란 점선·옅은 파란 바탕이 되고, 놓으면 accept에 맞는 파일만 onFilesSelect로, 맞지 않는 파일은 onFilesReject로 넘어간다
export const DragAndDrop: Story = {
  play: async ({ args, canvasElement }) => {
    const zone = canvasElement.querySelector<HTMLElement>(".group\\/zone")!;
    const transfer = new DataTransfer();
    transfer.items.add(new File(["image"], "photo.png", { type: "image/png" }));
    transfer.items.add(new File(["text"], "memo.txt", { type: "text/plain" }));
    zone.dispatchEvent(
      new DragEvent("dragover", { dataTransfer: transfer, bubbles: true, cancelable: true }),
    );
    await waitFor(() => expect(zone).toHaveAttribute("data-dragging", "true"));
    zone.dispatchEvent(
      new DragEvent("drop", { dataTransfer: transfer, bubbles: true, cancelable: true }),
    );
    await waitFor(() => expect(zone).not.toHaveAttribute("data-dragging"));
    await expect(args.onFilesSelect).toHaveBeenCalledTimes(1);
    const selected = (args.onFilesSelect as ReturnType<typeof fn>).mock.calls[0][0] as File[];
    await expect(selected.map((file) => file.name)).toEqual(["photo.png"]);
    const rejected = (args.onFilesReject as ReturnType<typeof fn>).mock.calls[0][0] as File[];
    await expect(rejected.map((file) => file.name)).toEqual(["memo.txt"]);
    // 끌어다 놓은 파일은 숨긴 입력에도 들어가서 폼으로 제출된다
    const input = canvasElement.querySelector<HTMLInputElement>('input[type="file"]')!;
    await expect(input.files?.[0]?.name).toBe("photo.png");
  },
};

// 버튼이나 칸의 빈 곳을 누르면 파일 고르기 창이 열린다(숨긴 입력에 파일을 넣어 확인)
export const SelectWithButton: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvasElement.querySelector<HTMLInputElement>('input[type="file"]')!;
    await userEvent.upload(input, new File(["pdf"], "report.pdf", { type: "application/pdf" }));
    await expect(args.onFilesSelect).toHaveBeenCalledTimes(1);
    await expect(canvas.getByRole("button", { name: "파일 선택" })).toBeEnabled();
  },
};

// 버튼 모양(layout="button"): 모바일 웹·좁은 자리. 허용 형식은 helper에 적는다. 버튼 높이는 size(32 · 40 · 48)
export const ButtonLayout: Story = {
  render: (args) => (
    <Box gap={24}>
      <FileUploader
        label="첨부"
        helper="JPG / PNG · 최대 10MB"
        accept="image/*"
        layout="button"
        onFilesSelect={args.onFilesSelect}
      />
      <FileUploader
        label="첨부(오류)"
        helper="10MB보다 큰 파일이에요"
        status="negative"
        layout="button"
      />
      <FileUploader label="첨부(비활성)" helper="지금은 올릴 수 없어요" disabled layout="button" />
      <FileUploader size="sm" label="sm" layout="button" />
      <FileUploader size="lg" label="lg" layout="button" />
    </Box>
  ),
};

// 올린 파일 한 줄(FileItem): 대기 · 올리는 중(진행 막대) · 완료(체크) · 실패(빨간 글자와 다시 시도), 이미지는 썸네일
export const FileItems: Story = {
  render: () => (
    <Box gap={8}>
      <FileItem name="계약서.pdf" fileSize="2.4MB" status="waiting" onRemove={fn()} />
      <FileItem
        name="거래내역.pdf"
        fileSize="2.4MB"
        status="uploading"
        progress={45}
        onRemove={fn()}
      />
      <FileItem name="신분증.png" fileSize="1.1MB" image={sample} onRemove={fn()} />
      <FileItem
        name="아주 긴 파일 이름이 들어가면 한 줄에서 말줄임으로 줄어들어요.pdf"
        fileSize="8.0MB"
        onRemove={fn()}
      />
      <FileItem
        name="용량초과.zip"
        status="negative"
        message="10MB보다 커요"
        onRemove={fn()}
        onRetry={fn()}
      />
      <FileItem name="비활성.pdf" fileSize="2.4MB" disabled onRemove={fn()} />
    </Box>
  ),
};

export const FileItemSizes: Story = {
  render: () => (
    <Box gap={8}>
      {(["lg", "md", "sm"] as const).map((size) => (
        <FileItem
          key={size}
          size={size}
          name={`${size} 크기.pdf`}
          fileSize="2.4MB"
          status="uploading"
          progress={60}
          onRemove={fn()}
        />
      ))}
    </Box>
  ),
};

// 고른 파일을 목록으로 보여 주고 올리는 흐름. 목록·미리보기·진행률·취소는 useFileUpload가 맡는다(업로드는 흉내)
export const UploadFlow: Story = {
  render: function Render(args) {
    const upload = useFileUpload({
      maxSize: 10 * 1024 * 1024,
      upload: (_: File, { onProgress, signal }: FileUploadHelpers) =>
        new Promise<void>((resolve, reject) => {
          let percent = 0;
          const timer = setInterval(() => {
            percent += 25;
            onProgress(percent);
            if (percent >= 100) {
              clearInterval(timer);
              resolve();
            }
          }, 300);
          signal.addEventListener("abort", () => {
            clearInterval(timer);
            reject(signal.reason);
          });
        }),
    });
    return (
      <Box gap={12}>
        <FileUploader {...args} {...upload.uploaderProps} />
        {upload.items.map((item) => (
          <FileItem key={item.id} {...upload.itemProps(item)} />
        ))}
      </Box>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvasElement.querySelector<HTMLInputElement>('input[type="file"]')!;
    await userEvent.upload(
      input,
      new File(["x".repeat(2048)], "증빙.pdf", { type: "application/pdf" }),
    );
    await expect(await canvas.findByRole("progressbar", { name: /증빙.pdf/ })).toBeVisible();
    await waitFor(() => expect(canvas.getByRole("img", { name: "완료" })).toBeVisible(), {
      timeout: 3000,
    });
    await userEvent.click(canvas.getByRole("button", { name: "증빙.pdf 삭제" }));
    await expect(canvas.queryByText("증빙.pdf")).toBeNull();
  },
};

// 구간별 값: 모바일은 버튼(높이 48), 태블릿(768px~)부터 칸(여백 32), 데스크톱(1024px~)부터 칸 여백 24. 툴바 뷰포트로 확인한다
export const Responsive: Story = {
  args: {
    size: { base: "lg", desktop: "md" },
    layout: { base: "button", tablet: "dropzone" },
  },
  parameters: { layout: "padded" },
};

// 모양이 바뀌어도 파일 입력은 하나다: 칸 모양에서 고른 파일이 버튼 모양에서도 그대로다(같은 입력)
export const LayoutKeepsState: Story = {
  args: { layout: { base: "button", tablet: "dropzone" } },
  play: async ({ canvasElement }) => {
    const inputs = canvasElement.querySelectorAll('input[type="file"]');
    await expect(inputs).toHaveLength(1);
    const visibleButtons = [...canvasElement.querySelectorAll("button")].filter(
      (button) => button.offsetParent !== null,
    );
    await expect(visibleButtons).toHaveLength(1);
  },
};

export const Mobile: Story = {
  globals: { viewport: { value: "mobile" } },
  args: { layout: { base: "button", tablet: "dropzone" } },
  render: (args) => (
    <Box gap={12}>
      <FileUploader {...args} />
      <FileItem size="sm" name="사진.png" fileSize="1.1MB" image={sample} onRemove={fn()} />
    </Box>
  ),
};
