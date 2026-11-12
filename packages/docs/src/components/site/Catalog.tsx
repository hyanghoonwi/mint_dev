import type { ReactNode } from "react";
import Link from "next/link";
import {
  Avatar,
  AvatarGroup,
  Badge,
  Button,
  Calendar,
  Category,
  PageCounter,
  PageDots,
  PriceChange,
  Pagination,
  CheckMark,
  Checkbox,
  Chip,
  FramedRadio,
  Radio,
  RadioGroup,
  SegmentedControl,
  Circular,
  Divider,
  Grid,
  HeartIcon,
  HouseIcon,
  IconButton,
  PlusIcon,
  SkeletonCircle,
  SkeletonText,
  StarIcon,
  Text,
  Tooltip,
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
    name: "Text",
    group: "Contents",
    to: "/components/text",
    preview: (
      <span style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <Text variant="heading-2-bold">비트코인</Text>
        <Text variant="body-4-regular" color="tertiary">
          시가총액 1위
        </Text>
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
    name: "Price change",
    group: "Contents",
    to: "/components/price-change",
    preview: (
      <>
        <PriceChange direction="up">1,200</PriceChange>
        <PriceChange direction="down" variant="weak" type="percent">
          1.20%
        </PriceChange>
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
    name: "Tooltip",
    group: "Feedback",
    to: "/components/tooltip",
    preview: (
      <span style={{ paddingTop: 40 }}>
        <Tooltip label="추가" open>
          <IconButton icon={<PlusIcon />} aria-label="추가" variant="background" tabIndex={-1} />
        </Tooltip>
      </span>
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
    name: "Category",
    group: "Navigation",
    to: "/components/category",
    preview: (
      <Category
        aria-label="분류 미리보기"
        size="md"
        shape="pill"
        fade={false}
        items={[
          { value: "a", label: "메이저" },
          { value: "b", label: "밈" },
        ]}
        style={{ width: 220, background: "transparent" }}
      />
    ),
  },
  {
    name: "Calendar",
    group: "Selection",
    to: "/components/calendar",
    preview: (
      <span aria-hidden="true" style={{ width: 220, pointerEvents: "none" }}>
        <Calendar
          today="2026-11-11"
          defaultValue="2026-11-12"
          marks={{ "2026-11-20": [{ color: "brand" }] }}
          inert
        />
      </span>
    ),
  },
  {
    name: "Checkbox",
    group: "Selection",
    to: "/components/checkbox",
    preview: (
      <span
        aria-hidden="true"
        style={{ display: "flex", flexDirection: "column", pointerEvents: "none" }}
      >
        <Checkbox defaultChecked tabIndex={-1}>
          약관 동의
        </Checkbox>
        <Checkbox tabIndex={-1}>마케팅 수신</Checkbox>
      </span>
    ),
  },
  {
    name: "Chip",
    group: "Selection",
    to: "/components/chip",
    preview: (
      <span aria-hidden="true" style={{ display: "flex", gap: 8, pointerEvents: "none" }}>
        <Chip active tabIndex={-1}>
          시그널
        </Chip>
        <Chip tabIndex={-1}>에어드랍</Chip>
      </span>
    ),
  },
  {
    name: "Framed",
    group: "Selection",
    to: "/components/framed",
    preview: (
      <span aria-hidden="true" style={{ pointerEvents: "none", width: 200 }}>
        <RadioGroup aria-label="미리보기" defaultValue="a" className="gap-2">
          <FramedRadio value="a" label="베이직" size="sm" tabIndex={-1} />
          <FramedRadio value="b" label="프로" size="sm" tabIndex={-1} />
        </RadioGroup>
      </span>
    ),
  },
  {
    name: "Radio",
    group: "Selection",
    to: "/components/radio",
    preview: (
      <span aria-hidden="true" style={{ pointerEvents: "none" }}>
        <RadioGroup aria-label="미리보기" defaultValue="a">
          <Radio value="a" tabIndex={-1}>
            최신순
          </Radio>
          <Radio value="b" tabIndex={-1}>
            인기순
          </Radio>
        </RadioGroup>
      </span>
    ),
  },
  {
    name: "Check mark",
    group: "Selection",
    to: "/components/check-mark",
    preview: (
      <span style={{ display: "flex", flexDirection: "column" }}>
        <CheckMark checked>최신순</CheckMark>
        <CheckMark>인기순</CheckMark>
      </span>
    ),
  },
  {
    name: "Page indicator",
    group: "Navigation",
    to: "/components/page-indicator",
    preview: (
      <span style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <PageDots current={2} total={5} />
        <PageCounter current={3} total={24} />
      </span>
    ),
  },
  {
    name: "Pagination",
    group: "Navigation",
    to: "/components/pagination",
    preview: (
      <span aria-hidden="true" style={{ pointerEvents: "none" }}>
        <Pagination page={6} total={99} variant="compact" />
      </span>
    ),
  },
  {
    name: "Segmented control",
    group: "Navigation",
    to: "/components/segmented-control",
    preview: (
      <span aria-hidden="true" style={{ pointerEvents: "none" }}>
        <SegmentedControl
          aria-label="미리보기"
          size="sm"
          items={[
            { value: "day", label: "일" },
            { value: "week", label: "주" },
            { value: "month", label: "월" },
          ]}
        />
      </span>
    ),
  },
  {
    name: "Icon button",
    group: "Actions",
    to: "/components/icon-button",
    preview: (
      <span aria-hidden="true" style={{ display: "flex", gap: 8, pointerEvents: "none" }}>
        <IconButton icon={<PlusIcon />} aria-label="추가" variant="background" tabIndex={-1} />
        <IconButton icon={<PlusIcon />} aria-label="추가" variant="solid" tabIndex={-1} />
      </span>
    ),
  },
  {
    name: "Divider",
    group: "Layout",
    to: "/components/divider",
    preview: (
      <span style={{ display: "flex", flexDirection: "column", gap: 16, width: 160 }}>
        <Divider />
        <Divider variant="strong" />
        <Divider variant="thick" />
      </span>
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

/**
 * Components Overview의 한 분류 카드 묶음. 분류 제목은 MDX에서 `## Actions`처럼 쓴다(목차에 나오게).
 * 분류 안에서는 이름의 알파벳 순으로 보여 준다(사이드바 `components/_meta.js`와 같은 순서)
 */
export function ComponentCards({ group }: { group: string }) {
  return (
    <div className="docs-comp-grid">
      {components
        .filter((item) => item.group === group)
        .sort((a, b) => a.name.localeCompare(b.name, "en"))
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
