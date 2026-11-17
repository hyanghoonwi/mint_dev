import { useRef, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within, waitFor } from "storybook/test";
import { Box, Button, ImageIcon, Text, Textarea, TextButton, TextField } from "@futurewiz-rms/mint";

const meta = {
  title: "Components/Form/Textarea",
  component: Textarea,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  decorators: [
    (Story) => (
      <div style={{ width: "100%", maxWidth: 360 }}>
        <Story />
      </div>
    ),
  ],
  args: { label: "라벨", placeholder: "입력해 주세요", helper: "도움말 메시지", onChange: fn() },
  argTypes: {
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
    label: { control: "text" },
    placeholder: { control: "text" },
    helper: { control: "text" },
    helpIcon: { control: "boolean" },
    addon: { control: false },
    status: { control: "inline-radio", options: ["normal", "negative", "positive"] },
    disabled: { control: "boolean" },
    readOnly: { control: "boolean" },
    required: { control: "boolean" },
    counter: { control: "boolean" },
    labelPosition: { control: "inline-radio", options: ["top", "left"] },
    height: { control: "number" },
    maxHeight: { control: "number" },
    heightMode: { control: "inline-radio", options: ["fixed", "auto", "resizable"] },
    maxLength: { control: "number" },
  },
} satisfies Meta<typeof Textarea>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Sizes: Story = {
  render: () => (
    <Box gap={24}>
      {(["sm", "md", "lg"] as const).map((size) => (
        <Box key={size} gap={8}>
          <TextField size={size} label={`TextField ${size}`} placeholder="한 줄 입력" />
          <Textarea
            size={size}
            label={`Textarea ${size}`}
            placeholder="여러 줄 입력"
            counter
            maxLength={500}
          />
        </Box>
      ))}
    </Box>
  ),
};
export const Statuses: Story = {
  render: () => (
    <Box gap={16}>
      <Textarea label="문의 내용" helper="문의할 내용을 적어 주세요" />
      <Textarea
        label="오류"
        helper="10자 이상 입력해 주세요"
        defaultValue="문의"
        status="negative"
      />
      <Textarea
        label="확인 완료"
        helper="등록할 수 있어요"
        defaultValue="문의할 내용을 모두 적었어요"
        status="positive"
      />
    </Box>
  ),
};
export const Disabled: Story = {
  args: { defaultValue: "입력한 내용", disabled: true, counter: true, maxLength: 500 },
};
export const ReadOnly: Story = {
  args: { defaultValue: "선택하고 복사할 수 있어요", readOnly: true },
};
// 라벨 위치: 위(기본) · 왼쪽. 왼쪽 라벨은 칸의 첫 줄 높이에 맞춰 위쪽에 놓인다
export const LabelPosition: Story = {
  render: () => (
    <Box gap={24}>
      <Textarea label="위" placeholder="내용을 입력해 주세요" helper="도움말 메시지" />
      <Textarea
        label="왼쪽"
        placeholder="내용을 입력해 주세요"
        helper="도움말 메시지"
        required
        labelPosition="left"
      />
    </Box>
  ),
};
export const Addon: Story = {
  args: {
    addon: (
      <>
        <TextButton size="sm">텍스트</TextButton>
        <ImageIcon size={20} />
      </>
    ),
    counter: true,
    maxLength: 500,
  },
};
export const Resizable: Story = {
  args: { counter: true, heightMode: "resizable", maxLength: 500 },
};
export const Counter: Story = {
  args: { counter: true, maxLength: 10 },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole("textbox", { name: "라벨" });
    await userEvent.type(input, "123456789012");
    await expect(input).toHaveValue("1234567890");
    await expect(canvas.getByText("10 / 10")).toBeVisible();
  },
};
export const AutoHeight: Story = {
  args: { counter: true, heightMode: "auto", maxLength: 1000 },
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByRole("textbox") as HTMLTextAreaElement;
    const field = input.parentElement!;
    const initialHeight = field.clientHeight;
    await userEvent.type(input, "첫째 줄{enter}둘째 줄{enter}셋째 줄{enter}넷째 줄");
    await waitFor(() => expect(field.clientHeight).toBeGreaterThan(initialHeight));
    await userEvent.type(input, "{enter}다섯째 줄".repeat(12));
    await waitFor(() => expect(input.scrollHeight).toBeGreaterThan(input.clientHeight));
    await expect(field.getBoundingClientRect().height).toBeLessThanOrEqual(240);
    await userEvent.clear(input);
    await waitFor(() => expect(field.clientHeight).toBe(initialHeight));
  },
};
export const Controlled: Story = {
  render: function Render() {
    const [value, setValue] = useState("");
    return (
      <Box gap={8}>
        <Textarea
          label="문의 내용"
          addon={
            <Button size="sm" onClick={() => setValue("")}>
              비우기
            </Button>
          }
          value={value}
          counter
          maxLength={500}
          onChange={(event) => setValue(event.target.value)}
        />
        <Text variant="body-3-regular">{value || "입력 전"}</Text>
      </Box>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole("textbox");
    await userEvent.type(input, "안녕하세요");
    await expect(canvas.getByText("5 / 500")).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: "비우기" }));
    await expect(input).toHaveValue("");
    await expect(canvas.getByText("0 / 500")).toBeVisible();
  },
};
export const Form: Story = {
  render: function Render() {
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const [submitted, setSubmitted] = useState("");
    return (
      <form
        onSubmit={(event) => {
          event.preventDefault();
          setSubmitted(String(new FormData(event.currentTarget).get("message")));
        }}
      >
        <Box gap={12}>
          <Textarea
            label="문의 내용"
            defaultValue="초기값"
            required
            counter
            name="message"
            maxLength={100}
            ref={inputRef}
          />
          <Button type="submit">제출</Button>
          <Button type="reset">초기화</Button>
          <Button onClick={() => inputRef.current?.focus()}>입력으로 이동</Button>
          <Text variant="body-3-regular">{submitted || "제출 전"}</Text>
        </Box>
      </form>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole("textbox", { name: /문의 내용/ });
    await userEvent.clear(input);
    await userEvent.type(input, "문의합니다");
    await userEvent.click(canvas.getByRole("button", { name: "제출" }));
    await expect(canvas.getByText("문의합니다")).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: "초기화" }));
    await expect(input).toHaveValue("초기값");
    await waitFor(() => expect(canvas.getByText("3 / 100")).toBeVisible());
    await userEvent.click(canvas.getByRole("button", { name: "입력으로 이동" }));
    await expect(input).toHaveFocus();
  },
};
export const Responsive: Story = {
  args: {
    size: { base: "lg", tablet: "md", desktop: "sm" },
    counter: true,
    labelPosition: { base: "top", desktop: "left" },
    maxLength: 500,
  },
};

export const Mobile: Story = {
  globals: { viewport: { value: "mobile" } },
  args: { counter: true, maxLength: 500 },
};

export const FixedHeight: Story = {
  args: { defaultValue: "여러 줄의 긴 내용\n".repeat(20), height: 160, maxHeight: 100 },
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByRole("textbox") as HTMLTextAreaElement;
    await expect(input.parentElement!.getBoundingClientRect().height).toBeCloseTo(160, 0);
    await expect(input.scrollHeight).toBeGreaterThan(input.clientHeight);
  },
};

export const HeightModes: Story = {
  render: function Render() {
    const [heightMode, setHeightMode] = useState<"fixed" | "auto" | "resizable">("fixed");
    return (
      <Box gap={12}>
        <Textarea
          label="높이 동작"
          defaultValue={"여러 줄의 내용\n".repeat(20)}
          height={160}
          maxHeight={320}
          heightMode={heightMode}
        />
        <Button onClick={() => setHeightMode("auto")}>자동 확장</Button>
        <Button onClick={() => setHeightMode("resizable")}>직접 조절</Button>
        <Button onClick={() => setHeightMode("fixed")}>고정 높이</Button>
      </Box>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const field = canvas.getByRole("textbox").parentElement!;
    await expect(field.getBoundingClientRect().height).toBeCloseTo(160, 0);
    await userEvent.click(canvas.getByRole("button", { name: "자동 확장" }));
    await waitFor(() => expect(field.getBoundingClientRect().height).toBeCloseTo(320, 0));
    await userEvent.click(canvas.getByRole("button", { name: "직접 조절" }));
    await waitFor(() => expect(field.getBoundingClientRect().height).toBeCloseTo(160, 0));
    await expect(getComputedStyle(field).resize).toBe("vertical");
    await expect(getComputedStyle(field).maxHeight).toBe("320px");
    await userEvent.click(canvas.getByRole("button", { name: "고정 높이" }));
    await expect(field.getBoundingClientRect().height).toBeCloseTo(160, 0);
    await expect(getComputedStyle(field).resize).toBe("none");
  },
};
