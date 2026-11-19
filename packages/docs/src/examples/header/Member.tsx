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

// 로그인 후(member)예요. 프로필이 보이고, badge를 켜면 새 알림 점이 달려요
export default function Member() {
  return (
    <Header
      items={items}
      hideOnScroll={false}
      logo={logo}
      profile={{ name: "민트", badge: true, href: "/me" }}
      user="member"
      style={{ position: "static" }}
    />
  );
}
