import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn } from "storybook/test";
import { Avatar, AvatarGroup, BellIcon } from "@futurewiz-rms/mint";
// 스토리용 샘플 이미지(Figma Avatar 이미지 노드 2200:3344의 캐릭터)
import sample from "./avatar-sample.jpg";

const sizes = [16, 24, 32, 40, 48, 64] as const;

const meta = {
  title: "Components/Display/Avatar",
  component: Avatar,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    size: { control: "inline-radio", options: sizes },
    variant: { control: "inline-radio", options: ["person", "brand"] },
    badge: { control: false },
    badgeSize: { control: "inline-radio", options: ["xs", "sm", "md", "lg", "xl"] },
    icon: { control: false },
    disabled: { control: "boolean" },
  },
  args: {
    size: 48,
    name: "김민수",
  },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

// 이름이 있으면 첫 글자를 보여 준다
export const Initial: Story = {};

export const Image: Story = {
  args: { src: sample },
};

// 이미지가 없으면 사용자 아이콘, 아이콘을 직접 넣을 수도 있다
export const Icon: Story = {
  args: { name: undefined },
};

export const CustomIcon: Story = {
  args: { name: undefined, icon: <BellIcon /> },
};

// brand는 사람이 아닌 대상(서비스·코인·조직)에 쓰는 둥근 사각형
export const Brand: Story = {
  args: { variant: "brand", name: "코인" },
};

// 16 · 24 · 32 · 40 · 48 · 64px
export const Sizes: Story = {
  render: () => (
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      {sizes.map((size) => (
        <Avatar key={size} size={size} src={sample} />
      ))}
      {sizes.map((size) => (
        <Avatar key={`i${size}`} size={size} name="김민수" />
      ))}
      {sizes.map((size) => (
        <Avatar key={`c${size}`} size={size} />
      ))}
    </div>
  ),
};

export const BrandSizes: Story = {
  render: () => (
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      {sizes.map((size) => (
        <Avatar key={size} size={size} variant="brand" name="코인" />
      ))}
    </div>
  ),
};

// 점 또는 개수. 99를 넘으면 99+. 크기에 맞춰 배지 크기가 정해진다
export const Badge: Story = {
  render: () => (
    <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
      {sizes.map((size) => (
        <Avatar key={size} size={size} name="김민수" badge="dot" />
      ))}
      {sizes.map((size) => (
        <Avatar key={`n${size}`} size={size} name="김민수" badge={12} />
      ))}
      <Avatar size={48} name="김민수" badge={120} />
    </div>
  ),
};

// 배지 크기는 아바타 크기와 따로 고를 수 있다(생략하면 아바타 크기에 맞춤). 위치는 아바타 크기를 따른다
export const BadgeSize: Story = {
  render: () => (
    <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
      {(["xs", "sm", "md", "lg", "xl"] as const).map((badgeSize) => (
        <Avatar key={badgeSize} size={48} name="김민수" badge={1} badgeSize={badgeSize} />
      ))}
    </div>
  ),
};

// onClick을 주면 눌리는 아바타. hover와 pressed는 같은 색이다
export const Interactive: Story = {
  render: (args) => (
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      <Avatar {...args} src={sample} onClick={fn()} />
      <Avatar {...args} onClick={fn()} />
      <Avatar {...args} name={undefined} onClick={fn()} />
    </div>
  ),
};

export const Disabled: Story = {
  render: (args) => (
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      <Avatar {...args} src={sample} disabled />
      <Avatar {...args} disabled />
      <Avatar {...args} name={undefined} disabled />
    </div>
  ),
};

// 아바타 그룹: 겹쳐 놓고 넘치면 +N
export const Group: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 16 }}>
      {sizes.map((size) => (
        <AvatarGroup
          key={size}
          size={size}
          aria-label="참여자"
          items={[{ src: sample }, { name: "김민수" }, {}]}
        />
      ))}
      <AvatarGroup
        aria-label="참여자"
        items={[{ src: sample }, { name: "김민수" }, {}, { name: "이" }, { name: "박" }]}
      />
    </div>
  ),
};

// 구간별 값: 모바일 32 → 태블릿(768px~) 48. 배지 위치·자동 배지 크기도 따라간다
export const Responsive: Story = {
  args: { name: "김민수", size: { base: 32, tablet: 48 }, badge: 3 },
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector("[role=img]") as HTMLElement;
    await expect(root).toHaveClass("size-8", "tablet:size-12");
    const badge = root.querySelector("span[aria-hidden]") as HTMLElement;
    await expect(badge).toHaveClass("h-[14px]", "tablet:h-[18px]", "tablet:-top-[6px]");
  },
};

// AvatarGroup도 같은 방식: 겹침 폭·+N 칸이 함께 바뀐다
export const GroupResponsive: Story = {
  render: () => (
    <AvatarGroup
      aria-label="참여자 5명"
      size={{ base: 24, tablet: 40 }}
      items={[
        { name: "김민수" },
        { name: "이서연" },
        { name: "박지훈" },
        { name: "최유진" },
        { name: "정하늘" },
      ]}
    />
  ),
  play: async ({ canvas }) => {
    const group = canvas.getByRole("group", { name: "참여자 5명" });
    await expect(group).toHaveClass(
      "[&>*:not(:first-child)]:-ml-[10px]",
      "tablet:[&>*:not(:first-child)]:-ml-[12px]",
    );
  },
};

// 16px: 글자 한 줄 옆의 작은 표시(작성자·댓글). 자동 배지는 8px 점
export const Size16: Story = {
  render: () => (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <Avatar size={16} name="김민수" badge="dot" />
      <span className="text-body-4-medium text-text-primary">김민수</span>
      <AvatarGroup
        size={16}
        items={[{ name: "민" }, { name: "코" }, { name: "랩" }, { name: "인" }]}
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const avatar = canvasElement.querySelector<HTMLElement>("[class*='size-4']");
    await expect(avatar).not.toBeNull();
    await expect(avatar!.getBoundingClientRect().width).toBe(16);
  },
};
