import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent } from "storybook/test";
import { Box, Switch, Text } from "@futurewiz-rms/mint";

const meta = {
  title: "Components/Form/Switch",
  component: Switch,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  args: { children: "알림 받기", onChange: fn() },
  argTypes: {
    checked: { control: "boolean" },
    disabled: { control: "boolean" },
  },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

// Figma Active: False · True
export const Active: Story = {
  render: (args) => (
    <Box gap={16}>
      <Switch {...args} defaultChecked={false} />
      <Switch {...args} defaultChecked />
    </Box>
  ),
};

// Figma State: Normal · Disabled (Pressed는 누르는 동안·hover에서 보인다)
export const Disabled: Story = {
  render: (args) => (
    <Box gap={16}>
      <Switch {...args} defaultChecked={false} disabled />
      <Switch {...args} defaultChecked disabled />
    </Box>
  ),
};

// 레이블 없이 트랙만: aria-label을 꼭 준다
export const WithoutLabel: Story = {
  args: { children: undefined, "aria-label": "다크 모드" },
};

// 제어 컴포넌트: checked + onChange
export const Controlled: Story = {
  render: function Render(args) {
    const [on, setOn] = useState(true);
    return (
      <Box gap={8}>
        <Switch {...args} checked={on} onChange={(event) => setOn(event.target.checked)} />
        <Text variant="body-3-regular" color="secondary">
          {on ? "켜짐" : "꺼짐"}
        </Text>
      </Box>
    );
  },
};

// 선택·키보드 동작 테스트
export const Interaction: Story = {
  play: async ({ canvas, args }) => {
    const toggle = canvas.getByRole("switch", { name: "알림 받기" });
    await expect(toggle).not.toBeChecked();
    await userEvent.click(canvas.getByText("알림 받기"));
    await expect(toggle).toBeChecked();
    await expect(args.onChange).toHaveBeenCalledTimes(1);
    toggle.focus();
    await userEvent.keyboard(" ");
    await expect(toggle).not.toBeChecked();
  },
};

// 비활성은 눌러도 바뀌지 않는다
export const DisabledNoChange: Story = {
  args: { disabled: true },
  play: async ({ canvas, args }) => {
    const toggle = canvas.getByRole("switch", { name: "알림 받기" });
    await expect(toggle).toBeDisabled();
    await userEvent.click(canvas.getByText("알림 받기"));
    await expect(toggle).not.toBeChecked();
    await expect(args.onChange).not.toHaveBeenCalled();
  },
};
