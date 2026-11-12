import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { Text, Thumbnail } from "@futurewiz-rms/mint";

const ratios = [
  "1:1",
  "5:4",
  "4:3",
  "3:2",
  "16:10",
  "1.618:1",
  "16:9",
  "2:1",
  "21:9",
  "4:5",
  "3:4",
  "2:3",
  "10:16",
  "1:1.618",
  "9:16",
  "1:2",
  "9:21",
] as const;

const meta = {
  title: "Components/Display/Thumbnail",
  component: Thumbnail,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    aspectRatio: { control: "select", options: ratios },
    fit: { control: "inline-radio", options: ["cover", "contain"] },
    radius: { control: "boolean" },
    border: { control: "boolean" },
    overlay: { control: "boolean" },
  },
  args: {
    aspectRatio: "16:9",
    style: { width: 320 },
  },
} satisfies Meta<typeof Thumbnail>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => <Thumbnail {...args} data-testid="thumbnail" />,
  play: async ({ canvas }) => {
    // 폭 320, 16:9 → 높이 180
    const box = canvas.getByTestId("thumbnail");
    await expect(Math.round(box.getBoundingClientRect().height)).toBe(180);
  },
};

// 가로형 9개 · 세로형 8개
export const AspectRatios: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 16,
        maxWidth: 760,
        alignItems: "flex-start",
      }}
    >
      {ratios.map((ratio) => (
        <div key={ratio} style={{ width: 100, display: "flex", flexDirection: "column", gap: 4 }}>
          <Thumbnail aspectRatio={ratio} radius />
          <Text variant="caption-1-regular" color="tertiary">
            {ratio}
          </Text>
        </div>
      ))}
    </div>
  ),
};

// 모서리 · 테두리 · 오버레이
export const Decorations: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 16 }}>
      <Thumbnail aspectRatio="4:3" radius style={{ width: 120 }} />
      <Thumbnail aspectRatio="4:3" radius border style={{ width: 120 }} />
      <Thumbnail aspectRatio="4:3" radius overlay style={{ width: 120 }} />
    </div>
  ),
};

// 오버레이 위에 글자 올리기. 대비가 더 필요하면 overlayColor로 진하게
export const WithText: Story = {
  args: {
    radius: true,
    overlay: true,
    overlayColor: "rgba(0, 0, 0, 0.4)",
    children: (
      <Text
        as="p"
        variant="heading-3-semibold"
        color="on-fill"
        style={{ position: "absolute", left: 16, bottom: 16 }}
      >
        비트코인 ETF 순유입 지속
      </Text>
    ),
  },
};

// 구간별 값: 모바일 1:1 → 태블릿(768px~) 16:9
export const Responsive: Story = {
  args: { aspectRatio: { base: "1:1", tablet: "16:9" } },
  render: (args) => <Thumbnail {...args} data-testid="thumbnail" />,
  play: async ({ canvas }) => {
    await expect(canvas.getByTestId("thumbnail")).toHaveClass(
      "aspect-[1/1]",
      "tablet:aspect-[16/9]",
    );
  },
};
