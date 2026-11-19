import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { Box, ProgressBar } from "@futurewiz-rms/mint";

const meta = {
  title: "Components/Loading/ProgressBar",
  component: ProgressBar,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: { value: 50, "aria-label": "업로드 진행" },
  argTypes: {
    value: { control: { type: "range", min: -100, max: 100, step: 5 } },
    status: { control: "inline-radio", options: ["normal", "negative", "positive"] },
    type: { control: "inline-radio", options: ["default", "diverging"] },
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 360 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ProgressBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas }) => {
    const bar = canvas.getByRole("progressbar", { name: "업로드 진행" });
    await expect(bar).toHaveAttribute("aria-valuenow", "50");
    await expect(bar).toHaveAttribute("aria-valuemin", "0");
  },
};

// 0 · 25 · 50 · 75 · 100%
export const Percents: Story = {
  render: () => (
    <Box gap={16}>
      {[0, 25, 50, 75, 100].map((value) => (
        <ProgressBar key={value} value={value} aria-label={`진행 ${value}%`} />
      ))}
    </Box>
  ),
};

// 진행 중(brand) · 실패(danger) · 완료(success)
export const Status: Story = {
  render: () => (
    <Box gap={16}>
      <ProgressBar value={60} status="normal" aria-label="진행 중" />
      <ProgressBar value={60} status="negative" aria-label="실패" />
      <ProgressBar value={100} status="positive" aria-label="완료" />
    </Box>
  ),
};

// 가운데 기준선에서 양쪽으로: 양수 빨강(오른쪽) · 음수 파랑(왼쪽) · 0은 가운데 점
export const Diverging: Story = {
  render: () => (
    <Box gap={16}>
      <ProgressBar value={0} type="diverging" aria-label="변화 없음" />
      <ProgressBar value={50} type="diverging" aria-label="상승 50" />
      <ProgressBar value={-50} type="diverging" aria-label="하락 50" />
      <ProgressBar value={100} type="diverging" aria-label="최대 상승" />
      <ProgressBar value={-100} type="diverging" aria-label="최대 하락" />
    </Box>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("progressbar", { name: "하락 50" })).toHaveAttribute(
      "aria-valuenow",
      "-50",
    );
    await expect(canvas.getByRole("progressbar", { name: "하락 50" })).toHaveAttribute(
      "aria-valuemin",
      "-100",
    );
  },
};

// 범위를 넘는 값은 잘라 쓴다
export const Clamped: Story = {
  args: { value: 140 },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "100");
  },
};
