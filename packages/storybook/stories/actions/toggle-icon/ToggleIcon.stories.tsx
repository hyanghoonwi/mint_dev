import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, fn, userEvent } from "storybook/test";
import { BellIcon, BookmarkSimpleIcon, HeartIcon, StarIcon, ToggleIcon } from "@futurewiz-rms/mint";

const meta = {
  title: "Components/Actions/ToggleIcon",
  component: ToggleIcon,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  args: { icon: <StarIcon />, "aria-label": "관심 코인", onActiveChange: fn() },
  argTypes: {
    size: { control: "inline-radio", options: ["xs", "sm", "md", "lg"] },
    active: { control: "boolean" },
    defaultActive: { control: "boolean" },
    disabled: { control: "boolean" },
    icon: { control: false },
    activeIcon: { control: false },
  },
} satisfies Meta<typeof ToggleIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

const row = { display: "flex", alignItems: "center", gap: 12 } as const;

export const Default: Story = {};

// 꺼짐(선 아이콘) · 켜짐(채움 아이콘)
export const States: Story = {
  render: (args) => (
    <div style={row}>
      <ToggleIcon {...args} defaultActive={false} />
      <ToggleIcon {...args} defaultActive />
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div style={row}>
      <ToggleIcon {...args} size="lg" />
      <ToggleIcon {...args} size="md" />
      <ToggleIcon {...args} size="sm" />
      <ToggleIcon {...args} size="xs" />
    </div>
  ),
};

export const Disabled: Story = {
  render: (args) => (
    <div style={row}>
      <ToggleIcon {...args} disabled />
      <ToggleIcon {...args} defaultActive disabled />
    </div>
  ),
};

// 자주 쓰는 아이콘
export const Common: Story = {
  render: () => (
    <div style={row}>
      <ToggleIcon icon={<StarIcon />} aria-label="관심 코인" defaultActive />
      <ToggleIcon icon={<HeartIcon />} aria-label="좋아요" />
      <ToggleIcon icon={<BookmarkSimpleIcon />} aria-label="북마크" />
      <ToggleIcon icon={<BellIcon />} aria-label="가격 알림" />
    </div>
  ),
};

// 제어: 상태를 사용하는 쪽이 가진다
export const Controlled: Story = {
  render: function Render(args) {
    const [active, setActive] = useState(false);
    return <ToggleIcon {...args} active={active} onActiveChange={setActive} />;
  },
};

export const Toggle: Story = {
  play: async ({ args, canvas }) => {
    const button = canvas.getByRole("button", { name: "관심 코인" });
    await expect(button).toHaveAttribute("aria-pressed", "false");
    await expect(button).toHaveClass("text-icon-default");
    await userEvent.click(button);
    await expect(button).toHaveAttribute("aria-pressed", "true");
    await expect(button).toHaveClass("text-icon-brand");
    await expect(args.onActiveChange).toHaveBeenLastCalledWith(true);
    await userEvent.click(button);
    await expect(button).toHaveAttribute("aria-pressed", "false");
    await expect(args.onActiveChange).toHaveBeenLastCalledWith(false);
  },
};

export const DisabledNotToggled: Story = {
  args: { disabled: true },
  play: async ({ args, canvas }) => {
    const button = canvas.getByRole("button", { name: "관심 코인" });
    await userEvent.click(button, { pointerEventsCheck: 0 });
    await expect(button).toHaveAttribute("aria-pressed", "false");
    await expect(args.onActiveChange).not.toHaveBeenCalled();
  },
};

// 구간별 값: 모바일 sm(32) → 데스크톱(1024px~) md(40)
export const Responsive: Story = {
  args: { size: { base: "sm", desktop: "md" } },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("button", { name: "관심 코인" })).toHaveClass(
      "size-8",
      "desktop:size-10",
    );
  },
};
