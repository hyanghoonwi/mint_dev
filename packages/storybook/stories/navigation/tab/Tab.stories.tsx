import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent } from "storybook/test";
import { Tab, Text } from "@futurewiz-rms/mint";

const sections = [
  { value: "home", label: "홈" },
  { value: "market", label: "시세" },
  { value: "assets", label: "내 자산" },
];

const labels = ["홈", "시세", "내 자산", "거래소", "입출금", "고객센터"];
const itemsOf = (count: number) =>
  labels.slice(0, count).map((label, index) => ({ value: `v${index}`, label }));

const meta = {
  title: "Components/Navigation/Tab",
  component: Tab,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: { items: sections, "aria-label": "내 정보" },
  argTypes: {
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
    layout: { control: "inline-radio", options: ["fill", "hug"] },
    fade: { control: "boolean" },
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 360 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Tab>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

// Figma Size: Large 48(기본) · Medium 40 · Small 32
export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Tab {...args} size="lg" />
      <Tab {...args} size="md" />
      <Tab {...args} size="sm" />
    </div>
  ),
};

// Figma layout: fill은 폭을 나눠 갖고, hug는 이름 폭만큼만 차지한다
export const Layouts: Story = {
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Tab {...args} layout="fill" />
      <Tab {...args} layout="hug" />
    </div>
  ),
};

// Figma tab = 2 ~ 6. 6개는 hug로 두고 넘치면 가로로 스크롤한다
export const Counts: Story = {
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {[2, 3, 4, 5].map((count) => (
        <Tab key={count} {...args} items={itemsOf(count)} />
      ))}
      <Tab {...args} items={itemsOf(6)} layout="hug" />
    </div>
  ),
};

// Figma badge = true: 새 소식이 있는 탭에만 점
export const WithBadge: Story = {
  args: {
    items: [sections[0], { ...sections[1], badge: true }, sections[2]],
  },
};

// Figma state = disabled
export const Disabled: Story = {
  args: {
    items: [sections[0], sections[1], { ...sections[2], disabled: true }],
  },
};

// fill이어도 이름이 안 들어가면 이름 폭을 지키고 가로로 스크롤한다(마우스는 끌어서, 놓으면 관성). 스크롤할 쪽에 그라데이션이 나타난다
export const LongLabels: Story = {
  args: {
    layout: "fill",
    items: [
      { value: "a", label: "자산 현황 요약" },
      { value: "b", label: "거래 내역 조회" },
      { value: "c", label: "입출금 한도 안내" },
    ],
  },
};

// 화면 폭에 따라 크기·배치가 바뀐다(툴바의 뷰포트로 확인)
export const Responsive: Story = {
  args: { size: { base: "lg", desktop: "md" }, layout: { base: "fill", tablet: "hug" } },
  decorators: [
    (Story) => (
      <div>
        <Story />
      </div>
    ),
  ],
};

// 선택·키보드 동작 테스트
export const Interaction: Story = {
  render: function Render(args) {
    const [value, setValue] = useState("home");
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <Tab {...args} value={value} onChange={setValue} />
        <Text variant="body-3-regular" color="secondary">
          선택: {value}
        </Text>
      </div>
    );
  },
  play: async ({ canvas }) => {
    const tab = (name: string) => canvas.getByRole("tab", { name });
    await expect(canvas.getByRole("tablist", { name: "내 정보" })).toBeInTheDocument();
    await expect(tab("홈")).toHaveAttribute("aria-selected", "true");
    await expect(tab("홈")).toHaveAttribute("tabindex", "0");
    await expect(tab("시세")).toHaveAttribute("tabindex", "-1");
    await userEvent.click(tab("내 자산"));
    await expect(tab("내 자산")).toHaveAttribute("aria-selected", "true");
    await expect(tab("홈")).toHaveAttribute("aria-selected", "false");
    await expect(canvas.getByText("선택: assets")).toBeInTheDocument();
    tab("내 자산").focus();
    await userEvent.keyboard("{ArrowRight}");
    await expect(tab("홈")).toHaveAttribute("aria-selected", "true");
    await expect(tab("홈")).toHaveFocus();
    await userEvent.keyboard("{End}");
    await expect(tab("내 자산")).toHaveAttribute("aria-selected", "true");
    await userEvent.keyboard("{Home}");
    await expect(canvas.getByText("선택: home")).toBeInTheDocument();
  },
};

// 비활성 탭은 화살표 키에서 건너뛴다
export const SkipDisabled: Story = {
  args: { items: [sections[0], { ...sections[1], disabled: true }, sections[2]] },
  play: async ({ canvas }) => {
    const tab = (name: string) => canvas.getByRole("tab", { name });
    tab("홈").focus();
    await userEvent.keyboard("{ArrowRight}");
    await expect(tab("내 자산")).toHaveAttribute("aria-selected", "true");
  },
};
