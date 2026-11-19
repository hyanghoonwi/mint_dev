import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { Box, RatioBar } from "@futurewiz-rms/mint";

const three = [
  { label: "비트코인", value: 56.2 },
  { label: "이더리움", value: 11.8 },
  { label: "스테이블코인", value: 10.9 },
];
const four = [...three, { label: "기타 암호화폐", value: 21.1 }];
const five = [...three, { label: "기타 암호화폐", value: 9 }, { label: "알트코인", value: 12.1 }];

const meta = {
  title: "Components/Display/RatioBar",
  component: RatioBar,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: { items: three },
  argTypes: {
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
    legend: { control: "boolean" },
    showValues: { control: "boolean" },
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 360 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof RatioBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole("img", { name: "비트코인 56.2%, 이더리움 11.8%, 스테이블코인 10.9%" }),
    ).toBeInTheDocument();
  },
};

// 막대 높이 sm 16(값 없음) · md 24 · lg 32
export const Sizes: Story = {
  render: () => (
    <Box gap={32}>
      <RatioBar size="lg" items={three} />
      <RatioBar size="md" items={three} />
      <RatioBar size="sm" items={three} />
    </Box>
  ),
};

// 구간 수마다 색 순서가 정해져 있다(3 · 4 · 5)
export const Segments: Story = {
  render: () => (
    <Box gap={32}>
      <RatioBar size="lg" items={three} />
      <RatioBar size="lg" items={four} />
      <RatioBar size="lg" items={five} />
    </Box>
  ),
};

// 자릿수가 섞인 값(9, 56.2)은 fractionDigits로 맞춘다
export const FractionDigits: Story = {
  args: { size: "lg", items: five, fractionDigits: 1 },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("img", { name: /기타 암호화폐 9\.0%/ })).toBeInTheDocument();
  },
};

export const WithoutLegend: Story = {
  args: { size: "lg", items: four, legend: false },
};

export const WithoutValues: Story = {
  args: { size: "lg", items: four, showValues: false },
};

// 모바일(360)에서는 범례가 줄바꿈된다
export const Mobile: Story = {
  args: { size: "lg", items: five },
  globals: { viewport: { value: "mobile" } },
};

// 구간별 값: 모바일 sm · 태블릿(768px~) md · 데스크톱(1024px~) lg. 막대 안 값은 데스크톱부터(그 아래는 범례로 읽음)
export const Responsive: Story = {
  args: {
    size: { base: "sm", tablet: "md", desktop: "lg" },
    items: four,
    legend: { base: true },
    showValues: { base: false, desktop: true },
  },
};
