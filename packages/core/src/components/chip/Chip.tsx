// 상태·이벤트를 직접 갖지 않아서 "use client"를 붙이지 않는다(Button과 같은 방식).
// `onClick`을 넘길 때만 클라이언트 컴포넌트 안에서 쓴다.
// Figma `Chip`(2200:8621) · `Chip Guidelines`(2200:9392).
// 필터·카테고리처럼 선택 상태(active)가 있는 칩 하나. 행동을 실행하는 Button과 달리 값을 고르거나 조건을 바꿀 때 쓴다.
// 여러 칩을 한 줄로 묶어 하나만 고르는 목록은 `Category`가 맡는다.
import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "../../utils/cn";
import {
  responsiveClasses,
  type Responsive,
  type ResponsiveClassTable,
} from "../../utils/responsive";

const chipVariants = cva(
  [
    "relative inline-flex shrink-0 cursor-pointer items-center justify-center gap-1 whitespace-nowrap transition-colors",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus",
    "disabled:cursor-not-allowed",
  ],
  {
    variants: {
      variant: { solid: "", outline: "border" },
      shape: { square: "", pill: "rounded-full" },
      active: { false: "", true: "" },
      disabled: { false: "", true: "" },
    },
    compoundVariants: [
      // 색: 안 고름 → 고름(active). hover·누름은 Figma Pressed와 같다
      {
        variant: "solid",
        active: false,
        disabled: false,
        class:
          "bg-fill-neutral-medium text-text-secondary hover:bg-fill-neutral-medium-pressed active:bg-fill-neutral-medium-pressed",
      },
      {
        variant: "solid",
        active: true,
        disabled: false,
        class:
          "bg-fill-neutral text-text-on-fill hover:bg-fill-neutral-pressed active:bg-fill-neutral-pressed",
      },
      {
        variant: "outline",
        active: false,
        disabled: false,
        class:
          "border-border-strong bg-fill-white text-text-secondary hover:bg-fill-neutral-weak active:bg-fill-neutral-weak",
      },
      {
        variant: "outline",
        active: true,
        disabled: false,
        class:
          "border-border-selected bg-fill-white text-text-strong hover:bg-fill-neutral-weak active:bg-fill-neutral-weak",
      },
      { variant: "solid", disabled: true, class: "bg-fill-disabled text-text-disabled" },
      {
        variant: "outline",
        disabled: true,
        class: "border-border-disabled bg-fill-white text-text-disabled",
      },
    ],
    defaultVariants: {
      variant: "solid",
      shape: "square",
      active: false,
      disabled: false,
    },
  },
);

type ChipVariantProps = VariantProps<typeof chipVariants>;

export type ChipSize = "lg" | "md" | "sm";

// 크기: Large 40 · Medium 32 · Small 28, 아이콘·이미지 16(Small 14). 좌우 여백·모서리는 모양(shape)마다 다르다.
// Large Square의 모서리 10은 Figma 값(MINT 반경 토큰에는 10이 없다). 32·28은 터치 화면에서 눌림 영역만 44px로 넓힌다.
// 값 하나 또는 구간별 객체를 받는다(utils/responsive.ts). 구간마다 클래스를 통째로 적은 표를 쓴다

const squareSizeClasses: ResponsiveClassTable<ChipSize> = {
  base: {
    lg: "h-10 text-label-2-medium [&_svg]:size-4 pointer-coarse:before:content-none rounded-[10px] px-4",
    md: "h-8 text-label-2-medium [&_svg]:size-4 pointer-coarse:before:absolute pointer-coarse:before:inset-x-0 pointer-coarse:before:top-1/2 pointer-coarse:before:h-11 pointer-coarse:before:-translate-y-1/2 rounded-8 px-3",
    sm: "h-7 text-label-3-medium [&_svg]:size-[14px] pointer-coarse:before:absolute pointer-coarse:before:inset-x-0 pointer-coarse:before:top-1/2 pointer-coarse:before:h-11 pointer-coarse:before:-translate-y-1/2 rounded-8 px-3",
  },
  tablet: {
    lg: "tablet:h-10 tablet:text-label-2-medium tablet:[&_svg]:size-4 tablet:pointer-coarse:before:content-none tablet:rounded-[10px] tablet:px-4",
    md: "tablet:h-8 tablet:text-label-2-medium tablet:[&_svg]:size-4 tablet:pointer-coarse:before:absolute tablet:pointer-coarse:before:inset-x-0 tablet:pointer-coarse:before:top-1/2 tablet:pointer-coarse:before:h-11 tablet:pointer-coarse:before:-translate-y-1/2 tablet:rounded-8 tablet:px-3",
    sm: "tablet:h-7 tablet:text-label-3-medium tablet:[&_svg]:size-[14px] tablet:pointer-coarse:before:absolute tablet:pointer-coarse:before:inset-x-0 tablet:pointer-coarse:before:top-1/2 tablet:pointer-coarse:before:h-11 tablet:pointer-coarse:before:-translate-y-1/2 tablet:rounded-8 tablet:px-3",
  },
  desktop: {
    lg: "desktop:h-10 desktop:text-label-2-medium desktop:[&_svg]:size-4 desktop:pointer-coarse:before:content-none desktop:rounded-[10px] desktop:px-4",
    md: "desktop:h-8 desktop:text-label-2-medium desktop:[&_svg]:size-4 desktop:pointer-coarse:before:absolute desktop:pointer-coarse:before:inset-x-0 desktop:pointer-coarse:before:top-1/2 desktop:pointer-coarse:before:h-11 desktop:pointer-coarse:before:-translate-y-1/2 desktop:rounded-8 desktop:px-3",
    sm: "desktop:h-7 desktop:text-label-3-medium desktop:[&_svg]:size-[14px] desktop:pointer-coarse:before:absolute desktop:pointer-coarse:before:inset-x-0 desktop:pointer-coarse:before:top-1/2 desktop:pointer-coarse:before:h-11 desktop:pointer-coarse:before:-translate-y-1/2 desktop:rounded-8 desktop:px-3",
  },
};

const pillSizeClasses: ResponsiveClassTable<ChipSize> = {
  base: {
    lg: "h-10 text-label-2-medium [&_svg]:size-4 pointer-coarse:before:content-none px-5",
    md: "h-8 text-label-2-medium [&_svg]:size-4 pointer-coarse:before:absolute pointer-coarse:before:inset-x-0 pointer-coarse:before:top-1/2 pointer-coarse:before:h-11 pointer-coarse:before:-translate-y-1/2 px-4",
    sm: "h-7 text-label-3-medium [&_svg]:size-[14px] pointer-coarse:before:absolute pointer-coarse:before:inset-x-0 pointer-coarse:before:top-1/2 pointer-coarse:before:h-11 pointer-coarse:before:-translate-y-1/2 px-4",
  },
  tablet: {
    lg: "tablet:h-10 tablet:text-label-2-medium tablet:[&_svg]:size-4 tablet:pointer-coarse:before:content-none tablet:px-5",
    md: "tablet:h-8 tablet:text-label-2-medium tablet:[&_svg]:size-4 tablet:pointer-coarse:before:absolute tablet:pointer-coarse:before:inset-x-0 tablet:pointer-coarse:before:top-1/2 tablet:pointer-coarse:before:h-11 tablet:pointer-coarse:before:-translate-y-1/2 tablet:px-4",
    sm: "tablet:h-7 tablet:text-label-3-medium tablet:[&_svg]:size-[14px] tablet:pointer-coarse:before:absolute tablet:pointer-coarse:before:inset-x-0 tablet:pointer-coarse:before:top-1/2 tablet:pointer-coarse:before:h-11 tablet:pointer-coarse:before:-translate-y-1/2 tablet:px-4",
  },
  desktop: {
    lg: "desktop:h-10 desktop:text-label-2-medium desktop:[&_svg]:size-4 desktop:pointer-coarse:before:content-none desktop:px-5",
    md: "desktop:h-8 desktop:text-label-2-medium desktop:[&_svg]:size-4 desktop:pointer-coarse:before:absolute desktop:pointer-coarse:before:inset-x-0 desktop:pointer-coarse:before:top-1/2 desktop:pointer-coarse:before:h-11 desktop:pointer-coarse:before:-translate-y-1/2 desktop:px-4",
    sm: "desktop:h-7 desktop:text-label-3-medium desktop:[&_svg]:size-[14px] desktop:pointer-coarse:before:absolute desktop:pointer-coarse:before:inset-x-0 desktop:pointer-coarse:before:top-1/2 desktop:pointer-coarse:before:h-11 desktop:pointer-coarse:before:-translate-y-1/2 desktop:px-4",
  },
};

// 앞 이미지(leadingImage) 크기

const imageSizeClasses: ResponsiveClassTable<ChipSize> = {
  base: {
    lg: "size-4",
    md: "size-4",
    sm: "size-[14px]",
  },
  tablet: {
    lg: "tablet:size-4",
    md: "tablet:size-4",
    sm: "tablet:size-[14px]",
  },
  desktop: {
    lg: "desktop:size-4",
    md: "desktop:size-4",
    sm: "desktop:size-[14px]",
  },
};

export interface ChipProps extends Omit<ComponentProps<"button">, "children" | "disabled"> {
  /** `solid` 흰 화면(기본) · `outline` 회색 배경 위 */
  variant?: NonNullable<ChipVariantProps["variant"]>;
  /** `lg` 40 · `md` 32(기본) · `sm` 28(촘촘한 목록). 구간별로 바꾸려면 `{ base: "sm", tablet: "md" }` */
  size?: Responsive<ChipSize>;
  /** `square` 둥근 사각형(기본) · `pill` 알약형. 한 서비스에서는 한 가지만 쓴다 */
  shape?: NonNullable<ChipVariantProps["shape"]>;
  /** 선택(켜짐) 여부. 스크린리더에는 `aria-pressed`로 알린다. 기본 `false` */
  active?: boolean;
  /** 레이블. 8자를 넘기지 않는다 */
  children: ReactNode;
  /** 레이블 왼쪽(앞) 아이콘(`<StarIcon />` 등). Figma의 leading icon. Button의 `leftAddon`과 같은 이름이다. 앞뒤 구성(아이콘·이미지·카운트)은 한 칩에 하나만 */
  leftAddon?: ReactNode;
  /** 레이블 오른쪽(뒤) 아이콘. Figma의 trailing icon */
  rightAddon?: ReactNode;
  /** 레이블 앞 둥근 이미지(코인 로고 등). `<img src alt="" />`를 넘기면 16px(Small 14px) 원으로 잘린다 */
  leadingImage?: ReactNode;
  /** 레이블 뒤 개수(예: `12`). 고름 상태에서는 흰 글자 80% */
  count?: ReactNode;
  /** 레이블 오른쪽 위의 빨간 점(새 소식) */
  badge?: boolean;
  /** 누를 수 없는 상태 */
  disabled?: boolean;
}

/** 필터·카테고리처럼 선택 상태가 있는 칩. 누르면 `active`를 바꾸는 쪽은 사용하는 쪽이다 */
export function Chip({
  variant = "solid",
  size = "md",
  shape = "square",
  active = false,
  children,
  leftAddon,
  rightAddon,
  leadingImage,
  count,
  badge = false,
  disabled = false,
  className,
  type = "button",
  ...props
}: ChipProps) {
  // 개수 색: 기본 tertiary, 고른 solid는 흰 글자 80%, 비활성은 disabled
  const countColor = disabled
    ? "text-text-disabled"
    : active && variant === "solid"
      ? "text-text-on-fill opacity-80"
      : "text-text-tertiary";

  return (
    <button
      type={type}
      aria-pressed={active}
      disabled={disabled}
      className={cn(
        chipVariants({ variant, shape, active, disabled }),
        responsiveClasses<ChipSize>(
          size,
          "md",
          shape === "pill" ? pillSizeClasses : squareSizeClasses,
        ),
        className,
      )}
      {...props}
    >
      {leadingImage != null && (
        <span
          aria-hidden="true"
          className={cn(
            "inline-flex shrink-0 overflow-hidden rounded-full bg-fill-neutral-medium [&>img]:size-full [&>img]:object-cover",
            responsiveClasses<ChipSize>(size, "md", imageSizeClasses),
          )}
        >
          {leadingImage}
        </span>
      )}
      {leftAddon}
      <span className="inline-flex items-start gap-[2px]">
        {children}
        {count != null && <span className={cn("pl-[2px]", countColor)}>{count}</span>}
        {badge && (
          // Figma: 6px 점, 위쪽 2px. 시맨틱 색 중 가장 가까운 danger(Category와 같음)
          <span aria-hidden="true" className="mt-[2px] size-[6px] rounded-full bg-fill-danger" />
        )}
      </span>
      {badge && <span className="sr-only">(새 소식)</span>}
      {rightAddon}
    </button>
  );
}
