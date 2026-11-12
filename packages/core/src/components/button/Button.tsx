// 상태·이벤트 처리가 없어서 "use client"를 붙이지 않는다. 서버 컴포넌트에서도 그대로 쓸 수 있다.
// (onClick은 사용하는 쪽이 클라이언트 컴포넌트에서 넘긴다. loading은 클릭 차단을 `disabled` 속성으로 해서 핸들러가 필요 없다)
import type { ComponentProps, ReactNode } from "react";
import { cn } from "../../utils/cn";
import {
  responsiveClasses,
  type ResponsiveClassTable,
  type Responsive,
} from "../../utils/responsive";
import { Circular } from "../circular/Circular";

export type ButtonSize = "xs" | "sm" | "md" | "lg";

/**
 * 위계(Figma Button 가이드): 강 `solid primary·neutral·destructive` · 중 `solid secondary` · 약 `outline`·`ghost`.
 * 가능한 조합만 타입으로 허용한다.
 */
export type ButtonStyle =
  | { variant?: "solid"; color?: "primary" | "neutral" | "secondary" | "destructive" }
  | { variant: "outline"; color?: "neutral" | "primary" }
  | { variant: "ghost"; color?: "neutral" };

/**
 * 앞(`leftAddon`)·뒤(`rightAddon`)에 아이콘 등을 붙인다. 둘 다 넣을 수는 있지만 레이블이 묻혀서 하나만 쓰기를 권한다.
 * `xs`는 아이콘이 없어서 넘겨도 그리지 않는다. 아이콘만 필요하면 IconButton을 쓴다.
 */
export interface ButtonIcon {
  /** 텍스트 앞(왼쪽)에 붙는 요소. 아이콘 등. 행동의 의미를 보조할 때 쓴다(글쓰기 + 연필). */
  leftAddon?: ReactNode;
  /** 텍스트 뒤(오른쪽)에 붙는 요소. 동작의 방향이나 결과를 알릴 때 쓴다(다음 + 화살표). */
  rightAddon?: ReactNode;
}

// 크기·폭은 값 하나 또는 구간별 객체를 받는다(utils/responsive.ts). 구간마다 클래스를 통째로 적은 표를 쓴다
const base =
  "relative inline-flex items-center justify-center border font-mint whitespace-nowrap cursor-pointer transition-colors disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus [&_svg]:pointer-events-none [&_svg]:shrink-0";

// 높이 xs 28 · sm 32 · md 40 · lg 48px, 모서리 xs 8 · 나머지 12. 아이콘(로딩 원 포함)은 xs 12 · sm·md 16 · lg 20px.
// 터치 화면에서 xs·sm은 보이는 크기는 그대로 두고 눌림 영역만 44px로 넓힌다(md·lg로 바뀌는 구간에서는 넓힌 영역을 없앤다)
const sizeClasses: ResponsiveClassTable<ButtonSize> = {
  base: {
    xs: "h-7 px-2 rounded-8 text-label-3-medium [&_svg]:size-3 pointer-coarse:before:absolute pointer-coarse:before:inset-x-0 pointer-coarse:before:top-1/2 pointer-coarse:before:h-11 pointer-coarse:before:-translate-y-1/2",
    sm: "h-8 px-3 rounded-12 text-label-3-medium [&_svg]:size-4 pointer-coarse:before:absolute pointer-coarse:before:inset-x-0 pointer-coarse:before:top-1/2 pointer-coarse:before:h-11 pointer-coarse:before:-translate-y-1/2",
    md: "h-10 px-4 rounded-12 text-label-2-medium [&_svg]:size-4 pointer-coarse:before:content-none",
    lg: "h-12 px-5 rounded-12 text-label-1-medium [&_svg]:size-5 pointer-coarse:before:content-none",
  },
  tablet: {
    xs: "tablet:h-7 tablet:px-2 tablet:rounded-8 tablet:text-label-3-medium tablet:[&_svg]:size-3 tablet:pointer-coarse:before:absolute tablet:pointer-coarse:before:inset-x-0 tablet:pointer-coarse:before:top-1/2 tablet:pointer-coarse:before:h-11 tablet:pointer-coarse:before:-translate-y-1/2",
    sm: "tablet:h-8 tablet:px-3 tablet:rounded-12 tablet:text-label-3-medium tablet:[&_svg]:size-4 tablet:pointer-coarse:before:absolute tablet:pointer-coarse:before:inset-x-0 tablet:pointer-coarse:before:top-1/2 tablet:pointer-coarse:before:h-11 tablet:pointer-coarse:before:-translate-y-1/2",
    md: "tablet:h-10 tablet:px-4 tablet:rounded-12 tablet:text-label-2-medium tablet:[&_svg]:size-4 tablet:pointer-coarse:before:content-none",
    lg: "tablet:h-12 tablet:px-5 tablet:rounded-12 tablet:text-label-1-medium tablet:[&_svg]:size-5 tablet:pointer-coarse:before:content-none",
  },
  desktop: {
    xs: "desktop:h-7 desktop:px-2 desktop:rounded-8 desktop:text-label-3-medium desktop:[&_svg]:size-3 desktop:pointer-coarse:before:absolute desktop:pointer-coarse:before:inset-x-0 desktop:pointer-coarse:before:top-1/2 desktop:pointer-coarse:before:h-11 desktop:pointer-coarse:before:-translate-y-1/2",
    sm: "desktop:h-8 desktop:px-3 desktop:rounded-12 desktop:text-label-3-medium desktop:[&_svg]:size-4 desktop:pointer-coarse:before:absolute desktop:pointer-coarse:before:inset-x-0 desktop:pointer-coarse:before:top-1/2 desktop:pointer-coarse:before:h-11 desktop:pointer-coarse:before:-translate-y-1/2",
    md: "desktop:h-10 desktop:px-4 desktop:rounded-12 desktop:text-label-2-medium desktop:[&_svg]:size-4 desktop:pointer-coarse:before:content-none",
    lg: "desktop:h-12 desktop:px-5 desktop:rounded-12 desktop:text-label-1-medium desktop:[&_svg]:size-5 desktop:pointer-coarse:before:content-none",
  },
};

// xs는 아이콘(leftAddon·rightAddon)을 그리지 않는다. 크기가 구간마다 바뀌어도 맞도록 CSS로 숨긴다
const addonClasses: ResponsiveClassTable<ButtonSize> = {
  base: {
    xs: "hidden",
    sm: "inline-flex",
    md: "inline-flex",
    lg: "inline-flex",
  },
  tablet: {
    xs: "tablet:hidden",
    sm: "tablet:inline-flex",
    md: "tablet:inline-flex",
    lg: "tablet:inline-flex",
  },
  desktop: {
    xs: "desktop:hidden",
    sm: "desktop:inline-flex",
    md: "desktop:inline-flex",
    lg: "desktop:inline-flex",
  },
};

// fullWidth: 부모 폭을 꽉 채운다
const fullWidthClasses: ResponsiveClassTable<"true" | "false"> = {
  base: {
    true: "w-full",
    false: "w-auto",
  },
  tablet: {
    true: "tablet:w-full",
    false: "tablet:w-auto",
  },
  desktop: {
    true: "desktop:w-full",
    false: "desktop:w-auto",
  },
};

/**
 * 조합별 색. hover와 pressed는 같은 색이다(모바일웹 터치와 PC가 같은 피드백).
 * loading은 pressed 색을 그대로 보여 준다(outline은 변화 없음). disabled는 비활성 색.
 */
const tones = {
  "solid-primary": {
    normal:
      "border-transparent bg-fill-brand text-text-on-fill enabled:hover:bg-fill-brand-pressed enabled:active:bg-fill-brand-pressed",
    loading: "bg-fill-brand-pressed",
  },
  "solid-neutral": {
    normal:
      "border-transparent bg-fill-neutral text-text-on-fill enabled:hover:bg-fill-neutral-pressed enabled:active:bg-fill-neutral-pressed",
    loading: "bg-fill-neutral-pressed",
  },
  "solid-secondary": {
    normal:
      "border-transparent bg-fill-neutral-weak text-text-strong enabled:hover:bg-fill-neutral-weak-pressed enabled:active:bg-fill-neutral-weak-pressed",
    loading: "bg-fill-neutral-weak-pressed",
  },
  "solid-destructive": {
    normal:
      "border-transparent bg-fill-danger text-text-on-fill enabled:hover:bg-fill-danger-pressed enabled:active:bg-fill-danger-pressed",
    loading: "bg-fill-danger-pressed",
  },
  "outline-neutral": {
    normal:
      "border-border-strong bg-fill-white text-text-strong enabled:hover:bg-fill-neutral-weak enabled:active:bg-fill-neutral-weak",
    loading: "",
  },
  "outline-primary": {
    normal:
      "border-border-brand bg-fill-white text-text-brand enabled:hover:bg-fill-brand-weak enabled:active:bg-fill-brand-weak",
    loading: "",
  },
  "ghost-neutral": {
    normal:
      "border-transparent bg-transparent text-text-secondary enabled:hover:bg-fill-neutral-weak-pressed enabled:active:bg-fill-neutral-weak-pressed",
    loading: "bg-fill-neutral-weak-pressed",
  },
} as const;

type ToneKey = keyof typeof tones;

const disabledTones = {
  solid: "border-transparent bg-fill-disabled text-text-disabled",
  outline: "border-border-disabled bg-fill-white text-text-disabled",
  ghost: "border-transparent bg-transparent text-text-disabled",
} as const;

export type ButtonProps = Omit<ComponentProps<"button">, "color"> &
  ButtonStyle &
  ButtonIcon & {
    /**
     * 높이 xs 28 · sm 32 · md 40 · lg 48px. 기본 `md`.
     * 구간별로 바꾸려면 객체를 준다: `{ base: "lg", tablet: "md" }`(모바일 lg, 768px~ md). 빈 구간은 앞 구간 값을 이어받는다
     */
    size?: Responsive<ButtonSize>;
    /** 진행 중. 레이블을 숨기고 진행 원을 보여 주며 크기는 그대로 둔다. 클릭은 막힌다(`disabled`와 같음). */
    loading?: boolean;
    /** 부모 폭을 꽉 채운다. 모바일 하단 버튼 등. 구간별로 바꾸려면 `{ base: true, tablet: false }` */
    fullWidth?: Responsive<boolean>;
  };

export function Button({
  className,
  size,
  variant = "solid",
  color,
  fullWidth,
  leftAddon,
  rightAddon,
  loading = false,
  disabled,
  children,
  type = "button",
  ref,
  ...props
}: ButtonProps) {
  const tone =
    tones[`${variant}-${color ?? (variant === "solid" ? "primary" : "neutral")}` as ToneKey];
  // loading 중에는 색을 비활성이 아니라 pressed로 보여 주려고 disabled 색보다 먼저 판단한다
  const toneClass = loading
    ? [tone.normal, tone.loading]
    : disabled
      ? disabledTones[variant]
      : tone.normal;

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cn(
        base,
        responsiveClasses<ButtonSize>(size, "md", sizeClasses),
        responsiveClasses<boolean>(fullWidth, false, fullWidthClasses),
        toneClass,
        className,
      )}
      {...props}
    >
      {loading && (
        // 원 크기는 버튼의 아이콘 크기 규칙([&_svg]:size-*)을 따른다: xs 12 · sm·md 16 · lg 20px
        <Circular size={16} aria-hidden="true" className="absolute text-current" />
      )}
      <span className={cn("inline-flex items-center gap-2", loading && "invisible")}>
        {leftAddon != null && (
          <span
            className={cn("items-center", responsiveClasses<ButtonSize>(size, "md", addonClasses))}
          >
            {leftAddon}
          </span>
        )}
        {children}
        {rightAddon != null && (
          <span
            className={cn("items-center", responsiveClasses<ButtonSize>(size, "md", addonClasses))}
          >
            {rightAddon}
          </span>
        )}
      </span>
    </button>
  );
}
