import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent } from "storybook/test";
import { CheckMark } from "@futurewiz-rms/mint";

const meta = {
  title: "Components/Form/CheckMark",
  component: CheckMark,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  args: { children: "텍스트", onClick: fn() },
  argTypes: {
    size: { control: "inline-radio", options: ["xs", "sm", "md", "lg"] },
    checked: { control: "boolean" },
    tight: { control: "boolean" },
    disabled: { control: "boolean" },
    role: {
      control: "select",
      options: ["checkbox", "radio", "option", "menuitemcheckbox", "menuitemradio"],
    },
  },
} satisfies Meta<typeof CheckMark>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Checked: Story = {
  args: { checked: true },
};

// Normal · Disabled (Pressed는 hover·누르는 동안 보인다)
export const States: Story = {
  render: (args) => (
    <div style={{ display: "grid", gridTemplateColumns: "auto auto", gap: 8 }}>
      <CheckMark {...args}>체크 안 됨</CheckMark>
      <CheckMark {...args} checked>
        체크됨
      </CheckMark>
      <CheckMark {...args} disabled>
        비활성
      </CheckMark>
      <CheckMark {...args} checked disabled>
        비활성 체크됨
      </CheckMark>
    </div>
  ),
};

export const Tight: Story = {
  args: { tight: true, checked: true },
};

// 레이블 없이: aria-label을 준다
export const IconOnly: Story = {
  args: { children: undefined, checked: true, "aria-label": "선택됨" },
};

// 표시용(onClick 없음): 감싸는 항목이 선택 여부를 알린다
export const Display: Story = {
  args: { onClick: undefined, checked: true },
};

// 하나만 고르는 목록: 항목 전체를 누른다
export const SingleSelectList: Story = {
  render: function Render() {
    const [sort, setSort] = useState("최신순");
    return (
      <div
        role="radiogroup"
        aria-label="정렬"
        style={{ display: "flex", flexDirection: "column", width: 240 }}
      >
        {["최신순", "인기순", "가격순"].map((label) => (
          <CheckMark
            key={label}
            role="radio"
            checked={sort === label}
            onClick={() => setSort(label)}
            className="w-full"
          >
            {label}
          </CheckMark>
        ))}
      </div>
    );
  },
  play: async ({ canvas, step }) => {
    await step("처음에는 최신순이 선택됨", async () => {
      await expect(canvas.getByRole("radio", { name: "최신순" })).toHaveAttribute(
        "aria-checked",
        "true",
      );
    });
    await step("항목을 누르면 그 항목만 선택", async () => {
      await userEvent.click(canvas.getByRole("radio", { name: "가격순" }));
      await expect(canvas.getByRole("radio", { name: "가격순" })).toHaveAttribute(
        "aria-checked",
        "true",
      );
      await expect(canvas.getByRole("radio", { name: "최신순" })).toHaveAttribute(
        "aria-checked",
        "false",
      );
    });
  },
};

// listbox 안에서는 role="option" → aria-selected
export const InListbox: Story = {
  render: function Render() {
    const [value, setValue] = useState("KRW");
    return (
      <div
        role="listbox"
        aria-label="통화"
        style={{ display: "flex", flexDirection: "column", width: 200 }}
      >
        {["KRW", "USD", "BTC"].map((label) => (
          <CheckMark
            key={label}
            role="option"
            tight
            checked={value === label}
            onClick={() => setValue(label)}
            className="w-full"
          >
            {label}
          </CheckMark>
        ))}
      </div>
    );
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("option", { name: "KRW" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    await userEvent.click(canvas.getByRole("option", { name: "BTC" }));
    await expect(canvas.getByRole("option", { name: "BTC" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
  },
};

export const DisabledNotClickable: Story = {
  args: { disabled: true, onClick: fn() },
  play: async ({ args, canvas }) => {
    await userEvent.click(canvas.getByRole("checkbox", { name: "텍스트" }), {
      pointerEventsCheck: 0,
    });
    await expect(args.onClick).not.toHaveBeenCalled();
  },
};

// Figma Size: XSmall 16 · Small 20(기본) · Medium 24 · Large 32. 기본·tight 높이도 확인한다
export const Sizes: Story = {
  render: (args) => (
    <div
      style={{ display: "grid", gridTemplateColumns: "auto auto", gap: 8, alignItems: "center" }}
    >
      {(["xs", "sm", "md", "lg"] as const).map((size) => [
        <CheckMark key={size} {...args} size={size} checked>
          {size}
        </CheckMark>,
        <CheckMark key={`${size}-t`} {...args} size={size} checked tight>
          {size} tight
        </CheckMark>,
      ])}
    </div>
  ),
  play: async ({ canvas }) => {
    const height = (name: string) =>
      Math.round(canvas.getByRole("checkbox", { name }).getBoundingClientRect().height);
    const icon = (name: string) =>
      Math.round(
        canvas.getByRole("checkbox", { name }).querySelector("svg")!.getBoundingClientRect().width,
      );
    await expect([icon("xs"), icon("sm"), icon("md"), icon("lg")]).toEqual([16, 20, 24, 32]);
    await expect([height("xs"), height("sm"), height("md"), height("lg")]).toEqual([
      40, 40, 40, 48,
    ]);
    await expect([height("sm tight"), height("md tight"), height("lg tight")]).toEqual([
      24, 28, 32,
    ]);
  },
};

// 구간별 값: 모바일 md → 데스크톱(1024px~) sm
export const Responsive: Story = {
  args: { size: { base: "md", desktop: "sm" }, checked: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("checkbox")).toHaveClass(
      "[&_svg]:size-6",
      "desktop:[&_svg]:size-5",
      "text-body-1-regular",
      "desktop:text-body-2-regular",
    );
  },
};
