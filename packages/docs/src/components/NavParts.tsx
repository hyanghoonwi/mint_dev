"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";

// 상단 탭: 사이드바는 전체를 보여 주고, 탭은 각 영역의 첫 페이지로 이동한다
const tabs = [
  { href: "/foundations/colors", label: "파운데이션", match: "/foundations" },
  { href: "/components/overview", label: "컴포넌트", match: "/components" },
  { href: "/brand/logo", label: "브랜드", match: "/brand" },
];

export function NavTabs() {
  const pathname = usePathname();
  return (
    <nav className="docs-tabs" aria-label="영역">
      {tabs.map((tab) => (
        <Link
          key={tab.href}
          href={tab.href}
          aria-current={pathname.startsWith(tab.match) ? "page" : undefined}
        >
          {tab.label}
        </Link>
      ))}
    </nav>
  );
}

const subscribe = () => () => {};

/** 오른쪽 위의 테마 전환 버튼. 현재 테마와 반대 이름을 보여 준다 */
export function ThemeButton() {
  const { resolvedTheme, setTheme } = useTheme();
  // 서버에서는 테마를 알 수 없어서, 브라우저에서 그려질 때만 글자를 채운다(서버·브라우저 결과가 달라지지 않게)
  const mounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
  const dark = mounted && resolvedTheme === "dark";
  return (
    <button
      type="button"
      className="docs-theme-button"
      onClick={() => setTheme(dark ? "light" : "dark")}
      aria-label={dark ? "라이트 테마로 바꾸기" : "다크 테마로 바꾸기"}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden="true"
      >
        {dark ? (
          <path d="M12 3v2m0 14v2M5.6 5.6l1.4 1.4m10 10 1.4 1.4M3 12h2m14 0h2M5.6 18.4 7 17m10-10 1.4-1.4M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z" />
        ) : (
          <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
        )}
      </svg>
      <span>{mounted ? (dark ? "라이트" : "다크") : " "}</span>
    </button>
  );
}
