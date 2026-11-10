// 상태·이벤트가 없어서 "use client"를 붙이지 않는다. 서버 컴포넌트에서도 그대로 쓸 수 있다.
// 표시 전용이다. 눌러도 아무 동작이 없고, 값을 골라 조건을 바꾸는 일은 Chip이 한다.
import type { ComponentProps } from "react";
import { cva } from "class-variance-authority";
import { cn } from "../../utils/cn";

export type BadgeVariant = "fill" | "weak";
export type BadgeColor = "brand" | "neutral" | "danger" | "success" | "warning";

// 높이 20 · 24 · 28px은 패딩과 글자 줄 높이로 정해진다(별도 높이 값 없음).
// 글자: sm 11 · md 12 · lg 14. 모서리는 sm·md가 8, lg만 12. 6·7px 패딩은 Figma 수치를 그대로 옮긴 임의 값이다.
const badgeVariants = cva("inline-flex items-center justify-center whitespace-nowrap select-none", {
  variants: {
    size: {
      sm: "rounded-8 px-[6px] py-[2px] text-caption-2-semibold",
      md: "rounded-8 px-[7px] py-[3px] text-caption-1-semibold",
      lg: "rounded-12 px-2 py-1 text-label-2-semibold",
    },
  },
  defaultVariants: { size: "md" },
});

// 채움(fill)은 진한 배경에 흰 글자로 가장 눈에 띄고, weak는 연한 배경에 색 글자로 부드럽다.
// danger·warning의 fill은 Figma가 시맨틱이 아닌 아토믹 색(red-500·yellow-500)을 직접 써서, 같은 값을 그대로 쓴다.
const tones: Record<BadgeVariant, Record<BadgeColor, string>> = {
  fill: {
    brand: "bg-fill-brand text-text-on-fill",
    neutral: "bg-fill-neutral-pressed text-text-on-fill",
    danger: "bg-[var(--color-atomic-red-500)] text-text-on-fill",
    success: "bg-fill-success text-text-on-fill",
    warning: "bg-[var(--color-atomic-yellow-500)] text-text-on-fill-warning",
  },
  weak: {
    brand: "bg-fill-brand-weak text-text-brand",
    neutral: "bg-fill-neutral-weak text-text-secondary",
    danger: "bg-fill-danger-weak text-text-danger",
    success: "bg-fill-success-weak text-text-success",
    warning: "bg-fill-warning-weak text-text-warning",
  },
};

export interface BadgeProps extends ComponentProps<"span"> {
  /** `fill`은 진한 배경(가장 눈에 띔), `weak`는 연한 배경. 기본 `fill` */
  variant?: BadgeVariant;
  /** 의미로 고른다: `brand` 강조 · `neutral` 일반 · `danger` 오류·임박 · `success` 완료 · `warning` 주의. 기본 `brand` */
  color?: BadgeColor;
  /** 높이 `sm` 20 · `md` 24 · `lg` 28px. 같은 화면에서는 하나로 맞춘다. 기본 `md` */
  size?: "sm" | "md" | "lg";
}

/** 문구는 `children`으로 넣는다. 1~4자로 짧게(lg는 1~8자까지) 쓴다. */
export function Badge({
  variant = "fill",
  color = "brand",
  size,
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ size }), tones[variant][color], className)} {...props}>
      {children}
    </span>
  );
}
