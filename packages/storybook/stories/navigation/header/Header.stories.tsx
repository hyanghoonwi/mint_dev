import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent } from "storybook/test";
import { Header } from "@futurewiz-rms/mint";

const logo = (
  <svg width="32" height="32" viewBox="0 0 32 32" aria-hidden="true" className="text-text-on-fill">
    <rect width="32" height="32" rx="8" fill="currentColor" opacity="0.24" />
  </svg>
);

const items = [
  { label: "홈", href: "/", active: true },
  { label: "마켓 시그널", href: "/market" },
  { label: "에어드랍", href: "/airdrop" },
  { label: "커뮤니티", href: "/community" },
  { label: "미디어", href: "/media" },
  { label: "코인 맵", href: "/map" },
];

const meta = {
  title: "Components/Navigation/Header",
  component: Header,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: {
    items,
    // 스토리 화면에서는 스크롤로 사라지지 않게 한다
    hideOnScroll: false,
    logo,
    onLoginClick: fn(),
    onMenuClick: fn(),
  },
  argTypes: {
    user: { control: "inline-radio", options: ["guest", "member"] },
  },
  decorators: [
    (Story) => (
      <div style={{ background: "#f3f4f7", minHeight: 200 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

// 768px부터 메뉴가 펼쳐진다(툴바 뷰포트를 Mobile 360으로 바꿔 햄버거를 확인)
export const Guest: Story = {
  play: async ({ canvas, args }) => {
    await expect(canvas.getByRole("link", { name: "홈" })).toHaveAttribute("aria-current", "page");
    await userEvent.click(canvas.getByRole("button", { name: "로그인" }));
    await expect(args.onLoginClick).toHaveBeenCalled();
  },
};

// 프로필 + 새 알림 점
export const Member: Story = {
  args: { profile: { name: "민트", badge: true, href: "/me" }, user: "member" },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("link", { name: "민트, 새 알림" })).toHaveAttribute(
      "href",
      "/me",
    );
  },
};

// 모바일(360): 로고 · 로그인 · 햄버거만 보인다
export const MobileGuest: Story = {
  globals: { viewport: { value: "mobile" } },
};

export const MobileMember: Story = {
  args: { profile: { name: "민트", badge: true, onClick: fn() }, user: "member" },
  globals: { viewport: { value: "mobile" } },
};

// 햄버거가 메뉴 화면으로 이동하는 링크가 된다
export const MenuLink: Story = {
  args: { menuHref: "/menu" },
  globals: { viewport: { value: "mobile" } },
};

// 스크롤을 내리면 가려지고 올리면 다시 보인다
export const HideOnScroll: Story = {
  args: { hideOnScroll: true },
  decorators: [
    (Story) => (
      <div style={{ background: "#f3f4f7" }}>
        <Story />
        <div style={{ height: 1600, padding: 24 }}>아래로 스크롤해 보세요</div>
      </div>
    ),
  ],
};
