import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { PageCounter, PageDots } from "@futurewiz-rms/mint";

const meta = {
  title: "Components/Navigation/PageIndicator",
  component: PageDots,
  subcomponents: { PageCounter },
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  args: { current: 1, total: 5 },
  argTypes: {
    current: { control: { type: "number", min: 1 } },
    total: { control: { type: "number", min: 2, max: 7 } },
    variant: { control: "inline-radio", options: ["normal", "white"] },
    size: { control: "inline-radio", options: ["md", "sm"] },
  },
} satisfies Meta<typeof PageDots>;

export default meta;
type Story = StoryObj<typeof meta>;

const col = {
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  gap: 16,
} as const;
const onImage = { background: "var(--mint-fill-neutral)", padding: "10px 12px", borderRadius: 8 };

export const Dots: Story = {};

export const DotsSizes: Story = {
  render: (args) => (
    <div style={col}>
      <PageDots {...args} size="md" />
      <PageDots {...args} size="sm" />
    </div>
  ),
};

// 이미지 위: white
export const DotsOnImage: Story = {
  args: { variant: "white" },
  render: (args) => (
    <div style={onImage}>
      <PageDots {...args} />
    </div>
  ),
};

// 점 개수 2~7
export const DotsCount: Story = {
  render: () => (
    <div style={col}>
      {[2, 3, 4, 5, 6, 7].map((total) => (
        <PageDots key={total} current={1} total={total} />
      ))}
    </div>
  ),
};

export const Counter: Story = {
  render: () => (
    <div style={col}>
      <PageCounter current={1} total={10} />
      <PageCounter current={1} total={10} size="sm" />
      <PageCounter current={1} total={10} variant="alternative" />
      <PageCounter current={1} total={10} variant="alternative" size="sm" />
    </div>
  ),
};

// 스크린리더 이름: "5개 중 2번째"
export const Accessible: Story = {
  render: () => (
    <div style={col}>
      <PageDots current={2} total={5} />
      <PageCounter current={3} total={24} />
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("img", { name: "5개 중 2번째" })).toBeInTheDocument();
    await expect(canvas.getByRole("img", { name: "24개 중 3번째" })).toHaveTextContent("3 / 24");
  },
};
