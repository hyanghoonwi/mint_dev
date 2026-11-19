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

// 로그인 전(guest)이에요. 로고와 메뉴 항목은 링크이고, 링크 컴포넌트를 안 넘기면 <a>로 그려요
export default function Basic() {
  return (
    <Header
      items={items}
      hideOnScroll={false}
      loginHref="/login"
      logo={logo}
      style={{ position: "static" }}
    />
  );
}
