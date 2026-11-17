import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";
import {
  Box,
  Button,
  Checkbox,
  FunnelIcon,
  Menu,
  MenuItem,
  Popover,
  Text,
} from "@futurewiz-rms/mint";

const meta = {
  title: "Components/Overlay/Popover",
  component: Popover,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    children: (
      <Box gap={8}>
        <Text variant="label-2-semibold">시장</Text>
        <Checkbox defaultChecked>원화</Checkbox>
        <Checkbox>BTC</Checkbox>
        <Checkbox>USDT</Checkbox>
      </Box>
    ),
    trigger: (props) => (
      <Button variant="outline" color="neutral" leftAddon={<FunnelIcon />} {...props}>
        필터
      </Button>
    ),
    "aria-label": "필터",
  },
  argTypes: {
    matchWidth: { control: "boolean" },
    placement: { control: "inline-radio", options: ["bottom-start", "bottom-end"] },
  },
  decorators: [
    (Story) => (
      <div style={{ minHeight: 260 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Popover>;

export default meta;
type Story = StoryObj<typeof meta>;

// 트리거를 누르면 아래에 뜨고, 바깥을 누르거나 Esc를 누르면 닫힌다. Esc로 닫으면 포커스가 트리거로 돌아간다
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole("button", { name: "필터" });
    await userEvent.click(trigger);
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    const dialog = await canvas.findByRole("dialog", { name: "필터" });
    // 열리면 상자 안 첫 요소로 포커스가 간다
    await waitFor(() => expect(dialog.contains(document.activeElement)).toBe(true));
    await userEvent.keyboard("{Escape}");
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await expect(trigger).toHaveFocus();
    await userEvent.click(trigger);
    await userEvent.click(canvasElement.ownerDocument.body);
    await waitFor(() => expect(canvas.queryByRole("dialog")).toBeNull());
  },
};

// 오른쪽 끝을 맞춘다(화면 오른쪽에 있는 버튼)
export const PlacementEnd: Story = {
  args: { defaultOpen: true, placement: "bottom-end" },
  decorators: [
    (Story) => (
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Story />
      </div>
    ),
  ],
};

// 목록을 띄우고 고르면 닫는다(제어). matchWidth면 상자 폭이 트리거와 같다
export const WithMenu: Story = {
  render: function Render() {
    const [open, setOpen] = useState(false);
    const [sort, setSort] = useState("latest");
    const labels: Record<string, string> = { latest: "최신순", popular: "인기순", price: "가격순" };
    return (
      <Popover
        trigger={(props) => (
          <Button variant="outline" color="neutral" {...props} style={{ width: 200 }}>
            {labels[sort]}
          </Button>
        )}
        open={open}
        matchWidth
        padding={0}
        aria-label="정렬"
        onOpenChange={setOpen}
      >
        <Menu
          value={sort}
          aria-label="정렬 기준"
          onChange={(next) => {
            setSort(next as string);
            setOpen(false);
          }}
          className="w-full shadow-none"
        >
          <MenuItem value="latest">최신순</MenuItem>
          <MenuItem value="popular">인기순</MenuItem>
          <MenuItem value="price">가격순</MenuItem>
        </Menu>
      </Popover>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "최신순" }));
    await userEvent.click(await canvas.findByRole("menuitem", { name: "가격순" }));
    await waitFor(() => expect(canvas.queryByRole("dialog")).toBeNull());
    await expect(canvas.getByRole("button", { name: "가격순" })).toBeVisible();
  },
};

// 부모에 overflow: hidden이 있어도 잘리지 않는다(브라우저 top layer)
export const InsideOverflowHidden: Story = {
  args: { defaultOpen: true },
  decorators: [
    (Story) => (
      <div style={{ overflow: "hidden", height: 60, border: "1px dashed #ccc", padding: 8 }}>
        <Story />
      </div>
    ),
  ],
  play: async ({ canvasElement }) => {
    const dialog = await within(canvasElement).findByRole("dialog");
    await expect(dialog.getBoundingClientRect().height).toBeGreaterThan(60);
    await expect(dialog.matches(":popover-open")).toBe(true);
  },
};

export const Mobile: Story = {
  globals: { viewport: { value: "mobile" } },
  args: { defaultOpen: true },
};
