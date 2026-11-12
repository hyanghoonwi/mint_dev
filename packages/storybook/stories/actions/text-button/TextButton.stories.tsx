import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { CaretRightIcon, PlusIcon, Text, TextButton } from "@futurewiz-rms/mint";

const sizes = ["xs", "sm", "md", "lg"] as const;

const meta = {
  title: "Components/Actions/TextButton",
  component: TextButton,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    color: { control: "inline-radio", options: ["primary", "neutral"] },
    size: { control: "inline-radio", options: sizes },
    underline: { control: "boolean" },
    inline: { control: "boolean" },
    loading: { control: "boolean" },
    disabled: { control: "boolean" },
  },
  args: {
    children: "전체 보기",
  },
} satisfies Meta<typeof TextButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

export const Neutral: Story = {
  args: { color: "neutral" },
};

// 높이 xs 20 · sm 24 · md 28 · lg 28
export const Sizes: Story = {
  render: () => (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      {sizes.map((size) => (
        <TextButton key={size} size={size} rightAddon={<CaretRightIcon />}>
          {size}
        </TextButton>
      ))}
    </div>
  ),
};

// 화살표를 뒤에 붙여 이동을 암시한다. 이동이면 href(<a>)
export const WithIcon: Story = {
  args: { href: "#", rightAddon: <CaretRightIcon /> },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("link", { name: "전체 보기" })).toHaveAttribute("href", "#");
  },
};

// 앞 아이콘(leftAddon)은 동작의 의미를, 뒤 아이콘(rightAddon)은 이동을 보조한다
export const Addons: Story = {
  render: () => (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <TextButton leftAddon={<PlusIcon />}>관심 코인 추가</TextButton>
      <TextButton rightAddon={<CaretRightIcon />}>전체 보기</TextButton>
    </div>
  ),
};

// 밑줄. 앞뒤 아이콘(addon)이 있으면 아이콘 끝까지 이어진다
export const Underline: Story = {
  render: () => (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      {sizes.map((size) => (
        <TextButton key={size} size={size} underline rightAddon={<CaretRightIcon />}>
          전체 보기
        </TextButton>
      ))}
    </div>
  ),
};

// 문장 속 링크: 패딩과 눌림 박스가 없고 밑줄이 항상 켜진다
export const Inline: Story = {
  render: () => (
    <Text as="p" variant="body-2-regular">
      투자 위험은{" "}
      <TextButton inline size="lg" href="#">
        투자 유의 안내
      </TextButton>
      에서 자세히 볼 수 있어요.
    </Text>
  ),
};

export const States: Story = {
  render: () => (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <TextButton>기본</TextButton>
      <TextButton disabled>비활성</TextButton>
      <TextButton loading>진행 중</TextButton>
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("button", { name: "비활성" })).toBeDisabled();
    await expect(canvas.getByRole("button", { name: "진행 중" })).toHaveAttribute(
      "aria-busy",
      "true",
    );
  },
};

// 구간별 값: 모바일 sm(24) → 데스크톱(1024px~) md(28)
export const Responsive: Story = {
  args: { size: { base: "sm", desktop: "md" } },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("button")).toHaveClass("h-6", "desktop:h-7");
  },
};
