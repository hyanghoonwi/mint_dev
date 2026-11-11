import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent } from "storybook/test";
import { ArrowRightIcon, Chip, StarIcon } from "@futurewiz-rms/mint";

const meta = {
  title: "Components/Form/Chip",
  component: Chip,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  args: { children: "Chip", onClick: fn() },
  argTypes: {
    variant: { control: "inline-radio", options: ["solid", "outline"] },
    size: { control: "inline-radio", options: ["lg", "md", "sm"] },
    shape: { control: "inline-radio", options: ["square", "pill"] },
    active: { control: "boolean" },
    disabled: { control: "boolean" },
    badge: { control: "boolean" },
    count: { control: "text" },
  },
} satisfies Meta<typeof Chip>;

export default meta;
type Story = StoryObj<typeof meta>;

const row = { display: "flex", alignItems: "center", gap: 8 } as const;

export const Default: Story = {};

export const Variants: Story = {
  render: (args) => (
    <div style={row}>
      <Chip {...args}>Chip</Chip>
      <Chip {...args} active>
        Chip
      </Chip>
      <Chip {...args} variant="outline">
        Chip
      </Chip>
      <Chip {...args} variant="outline" active>
        Chip
      </Chip>
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div style={row}>
      <Chip {...args} size="lg">
        Chip
      </Chip>
      <Chip {...args} size="md">
        Chip
      </Chip>
      <Chip {...args} size="sm">
        Chip
      </Chip>
    </div>
  ),
};

export const Shapes: Story = {
  render: (args) => (
    <div style={row}>
      <Chip {...args}>Chip</Chip>
      <Chip {...args} active>
        Chip
      </Chip>
      <Chip {...args} shape="pill">
        Chip
      </Chip>
      <Chip {...args} shape="pill" active>
        Chip
      </Chip>
    </div>
  ),
};

// 앞뒤 구성: 아이콘 · 이미지 · 카운트(한 칩에 하나만)
export const Addons: Story = {
  render: (args) => (
    <div style={row}>
      <Chip {...args} leftAddon={<StarIcon />}>
        관심
      </Chip>
      <Chip {...args} rightAddon={<ArrowRightIcon />}>
        더보기
      </Chip>
      <Chip {...args} leadingImage={<span />}>
        비트코인
      </Chip>
      <Chip {...args} count={12}>
        시그널
      </Chip>
      <Chip {...args} active count={12}>
        시그널
      </Chip>
      <Chip {...args} badge>
        에어드랍
      </Chip>
    </div>
  ),
};

export const Disabled: Story = {
  render: (args) => (
    <div style={row}>
      <Chip {...args} disabled>
        Chip
      </Chip>
      <Chip {...args} variant="outline" disabled>
        Chip
      </Chip>
    </div>
  ),
};

// 여러 개 고르기: 누르면 active가 바뀌고 aria-pressed로 읽힌다
export const MultiSelect: Story = {
  render: function Render() {
    const [on, setOn] = useState<string[]>(["시그널"]);
    const toggle = (name: string) =>
      setOn((prev) => (prev.includes(name) ? prev.filter((v) => v !== name) : [...prev, name]));
    return (
      <div role="group" aria-label="알림 종류" style={row}>
        {["시그널", "에어드랍", "공시"].map((name) => (
          <Chip key={name} active={on.includes(name)} onClick={() => toggle(name)}>
            {name}
          </Chip>
        ))}
      </div>
    );
  },
  play: async ({ canvas }) => {
    const chip = (name: string) => canvas.getByRole("button", { name });
    await expect(chip("시그널")).toHaveAttribute("aria-pressed", "true");
    await userEvent.click(chip("에어드랍"));
    await expect(chip("에어드랍")).toHaveAttribute("aria-pressed", "true");
    await expect(chip("시그널")).toHaveAttribute("aria-pressed", "true");
    await userEvent.click(chip("시그널"));
    await expect(chip("시그널")).toHaveAttribute("aria-pressed", "false");
  },
};

export const DisabledNotClickable: Story = {
  args: { disabled: true },
  play: async ({ args, canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Chip" }), { pointerEventsCheck: 0 });
    await expect(args.onClick).not.toHaveBeenCalled();
  },
};

// 구간별 값: 모바일 sm(28) → 태블릿(768px~) md(32). 모양(shape)마다 여백·모서리 표가 따로다
export const Responsive: Story = {
  args: { size: { base: "sm", tablet: "md" }, shape: "pill" },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("button", { name: "Chip" })).toHaveClass(
      "h-7",
      "tablet:h-8",
      "px-4",
      "rounded-full",
    );
  },
};
