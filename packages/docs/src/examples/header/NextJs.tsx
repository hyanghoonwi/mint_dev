"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Header } from "@futurewiz-rms/mint";

const logo = (
  <svg width="32" height="32" viewBox="0 0 32 32" aria-hidden="true" className="text-text-on-fill">
    <rect width="32" height="32" rx="8" fill="currentColor" opacity="0.24" />
  </svg>
);

const menus = [
  { label: "홈", href: "/" },
  { label: "마켓 시그널", href: "/market" },
  { label: "에어드랍", href: "/airdrop" },
];

// Next.js: linkComponent={Link}로 넘기면 로고·메뉴·로그인·프로필이 모두 next/link로 이동해요(미리 불러오기 포함).
// 현재 위치는 usePathname()으로 계산해서 active로 넘겨요. 그래서 이 파일은 클라이언트 컴포넌트예요
export default function NextJs() {
  const pathname = usePathname();
  const items = menus.map((menu) => ({
    ...menu,
    active: menu.href === "/" ? pathname === "/" : pathname.startsWith(menu.href),
  }));

  return (
    <Header
      items={items}
      hideOnScroll={false}
      loginHref="/login"
      logo={logo}
      menuHref="/menu"
      linkComponent={Link}
      style={{ position: "static" }}
    />
  );
}
