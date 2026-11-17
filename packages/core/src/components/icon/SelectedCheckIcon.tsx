// 상태·이벤트가 없어서 "use client"를 붙이지 않는다. 서버 컴포넌트에서도 그대로 쓸 수 있다.
// Figma `Selected Check`(node 2204:12343): 목록에서 고른 항목 끝에 붙는 체크(20px, 선 2, 둥근 끝). Menu·Select·CheckMark가 같은 체크를 쓴다.
// Phosphor `check`(선 1.25 상당)와 굵기가 달라서 `icons.json` 생성 목록에 없고, 디자인 시스템 전용 아이콘으로 따로 등록한다.
// 그래서 `icons.generated.ts`(생성물)에 넣지 않고 이 파일에서 직접 관리한다. 크기는 20 하나이고 색은 글자색을 따른다
// (보통 `text-icon-brand`). 이름 규칙은 다른 아이콘과 같다(Figma 이름 `Selected Check` → `SelectedCheckIcon`).
import type { ComponentProps } from "react";
import { cn } from "../../utils/cn";

export interface SelectedCheckIconProps extends Omit<
  ComponentProps<"svg">,
  "children" | "width" | "height" | "viewBox" | "fill" | "stroke"
> {}

/**
 * 고른 항목 표시 체크(20px 고정). 색은 `currentColor`라서 글자색 클래스로 지정한다(예: `text-icon-brand`).
 * `aria-label`이 없으면 장식용으로 보고 스크린리더가 읽지 않게 한다(`aria-hidden`).
 */
export function SelectedCheckIcon({
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledby,
  className,
  ref,
  ...props
}: SelectedCheckIconProps) {
  const labelled = ariaLabel !== undefined || ariaLabelledby !== undefined;
  return (
    <svg
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      width={20}
      height={20}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      role={labelled ? "img" : undefined}
      aria-hidden={labelled ? undefined : true}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledby}
      className={cn("shrink-0", className)}
      {...props}
    >
      <path d="M4.16667 10L8.33333 14.1667L15.8333 5.83333" />
    </svg>
  );
}
