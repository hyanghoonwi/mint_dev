import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import {
  Box,
  Button,
  EnvelopeIcon,
  MagnifyingGlassIcon,
  Text,
  TextField,
} from "@futurewiz-rms/mint";

const meta = {
  title: "Components/Form/TextField",
  component: TextField,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  decorators: [
    (Story) => (
      <div style={{ width: 360 }}>
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
    status: { control: "inline-radio", options: ["normal", "negative", "positive"] },
    disabled: { control: "boolean" },
    readOnly: { control: "boolean" },
    required: { control: "boolean" },
    clearButton: { control: "boolean" },
    labelPosition: { control: "inline-radio", options: ["top", "left"] },
  },
} satisfies Meta<typeof TextField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

// Large 48 · Medium 40(기본) · Small 32
export const Sizes: Story = {
  render: () => (
    <Box gap={16}>
      <TextField size="lg" label="Large" defaultValue="입력한 내용" />
      <TextField size="md" label="Medium" defaultValue="입력한 내용" />
      <TextField size="sm" label="Small" defaultValue="입력한 내용" />
    </Box>
  ),
};

// Status: Normal · Negative(오류) · Positive(확인 완료). 테두리와 도움말 색이 따라간다
export const Statuses: Story = {
  render: () => (
    <Box gap={16}>
      <TextField label="기본" helper="도움말 메시지" defaultValue="입력한 내용" />
      <TextField
        label="오류"
        helper="이메일 형식이 아니에요. @를 포함해 다시 입력해 주세요"
        defaultValue="abc"
        status="negative"
      />
      <TextField
        label="확인 완료"
        helper="사용할 수 있어요"
        defaultValue="mint"
        status="positive"
      />
    </Box>
  ),
};

export const States: Story = {
  render: () => (
    <Box gap={16}>
      <TextField label="필수" placeholder="이름" required />
      <TextField label="비활성" helper="수정할 수 없어요" defaultValue="입력한 내용" disabled />
      <TextField
        label="읽기 전용"
        helper="인증된 이메일이에요"
        defaultValue="mint@example.com"
        readOnly
      />
      <TextField label="비활성(빈 값)" placeholder="입력해 주세요" disabled />
    </Box>
  ),
};

export const LabelLeft: Story = {
  parameters: { layout: "padded" },
  args: { defaultValue: "입력한 내용", labelPosition: "left" },
};

// 앞뒤 구성: leftAddon · 지우기 · rightAddon(글자·아이콘·버튼을 하나 또는 여러 개)
export const Adornments: Story = {
  render: () => (
    <Box gap={16}>
      <TextField label="검색" placeholder="코인 이름" leftAddon={<MagnifyingGlassIcon />} />
      <TextField
        label="인증번호"
        placeholder="6자리"
        rightAddon={
          <>
            <Text variant="body-4-medium" color="secondary">
              03:00
            </Text>
            <Button color="secondary" size="sm">
              재전송
            </Button>
          </>
        }
      />
      <TextField label="이메일" placeholder="mint@example.com" rightAddon={<EnvelopeIcon />} />
    </Box>
  ),
};

export const Controlled: Story = {
  render: function Render() {
    const [value, setValue] = useState("mint");
    return (
      <TextField
        label="닉네임"
        helper={`${value.length}자`}
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />
    );
  },
};

// 구간별 값: 모바일·태블릿은 라벨 위·칸 48, 데스크톱(1024px~)부터 라벨 왼쪽·칸 40. 툴바 뷰포트로 확인한다
export const Responsive: Story = {
  decorators: [
    (Story) => (
      <div style={{ width: "100%" }}>
        <Story />
      </div>
    ),
  ],
  args: {
    size: { base: "lg", desktop: "md" },
    defaultValue: "입력한 내용",
    labelPosition: { base: "top", desktop: "left" },
  },
};

export const Mobile: Story = {
  globals: { viewport: { value: "mobile" } },
  args: { size: "lg", defaultValue: "입력한 내용" },
};

// 라벨을 눌러도 입력에 포커스가 가고, 입력하면 지우기 버튼이 나타나며 누르면 비워진다(onChange도 호출)
export const TypeAndClear: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByText("라벨"));
    const input = canvas.getByLabelText("라벨");
    await expect(input).toHaveFocus();
    await userEvent.type(input, "mint");
    await expect(input).toHaveValue("mint");
    await userEvent.click(canvas.getByRole("button", { name: "입력 지우기" }));
    await expect(input).toHaveValue("");
    await expect(args.onChange).toHaveBeenCalled();
  },
};

// 읽기 전용: 값은 진하게 보이고 선택·복사할 수 있지만 바꿀 수 없다(회색 칸). 지우기 버튼도 나타나지 않는다
export const ReadOnly: Story = {
  args: { defaultValue: "mint@example.com", readOnly: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText("라벨");
    await userEvent.click(input);
    await expect(input).toHaveFocus();
    await expect(canvas.queryByRole("button", { name: "입력 지우기" })).toBeNull();
    await userEvent.type(input, "x");
    await expect(input).toHaveValue("mint@example.com");
  },
};

export const DisabledNotTypeable: Story = {
  args: { disabled: true },
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByLabelText("라벨");
    await expect(input).toBeDisabled();
  },
};
