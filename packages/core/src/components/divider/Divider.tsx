// 상태·이벤트가 없어서 "use client"를 붙이지 않는다. 서버 컴포넌트에서도 그대로 쓸 수 있다.
// 내용을 시각적으로 나누는 선. Figma `Divider`(node 2291:34476).
// 장식이라 보조기기에서 읽지 않는다(aria-hidden). 나뉜 내용은 제목이나 글자로 알린다.
import type { ComponentProps } from "react";
import { cn } from "../../utils/cn";

export type DividerOrientation = "horizontal" | "vertical";
export type DividerVariant = "default" | "strong" | "thick";

const colorClasses: Record<DividerVariant, string> = {
  default: "bg-border-default",
  strong: "bg-border-strong",
  // 8px 띠는 선 색이 아니라 낮은 배경색(gray-100)이다
  thick: "bg-background-lower",
};

export interface DividerProps extends Omit<ComponentProps<"div">, "children"> {
  /** `horizontal`은 위아래를, `vertical`은 좌우를 나눈다. 기본 `horizontal` */
  orientation?: DividerOrientation;
  /** `default` 일반 구분 · `strong` 더 또렷하게 · `thick` 8px 띠(영역 구분, 가로선만). 기본 `default` */
  variant?: DividerVariant;
  /** 좌우에 20px 여백(가로선만). 기본 `false` */
  inset?: boolean;
}

/**
 * 가로선은 부모 폭을 채우고, 세로선은 flex 줄 안에서 높이를 채운다(`self-stretch`).
 * 세로선을 flex 밖에서 쓰면 `className`으로 높이(`h-*`)를 준다.
 */
export function Divider({
  orientation = "horizontal",
  variant = "default",
  inset = false,
  className,
  ...props
}: DividerProps) {
  const vertical = orientation === "vertical";
  // thick·inset은 가로선에만 있다. 세로선에 주면 default 선으로 그린다
  const tone = vertical && variant === "thick" ? "default" : variant;
  return (
    <div
      aria-hidden="true"
      className={cn(
        "shrink-0 self-stretch",
        vertical ? "w-px" : tone === "thick" ? "h-2" : "h-px",
        !vertical && inset && "mx-5",
        colorClasses[tone],
        className,
      )}
      {...props}
    />
  );
}
