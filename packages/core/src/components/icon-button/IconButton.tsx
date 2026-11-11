// 상태·이벤트를 직접 갖지 않아서 "use client"를 붙이지 않는다(Button과 같은 방식).
// `onClick`을 넘길 때만 클라이언트 컴포넌트 안에서 쓴다.
// Figma `Icon Button`(2201:10957) · `Icon Button Guidelines`(2201:11198).
// 아이콘만으로 동작을 실행하는 원형 버튼. 의미 전달이 약하므로 꼭 필요한 곳에만 쓰고 이름(aria-label)을 붙인다.
import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "../../utils/cn";
import {
  responsiveClasses,
  type Responsive,
  type ResponsiveClassTable,
} from "../../utils/responsive";

const iconButtonVariants = cva(
  [
    "relative inline-flex shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus",
    "disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:shrink-0",
  ],
  {
    variants: {
      // Figma Type: Normal · Background · Outlined · Solid. 아이콘 색은 기본 icon-strong, solid만 흰색, 비활성은 icon-disabled
      variant: {
        normal:
          "text-icon-strong hover:bg-fill-neutral-weak active:bg-fill-neutral-weak disabled:bg-transparent disabled:text-icon-disabled",
        background:
          "bg-fill-neutral-medium text-icon-strong hover:bg-fill-neutral-medium-pressed active:bg-fill-neutral-medium-pressed disabled:bg-fill-neutral-medium disabled:text-icon-disabled",
        outline:
          "border border-border-strong bg-fill-white text-icon-strong hover:bg-fill-neutral-weak active:bg-fill-neutral-weak disabled:border-border-disabled disabled:bg-fill-white disabled:text-icon-disabled",
        solid:
          "bg-fill-brand text-icon-on-fill hover:bg-fill-brand-pressed active:bg-fill-brand-pressed disabled:bg-fill-disabled disabled:text-icon-disabled",
      },
    },
    defaultVariants: { variant: "normal" },
  },
);

type IconButtonVariantProps = VariantProps<typeof iconButtonVariants>;

export type IconButtonSize = "xs" | "sm" | "md" | "lg";

// 크기는 Button과 같다: xs 28 · sm 32 · md 40 · lg 48, 아이콘 14 · 16 · 20 · 24. 값 하나 또는 구간별 객체를 받는다(utils/responsive.ts).
// Figma 접근성: XSmall·Small은 주변 여백까지 포함해 44px. 터치 화면에서 눌림 영역만 넓힌다(md·lg로 바뀌는 구간에서는 넓힌 영역을 없앤다)
const sizeClasses: ResponsiveClassTable<IconButtonSize> = {
  base: {
    xs: "size-7 [&_svg]:size-[14px] pointer-coarse:before:absolute pointer-coarse:before:top-1/2 pointer-coarse:before:left-1/2 pointer-coarse:before:size-11 pointer-coarse:before:-translate-x-1/2 pointer-coarse:before:-translate-y-1/2",
    sm: "size-8 [&_svg]:size-4 pointer-coarse:before:absolute pointer-coarse:before:top-1/2 pointer-coarse:before:left-1/2 pointer-coarse:before:size-11 pointer-coarse:before:-translate-x-1/2 pointer-coarse:before:-translate-y-1/2",
    md: "size-10 [&_svg]:size-5 pointer-coarse:before:content-none",
    lg: "size-12 [&_svg]:size-6 pointer-coarse:before:content-none",
  },
  tablet: {
    xs: "tablet:size-7 tablet:[&_svg]:size-[14px] tablet:pointer-coarse:before:absolute tablet:pointer-coarse:before:top-1/2 tablet:pointer-coarse:before:left-1/2 tablet:pointer-coarse:before:size-11 tablet:pointer-coarse:before:-translate-x-1/2 tablet:pointer-coarse:before:-translate-y-1/2",
    sm: "tablet:size-8 tablet:[&_svg]:size-4 tablet:pointer-coarse:before:absolute tablet:pointer-coarse:before:top-1/2 tablet:pointer-coarse:before:left-1/2 tablet:pointer-coarse:before:size-11 tablet:pointer-coarse:before:-translate-x-1/2 tablet:pointer-coarse:before:-translate-y-1/2",
    md: "tablet:size-10 tablet:[&_svg]:size-5 tablet:pointer-coarse:before:content-none",
    lg: "tablet:size-12 tablet:[&_svg]:size-6 tablet:pointer-coarse:before:content-none",
  },
  desktop: {
    xs: "desktop:size-7 desktop:[&_svg]:size-[14px] desktop:pointer-coarse:before:absolute desktop:pointer-coarse:before:top-1/2 desktop:pointer-coarse:before:left-1/2 desktop:pointer-coarse:before:size-11 desktop:pointer-coarse:before:-translate-x-1/2 desktop:pointer-coarse:before:-translate-y-1/2",
    sm: "desktop:size-8 desktop:[&_svg]:size-4 desktop:pointer-coarse:before:absolute desktop:pointer-coarse:before:top-1/2 desktop:pointer-coarse:before:left-1/2 desktop:pointer-coarse:before:size-11 desktop:pointer-coarse:before:-translate-x-1/2 desktop:pointer-coarse:before:-translate-y-1/2",
    md: "desktop:size-10 desktop:[&_svg]:size-5 desktop:pointer-coarse:before:content-none",
    lg: "desktop:size-12 desktop:[&_svg]:size-6 desktop:pointer-coarse:before:content-none",
  },
};

export interface IconButtonProps extends Omit<ComponentProps<"button">, "children"> {
  /** 보여 줄 아이콘(`<XIcon />` 등). 크기는 버튼 크기에 맞춰진다 */
  icon: ReactNode;
  /** 버튼 이름(필수). 아이콘만 있어서 스크린리더가 읽을 이름이 따로 있어야 한다. 예: "닫기" */
  "aria-label": string;
  /** `normal` 배경 없음(기본) · `background` 회색 바탕 · `outline` 테두리 · `solid` 브랜드(가장 강조) */
  variant?: NonNullable<IconButtonVariantProps["variant"]>;
  /**
   * `xs` 28 · `sm` 32 · `md` 40(기본) · `lg` 48. 표나 촘촘한 목록은 `xs`.
   * 구간별로 바꾸려면 객체를 준다: `{ base: "sm", tablet: "md" }`. 빈 구간은 앞 구간 값을 이어받는다
   */
  size?: Responsive<IconButtonSize>;
  /** 오른쪽 위 빨간 점. 알림처럼 새 소식을 알린다 */
  badge?: boolean;
}

/** 아이콘만으로 동작을 실행하는 원형 버튼 */
export function IconButton({
  icon,
  variant = "normal",
  size = "md",
  badge = false,
  className,
  type = "button",
  "aria-label": label,
  ...props
}: IconButtonProps) {
  return (
    <button
      type={type}
      // 배지가 있으면 이름에 "새 소식"을 덧붙여 소리로도 알린다(aria-label이 내용보다 우선이라 안쪽 글자는 읽히지 않는다)
      aria-label={badge ? `${label} (새 소식)` : label}
      className={cn(
        iconButtonVariants({ variant }),
        responsiveClasses<IconButtonSize>(size, "md", sizeClasses),
        className,
      )}
      {...props}
    >
      {icon}
      {badge && (
        // Figma: 8px 점, 48 버튼 기준 위·오른쪽 4px. 크기가 작아도 같은 자리
        <span
          aria-hidden="true"
          className="absolute top-1 right-1 size-2 rounded-full bg-fill-danger"
        />
      )}
    </button>
  );
}
