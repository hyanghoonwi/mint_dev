import type { Meta, StoryObj } from "@storybook/react-vite";
import { Box, SkeletonCircle, SkeletonRectangle, SkeletonText } from "@futurewiz-rms/mint";

const meta = {
  title: "Components/Loading/Skeleton",
  component: SkeletonText,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  argTypes: {
    color: { control: "inline-radio", options: ["normal", "white"] },
    animate: { control: "boolean" },
    align: { control: "inline-radio", options: ["leading", "center", "trailing"] },
    length: { control: "inline-radio", options: ["100%", "75%", "50%", "25%"] },
    width: { control: "text" },
    height: { control: "number" },
  },
  args: { width: 240 },
} satisfies Meta<typeof SkeletonText>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Text: Story = {};

// length: 줄 칸 폭에 대한 비율
export const TextLengths: Story = {
  render: (args) => (
    <Box gap={16}>
      <SkeletonText {...args} length="100%" />
      <SkeletonText {...args} length="75%" />
      <SkeletonText {...args} length="50%" />
      <SkeletonText {...args} length="25%" />
    </Box>
  ),
};

// align: 짧은 줄을 칸 안의 어디에 둘지
export const TextAligns: Story = {
  render: (args) => (
    <Box gap={16}>
      <SkeletonText {...args} align="leading" length="50%" />
      <SkeletonText {...args} align="center" length="50%" />
      <SkeletonText {...args} align="trailing" length="50%" />
    </Box>
  ),
};

// animate={false}: 빛 띠 없이 멈춘 모양(움직임 줄이기 설정에서도 이렇게 보인다)
export const Static: Story = {
  args: { animate: false },
};

export const Rectangle: Story = {
  render: () => (
    <Box direction="horizontal" gap={24}>
      <SkeletonRectangle width={120} height={80} />
      <SkeletonRectangle radius width={120} height={80} />
    </Box>
  ),
};

export const CircleSizes: Story = {
  render: () => (
    <Box direction="horizontal" align="center" gap={24}>
      <SkeletonCircle size={24} />
      <SkeletonCircle size={32} />
      <SkeletonCircle size={40} />
      <SkeletonCircle size={48} />
      <SkeletonCircle size={64} />
    </Box>
  ),
};

// white: 회색 바탕 위에서 쓰는 흰색
export const White: Story = {
  render: () => (
    <div
      className="bg-background-lower"
      style={{ display: "flex", alignItems: "center", gap: 24, padding: 16 }}
    >
      <SkeletonText color="white" width={240} />
      <SkeletonRectangle color="white" radius width={120} height={80} />
      <SkeletonCircle color="white" size={40} />
    </div>
  ),
};

// 실제 화면처럼 조합: 프로필 목록 한 줄
export const ListItem: Story = {
  render: () => (
    <div aria-busy="true" style={{ display: "flex", alignItems: "center", gap: 12, width: 320 }}>
      <SkeletonCircle size={40} />
      <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
        <SkeletonText length="50%" />
        <SkeletonText length="75%" height={12} />
      </div>
    </div>
  ),
};

// 화면 폭이 좁아져도 부모 폭을 따라 줄어든다
export const Mobile: Story = {
  globals: { viewport: { value: "mobile" } },
  render: () => (
    <Box gap={12}>
      <SkeletonRectangle radius height={160} />
      <SkeletonText />
      <SkeletonText length="75%" />
    </Box>
  ),
};
