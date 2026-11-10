// 상태·이벤트 처리가 없어서 "use client"를 붙이지 않는다. 서버 컴포넌트에서도 그대로 쓸 수 있다.
// (onClick은 사용하는 쪽이 클라이언트 컴포넌트에서 넘긴다. loading은 클릭 차단을 `disabled` 속성으로 해서 핸들러가 필요 없다)
import type { ComponentProps, ReactNode } from "react";
import { cva } from "class-variance-authority";
import { cn } from "../../utils/cn";
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

// 높이: xs 28 · sm 32 · md 40 · lg 48px. 모서리는 xs만 8, 나머지는 12.
// 터치 화면에서 xs·sm은 보이는 크기는 그대로 두고 눌림 영역만 44px로 넓힌다.
const buttonVariants = cva(
  "relative inline-flex items-center justify-center rounded-12 border font-mint whitespace-nowrap cursor-pointer transition-colors disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      size: {
        xs: "h-7 px-2 rounded-8 text-label-3-semibold pointer-coarse:before:absolute pointer-coarse:before:inset-x-0 pointer-coarse:before:top-1/2 pointer-coarse:before:h-11 pointer-coarse:before:-translate-y-1/2",
        sm: "h-8 px-3 text-label-3-semibold [&_svg]:size-4 pointer-coarse:before:absolute pointer-coarse:before:inset-x-0 pointer-coarse:before:top-1/2 pointer-coarse:before:h-11 pointer-coarse:before:-translate-y-1/2",
        md: "h-10 px-4 text-label-2-semibold [&_svg]:size-4",
        lg: "h-12 px-5 text-label-1-semibold [&_svg]:size-5",
      },
      fullWidth: { true: "w-full" },
    },
    defaultVariants: { size: "md" },
  },
);

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
      "border-border-strong bg-transparent text-text-strong enabled:hover:bg-fill-neutral-weak enabled:active:bg-fill-neutral-weak",
    loading: "",
  },
  "outline-primary": {
    normal:
      "border-border-brand bg-transparent text-text-brand enabled:hover:bg-fill-brand-weak enabled:active:bg-fill-brand-weak",
    loading: "",
  },
  "ghost-neutral": {
    normal:
      "border-transparent bg-transparent text-text-strong enabled:hover:bg-fill-neutral-weak-pressed enabled:active:bg-fill-neutral-weak-pressed",
    loading: "bg-fill-neutral-weak-pressed",
  },
} as const;

type ToneKey = keyof typeof tones;

const disabledTones = {
  solid: "border-transparent bg-fill-disabled text-text-disabled",
  outline: "border-border-disabled bg-transparent text-text-disabled",
  ghost: "border-transparent bg-transparent text-text-disabled",
} as const;

// 로딩 원 크기는 버튼 크기를 따른다(Figma): xs 12 · sm 16 · md 16 · lg 20px
const spinnerSizes = { xs: 12, sm: 16, md: 16, lg: 20 } as const;

export type ButtonProps = Omit<ComponentProps<"button">, "color"> &
  ButtonStyle &
  ButtonIcon & {
    /** 높이 xs 28 · sm 32 · md 40 · lg 48px. 기본 `md` */
    size?: ButtonSize;
    /** 진행 중. 레이블을 숨기고 진행 원을 보여 주며 크기는 그대로 둔다. 클릭은 막힌다(`disabled`와 같음). */
    loading?: boolean;
    /** 부모 폭을 꽉 채운다. 모바일 하단 버튼 등 */
    fullWidth?: boolean;
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
      className={cn(buttonVariants({ size, fullWidth }), toneClass, className)}
      {...props}
    >
      {loading && (
        <Circular
          size={spinnerSizes[size ?? "md"]}
          aria-hidden="true"
          className="absolute text-current"
        />
      )}
      <span className={cn("inline-flex items-center gap-2", loading && "invisible")}>
        {size !== "xs" && leftAddon}
        {children}
        {size !== "xs" && rightAddon}
      </span>
    </button>
  );
}
