"use client";
import { useState, type ComponentProps } from "react";
import { Header } from "@futurewiz-rms/mint";

const logo = (
  <svg width="32" height="32" viewBox="0 0 32 32" aria-hidden="true" className="text-text-on-fill">
    <rect width="32" height="32" rx="8" fill="currentColor" opacity="0.24" />
  </svg>
);

// 라우터의 Link를 흉내 낸 예시예요. 실제로는 사용하는 라우터의 Link를 그대로 linkComponent로 넘겨요.
// 필요한 조건은 하나예요: href·className·onClick·children을 받아서 그리면 돼요
function AppLink({
  href,
  onNavigate,
  ...props
}: ComponentProps<"a"> & { onNavigate: (href: string) => void }) {
  return (
    <a
      href={href}
      onClick={(event) => {
        event.preventDefault();
        if (href) onNavigate(href);
      }}
      {...props}
    />
  );
}

const menus = [
  { label: "홈", href: "/" },
  { label: "마켓 시그널", href: "/market" },
  { label: "에어드랍", href: "/airdrop" },
];

// React(Vite 등): 현재 주소(pathname)를 상태로 들고 있다가 active로 넘겨요. 라우터가 있으면 그 라우터의 훅으로 바꿔요
export default function React() {
  const [pathname, setPathname] = useState("/market");
  const items = menus.map((menu) => ({ ...menu, active: menu.href === pathname }));

  return (
    <Header
      items={items}
      hideOnScroll={false}
      loginHref="/login"
      logo={logo}
      linkComponent={(props: ComponentProps<"a">) => (
        <AppLink {...props} onNavigate={setPathname} />
      )}
      style={{ position: "static" }}
    />
  );
}
