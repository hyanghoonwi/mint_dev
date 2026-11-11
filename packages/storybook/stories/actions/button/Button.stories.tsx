import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn } from "storybook/test";
import { ArrowRightIcon, Button, PlusIcon } from "@futurewiz-rms/mint";

const meta = {
  title: "Components/Actions/Button",
  component: Button,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    variant: { control: "inline-radio", options: ["solid", "outline", "ghost"] },
    color: {
      control: "select",
      options: ["primary", "neutral", "secondary", "destructive"],
      description: "outline은 neutral·primary, ghost는 neutral만 쓸 수 있어요",
    },
    size: {
      control: "inline-radio",
      options: ["xs", "sm", "md", "lg"],
      description: '값 하나 또는 구간별 객체 `{ base: "lg", tablet: "md" }`',
    },
    loading: { control: "boolean" },
    fullWidth: { control: "boolean" },
    disabled: { control: "boolean" },
    leftAddon: { control: false },
    rightAddon: { control: false },
  },
  args: {
    children: "확인",
    onClick: fn(),
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

export const Neutral: Story = {
  args: { color: "neutral" },
};

export const Secondary: Story = {
  args: { color: "secondary" },
};

export const Destructive: Story = {
  args: { color: "destructive", children: "삭제하기" },
};

export const Outline: Story = {
  args: { variant: "outline" },
};

export const OutlinePrimary: Story = {
  args: { variant: "outline", color: "primary" },
};

export const Ghost: Story = {
  args: { variant: "ghost" },
};

// 위계별 전체: 강(solid primary·neutral·destructive) · 중(secondary) · 약(outline·ghost)
export const Hierarchy: Story = {
  render: () => (
    <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 12 }}>
      <Button>Primary</Button>
      <Button color="neutral">Neutral</Button>
      <Button color="destructive">삭제</Button>
      <Button color="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="outline" color="primary">
        Outline
      </Button>
      <Button variant="ghost">Ghost</Button>
    </div>
  ),
};

// 높이 28 · 32 · 40 · 48px. 모서리는 xs만 8
export const Sizes: Story = {
  render: () => (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <Button size="xs">xs</Button>
      <Button size="sm">sm</Button>
      <Button size="md">md</Button>
      <Button size="lg">lg</Button>
    </div>
  ),
};

// 아이콘은 앞 또는 뒤 중 하나만. xs는 아이콘이 없다
export const WithIcon: Story = {
  render: () => (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <Button leftAddon={<PlusIcon />}>추가</Button>
      <Button rightAddon={<ArrowRightIcon />}>더 보기</Button>
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <Button disabled>Primary</Button>
      <Button variant="outline" disabled>
        Outline
      </Button>
      <Button variant="ghost" disabled>
        Ghost
      </Button>
    </div>
  ),
};

// 레이블은 숨기고 크기는 그대로 유지하며 클릭은 막힌다
export const Loading: Story = {
  render: () => (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <Button loading>Primary</Button>
      <Button color="secondary" loading>
        Secondary
      </Button>
      <Button variant="outline" loading>
        Outline
      </Button>
      <Button variant="ghost" loading>
        Ghost
      </Button>
    </div>
  ),
};

// 부모 폭을 꽉 채운다. 모바일 화면 하단 버튼 등에 쓴다
export const FullWidth: Story = {
  args: { fullWidth: true, size: "lg" },
  parameters: { layout: "padded" },
};

// 닫기 + 확인은 3:7 폭 비율. 모바일(360)에서 확인한다
export const Pair: Story = {
  parameters: { layout: "padded" },
  globals: { viewport: { value: "mobile" } },
  render: () => (
    <div style={{ display: "flex", gap: 8 }}>
      <div style={{ flex: 3 }}>
        <Button color="secondary" size="lg" fullWidth>
          닫기
        </Button>
      </div>
      <div style={{ flex: 7 }}>
        <Button size="lg" fullWidth>
          참여하기
        </Button>
      </div>
    </div>
  ),
};

// 구간별 값: 모바일 lg·가로 꽉 채움 → 태블릿(768px~)부터 md·내용 폭. 툴바의 뷰포트를 바꿔 확인한다
export const Responsive: Story = {
  args: {
    children: "참여하기",
    size: { base: "lg", tablet: "md" },
    fullWidth: { base: true, tablet: false },
  },
  parameters: { layout: "padded" },
  play: async ({ canvas }) => {
    const button = canvas.getByRole("button", { name: "참여하기" });
    // 구간마다 클래스가 붙었는지(화면 폭과 상관없이 같은 HTML이라 서버 렌더와 어긋나지 않는다)
    await expect(button).toHaveClass("h-12", "w-full", "tablet:h-10", "tablet:w-auto");
  },
};

export const ResponsiveMobile: Story = {
  ...Responsive,
  globals: { viewport: { value: "mobile" } },
};

// xs에서는 아이콘을 그리지 않는다(구간별 크기여도 CSS로 숨김)
export const XsHidesAddon: Story = {
  args: { size: "xs", leftAddon: <PlusIcon />, children: "추가" },
  play: async ({ canvasElement }) => {
    const addon = canvasElement.querySelector("button svg")?.parentElement as HTMLElement;
    await expect(getComputedStyle(addon).display).toBe("none");
  },
};
