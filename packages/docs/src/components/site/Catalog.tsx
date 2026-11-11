import type { ReactNode } from "react";
import Link from "next/link";
import {
  Avatar,
  AvatarGroup,
  Badge,
  Button,
  Circular,
  Grid,
  HeartIcon,
  HouseIcon,
  SkeletonCircle,
  SkeletonText,
  StarIcon,
} from "@futurewiz-rms/mint";

const components: { name: string; group: string; to: string; preview: ReactNode }[] = [
  {
    name: "Circular",
    group: "Loading",
    to: "/components/circular",
    preview: <Circular color="brand" />,
  },
  {
    name: "Skeleton",
    group: "Loading",
    to: "/components/skeleton",
    preview: (
      <span style={{ display: "flex", alignItems: "center", gap: 12, width: 160 }}>
        <SkeletonCircle size={32} />
        <span style={{ display: "flex", flexDirection: "column", gap: 6, flex: 1 }}>
          <SkeletonText length="75%" height={12} />
          <SkeletonText length="50%" height={12} />
        </span>
      </span>
    ),
  },
  {
    name: "Badge",
    group: "Contents",
    to: "/components/badge",
    preview: (
      <>
        <Badge>NEW</Badge>
        <Badge variant="weak" color="success">
          완료
        </Badge>
      </>
    ),
  },
  {
    name: "Avatar",
    group: "Contents",
    to: "/components/avatar",
    preview: (
      <>
        <Avatar src="/img/avatar-sample.jpg" name="김민수" />
        <Avatar name="이서" />
        <Avatar />
      </>
    ),
  },
  {
    name: "Avatar group",
    group: "Contents",
    to: "/components/avatar-group",
    preview: (
      <AvatarGroup
        size={32}
        items={[{ src: "/img/avatar-sample.jpg" }, { name: "김" }, { name: "이" }, {}, {}]}
      />
    ),
  },
  {
    name: "Alert",
    group: "Feedback",
    to: "/components/alert",
    preview: (
      // 카드 안에서는 대화상자를 실제로 띄울 수 없어서, 같은 토큰으로 모양만 보여 준다
      <span
        className="rounded-16 bg-fill-white"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 12,
          width: 160,
          padding: "16px 16px 8px",
          textAlign: "left",
        }}
      >
        <span style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <strong className="text-label-1-semibold text-text-strong">제목</strong>
          <span className="text-label-3-semibold text-text-secondary">본문</span>
        </span>
        <span
          className="text-label-3-semibold"
          style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}
        >
          <span className="text-text-secondary">취소</span>
          <span className="text-text-brand">확인</span>
        </span>
      </span>
    ),
  },
  {
    name: "Button",
    group: "Actions",
    to: "/components/button",
    preview: (
      <>
        <Button size="sm">확인</Button>
        <Button size="sm" variant="outline">
          취소
        </Button>
      </>
    ),
  },
  {
    name: "Container · Grid",
    group: "Layout",
    to: "/components/container-grid",
    preview: (
      // 어느 구간에서든 한 줄에 4칸: 모바일 4÷1, 태블릿 8÷2, 데스크톱 12÷3
      <Grid style={{ width: 200, gap: 8 }}>
        {[1, 2, 3, 4].map((n) => (
          <Grid.Item
            key={n}
            span={{ base: 1, tablet: 2, desktop: 3 }}
            className="docs-grid-col docs-grid-col--small"
          >
            {n}
          </Grid.Item>
        ))}
      </Grid>
    ),
  },
];

/** 카드 하나: 위쪽 미리보기 + 아래쪽 이름. 카드 전체가 링크다 */
function CatalogCard({ name, to, preview }: { name: string; to: string; preview: ReactNode }) {
  return (
    <Link href={to} className="docs-comp-card">
      {/* 카드 전체가 링크라서 미리보기 안의 버튼은 누르거나 포커스되지 않게 한다 */}
      <span className="docs-comp-card__preview" inert data-pagefind-ignore>
        {preview}
      </span>
      <span className="docs-comp-card__footer">
        <strong>{name}</strong>
      </span>
    </Link>
  );
}

/** Components Overview의 한 분류 카드 묶음. 분류 제목은 MDX에서 `## Actions`처럼 쓴다(목차에 나오게) */
export function ComponentCards({ group }: { group: string }) {
  return (
    <div className="docs-comp-grid">
      {components
        .filter((item) => item.group === group)
        .map((item) => (
          <CatalogCard key={item.name} {...item} />
        ))}
    </div>
  );
}

const foundations: { name: string; to: string; preview: ReactNode }[] = [
  {
    name: "Colors",
    to: "/foundations/colors",
    preview: (
      <span style={{ display: "flex", gap: 6 }}>
        {["bg-fill-brand", "bg-fill-neutral", "bg-fill-success", "bg-fill-danger"].map((c) => (
          <span key={c} className={`rounded-full ${c}`} style={{ width: 28, height: 28 }} />
        ))}
      </span>
    ),
  },
  {
    name: "Typography",
    to: "/foundations/typography",
    preview: <span className="text-display-1-bold text-text-strong">Aa</span>,
  },
  {
    name: "Spacing · Grid",
    to: "/foundations/grid",
    preview: (
      <Grid style={{ width: 200, gap: 8 }}>
        {[1, 2, 3, 4].map((n) => (
          <Grid.Item
            key={n}
            span={{ base: 1, tablet: 2, desktop: 3 }}
            className="docs-grid-col docs-grid-col--small"
          >
            {n}
          </Grid.Item>
        ))}
      </Grid>
    ),
  },
  {
    name: "Icons",
    to: "/foundations/icons",
    preview: (
      <span className="text-icon-strong" style={{ display: "flex", gap: 12 }}>
        <HouseIcon />
        <StarIcon variant="fill" />
        <HeartIcon />
      </span>
    ),
  },
];

/** Foundations Overview의 Base material 카드 */
export function FoundationCards() {
  return (
    <div className="docs-comp-grid">
      {foundations.map((item) => (
        <CatalogCard key={item.name} {...item} />
      ))}
    </div>
  );
}
