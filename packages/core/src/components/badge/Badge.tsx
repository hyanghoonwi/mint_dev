// 상태·이벤트가 없어서 "use client"를 붙이지 않는다. 서버 컴포넌트에서도 그대로 쓸 수 있다.
// 표시 전용이다. 눌러도 아무 동작이 없고, 값을 골라 조건을 바꾸는 일은 Chip이 한다.
import type { ComponentProps } from "react";
import { cn } from "../../utils/cn";
import {
  responsiveClasses,
  type Responsive,
  type ResponsiveClassTable,
} from "../../utils/responsive";

export type BadgeVariant = "fill" | "weak";
// teal·violet·pink는 의미 없는 분류용 색(차트 색 chart/2·5·6). Figma에서 orange는 warning·danger와 비슷해서 뺐다(2026-11-11)
export type BadgeColor =
  "brand" | "neutral" | "danger" | "success" | "warning" | "teal" | "violet" | "pink";

// 높이 20 · 22 · 28px은 패딩과 글자 줄 높이로 정해진다(별도 높이 값 없음).
// 글자: sm Caption 2 SemiBold(11/16) · md Label 3 SemiBold(12/16, 2026-11-11 Figma 변경) · lg Label 2 SemiBold(14/20). 모서리는 sm·md가 8, lg만 12. 6·7px 패딩은 Figma 수치를 그대로 옮긴 임의 값이다.
export type BadgeSize = "sm" | "md" | "lg";

// 값 하나 또는 구간별 객체를 받는다(utils/responsive.ts)
const sizeClasses: ResponsiveClassTable<BadgeSize> = {
  base: {
    sm: "rounded-8 px-[6px] py-[2px] text-caption-2-semibold",
    md: "rounded-8 px-[7px] py-[3px] text-label-3-semibold",
    lg: "rounded-12 px-2 py-1 text-label-2-semibold",
  },
  tablet: {
    sm: "tablet:rounded-8 tablet:px-[6px] tablet:py-[2px] tablet:text-caption-2-semibold",
    md: "tablet:rounded-8 tablet:px-[7px] tablet:py-[3px] tablet:text-label-3-semibold",
    lg: "tablet:rounded-12 tablet:px-2 tablet:py-1 tablet:text-label-2-semibold",
  },
  desktop: {
    sm: "desktop:rounded-8 desktop:px-[6px] desktop:py-[2px] desktop:text-caption-2-semibold",
    md: "desktop:rounded-8 desktop:px-[7px] desktop:py-[3px] desktop:text-label-3-semibold",
    lg: "desktop:rounded-12 desktop:px-2 desktop:py-1 desktop:text-label-2-semibold",
  },
};

// 채움(fill)은 진한 배경에 흰 글자로 가장 눈에 띄고, weak는 연한 배경에 색 글자로 부드럽다.
// danger·warning의 fill은 Figma가 시맨틱이 아닌 아토믹 색(red-500·yellow-500)을 직접 써서, 같은 값을 그대로 쓴다.
const tones: Record<BadgeVariant, Record<BadgeColor, string>> = {
  fill: {
    brand: "bg-fill-brand text-text-on-fill",
    neutral: "bg-fill-neutral-pressed text-text-on-fill",
    danger: "bg-[var(--color-atomic-red-500)] text-text-on-fill",
    success: "bg-fill-success text-text-on-fill",
    warning: "bg-[var(--color-atomic-yellow-500)] text-text-on-fill-warning",
    teal: "bg-chart-2 text-text-on-fill",
    violet: "bg-chart-5 text-text-on-fill",
    pink: "bg-chart-6 text-text-on-fill",
  },
  weak: {
    brand: "bg-fill-brand-weak text-text-brand",
    neutral: "bg-fill-neutral-weak text-text-secondary",
    danger: "bg-fill-danger-weak text-text-danger",
    success: "bg-fill-success-weak text-text-success",
    warning: "bg-fill-warning-weak text-text-warning",
    teal: "bg-chart-2-weak text-chart-2",
    violet: "bg-chart-5-weak text-chart-5",
    pink: "bg-chart-6-weak text-chart-6",
  },
};

export interface BadgeProps extends ComponentProps<"span"> {
  /** `fill`은 진한 배경(가장 눈에 띔), `weak`는 연한 배경. 기본 `fill` */
  variant?: BadgeVariant;
  /** 의미로 고른다: `brand` 강조 · `neutral` 일반 · `danger` 오류·임박 · `success` 완료 · `warning` 주의 · `teal` `violet` `pink` 의미 없는 분류용. 기본 `brand` */
  color?: BadgeColor;
  /** 높이 `sm` 20 · `md` 22 · `lg` 28px. 같은 화면에서는 하나로 맞춘다. 기본 `md`. 구간별로 바꾸려면 `{ base: "sm", tablet: "md" }` */
  size?: Responsive<BadgeSize>;
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
    <span
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap select-none",
        responsiveClasses<BadgeSize>(size, "md", sizeClasses),
        tones[variant][color],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
