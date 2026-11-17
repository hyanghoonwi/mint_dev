import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { Box, Text } from "@futurewiz-rms/mint";

const meta = {
  title: "Components/Layout/Box",
  component: Box,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  args: {
    tone: "outline",
    children: (
      <>
        <Text variant="label-2-semibold">제목</Text>
        <Text variant="body-4-regular" color="secondary">
          설명 글
        </Text>
      </>
    ),
    padding: 16,
    gap: 8,
    className: "w-[240px]",
  },
  argTypes: {
    tone: {
      control: "select",
      options: ["none", "outline", "neutral", "brand", "success", "warning", "danger"],
    },
    elevation: { control: "inline-radio", options: ["none", "raised", "floating"] },
    radius: { control: "inline-radio", options: [0, 4, 8, 12, 16, 20, "full"] },
    direction: { control: "inline-radio", options: ["vertical", "horizontal"] },
    align: { control: "inline-radio", options: ["start", "center", "end", "stretch"] },
    justify: { control: "inline-radio", options: ["start", "center", "between", "end"] },
    padding: { control: "inline-radio", options: [0, 8, 16, 20, 24] },
    gap: { control: "inline-radio", options: [0, 4, 8, 12, 16, 24, 32] },
    overflow: { control: "inline-radio", options: ["visible", "hidden", "scroll"] },
  },
} satisfies Meta<typeof Box>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

// Figma Direction: Vertical · Horizontal
export const Direction: Story = {
  render: () => (
    <Box direction="horizontal" gap={24}>
      <Box tone="outline" padding={16} gap={8} className="w-[160px]">
        <Text variant="body-4-regular">하나</Text>
        <Text variant="body-4-regular">둘</Text>
      </Box>
      <Box tone="outline" direction="horizontal" align="center" padding={16} gap={8}>
        <Text variant="body-4-regular">하나</Text>
        <Text variant="body-4-regular">둘</Text>
      </Box>
    </Box>
  ),
};

// Figma Tone은 테두리만 바꾼다. 배경은 className의 색 토큰(fill/*-weak)으로 짝을 맞춘다
export const ToneWithBackground: Story = {
  render: () => (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 160px)", gap: 16 }}>
      <Box tone="outline" padding={16}>
        <Text variant="body-4-regular">outline</Text>
      </Box>
      <Box tone="neutral" padding={16} className="bg-fill-neutral-weak">
        <Text variant="body-4-regular">neutral</Text>
      </Box>
      <Box tone="brand" padding={16} className="bg-fill-brand-weak">
        <Text variant="body-4-regular">brand</Text>
      </Box>
      <Box tone="success" padding={16} className="bg-fill-success-weak">
        <Text variant="body-4-regular">success</Text>
      </Box>
      <Box tone="warning" padding={16} className="bg-fill-warning-weak">
        <Text variant="body-4-regular">warning</Text>
      </Box>
      <Box tone="danger" padding={16} className="bg-fill-danger-weak">
        <Text variant="body-4-regular">danger</Text>
      </Box>
    </div>
  ),
};

// Figma Elevation: raised는 흰 바탕 + shadow-raised(Figma shadow/normal/small), floating은 떠 있는 바탕 + shadow-floating(Popover·떠 있는 목록)
export const Elevation: Story = {
  render: () => (
    <div
      style={{ display: "flex", gap: 24, padding: 16, background: "var(--mint-background-lower)" }}
    >
      <Box padding={16} className="w-[140px] bg-background-default">
        <Text variant="body-4-regular">none</Text>
      </Box>
      <Box elevation="raised" padding={16} className="w-[140px]">
        <Text variant="body-4-regular">raised</Text>
      </Box>
      <Box elevation="floating" radius={12} padding={16} className="w-[140px]">
        <Text variant="body-4-regular">floating</Text>
      </Box>
    </div>
  ),
};

// 구간별 값: 모바일·태블릿은 세로·여백 16, 데스크톱(1024px~)부터 가로·여백 24
export const Responsive: Story = {
  parameters: { layout: "padded" },
  args: {
    direction: { base: "vertical", desktop: "horizontal" },
    padding: { base: 16, desktop: 24 },
    gap: { base: 8, desktop: 16 },
    className: "w-full",
  },
};

export const AsTag: Story = {
  args: { as: "section", "aria-label": "요약" },
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelector("section")).not.toBeNull();
  },
};
