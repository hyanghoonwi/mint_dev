import type { ReactNode } from "react";
import Link from "next/link";
import {
  Avatar,
  AvatarGroup,
  Badge,
  Box,
  Button,
  Calendar,
  Category,
  LiveStatus,
  Menu,
  MenuItem,
  Select,
  TextField,
  Textarea,
  PageCounter,
  PageDots,
  PriceChange,
  Pagination,
  CheckMark,
  Checkbox,
  Chip,
  DatePicker,
  FileUploader,
  FramedRadio,
  Radio,
  RadioGroup,
  Label,
  SegmentedControl,
  Tab,
  Circular,
  Divider,
  Grid,
  HeartIcon,
  HouseIcon,
  IconButton,
  PlusIcon,
  SkeletonCircle,
  SkeletonText,
  Snackbar,
  Switch,
  StarIcon,
  Text,
  TextButton,
  ToggleIcon,
  Thumbnail,
  Toast,
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
    name: "Live status",
    group: "Contents",
    to: "/components/live-status",
    preview: (
      <span aria-hidden="true" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <LiveStatus />
        <LiveStatus active={false} />
      </span>
    ),
  },
  {
    name: "Price change",
    group: "Contents",
    to: "/components/price-change",
    preview: (
      <>
        <PriceChange direction="up">1,200</PriceChange>
        <PriceChange variant="weak" type="percent" direction="down">
          1.20%
        </PriceChange>
      </>
    ),
  },
  {
    name: "Thumbnail",
    group: "Contents",
    to: "/components/thumbnail",
    preview: (
      <>
        <Thumbnail radius aspectRatio="16:9" style={{ width: 112 }} />
        <Thumbnail radius aspectRatio="1:1" style={{ width: 63 }} />
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
    name: "Snackbar",
    group: "Feedback",
    to: "/components/snackbar",
    preview: (
      <Snackbar
        heading="삭제했어요."
        description="되돌릴 수 있어요."
        style={{ minWidth: 0, width: 200 }}
      />
    ),
  },
  {
    name: "Toast",
    group: "Feedback",
    to: "/components/toast",
    preview: (
      <Toast variant="positive" style={{ width: 180 }}>
        저장했어요.
      </Toast>
    ),
  },
  {
    name: "Tooltip",
    group: "Feedback",
    to: "/components/tooltip",
    preview: (
      <span style={{ paddingTop: 40 }}>
        <Tooltip label="추가" open>
          <IconButton variant="background" icon={<PlusIcon />} tabIndex={-1} aria-label="추가" />
        </Tooltip>
      </span>
    ),
  },
  {
    name: "Popover",
    group: "Feedback",
    to: "/components/popover",
    preview: (
      // 카드 안에서는 상자를 실제로 띄울 수 없어서, 같은 토큰으로 모양만 보여 준다
      <span
        aria-hidden="true"
        style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 4 }}
      >
        <span className="rounded-8 border border-border-strong bg-fill-white px-3 py-1 text-label-2-semibold text-text-primary">
          필터
        </span>
        <span className="rounded-12 bg-background-floated p-3 text-body-5-regular text-text-secondary shadow-floating">
          원화 · BTC · USDT
        </span>
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
          <Text variant="label-1-semibold" color="strong" as="strong">
            제목
          </Text>
          <Text variant="label-3-semibold" color="secondary">
            본문
          </Text>
        </span>
        <span style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
          <Text variant="label-3-semibold" color="secondary">
            취소
          </Text>
          <Text variant="label-3-semibold" color="brand">
            확인
          </Text>
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
        <Button variant="outline" size="sm">
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
        size="md"
        shape="pill"
        items={[
          { value: "a", label: "메이저" },
          { value: "b", label: "밈" },
        ]}
        fade={false}
        aria-label="분류 미리보기"
        style={{ width: 220, background: "transparent" }}
      />
    ),
  },
  {
    name: "Calendar",
    group: "Form",
    to: "/components/calendar",
    preview: (
      <span aria-hidden="true" style={{ width: 220, pointerEvents: "none" }}>
        <Calendar
          defaultValue="2026-11-12"
          today="2026-11-11"
          marks={{ "2026-11-20": [{ color: "brand" }] }}
          inert
        />
      </span>
    ),
  },
  {
    name: "Checkbox",
    group: "Form",
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
    group: "Form",
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
    name: "Date picker",
    group: "Form",
    to: "/components/date-picker",
    preview: (
      <span aria-hidden="true" style={{ display: "block", width: 200, pointerEvents: "none" }}>
        <DatePicker size="sm" defaultValue="2026-11-17" today="2026-11-17" tabIndex={-1} />
      </span>
    ),
  },
  {
    name: "File uploader",
    group: "Form",
    to: "/components/file-uploader",
    preview: (
      <span aria-hidden="true" style={{ display: "block", width: 220, pointerEvents: "none" }}>
        <FileUploader size="sm" description="PDF · 최대 10MB" tabIndex={-1} />
      </span>
    ),
  },
  {
    name: "Framed",
    group: "Form",
    to: "/components/framed",
    preview: (
      <span aria-hidden="true" style={{ pointerEvents: "none", width: 200 }}>
        <RadioGroup defaultValue="a" aria-label="미리보기" className="gap-2">
          <FramedRadio size="sm" label="베이직" value="a" tabIndex={-1} />
          <FramedRadio size="sm" label="프로" value="b" tabIndex={-1} />
        </RadioGroup>
      </span>
    ),
  },
  {
    name: "Label",
    group: "Form",
    to: "/components/label",
    preview: (
      <span aria-hidden="true" style={{ pointerEvents: "none" }}>
        <Label helpIcon required>
          이름
        </Label>
      </span>
    ),
  },
  {
    name: "Radio",
    group: "Form",
    to: "/components/radio",
    preview: (
      <span aria-hidden="true" style={{ pointerEvents: "none" }}>
        <RadioGroup defaultValue="a" aria-label="미리보기">
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
    name: "Select",
    group: "Form",
    to: "/components/select",
    preview: (
      <span aria-hidden="true" style={{ display: "block", width: 220, pointerEvents: "none" }}>
        <Select
          size="md"
          label="시장"
          options={[
            { value: "krw", label: "원화" },
            { value: "btc", label: "BTC" },
          ]}
          defaultValue="krw"
        />
      </span>
    ),
  },
  {
    name: "Textarea",
    group: "Form",
    to: "/components/textarea",
    preview: (
      <span aria-hidden="true" style={{ display: "block", width: 220, pointerEvents: "none" }}>
        <Textarea label="문의 내용" placeholder="내용을 입력해 주세요" tabIndex={-1} />
      </span>
    ),
  },
  {
    name: "Text field",
    group: "Form",
    to: "/components/text-field",
    preview: (
      <span aria-hidden="true" style={{ display: "block", width: 220, pointerEvents: "none" }}>
        <TextField size="md" label="이름" placeholder="홍길동" tabIndex={-1} />
      </span>
    ),
  },
  {
    name: "Switch",
    group: "Form",
    to: "/components/switch",
    preview: (
      <span
        aria-hidden="true"
        style={{ pointerEvents: "none", display: "flex", flexDirection: "column", gap: 8 }}
      >
        <Switch defaultChecked tabIndex={-1} aria-label="켜짐" />
        <Switch tabIndex={-1} aria-label="꺼짐" />
      </span>
    ),
  },
  {
    name: "Check mark",
    group: "Form",
    to: "/components/check-mark",
    preview: (
      <span style={{ display: "flex", flexDirection: "column" }}>
        <CheckMark checked>최신순</CheckMark>
        <CheckMark>인기순</CheckMark>
      </span>
    ),
  },
  {
    name: "Menu",
    group: "Navigation",
    to: "/components/menu",
    preview: (
      <span aria-hidden="true" style={{ pointerEvents: "none" }}>
        <Menu size="sm" defaultValue="latest" aria-label="정렬 미리보기">
          <MenuItem value="latest" tabIndex={-1}>
            최신순
          </MenuItem>
          <MenuItem value="popular" tabIndex={-1}>
            인기순
          </MenuItem>
        </Menu>
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
        <Pagination variant="compact" page={6} total={99} />
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
          size="sm"
          items={[
            { value: "day", label: "일" },
            { value: "week", label: "주" },
            { value: "month", label: "월" },
          ]}
          aria-label="미리보기"
        />
      </span>
    ),
  },
  {
    name: "Tab",
    group: "Navigation",
    to: "/components/tab",
    preview: (
      <span aria-hidden="true" style={{ pointerEvents: "none", display: "block", width: 200 }}>
        <Tab
          size="sm"
          items={[
            { value: "home", label: "홈" },
            { value: "market", label: "시세" },
            { value: "assets", label: "내 자산" },
          ]}
          aria-label="미리보기"
        />
      </span>
    ),
  },
  {
    name: "Text button",
    group: "Actions",
    to: "/components/text-button",
    preview: (
      <span aria-hidden="true" style={{ display: "flex", gap: 8, pointerEvents: "none" }}>
        <TextButton tabIndex={-1}>전체 보기</TextButton>
        <TextButton color="neutral" tabIndex={-1}>
          취소
        </TextButton>
      </span>
    ),
  },
  {
    name: "Icon button",
    group: "Actions",
    to: "/components/icon-button",
    preview: (
      <span aria-hidden="true" style={{ display: "flex", gap: 8, pointerEvents: "none" }}>
        <IconButton variant="background" icon={<PlusIcon />} tabIndex={-1} aria-label="추가" />
        <IconButton variant="solid" icon={<PlusIcon />} tabIndex={-1} aria-label="추가" />
      </span>
    ),
  },
  {
    name: "Toggle icon",
    group: "Actions",
    to: "/components/toggle-icon",
    preview: (
      <span aria-hidden="true" style={{ display: "flex", gap: 8, pointerEvents: "none" }}>
        <ToggleIcon icon={<StarIcon />} defaultActive tabIndex={-1} aria-label="관심 코인" />
        <ToggleIcon icon={<HeartIcon />} tabIndex={-1} aria-label="좋아요" />
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
    name: "Box",
    group: "Layout",
    to: "/components/box",
    preview: (
      <Box tone="brand" padding={16} gap={4} className="w-[160px] bg-fill-brand-weak">
        <Text variant="label-2-semibold">Box</Text>
        <Text variant="body-5-regular" color="secondary">
          tone · padding · gap
        </Text>
      </Box>
    ),
  },
  {
    name: "Container · Grid",
    group: "Layout",
    to: "/components/container-grid",
    preview: (
      // 어느 구간에서든 한 줄에 4칸: 모바일 4÷1, 태블릿 8÷2, 데스크톱 12÷3
      <Grid style={{ width: 200, gap: 8 }}>
        {[1, 2, 3, 4].map((cellNumber) => (
          <Grid.Item
            key={cellNumber}
            span={{ base: 1, tablet: 2, desktop: 3 }}
            className="docs-grid-col docs-grid-col--small"
          >
            {cellNumber}
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
        .sort((first, second) => first.name.localeCompare(second.name, "en"))
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
        {["bg-fill-brand", "bg-fill-neutral", "bg-fill-success", "bg-fill-danger"].map(
          (colorClass) => (
            <span
              key={colorClass}
              className={`rounded-full ${colorClass}`}
              style={{ width: 28, height: 28 }}
            />
          ),
        )}
      </span>
    ),
  },
  {
    name: "Typography",
    to: "/foundations/typography",
    preview: (
      <Text variant="display-1-bold" color="strong">
        Aa
      </Text>
    ),
  },
  {
    name: "Spacing · Grid",
    to: "/foundations/grid",
    preview: (
      <Grid style={{ width: 200, gap: 8 }}>
        {[1, 2, 3, 4].map((cellNumber) => (
          <Grid.Item
            key={cellNumber}
            span={{ base: 1, tablet: 2, desktop: 3 }}
            className="docs-grid-col docs-grid-col--small"
          >
            {cellNumber}
          </Grid.Item>
        ))}
      </Grid>
    ),
  },
  {
    name: "Radius · Shadow",
    to: "/foundations/shape",
    preview: (
      <span style={{ display: "flex", gap: 16 }}>
        <span
          className="rounded-8 bg-background-floated shadow-floating"
          style={{ width: 48, height: 48 }}
        />
        <span
          className="rounded-16 bg-background-floated shadow-floating"
          style={{ width: 48, height: 48 }}
        />
        <span
          className="rounded-full bg-background-floated shadow-floating"
          style={{ width: 48, height: 48 }}
        />
      </span>
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
