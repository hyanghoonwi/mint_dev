// 상태·이벤트가 없어서 "use client"를 붙이지 않는다. 서버 컴포넌트에서도 그대로 쓸 수 있다.
import type { ComponentProps, ReactElement } from "react";
import { cn } from "../../utils/cn";

/** Figma 아이콘 컴포넌트의 Size 속성: 16 · 20 · 24px. 16과 20은 24px 아이콘을 비율대로 줄인 것이다. */
export type IconSize = 16 | 20 | 24;

/** Figma 아이콘 컴포넌트의 Style 속성: 선(Line, Regular 굵기) · 채움(Fill) */
export type IconVariant = "line" | "fill";

export interface IconProps extends Omit<
  ComponentProps<"svg">,
  "children" | "width" | "height" | "viewBox" | "fill"
> {
  /** 크기(px). 기본 24 */
  size?: IconSize;
  /** 선 또는 채움. 기본 `line` */
  variant?: IconVariant;
}

export type IconComponent = (props: IconProps) => ReactElement;

/**
 * 아이콘 컴포넌트를 만든다. 아이콘마다 선(line)·채움(fill) path 하나씩을 가진다.
 *  - 색은 `currentColor`라서 글자색 클래스로 지정한다(예: `text-text-secondary`).
 *  - `aria-label`이 없으면 장식용으로 보고 스크린리더가 읽지 않게 한다(`aria-hidden`).
 *    아이콘만으로 뜻을 전하는 곳(아이콘 버튼 등)에는 `aria-label`을 준다.
 */
export function createIcon(displayName: string, line: string, fill: string): IconComponent {
  function Icon({
    size = 24,
    variant = "line",
    className,
    ref,
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledby,
    ...props
  }: IconProps) {
    const labelled = ariaLabel !== undefined || ariaLabelledby !== undefined;
    return (
      <svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 256 256"
        width={size}
        height={size}
        fill="currentColor"
        role={labelled ? "img" : undefined}
        aria-hidden={labelled ? undefined : true}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledby}
        className={cn("shrink-0", className)}
        {...props}
      >
        <path d={variant === "fill" ? fill : line} />
      </svg>
    );
  }
  Icon.displayName = displayName;
  return Icon;
}
