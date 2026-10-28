// 상태·이벤트 처리가 없어서 "use client"를 붙이지 않는다. 서버 컴포넌트에서도 그대로 쓸 수 있다.
// (onClick은 사용하는 쪽이 클라이언트 컴포넌트에서 넘긴다)
import type { ComponentProps, ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../utils/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-8 border font-mint whitespace-nowrap cursor-pointer transition-colors disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      // 높이: sm 32 · md 40 · lg 48 · xl 56px. 터치 화면에서는 md(40px) 이상을 쓴다
      size: {
        sm: "h-8 px-3 text-label-3-semibold [&_svg]:size-4",
        md: "h-10 px-4 text-label-2-semibold [&_svg]:size-4",
        lg: "h-12 px-5 text-label-1-semibold [&_svg]:size-5",
        xl: "h-14 px-6 text-heading-3-semibold [&_svg]:size-6",
      },
      variant: {
        primary:
          "border-transparent bg-brand-primary text-text-on-brand hover:bg-brand-primary-hover",
        tint: "border-transparent bg-brand-tint text-brand-primary",
        line: "border-border-default bg-bg-surface text-text-primary hover:bg-bg-elevated",
        // 탈퇴처럼 되돌리기 어렵거나 부정적인 동작용
        danger: "border-transparent bg-brand-error text-text-inverse",
      },
      fullWidth: {
        true: "w-full",
      },
    },
    defaultVariants: {
      size: "md",
      variant: "primary",
    },
  },
);

export interface ButtonProps extends ComponentProps<"button">, VariantProps<typeof buttonVariants> {
  /** 텍스트 앞(왼쪽)에 붙는 요소. 아이콘 등. */
  leftAddon?: ReactNode;
  /** 텍스트 뒤(오른쪽)에 붙는 요소. "더보기 →"의 화살표 등. */
  rightAddon?: ReactNode;
}

export function Button({
  className,
  size,
  variant,
  fullWidth,
  leftAddon,
  rightAddon,
  children,
  type = "button",
  ref,
  ...props
}: ButtonProps) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(buttonVariants({ size, variant, fullWidth }), className)}
      {...props}
    >
      {leftAddon}
      {children}
      {rightAddon}
    </button>
  );
}
