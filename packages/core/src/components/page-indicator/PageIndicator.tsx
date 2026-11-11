// 표시 전용이라 "use client"를 붙이지 않는다. 서버 컴포넌트에서 그대로 쓸 수 있다.
// Figma `Page Indicator`(2204:17256) · `Page Indicator Guidelines`(2204:17435).
// 요소(배너·캐러셀·이미지 갤러리)의 현재 위치를 안내한다. 숫자로 알리는 Counter(PageCounter)와 점으로 알리는 Dot(PageDots)이 있다.
// 위치를 바꾸는 동작은 넣지 않는다(표시 전용). 넘기기는 캐러셀 쪽이 맡는다.
import type { ComponentProps } from "react";
import { cn } from "../../utils/cn";

export type PageIndicatorSize = "md" | "sm";

interface PageIndicatorBase extends Omit<ComponentProps<"div">, "children"> {
  /** 현재 위치(1부터) */
  current: number;
  /** 전체 개수 */
  total: number;
  /** `md` 기본 · `sm` 작게 */
  size?: PageIndicatorSize;
}

export interface PageCounterProps extends PageIndicatorBase {
  /** `normal` 진한 바탕·흰 글자(기본, 이미지 위) · `alternative` 연한 회색 바탕·회색 글자 */
  variant?: "normal" | "alternative";
}

/** 현재 / 전체를 숫자로 보여 준다(예: 1 / 10). 개수 제한이 없어서 이미지가 많은 갤러리에 쓴다 */
export function PageCounter({
  current,
  total,
  variant = "normal",
  size = "md",
  className,
  ...props
}: PageCounterProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center justify-center rounded-full whitespace-nowrap",
        size === "md"
          ? "min-h-7 px-3 text-label-2-semibold"
          : "min-h-[22px] px-2 text-label-3-semibold",
        variant === "normal"
          ? "bg-fill-neutral text-text-on-fill"
          : "bg-fill-neutral-weak text-text-secondary",
        className,
      )}
      // 화면은 "1 / 10", 스크린리더는 "10개 중 1번째"로 읽는다
      role="img"
      aria-label={`${total}개 중 ${current}번째`}
      {...props}
    >
      {current} / {total}
    </div>
  );
}

export interface PageDotsProps extends PageIndicatorBase {
  /** `normal` 밝은 바탕 위(기본) · `white` 이미지 위(현재 점 흰색, 나머지 흰색 40%) */
  variant?: "normal" | "white";
}

/** 점으로 위치를 보여 준다. 2~7개일 때만 쓰고, 8개 이상이면 `PageCounter`를 쓴다 */
export function PageDots({
  current,
  total,
  variant = "normal",
  size = "md",
  className,
  ...props
}: PageDotsProps) {
  return (
    <div
      className={cn("inline-flex items-center", size === "md" ? "gap-2" : "gap-[6px]", className)}
      role="img"
      aria-label={`${total}개 중 ${current}번째`}
      {...props}
    >
      {Array.from({ length: total }, (_, index) => {
        const active = index + 1 === current;
        return (
          <span
            key={index}
            className={cn(
              "shrink-0 rounded-full transition-colors",
              size === "md" ? "size-2" : "size-[6px]",
              variant === "normal"
                ? active
                  ? "bg-fill-neutral"
                  : "bg-fill-neutral-medium"
                : cn("bg-fill-white", !active && "opacity-40"),
            )}
          />
        );
      })}
    </div>
  );
}
