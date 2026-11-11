// 상태·이벤트가 없어서 "use client"를 붙이지 않는다. 서버 컴포넌트(loading.tsx 등)에서 그대로 쓸 수 있다.
// 콘텐츠가 들어올 자리를 미리 보여 주는 회색 덩어리. Figma `Skeleton Text`(2200:2694) · `Skeleton Rectangle`(2200:2807) · `Skeleton Circle`(2200:2859).
// 모양만 보여 주는 장식이라 모두 aria-hidden이다. 불러오는 중이라는 사실은 감싸는 영역(aria-busy)이 알린다.
// 빛 띠가 지나가는 효과(shimmer)는 CSS 애니메이션이라 JS가 필요 없다. 움직임 줄이기 설정이면 띠 없이 멈춘 회색 덩어리만 보인다.
import type { ComponentProps, CSSProperties } from "react";
import { cn } from "../../utils/cn";

export type SkeletonColor = "normal" | "white";

// normal: 흰 바탕 위(fill/neutral-weak) · white: 회색 바탕 위(흰색).
// 지나가는 띠는 바탕보다 한 단계 진한 토큰 색이다(--mint-skeleton-shine): normal → neutral-medium · white → neutral-weak
const colors: Record<SkeletonColor, string> = {
  normal: "bg-fill-neutral-weak [--mint-skeleton-shine:var(--mint-fill-neutral-medium)]",
  white: "bg-fill-white [--mint-skeleton-shine:var(--mint-fill-neutral-weak)]",
};

/** 숫자는 px, 문자열은 그대로(`"100%"`) */
type Length = number | string;

interface SkeletonBaseProps extends Omit<ComponentProps<"div">, "children" | "color"> {
  /** `normal` 흰 바탕 위 회색 · `white` 회색 바탕 위 흰색. 기본 `normal` */
  color?: SkeletonColor;
  /** 빛 띠가 왼쪽에서 오른쪽으로 지나가는 효과(shimmer). 기본 `true`. 움직임 줄이기 설정을 켠 사용자에게는 멈춘다 */
  animate?: boolean;
}

// 200% 폭의 그라데이션(가운데만 띠 색)을 깔고 위치를 옮긴다. 움직임 줄이기면 그라데이션과 애니메이션을 모두 끈다
const shimmer =
  "[background-image:linear-gradient(90deg,transparent_0%,var(--mint-skeleton-shine)_50%,transparent_100%)] [background-size:200%_100%] [background-repeat:no-repeat] animate-[mint-shimmer_1.6s_ease-in-out_infinite] motion-reduce:animate-none motion-reduce:[background-image:none]";

export type SkeletonTextLength = "100%" | "75%" | "50%" | "25%";
export type SkeletonTextAlign = "leading" | "center" | "trailing";

const textAligns: Record<SkeletonTextAlign, string> = {
  leading: "justify-start",
  center: "justify-center",
  trailing: "justify-end",
};

export interface SkeletonTextProps extends SkeletonBaseProps {
  /** 줄 길이(줄 칸 폭에 대한 비율). 기본 `"100%"`. 여러 줄은 길이를 달리해 쌓는다 */
  length?: SkeletonTextLength;
  /** 짧은 줄을 칸 안의 어디에 둘지. 기본 `leading`(왼쪽) */
  align?: SkeletonTextAlign;
  /** 줄 칸의 폭. 기본 `"100%"`(부모 폭) */
  width?: Length;
  /** 줄 높이. 기본 16 */
  height?: Length;
}

/** 텍스트 한 줄 자리. 여러 줄은 쌓아서 만든다 */
export function SkeletonText({
  length = "100%",
  align = "leading",
  color = "normal",
  animate = true,
  width = "100%",
  height = 16,
  className,
  style,
  ...props
}: SkeletonTextProps) {
  return (
    <div
      aria-hidden="true"
      className={cn("flex max-w-full shrink-0", textAligns[align], className)}
      style={{ width, ...style }}
      {...props}
    >
      <div
        className={cn("rounded-4", colors[color], animate && shimmer)}
        style={{ width: length, height }}
      />
    </div>
  );
}

export interface SkeletonRectangleProps extends SkeletonBaseProps {
  /** 모서리를 둥글게(8px). 숫자를 주면 그 값(px)으로 둥글게. 기본 `false` */
  radius?: boolean | number;
  /** 폭. 기본 `"100%"`(부모 폭) */
  width?: Length;
  /** 높이. 기본 80 */
  height?: Length;
}

/** 이미지·썸네일·카드처럼 네모난 콘텐츠 자리 */
export function SkeletonRectangle({
  radius = false,
  color = "normal",
  animate = true,
  width = "100%",
  height = 80,
  className,
  style,
  ...props
}: SkeletonRectangleProps) {
  const radiusStyle: CSSProperties = typeof radius === "number" ? { borderRadius: radius } : {};
  return (
    <div
      aria-hidden="true"
      className={cn(
        "max-w-full shrink-0",
        colors[color],
        animate && shimmer,
        radius === true && "rounded-8",
        className,
      )}
      style={{ width, height, ...radiusStyle, ...style }}
      {...props}
    />
  );
}

export type SkeletonCircleSize = 24 | 32 | 40 | 48 | 64;

export interface SkeletonCircleProps extends SkeletonBaseProps {
  /** 지름(px). `Avatar` 크기와 같다. 기본 40 */
  size?: SkeletonCircleSize | number;
}

/** 아바타·아이콘처럼 동그란 콘텐츠 자리 */
export function SkeletonCircle({
  size = 40,
  color = "normal",
  animate = true,
  className,
  style,
  ...props
}: SkeletonCircleProps) {
  return (
    <div
      aria-hidden="true"
      className={cn("shrink-0 rounded-full", colors[color], animate && shimmer, className)}
      style={{ width: size, height: size, ...style }}
      {...props}
    />
  );
}
