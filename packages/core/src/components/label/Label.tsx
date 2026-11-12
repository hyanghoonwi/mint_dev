// 상태·이벤트가 없어서 "use client"를 붙이지 않는다. 서버 컴포넌트에서도 그대로 쓸 수 있다.
// Figma `Label`(2332:41220) · `Label Guidelines`(2332:41302).
// 입력 칸 위에 붙는 이름. 무엇을 입력하는지 알려 주고, 예시는 Placeholder가 맡는다.
// 글자는 `<label>`이라 `htmlFor`로 입력 칸과 이어 두면 이름을 눌러도 입력 칸에 포커스가 간다.
// 도움말 아이콘은 `<label>` 밖에 둔다(라벨 안에 누르는 요소를 넣지 않는다).
import type { ComponentProps, ReactNode } from "react";
import { cn } from "../../utils/cn";
import { QuestionIcon } from "../icon/icons.generated";
import {
  responsiveClasses,
  type Responsive,
  type ResponsiveClassTable,
} from "../../utils/responsive";

export type LabelSize = "sm" | "md" | "lg";

export interface LabelProps extends Omit<ComponentProps<"div">, "children"> {
  /** 라벨 글자. 이름, 휴대폰 번호처럼 명사로 짧게 쓴다 */
  children: ReactNode;
  /** 이어 줄 입력 칸의 `id`. 주면 라벨을 눌러도 입력 칸이 선택된다 */
  htmlFor?: string;
  /**
   * `sm` 12 · `md` 14(기본) · `lg` 16(글자 크기). 입력 칸 크기에 맞춰 고른다.
   * 구간별로 바꾸려면 객체를 준다: `{ base: "md", desktop: "lg" }`
   */
  size?: Responsive<LabelSize>;
  /** 필수 입력이면 글자 옆에 빨간 `*`를 붙인다. 스크린리더는 "(필수)"로 읽는다 */
  required?: boolean;
  /** 입력 칸을 쓸 수 없을 때 글자색을 흐리게 한다 */
  disabled?: boolean;
  /**
   * 글자 오른쪽에 도움말 아이콘을 둔다. `true`면 물음표 아이콘(16)을 보이고,
   * 누르면 설명이 나오게 하려면 `Tooltip`으로 감싼 버튼 같은 요소를 직접 준다
   */
  helpIcon?: boolean | ReactNode;
}

// 글자: lg Label 1 SemiBold(16/20) · md Label 2 SemiBold(14/20) · sm Label 3 SemiBold(12/16)
const sizeClasses: ResponsiveClassTable<LabelSize> = {
  base: {
    lg: "text-label-1-semibold",
    md: "text-label-2-semibold",
    sm: "text-label-3-semibold",
  },
  tablet: {
    lg: "tablet:text-label-1-semibold",
    md: "tablet:text-label-2-semibold",
    sm: "tablet:text-label-3-semibold",
  },
  desktop: {
    lg: "desktop:text-label-1-semibold",
    md: "desktop:text-label-2-semibold",
    sm: "desktop:text-label-3-semibold",
  },
};

// 필수 표시 칸: 폭 8, 높이 lg·md 8 · sm 12. `*`는 칸 아래에 맞춰져 글자 오른쪽 위로 올라가 보인다
const requiredClasses: ResponsiveClassTable<LabelSize> = {
  base: { lg: "h-2", md: "h-2", sm: "h-3" },
  tablet: { lg: "tablet:h-2", md: "tablet:h-2", sm: "tablet:h-3" },
  desktop: { lg: "desktop:h-2", md: "desktop:h-2", sm: "desktop:h-3" },
};

/** 입력 칸 위에 붙는 이름. 필수 표시와 도움말 아이콘을 붙일 수 있다 */
export function Label({
  children,
  htmlFor,
  size = "md",
  required = false,
  disabled = false,
  helpIcon = false,
  className,
  ...props
}: LabelProps) {
  return (
    <div className={cn("inline-flex items-center gap-1", className)} {...props}>
      <label
        htmlFor={htmlFor}
        className={cn(
          "inline-flex items-center gap-1 whitespace-nowrap",
          responsiveClasses<LabelSize>(size, "md", sizeClasses),
          disabled ? "text-text-disabled" : "text-text-strong",
        )}
      >
        {children}
        {required && (
          <>
            <span
              aria-hidden="true"
              className={cn(
                "flex w-2 flex-col justify-end text-label-3-medium text-text-danger",
                responsiveClasses<LabelSize>(size, "md", requiredClasses),
              )}
            >
              <span>*</span>
            </span>
            <span className="sr-only">(필수)</span>
          </>
        )}
      </label>
      {helpIcon !== false && helpIcon !== null && helpIcon !== undefined && (
        <span
          className={cn(
            "inline-flex shrink-0 items-center",
            disabled ? "text-icon-disabled" : "text-icon-secondary",
          )}
        >
          {helpIcon === true ? <QuestionIcon size={16} /> : helpIcon}
        </span>
      )}
    </div>
  );
}
