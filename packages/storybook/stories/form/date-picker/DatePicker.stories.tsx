import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import { Box, DatePicker, Text } from "@futurewiz-rms/mint";

const meta = {
  title: "Components/Form/DatePicker",
  component: DatePicker,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: { label: "날짜", today: "2026-11-17", onChange: fn() },
  argTypes: {
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
    status: { control: "inline-radio", options: ["normal", "negative", "positive"] },
    disabled: { control: "boolean" },
    readOnly: { control: "boolean" },
    required: { control: "boolean" },
    labelPosition: { control: "inline-radio", options: ["top", "left"] },
  },
  decorators: [
    (Story) => (
      <div style={{ width: "100%", maxWidth: 360, minHeight: 480 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof DatePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

// 칸을 누르면 달력이 뜨고, 고른 날짜가 YYYY-MM-DD로 들어간다
export const Default: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole("textbox", { name: /날짜/ });
    await userEvent.click(input);
    const dialog = await canvas.findByRole("dialog", { name: "날짜 고르기" });
    // 마우스로 열면 입력 칸에 포커스가 남는다(직접 입력할 수 있게)
    await expect(input).toHaveFocus();
    await userEvent.click(within(dialog).getByRole("button", { name: /20일/ }));
    await expect(args.onChange).toHaveBeenLastCalledWith("2026-11-20");
    await expect(input).toHaveValue("2026-11-20");
    await waitFor(() => expect(canvas.queryByRole("dialog")).toBeNull());
    await expect(input).toHaveFocus();
  },
};

// 칸 상자 어디를 눌러도 열린다(글자 영역뿐 아니라 왼쪽 여백·오른쪽 달력 아이콘). 열린 채로 다시 눌러도 닫히지 않고, 지우기(×)는 열지 않는다
export const OpenFromAnywhere: Story = {
  args: { defaultValue: "2026-11-05" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole("textbox", { name: /날짜/ });
    const field = input.parentElement!;
    // 오른쪽 달력 아이콘(지우기 버튼 안의 아이콘이 아닌 마지막 아이콘)
    const icons = field.querySelectorAll("svg");
    const icon = icons[icons.length - 1];
    await userEvent.click(icon);
    await canvas.findByRole("dialog");
    await userEvent.click(icon);
    await expect(canvas.getByRole("dialog")).toBeVisible();
    await userEvent.click(canvasElement.ownerDocument.body);
    await waitFor(() => expect(canvas.queryByRole("dialog")).toBeNull());
    // 칸 상자(여백)를 직접 누른다
    await userEvent.click(field);
    await canvas.findByRole("dialog");
    await userEvent.keyboard("{Escape}");
    await userEvent.click(canvas.getByRole("button", { name: "입력 지우기" }));
    await expect(input).toHaveValue("");
    await expect(canvas.queryByRole("dialog")).toBeNull();
  },
};

// 키보드: ↓로 열면 달력의 날짜로 포커스가 가고, Esc로 닫으면 칸으로 돌아온다
export const Keyboard: Story = {
  args: { defaultValue: "2026-11-05" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole("textbox", { name: /날짜/ });
    input.focus();
    await userEvent.keyboard("{ArrowDown}");
    const dialog = await canvas.findByRole("dialog");
    await waitFor(() => expect(dialog.contains(document.activeElement)).toBe(true));
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(canvas.queryByRole("dialog")).toBeNull());
    await expect(input).toHaveFocus();
  },
};

// 직접 입력: 올바른 날짜를 다 입력하면 값이 바뀌고, 틀린 날짜는 칸을 벗어날 때 원래 값으로 돌아간다
export const Typing: Story = {
  args: { defaultValue: "2026-11-05" },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole("textbox", { name: /날짜/ });
    await userEvent.clear(input);
    await expect(args.onChange).toHaveBeenLastCalledWith("");
    await userEvent.type(input, "2026-12-25");
    await expect(args.onChange).toHaveBeenLastCalledWith("2026-12-25");
    await userEvent.clear(input);
    await userEvent.type(input, "2026-02-30");
    await userEvent.tab();
    await expect(input).toHaveValue("");
  },
};

// 고를 수 있는 범위·고를 수 없는 날
export const MinMax: Story = {
  args: {
    helper: "11월 10일~25일 중에서 골라 주세요",
    disabledDates: ["2026-11-15"],
    min: "2026-11-10",
    max: "2026-11-25",
  },
};

export const States: Story = {
  render: (args) => (
    <Box gap={16}>
      <DatePicker {...args} label="오류" helper="날짜를 골라 주세요" status="negative" />
      <DatePicker {...args} label="비활성" defaultValue="2026-11-17" disabled />
      <DatePicker {...args} label="읽기 전용" defaultValue="2026-11-17" readOnly />
    </Box>
  ),
};

export const Controlled: Story = {
  render: function Render(args) {
    const [date, setDate] = useState("2026-11-17");
    return (
      <Box gap={8}>
        <DatePicker {...args} value={date} onChange={setDate} />
        <Text variant="body-3-regular">고른 날: {date || "없음"}</Text>
      </Box>
    );
  },
};

export const Mobile: Story = {
  globals: { viewport: { value: "mobile" } },
};
