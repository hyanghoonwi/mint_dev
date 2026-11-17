import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { Box, LiveStatus, Text } from "@futurewiz-rms/mint";

const meta = {
  title: "Components/Display/LiveStatus",
  component: LiveStatus,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  argTypes: {
    label: { control: "text" },
    active: { control: "boolean" },
  },
} satisfies Meta<typeof LiveStatus>;

export default meta;
type Story = StoryObj<typeof meta>;

// 켜짐: 빨간 점 + 퍼지는 링(1.8초 반복). 기본 문구는 "실시간 반영 중"
export const Default: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByText("실시간 반영 중")).toBeInTheDocument();
  },
};

// 꺼짐: 회색 점, 링 없음. 기본 문구는 "일시정지"
export const Off: Story = {
  args: { active: false },
  play: async ({ canvas }) => {
    await expect(canvas.getByText("일시정지")).toBeInTheDocument();
  },
};

export const CustomLabel: Story = {
  args: { label: "시세 연결됨" },
};

// 섹션 제목 옆에 작게 붙여 쓴다
export const NextToTitle: Story = {
  render: () => (
    <Box direction="horizontal" align="center" gap={12}>
      <Text variant="title-3-bold" as="h3">
        실시간 시세
      </Text>
      <LiveStatus />
    </Box>
  ),
};

// 같은 화면에 여러 개 있으면 링이 0.26초씩 어긋나게 퍼진다
export const Multiple: Story = {
  render: () => (
    <Box gap={12}>
      <LiveStatus label="BTC" />
      <LiveStatus label="ETH" />
      <LiveStatus label="XRP" />
      <LiveStatus label="SOL" />
    </Box>
  ),
};
