import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, waitFor } from "storybook/test";
import { Button, IconButton, ShareNetworkIcon, Tooltip } from "@futurewiz-rms/mint";

const positions = ["top", "bottom", "left", "right"] as const;
const aligns = ["start", "center", "end"] as const;

const meta = {
  title: "Components/Overlay/Tooltip",
  component: Tooltip,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    position: { control: "inline-radio", options: positions },
    arrowAlign: { control: "inline-radio", options: aligns },
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
    open: { control: "boolean" },
  },
  args: {
    label: "공유",
    children: <IconButton icon={<ShareNetworkIcon />} aria-label="공유" />,
  },
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

// 마우스를 올리거나 Tab으로 포커스하면 열리고, Esc로 닫힌다
export const Default: Story = {
  play: async ({ canvas }) => {
    const button = canvas.getByRole("button", { name: "공유" });
    const tooltip = canvas.getByRole("tooltip", { hidden: true });
    // 말풍선은 대상의 설명으로 연결된다
    await expect(button).toHaveAttribute("aria-describedby", tooltip.id);
    await expect(tooltip).not.toBeVisible();
    await userEvent.tab();
    await waitFor(() => expect(tooltip).toBeVisible());
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(tooltip).not.toBeVisible());
  },
};

// 위치 4 × 화살표 정렬 3. 화살표 끝이 대상의 가운데를 가리킨다
export const Positions: Story = {
  args: { size: "md" },
  render: (args) => (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 160px)",
        gap: "72px 24px",
        padding: 56,
      }}
    >
      {positions.flatMap((position) =>
        aligns.map((align) => (
          <div key={`${position}-${align}`} style={{ display: "flex", justifyContent: "center" }}>
            <Tooltip label="역할" position={position} arrowAlign={align} size={args.size} open>
              <Button size="sm" color="secondary">
                {position} · {align}
              </Button>
            </Tooltip>
          </div>
        )),
      )}
    </div>
  ),
};

// 높이 30 · 36 · 42
export const Sizes: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 48, paddingTop: 56 }}>
      {(["sm", "md", "lg"] as const).map((size) => (
        <Tooltip key={size} label="역할" size={size} open>
          <Button size="sm" color="secondary">
            {size}
          </Button>
        </Tooltip>
      ))}
    </div>
  ),
};

// 단축키는 이름 대신 단축키 글자만 넣는다
export const Shortcut: Story = {
  render: () => (
    <div style={{ paddingTop: 56 }}>
      <Tooltip label="⌘C" open>
        <Button size="sm" color="secondary">
          복사
        </Button>
      </Tooltip>
    </div>
  ),
};

// 구간별 값: 모바일·태블릿은 아래(bottom)·sm, 데스크톱(1024px~)부터 오른쪽(right)·md
export const Responsive: Story = {
  args: {
    open: true,
    position: { base: "bottom", desktop: "right" },
    size: { base: "sm", desktop: "md" },
  },
  play: async ({ canvas }) => {
    const tooltip = canvas.getByRole("tooltip");
    await expect(tooltip).toHaveClass("top-full", "desktop:left-full", "text-caption-1-medium");
    await expect(tooltip).toHaveClass("desktop:text-body-5-medium");
  },
};
