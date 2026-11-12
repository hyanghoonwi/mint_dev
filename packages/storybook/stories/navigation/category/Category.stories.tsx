import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, waitFor } from "storybook/test";
import { Category, HouseIcon, StarIcon, Text } from "@futurewiz-rms/mint";

const coins = [
  { value: "major", label: "메이저" },
  { value: "defi", label: "디파이" },
  { value: "meme", label: "밈" },
];

const many = [
  ...coins,
  { value: "layer2", label: "레이어2" },
  { value: "ai", label: "AI" },
  { value: "game", label: "게임" },
  { value: "stable", label: "스테이블" },
];

const meta = {
  title: "Components/Navigation/Category",
  component: Category,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: { items: coins, "aria-label": "코인 분류" },
  argTypes: {
    variant: { control: "inline-radio", options: ["solid", "outline"] },
    size: { control: "inline-radio", options: ["lg", "md"] },
    shape: { control: "inline-radio", options: ["square", "pill"] },
    all: { control: "boolean" },
    fade: { control: "boolean" },
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 360 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Category>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

// outline: 회색 배경 위
export const Outline: Story = {
  args: { variant: "outline" },
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <Category {...args} size="lg" />
      <Category {...args} size="md" />
    </div>
  ),
};

export const Shapes: Story = {
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <Category {...args} shape="square" />
      <Category {...args} shape="pill" />
      <Category {...args} variant="outline" shape="square" />
      <Category {...args} variant="outline" shape="pill" />
    </div>
  ),
};

export const WithoutAll: Story = {
  args: { all: false },
};

// 칩별 badge(빨간 점)와 icon(글자 앞 아이콘)
export const BadgeAndIcon: Story = {
  args: {
    items: [
      { value: "home", label: "홈", icon: <HouseIcon /> },
      { value: "fav", label: "관심", icon: <StarIcon />, badge: true },
      { value: "meme", label: "밈" },
    ],
  },
};

// 넘치면 가로 스크롤, 스크롤할 쪽에만 그라데이션이 나타난다
export const Overflow: Story = {
  args: { items: many },
  play: async ({ canvas, canvasElement, step }) => {
    const group = canvas.getByRole("radiogroup", { name: "코인 분류" });
    const [leading, trailing] = canvasElement.querySelectorAll<HTMLElement>(
      "[aria-hidden=true].absolute",
    );
    await step("처음에는 오른쪽 그라데이션만", async () => {
      await waitFor(() => expect(trailing).toHaveClass("opacity-100"));
      await expect(leading).toHaveClass("opacity-0");
    });
    await step("끝까지 스크롤하면 왼쪽만", async () => {
      group.scrollLeft = group.scrollWidth;
      await waitFor(() => expect(leading).toHaveClass("opacity-100"));
      await waitFor(() => expect(trailing).toHaveClass("opacity-0"));
    });
  },
};

// 마우스로 끌어서 스크롤한다(터치·트랙패드는 브라우저가 스크롤). 끈 뒤에는 칩이 선택되지 않는다
export const DragScroll: Story = {
  args: { items: many },
  play: async ({ canvas, step }) => {
    const group = canvas.getByRole("radiogroup", { name: "코인 분류" });
    const chip = canvas.getByRole("radio", { name: "디파이" });
    const { left, top, height } = chip.getBoundingClientRect();
    const y = top + height / 2;
    await step("칩 위에서 왼쪽으로 끌면 스크롤되고 선택은 그대로", async () => {
      await userEvent.pointer([
        { keys: "[MouseLeft>]", target: chip, coords: { clientX: left + 10, clientY: y } },
        { target: chip, coords: { clientX: left - 40, clientY: y } },
        { target: chip, coords: { clientX: left - 110, clientY: y } },
        { keys: "[/MouseLeft]", target: chip, coords: { clientX: left - 110, clientY: y } },
      ]);
      await expect(group.scrollLeft).toBeGreaterThan(100);
      await expect(canvas.getByRole("radio", { name: "전체" })).toBeChecked();
      await expect(chip).not.toBeChecked();
    });
    await step("조금만 움직이고 떼면 그대로 선택된다", async () => {
      const ai = canvas.getByRole("radio", { name: "AI" });
      await userEvent.click(ai);
      await expect(ai).toBeChecked();
    });
  },
};

// 선택·키보드 동작 테스트
export const Interaction: Story = {
  args: { items: many },
  render: function Render(args) {
    const [value, setValue] = useState("all");
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <Category {...args} value={value} onChange={setValue} />
        <Text variant="body-3-regular" color="secondary">
          선택: {value}
        </Text>
      </div>
    );
  },
  play: async ({ canvas, step }) => {
    const radio = (name: string) => canvas.getByRole("radio", { name });
    await step("처음에는 전체가 선택되고, 그 칩만 Tab으로 들어옴", async () => {
      await expect(radio("전체")).toHaveAttribute("aria-checked", "true");
      await expect(radio("전체")).toHaveAttribute("tabindex", "0");
      await expect(radio("밈")).toHaveAttribute("tabindex", "-1");
    });
    await step("누르면 하나만 선택", async () => {
      await userEvent.click(radio("디파이"));
      await expect(radio("디파이")).toHaveAttribute("aria-checked", "true");
      await expect(radio("전체")).toHaveAttribute("aria-checked", "false");
      await expect(canvas.getByText("선택: defi")).toBeInTheDocument();
    });
    await step("→ 키로 옆 칩 선택, End로 마지막", async () => {
      radio("디파이").focus();
      await userEvent.keyboard("{ArrowRight}");
      await expect(radio("밈")).toHaveAttribute("aria-checked", "true");
      await expect(radio("밈")).toHaveFocus();
      await userEvent.keyboard("{End}");
      await expect(radio("스테이블")).toHaveAttribute("aria-checked", "true");
      await expect(canvas.getByText("선택: stable")).toBeInTheDocument();
    });
    await step("끝에서 →는 처음으로", async () => {
      await userEvent.keyboard("{ArrowRight}");
      await expect(radio("전체")).toHaveAttribute("aria-checked", "true");
    });
  },
};

// 좁은 화면에서도 한 줄로 두고 스크롤한다
export const Mobile: Story = {
  args: { items: many, shape: "pill" },
  globals: { viewport: { value: "mobile" } },
};

// 구간별 값: 모바일·태블릿 lg(40) → 데스크톱(1024px~) md(32)
export const Responsive: Story = {
  args: { size: { base: "lg", desktop: "md" } },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("radio", { name: "전체" })).toHaveClass(
      "h-10",
      "desktop:h-8",
      "rounded-12",
      "desktop:rounded-8",
    );
  },
};
