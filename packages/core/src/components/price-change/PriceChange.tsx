// 상태·이벤트가 없어서 "use client"를 붙이지 않는다. 서버 컴포넌트에서도 그대로 쓸 수 있다.
// 가격이 오르내린 정도를 보여 주는 표시 전용 부품이다. Figma `Price Change`(node 2289:34109).
// 금액(amount)에는 화살표(▲ ▼, 보합은 가로선)만, 퍼센트(percent)에는 부호(+, -)만 붙인다(2026-11-11 정책).
import type { ComponentProps, ReactNode } from "react";
import { cn } from "../../utils/cn";
import {
  responsiveClasses,
  type Responsive,
  type ResponsiveClassTable,
} from "../../utils/responsive";

export type PriceChangeDirection = "up" | "down" | "flat";
export type PriceChangeVariant = "text" | "weak";
export type PriceChangeType = "amount" | "percent";
export type PriceChangeSize = "sm" | "md" | "lg";

// 글자: sm Caption 1 Medium(12/18, weak는 Label 3 Medium 12/16) · md Body 4 SemiBold(14/22) · lg Body 2 SemiBold(16/24).
// 화살표와 숫자 사이 2 · 3 · 4px, weak 패딩 6×2 · 8×3 · 10×4는 Figma 수치를 그대로 옮긴 임의 값이다.
// 값 하나 또는 구간별 객체를 받는다(utils/responsive.ts)
const textSizeClasses: ResponsiveClassTable<PriceChangeSize> = {
  base: {
    sm: "gap-[2px] text-caption-1-medium",
    md: "gap-[3px] text-body-4-semibold",
    lg: "gap-1 text-body-2-semibold",
  },
  tablet: {
    sm: "tablet:gap-[2px] tablet:text-caption-1-medium",
    md: "tablet:gap-[3px] tablet:text-body-4-semibold",
    lg: "tablet:gap-1 tablet:text-body-2-semibold",
  },
  desktop: {
    sm: "desktop:gap-[2px] desktop:text-caption-1-medium",
    md: "desktop:gap-[3px] desktop:text-body-4-semibold",
    lg: "desktop:gap-1 desktop:text-body-2-semibold",
  },
};

const weakSizeClasses: ResponsiveClassTable<PriceChangeSize> = {
  base: {
    sm: "gap-[2px] rounded-4 px-[6px] py-[2px] text-label-3-medium",
    md: "gap-[3px] rounded-8 px-2 py-[3px] text-body-4-semibold",
    lg: "gap-1 rounded-8 px-[10px] py-1 text-body-2-semibold",
  },
  tablet: {
    sm: "tablet:gap-[2px] tablet:rounded-4 tablet:px-[6px] tablet:py-[2px] tablet:text-label-3-medium",
    md: "tablet:gap-[3px] tablet:rounded-8 tablet:px-2 tablet:py-[3px] tablet:text-body-4-semibold",
    lg: "tablet:gap-1 tablet:rounded-8 tablet:px-[10px] tablet:py-1 tablet:text-body-2-semibold",
  },
  desktop: {
    sm: "desktop:gap-[2px] desktop:rounded-4 desktop:px-[6px] desktop:py-[2px] desktop:text-label-3-medium",
    md: "desktop:gap-[3px] desktop:rounded-8 desktop:px-2 desktop:py-[3px] desktop:text-body-4-semibold",
    lg: "desktop:gap-1 desktop:rounded-8 desktop:px-[10px] desktop:py-1 desktop:text-body-2-semibold",
  },
};

const colorClasses: Record<PriceChangeDirection, string> = {
  up: "text-text-up",
  down: "text-text-down",
  flat: "text-text-flat",
};

const weakClasses: Record<PriceChangeDirection, string> = {
  up: "bg-fill-up-weak",
  down: "bg-fill-down-weak",
  flat: "bg-fill-neutral-weak",
};

// 스크린리더용 방향. 화살표는 그림이라 읽히지 않아서 글자로 함께 알린다
const directionLabels: Record<PriceChangeDirection, string> = {
  up: "상승",
  down: "하락",
  flat: "보합",
};

/** 금액 표시(7×5.5 삼각형, 보합은 7×1.5 가로선). 크기와 관계없이 같다 */
function Arrow({ direction }: { direction: PriceChangeDirection }) {
  if (direction === "flat") {
    return (
      <span aria-hidden="true" className="h-[1.5px] w-[7px] shrink-0 rounded-[1px] bg-current" />
    );
  }
  return (
    <svg
      aria-hidden="true"
      width="7"
      height="5.5"
      viewBox="0 0 7 5.5"
      fill="none"
      className={cn("shrink-0", direction === "up" ? "text-icon-up" : "text-icon-down")}
    >
      <path
        d={direction === "up" ? "M0 5.5L3.5 0L7 5.5H0Z" : "M0 0H7L3.5 5.5L0 0Z"}
        fill="currentColor"
      />
    </svg>
  );
}

export interface PriceChangeProps extends Omit<ComponentProps<"span">, "children"> {
  /** 오름 `up`(빨강) · 내림 `down`(파랑) · 변동 없음 `flat`(회색) */
  direction: PriceChangeDirection;
  /** `amount`는 화살표(▲ ▼ −), `percent`는 부호(+, -)를 붙인다. 기본 `amount` */
  type?: PriceChangeType;
  /** `text`는 글자만, `weak`는 연한 배경. 기본 `text` */
  variant?: PriceChangeVariant;
  /** 글자 `sm` 12 · `md` 14 · `lg` 16px. 기본 `md`. 구간별로 바꾸려면 `{ base: "sm", desktop: "md" }` */
  size?: Responsive<PriceChangeSize>;
  /** 숫자만 넣는다(`"1,200"`, `"3.42%"`). 화살표·부호는 컴포넌트가 붙인다 */
  children: ReactNode;
}

/** 시세가 오르내린 정도. 금액은 화살표, 퍼센트는 부호로 방향을 알린다 */
export function PriceChange({
  direction,
  type = "amount",
  variant = "text",
  size,
  className,
  children,
  ...props
}: PriceChangeProps) {
  const sign =
    type === "percent" ? (direction === "up" ? "+" : direction === "down" ? "-" : "") : "";
  return (
    <span
      className={cn(
        "inline-flex items-center whitespace-nowrap tabular-nums",
        responsiveClasses<PriceChangeSize>(
          size,
          "md",
          variant === "weak" ? weakSizeClasses : textSizeClasses,
        ),
        colorClasses[direction],
        variant === "weak" && weakClasses[direction],
        className,
      )}
      {...props}
    >
      <span className="sr-only">{directionLabels[direction]} </span>
      {type === "amount" && <Arrow direction={direction} />}
      <span>
        {sign}
        {children}
      </span>
    </span>
  );
}
