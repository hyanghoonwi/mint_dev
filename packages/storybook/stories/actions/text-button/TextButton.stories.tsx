import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { Box, CaretRightIcon, PlusIcon, Text, TextButton } from "@futurewiz-rms/mint";

const sizes = ["xs", "sm", "md", "lg"] as const;

const meta = {
  title: "Components/Actions/TextButton",
  component: TextButton,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    color: { control: "inline-radio", options: ["primary", "neutral", "inverse"] },
    size: { control: "inline-radio", options: sizes },
    underline: { control: "boolean" },
    loading: { control: "boolean" },
    disabled: { control: "boolean" },
    inline: { control: "boolean" },
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

// 어두운 바탕 위(Header 메뉴). 평소 옅은 흰 글자, 마우스를 올리면 흰 글자
export const Inverse: Story = {
  args: { color: "inverse" },
  decorators: [
    (Story) => (
      <div style={{ background: "#0a1226", padding: 16, borderRadius: 16 }}>
        <Story />
      </div>
    ),
  ],
};

// 높이 xs 20 · sm 24 · md 28 · lg 28
export const Sizes: Story = {
  render: () => (
    <Box direction="horizontal" align="center" gap={12}>
      {sizes.map((size) => (
        <TextButton key={size} size={size} rightAddon={<CaretRightIcon />}>
          {size}
        </TextButton>
      ))}
    </Box>
  ),
};

// 화살표를 뒤에 붙여 이동을 암시한다. 이동이면 href(<a>)
export const WithIcon: Story = {
  args: { rightAddon: <CaretRightIcon />, href: "#" },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("link", { name: "전체 보기" })).toHaveAttribute("href", "#");
  },
};

// 앞 아이콘(leftAddon)은 동작의 의미를, 뒤 아이콘(rightAddon)은 이동을 보조한다
export const Addons: Story = {
  render: () => (
    <Box direction="horizontal" align="center" gap={12}>
      <TextButton leftAddon={<PlusIcon />}>관심 코인 추가</TextButton>
      <TextButton rightAddon={<CaretRightIcon />}>전체 보기</TextButton>
    </Box>
  ),
};

// 밑줄. 앞뒤 아이콘(addon)이 있으면 아이콘 끝까지 이어진다
export const Underline: Story = {
  render: () => (
    <Box direction="horizontal" align="center" gap={12}>
      {sizes.map((size) => (
        <TextButton key={size} size={size} underline rightAddon={<CaretRightIcon />}>
          전체 보기
        </TextButton>
      ))}
    </Box>
  ),
};

// 문장 속 링크: 패딩과 눌림 박스가 없고 밑줄이 항상 켜진다
export const Inline: Story = {
  render: () => (
    <Text variant="body-2-regular" as="p">
      투자 위험은{" "}
      <TextButton size="lg" inline href="#">
        투자 유의 안내
      </TextButton>
      에서 자세히 볼 수 있어요.
    </Text>
  ),
};

export const States: Story = {
  render: () => (
    <Box direction="horizontal" align="center" gap={12}>
      <TextButton>기본</TextButton>
      <TextButton disabled>비활성</TextButton>
      <TextButton loading>진행 중</TextButton>
    </Box>
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
