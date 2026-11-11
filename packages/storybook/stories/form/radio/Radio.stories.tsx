import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent } from "storybook/test";
import { Radio, RadioGroup } from "@futurewiz-rms/mint";

const meta = {
  title: "Components/Form/Radio",
  component: RadioGroup,
  subcomponents: { Radio },
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  args: { "aria-label": "정렬 기준", defaultValue: "latest", onChange: fn(), children: null },
  argTypes: {
    disabled: { control: "boolean" },
  },
  render: (args) => (
    <RadioGroup {...args}>
      <Radio value="latest">최신순</Radio>
      <Radio value="popular">인기순</Radio>
      <Radio value="price">가격순</Radio>
    </RadioGroup>
  ),
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

// 안 고름 · 고름 × 기본 · 비활성 (Pressed는 hover·누르는 동안)
export const States: Story = {
  render: () => (
    <div style={{ display: "grid", gridTemplateColumns: "auto auto", gap: 8 }}>
      <RadioGroup aria-label="기본" defaultValue="b">
        <Radio value="a">안 고름</Radio>
        <Radio value="b">고름</Radio>
      </RadioGroup>
      <RadioGroup aria-label="비활성" defaultValue="b" disabled>
        <Radio value="a">비활성</Radio>
        <Radio value="b">비활성 고름</Radio>
      </RadioGroup>
    </div>
  ),
};

export const Tight: Story = {
  render: () => (
    <RadioGroup aria-label="통화" defaultValue="KRW" style={{ gap: 12 }}>
      <Radio value="KRW" tight>
        KRW
      </Radio>
      <Radio value="USD" tight>
        USD
      </Radio>
    </RadioGroup>
  ),
};

// 하나만 선택: 누르면 이전 선택이 풀린다
export const SelectOne: Story = {
  play: async ({ args, canvas }) => {
    const radio = (name: string) => canvas.getByRole("radio", { name });
    await expect(radio("최신순")).toBeChecked();
    await userEvent.click(canvas.getByText("가격순"));
    await expect(radio("가격순")).toBeChecked();
    await expect(radio("최신순")).not.toBeChecked();
    await expect(args.onChange).toHaveBeenLastCalledWith("price");
  },
};

// 방향키로 선택을 옮긴다(브라우저 기본 동작)
export const Keyboard: Story = {
  play: async ({ canvas }) => {
    const radio = (name: string) => canvas.getByRole("radio", { name });
    await userEvent.tab();
    await expect(radio("최신순")).toHaveFocus();
    await userEvent.keyboard("{ArrowDown}");
    await expect(radio("인기순")).toBeChecked();
    await expect(radio("인기순")).toHaveFocus();
    await userEvent.keyboard("{ArrowUp}");
    await expect(radio("최신순")).toBeChecked();
  },
};

export const DisabledGroup: Story = {
  args: { disabled: true },
  play: async ({ args, canvas }) => {
    await userEvent.click(canvas.getByText("가격순"), { pointerEventsCheck: 0 });
    await expect(canvas.getByRole("radio", { name: "가격순" })).not.toBeChecked();
    await expect(args.onChange).not.toHaveBeenCalled();
  },
};

// 제어: 바깥 상태와 함께 바뀐다
export const Controlled: Story = {
  render: function Render() {
    const [method, setMethod] = useState("card");
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <RadioGroup aria-label="결제 수단" value={method} onChange={setMethod}>
          <Radio value="card">카드</Radio>
          <Radio value="bank">계좌이체</Radio>
          <Radio value="point">포인트</Radio>
        </RadioGroup>
        <output>{method}</output>
      </div>
    );
  },
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByText("포인트"));
    await expect(canvas.getByRole("status")).toHaveTextContent("point");
  },
};

// 폼 제출: name과 고른 value가 넘어간다
export const InForm: Story = {
  render: function Render() {
    const [sent, setSent] = useState("");
    return (
      <form
        onSubmit={(event) => {
          event.preventDefault();
          setSent(String(new FormData(event.currentTarget).get("sort")));
        }}
        style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}
      >
        <RadioGroup aria-label="정렬 기준" name="sort" defaultValue="latest">
          <Radio value="latest">최신순</Radio>
          <Radio value="popular">인기순</Radio>
        </RadioGroup>
        <button type="submit">제출</button>
        <output>{sent}</output>
      </form>
    );
  },
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByText("인기순"));
    await userEvent.click(canvas.getByRole("button", { name: "제출" }));
    await expect(canvas.getByRole("status")).toHaveTextContent("popular");
  },
};
