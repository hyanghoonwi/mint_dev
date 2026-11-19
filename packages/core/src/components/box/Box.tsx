// 상태·이벤트가 없어서 "use client"를 붙이지 않는다. 서버 컴포넌트에서도 그대로 쓸 수 있다.
// Figma `Box`(node 2391:88716) · `Box Guidelines`(node 2391:89028).
// 콘텐츠를 담고 배치만 하는 범용 레이아웃 상자. 방향·여백·간격·정렬·모서리·넘침과, 겉면(Surface)의 테두리(tone)·그림자(elevation)를 고른다.
// 배경색은 tone에 넣지 않는다(Figma Surface도 테두리만 바꾼다). 배경이 필요하면 `className`에 색 토큰 클래스를 준다
// (예: `tone="brand" className="bg-fill-brand-weak"`). 크기(폭·높이)도 `className`으로 정한다(Figma Hug · Fill · Fixed).
import type { ComponentProps, ElementType } from "react";
import { cn } from "../../utils/cn";
import {
  responsiveClasses,
  type Responsive,
  type ResponsiveClassTable,
} from "../../utils/responsive";

/** 쌓는 방향(Figma Direction): `vertical` 위에서 아래 · `horizontal` 왼쪽에서 오른쪽 */
export type BoxDirection = "vertical" | "horizontal";
/** 안쪽 여백(px, Figma Padding) */
export type BoxPadding = 0 | 8 | 16 | 20 | 24;
/** 요소 사이 간격(px, Figma Gap) */
export type BoxGap = 0 | 4 | 8 | 12 | 16 | 24 | 32;
/** 겉면 테두리(Figma Tone). 배경은 넣지 않는다 */
export type BoxTone = "none" | "outline" | "neutral" | "brand" | "success" | "warning" | "danger";
/** 모서리(px, Figma Box Radius 변수 모드. 기본 8). 반경 토큰에 있는 값만 받는다 */
export type BoxRadius = 0 | 4 | 8 | 12 | 16 | 20 | "full";

/** 담을 수 있는 태그. 문서 구조에 맞게 고른다(기본 `div`) */
export type BoxElement =
  | "div"
  | "section"
  | "article"
  | "aside"
  | "header"
  | "footer"
  | "nav"
  | "main"
  | "ul"
  | "ol"
  | "li"
  | "form"
  | "fieldset";

// 쌓는 방향. 레이아웃 prop이라 값 하나 또는 구간별 객체를 받는다(utils/responsive.ts). 구간마다 클래스를 통째로 적은 표를 쓴다
const directionClasses: ResponsiveClassTable<BoxDirection> = {
  base: {
    vertical: "flex-col",
    horizontal: "flex-row",
  },
  tablet: {
    vertical: "tablet:flex-col",
    horizontal: "tablet:flex-row",
  },
  desktop: {
    vertical: "desktop:flex-col",
    horizontal: "desktop:flex-row",
  },
};

// 안쪽 여백(Figma Box Padding 0 · 8 · 16 · 20 · 24 = spacing 변수). 숫자 키는 문자열로 적는다
const paddingClasses: ResponsiveClassTable<`${BoxPadding}`> = {
  base: {
    "0": "p-0",
    "8": "p-2",
    "16": "p-4",
    "20": "p-5",
    "24": "p-6",
  },
  tablet: {
    "0": "tablet:p-0",
    "8": "tablet:p-2",
    "16": "tablet:p-4",
    "20": "tablet:p-5",
    "24": "tablet:p-6",
  },
  desktop: {
    "0": "desktop:p-0",
    "8": "desktop:p-2",
    "16": "desktop:p-4",
    "20": "desktop:p-5",
    "24": "desktop:p-6",
  },
};

// 요소 사이 간격(Figma Gap 0 · 4 · 8 · 12 · 16 · 24 · 32 = spacing 변수)
const gapClasses: ResponsiveClassTable<`${BoxGap}`> = {
  base: {
    "0": "gap-0",
    "4": "gap-1",
    "8": "gap-2",
    "12": "gap-3",
    "16": "gap-4",
    "24": "gap-6",
    "32": "gap-8",
  },
  tablet: {
    "0": "tablet:gap-0",
    "4": "tablet:gap-1",
    "8": "tablet:gap-2",
    "12": "tablet:gap-3",
    "16": "tablet:gap-4",
    "24": "tablet:gap-6",
    "32": "tablet:gap-8",
  },
  desktop: {
    "0": "desktop:gap-0",
    "4": "desktop:gap-1",
    "8": "desktop:gap-2",
    "12": "desktop:gap-3",
    "16": "desktop:gap-4",
    "24": "desktop:gap-6",
    "32": "desktop:gap-8",
  },
};

// 교차축·주축 정렬(Figma Alignment · Justify)
const alignClasses = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  stretch: "items-stretch",
} as const;

const justifyClasses = {
  start: "justify-start",
  center: "justify-center",
  between: "justify-between",
  end: "justify-end",
} as const;

// 겉면 테두리(Figma Box Surface Tone). Outline은 기본 테두리, 나머지는 의미 색 테두리
const toneClasses: Record<BoxTone, string> = {
  none: "",
  outline: "border border-border-default",
  neutral: "border border-border-focus",
  brand: "border border-border-brand",
  success: "border border-fill-success",
  warning: "border border-fill-warning",
  danger: "border border-fill-danger",
};

const radiusClasses: Record<`${BoxRadius}`, string> = {
  0: "rounded-none",
  4: "rounded-4",
  8: "rounded-8",
  12: "rounded-12",
  16: "rounded-16",
  20: "rounded-20",
  full: "rounded-full",
};

// Scroll은 넘치는 방향으로 스크롤된다(Mint 기본 스크롤바)
const overflowClasses = {
  visible: "",
  hidden: "overflow-hidden",
  scroll: "overflow-auto",
} as const;

export interface BoxProps extends ComponentProps<"div"> {
  /** 겉면 테두리. 기본 `none`. 배경은 `className`의 색 토큰으로 준다(`bg-fill-brand-weak` 등) */
  tone?: BoxTone;
  /**
   * 그림자. `raised`는 화면에 붙은 카드처럼 살짝 띄운다(흰 바탕 + `shadow-raised`).
   * `floating`은 위에 떠 있는 상자(떠 있는 바탕 + `shadow-floating`)로, Popover·떠 있는 목록이 쓴다. 기본 `none`
   */
  elevation?: "none" | "raised" | "floating";
  /** 모서리. 기본 `8` */
  radius?: BoxRadius;
  /** 쌓는 방향. 기본 `vertical`. 구간별로 바꾸려면 `{ base: "vertical", desktop: "horizontal" }` */
  direction?: Responsive<BoxDirection>;
  /** 교차축 정렬. 기본 `stretch`(자식이 폭이나 높이를 채움) */
  align?: keyof typeof alignClasses;
  /** 주축 정렬. 기본 `start` */
  justify?: keyof typeof justifyClasses;
  /** 안쪽 여백 0 · 8 · 16 · 20 · 24px. 기본 `0`. 구간별로 바꾸려면 `{ base: 16, desktop: 24 }` */
  padding?: Responsive<BoxPadding>;
  /** 요소 사이 간격 0 · 4 · 8 · 12 · 16 · 24 · 32px. 기본 `0`. 구간별 객체도 받는다 */
  gap?: Responsive<BoxGap>;
  /** 넘친 내용. `visible`(기본) · `hidden` 잘라냄 · `scroll` 스크롤 */
  overflow?: keyof typeof overflowClasses;
  /** 태그. 기본 `div` */
  as?: BoxElement;
}

/** 콘텐츠를 담고 배치하는 범용 레이아웃 상자. 카드 안, 페이지 영역, 콘텐츠 묶음 어디서나 구조를 잡는다 */
export function Box({
  tone = "none",
  elevation = "none",
  radius = 8,
  direction = "vertical",
  align = "stretch",
  justify = "start",
  padding = 0,
  gap = 0,
  overflow = "visible",
  as,
  className,
  ...props
}: BoxProps) {
  // 태그마다 ref 타입이 달라 유니온으로 좁혀지지 않게 넓혀 둔다(Text와 같은 방식)
  const Component = (as ?? "div") as ElementType;
  return (
    <Component
      className={cn(
        "flex min-w-0",
        responsiveClasses<BoxDirection>(direction, "vertical", directionClasses),
        responsiveClasses<BoxPadding>(padding, 0, paddingClasses),
        responsiveClasses<BoxGap>(gap, 0, gapClasses),
        alignClasses[align],
        justifyClasses[justify],
        toneClasses[tone],
        elevation === "raised" && "bg-background-default shadow-raised",
        elevation === "floating" && "bg-background-floated shadow-floating",
        radiusClasses[radius],
        overflowClasses[overflow],
        className,
      )}
      {...props}
    />
  );
}
