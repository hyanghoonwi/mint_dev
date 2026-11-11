import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent } from "storybook/test";
import { BellIcon, DotsThreeIcon, IconButton, PlusIcon, XIcon } from "@futurewiz-rms/mint";

const meta = {
  title: "Components/Actions/IconButton",
  component: IconButton,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  args: { icon: <PlusIcon />, "aria-label": "추가", onClick: fn() },
  argTypes: {
    variant: { control: "inline-radio", options: ["normal", "background", "outline", "solid"] },
    size: { control: "inline-radio", options: ["xs", "sm", "md", "lg"] },
    badge: { control: "boolean" },
    disabled: { control: "boolean" },
    icon: { control: false },
  },
} satisfies Meta<typeof IconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

const row = { display: "flex", alignItems: "center", gap: 12 } as const;

export const Default: Story = {};

export const Variants: Story = {
  render: (args) => (
    <div style={row}>
      <IconButton {...args} variant="normal" />
      <IconButton {...args} variant="background" />
      <IconButton {...args} variant="outline" />
      <IconButton {...args} variant="solid" />
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div style={row}>
      <IconButton {...args} size="lg" />
      <IconButton {...args} size="md" />
      <IconButton {...args} size="sm" />
      <IconButton {...args} size="xs" />
    </div>
  ),
};

export const Disabled: Story = {
  render: (args) => (
    <div style={row}>
      <IconButton {...args} variant="normal" disabled />
      <IconButton {...args} variant="background" disabled />
      <IconButton {...args} variant="outline" disabled />
      <IconButton {...args} variant="solid" disabled />
    </div>
  ),
};

// 뱃지: 이름에 "(새 소식)"이 붙는다
export const Badge: Story = {
  args: { icon: <BellIcon />, "aria-label": "알림", badge: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("button", { name: "알림 (새 소식)" })).toBeInTheDocument();
  },
};

// 자주 쓰는 아이콘
export const Common: Story = {
  render: () => (
    <div style={row}>
      <IconButton icon={<XIcon />} aria-label="닫기" />
      <IconButton icon={<DotsThreeIcon />} aria-label="더보기" variant="background" size="sm" />
      <IconButton icon={<PlusIcon />} aria-label="코인 추가" variant="solid" size="lg" />
    </div>
  ),
};

export const Click: Story = {
  play: async ({ args, canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: "추가" }));
    await expect(args.onClick).toHaveBeenCalledTimes(1);
  },
};

export const DisabledNotClickable: Story = {
  args: { disabled: true },
  play: async ({ args, canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: "추가" }), { pointerEventsCheck: 0 });
    await expect(args.onClick).not.toHaveBeenCalled();
  },
};

// 구간별 값: 모바일 sm(32) → 태블릿(768px~) md(40)
export const Responsive: Story = {
  args: { size: { base: "sm", tablet: "md" } },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("button", { name: "추가" })).toHaveClass(
      "size-8",
      "tablet:size-10",
    );
  },
};
