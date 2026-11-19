"use client";

import { Header } from "@futurewiz-rms/mint";
import { DoDont } from "./DoDont";
import { jsx, Playground } from "./Playground";

const logo = (
  <svg width="32" height="32" viewBox="0 0 32 32" aria-hidden="true" className="text-text-on-fill">
    <rect width="32" height="32" rx="8" fill="currentColor" opacity="0.24" />
  </svg>
);

const items = [
  { label: "홈", href: "#", active: true },
  { label: "마켓 시그널", href: "#" },
  { label: "에어드랍", href: "#" },
];

const guideItems = [
  { label: "홈", href: "#", active: true },
  { label: "마켓", href: "#" },
];

export function HeaderPlayground() {
  return (
    <Playground
      stageMinHeight={160}
      controls={[{ prop: "user", type: "select", options: ["guest", "member"], default: "guest" }]}
      render={(values) => (
        <Header
          items={items}
          hideOnScroll={false}
          logo={logo}
          profile={{ name: "민트", badge: true }}
          user={values.user as "guest" | "member"}
          style={{ position: "static" }}
        />
      )}
      code={(values) =>
        jsx("Header", {
          items: { expr: "items" },
          logo: { expr: "<Logo />" },
          profile:
            values.user === "member"
              ? { expr: '{ name: "민트", badge: true, href: "/me" }' }
              : undefined,
          user: values.user !== "guest" ? (values.user as string) : undefined,
          linkComponent: { expr: "Link" },
        })
      }
    />
  );
}

/** Header 사용 가이드 그림 */
export function HeaderGuide() {
  // 그림 칸이 좁아서 메뉴를 둘만 둔다(창 폭이 태블릿 이상이면 메뉴가 펼쳐져 알약이 넓어진다)
  const items = guideItems;
  return (
    <DoDont
      good={
        <Header
          items={items}
          hideOnScroll={false}
          logo={logo}
          style={{ position: "static", padding: 0 }}
        />
      }
      goodText={<>현재 위치의 메뉴만 흰 글자로 두어서 어디에 있는지 알려요.</>}
      bad={
        <Header
          items={items.map((item) => ({ ...item, active: true }))}
          hideOnScroll={false}
          logo={logo}
          style={{ position: "static", padding: 0 }}
        />
      }
      badText={<>메뉴를 여러 개 현재 위치로 두면 어디에 있는지 알 수 없어요.</>}
    />
  );
}
