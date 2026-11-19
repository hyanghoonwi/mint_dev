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
];

// 768px부터 메뉴를 펼치고, 그보다 좁으면 로고·로그인·햄버거만 보여요(별도 코드 없이 CSS로 바뀌어요)
export default function Responsive() {
  return (
    <Header
      items={items}
      hideOnScroll={false}
      loginHref="/login"
      logo={logo}
      menuHref="/menu"
      style={{ position: "static" }}
    />
  );
}
