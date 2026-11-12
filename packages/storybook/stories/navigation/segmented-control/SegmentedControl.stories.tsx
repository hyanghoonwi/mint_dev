import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent } from "storybook/test";
import { ListIcon, SegmentedControl, SquaresFourIcon, TableIcon, Text } from "@futurewiz-rms/mint";

const period = [
  { value: "day", label: "일" },
  { value: "week", label: "주" },
  { value: "month", label: "월" },
];

const labels = ["일", "주", "월", "분기", "연", "전체"];
const itemsOf = (count: number) =>
  labels.slice(0, count).map((label, index) => ({ value: `v${index}`, label }));

const meta = {
  title: "Components/Navigation/SegmentedControl",
  component: SegmentedControl,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: { items: period, "aria-label": "기간" },
  argTypes: {
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
    fullWidth: { control: "boolean" },
  },
} satisfies Meta<typeof SegmentedControl>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

// Figma Size: Small 32 · Medium 40(기본) · Large 48
export const Sizes: Story = {
  args: { fullWidth: true },
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 360 }}>
      <SegmentedControl {...args} size="sm" />
      <SegmentedControl {...args} size="md" />
      <SegmentedControl {...args} size="lg" />
    </div>
  ),
};

// Figma icon = true: 글자 앞 아이콘(lg 20 · md·sm 16)
export const WithIcon: Story = {
  args: {
    "aria-label": "보기 방식",
    items: [
      { value: "list", label: "목록", icon: <ListIcon /> },
      { value: "grid", label: "격자", icon: <SquaresFourIcon /> },
      { value: "table", label: "표", icon: <TableIcon /> },
    ],
  },
};

// Figma count = 2 ~ 6. 항목은 언제나 같은 폭
export const Counts: Story = {
  args: { fullWidth: true },
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 360 }}>
      {[2, 3, 4, 5, 6].map((count) => (
        <SegmentedControl key={count} {...args} items={itemsOf(count)} />
      ))}
    </div>
  ),
};

// 기본은 내용 폭(가장 긴 항목 폭으로 같은 폭), fullWidth는 부모 폭
export const FullWidth: Story = {
  args: { fullWidth: true },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 360 }}>
        <Story />
      </div>
    ),
  ],
};

export const Disabled: Story = {
  args: {
    items: [period[0], period[1], { ...period[2], disabled: true }],
  },
};

// 선택·키보드 동작 테스트
export const Interaction: Story = {
  render: function Render(args) {
    const [value, setValue] = useState("day");
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <SegmentedControl {...args} value={value} onChange={setValue} />
        <Text variant="body-3-regular" color="secondary">
          선택: {value}
        </Text>
      </div>
    );
  },
  play: async ({ canvas, canvasElement, step }) => {
    const radio = (name: string) => canvas.getByRole("radio", { name });
    await step("처음에는 첫 항목이 선택되고, 그 항목만 Tab으로 들어옴", async () => {
      await expect(canvas.getByRole("radiogroup", { name: "기간" })).toBeInTheDocument();
      await expect(radio("일")).toHaveAttribute("aria-checked", "true");
      await expect(radio("일")).toHaveAttribute("tabindex", "0");
      await expect(radio("주")).toHaveAttribute("tabindex", "-1");
      await expect(radio("일")).toHaveClass("text-text-strong");
      await expect(radio("주")).toHaveClass("text-text-secondary");
    });
    await step("누르면 하나만 선택", async () => {
      await userEvent.click(radio("월"));
      await expect(radio("월")).toHaveAttribute("aria-checked", "true");
      await expect(radio("일")).toHaveAttribute("aria-checked", "false");
      await expect(canvas.getByText("선택: month")).toBeInTheDocument();
    });
    await step("흰 칩이 세 번째 칸으로 미끄러짐", async () => {
      const thumb = canvasElement.querySelector<HTMLElement>(
        "[role=radiogroup] > [aria-hidden=true]",
      );
      await expect(thumb?.style.transform).toBe("translateX(200%)");
      await expect(thumb).toHaveClass("transition-transform", "motion-reduce:transition-none");
    });
    await step("→ 키는 끝에서 처음으로, Home·End", async () => {
      radio("월").focus();
      await userEvent.keyboard("{ArrowRight}");
      await expect(radio("일")).toHaveAttribute("aria-checked", "true");
      await expect(radio("일")).toHaveFocus();
      await userEvent.keyboard("{End}");
      await expect(radio("월")).toHaveAttribute("aria-checked", "true");
      await userEvent.keyboard("{Home}");
      await expect(canvas.getByText("선택: day")).toBeInTheDocument();
    });
  },
};

// 비활성 항목은 화살표 키에서 건너뛴다
export const SkipDisabled: Story = {
  args: { items: [period[0], { ...period[1], disabled: true }, period[2]] },
  play: async ({ canvas }) => {
    const radio = (name: string) => canvas.getByRole("radio", { name });
    radio("일").focus();
    await userEvent.keyboard("{ArrowRight}");
    await expect(radio("월")).toHaveAttribute("aria-checked", "true");
  },
};

// 모바일은 꽉 채우고 태블릿부터 내용 폭
export const Mobile: Story = {
  args: { fullWidth: { base: true, tablet: false }, size: "lg" },
  globals: { viewport: { value: "mobile" } },
};

// 구간별 값: 모바일·태블릿 lg(48) → 데스크톱(1024px~) md(40)
export const Responsive: Story = {
  args: { size: { base: "lg", desktop: "md" }, fullWidth: { base: true, tablet: false } },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("radiogroup")).toHaveClass(
      "grid",
      "w-full",
      "tablet:inline-grid",
      "tablet:w-auto",
    );
    await expect(canvas.getByRole("radio", { name: "일" })).toHaveClass(
      "h-10",
      "desktop:h-8",
      "text-label-1-medium",
      "desktop:text-label-2-medium",
    );
  },
};
