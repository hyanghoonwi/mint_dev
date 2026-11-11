// 상태·이벤트를 직접 갖지 않아서 "use client"를 붙이지 않는다. 서버 컴포넌트에서 표시용으로 쓸 수 있고,
// `onClick`을 넘길 때만 클라이언트 컴포넌트 안에서 쓴다(Button과 같은 방식).
// Figma `Check Mark`(2200:7795) · `Check Mark Guidelines`(2200:7940).
// 목록에서 선택된 항목을 표시하는 체크 표시. 값을 고르는 폼 컨트롤은 Checkbox다.
import type { ComponentProps, ReactNode } from "react";
import { cn } from "../../utils/cn";
import {
  responsiveClasses,
  type Responsive,
  type ResponsiveClassTable,
} from "../../utils/responsive";

/** 눌리는 CheckMark가 스크린리더에 읽히는 역할. `option`은 `aria-selected`, 나머지는 `aria-checked`로 상태를 알린다 */
/** Figma Size: XSmall(아이콘 16) · Small(20, 기본) · Medium(24) · Large(32) */
export type CheckMarkSize = "xs" | "sm" | "md" | "lg";

export type CheckMarkRole = "checkbox" | "radio" | "option" | "menuitemcheckbox" | "menuitemradio";

export interface CheckMarkProps extends Omit<
  ComponentProps<"button">,
  "children" | "role" | "type"
> {
  /** 선택 여부. 선택되면 체크가 브랜드 색으로 바뀐다. 기본 `false` */
  checked?: boolean;
  /** 레이블. 없으면 체크만 보이므로 `aria-label`을 준다 */
  children?: ReactNode;
  /**
   * `xs` 아이콘 16 · `sm` 20(기본) · `md` 24 · `lg` 32. 글자와 높이(기본 40, `lg` 48)도 함께 바뀐다.
   * 구간별로 바꾸려면 객체를 준다: `{ base: "md", desktop: "sm" }`
   */
  size?: Responsive<CheckMarkSize>;
  /** 바깥 여백(8px)을 없앤 촘촘한 모양. 촘촘한 목록에서만 쓴다. 기본 `false` */
  tight?: boolean;
  /** 누를 수 없는 상태 */
  disabled?: boolean;
  /** 눌리는 CheckMark의 역할. 기본 `checkbox`. 목록(listbox) 안이면 `option`, 메뉴 안이면 `menuitemcheckbox`·`menuitemradio` */
  role?: CheckMarkRole;
}

// 크기별 아이콘·글자(Figma 2258:28358). 글자 크기는 MINT 글자 스타일 중 Figma 값에 가장 가까운 것을 쓴다:
// XSmall 14/20 → body-4(14/22) · Small 16/24 → body-2 · Medium 18/28 → body-1(17/28) · Large 20/30 → heading-2-medium(20/30)
// (Figma가 18·20px Regular를 쓰지만 MINT 글자 표에 같은 굵기·크기가 없다)
const lookClasses: ResponsiveClassTable<CheckMarkSize> = {
  base: {
    xs: "[&_svg]:size-4 text-body-4-regular",
    sm: "[&_svg]:size-5 text-body-2-regular",
    md: "[&_svg]:size-6 text-body-1-regular",
    lg: "[&_svg]:size-8 text-heading-2-medium",
  },
  tablet: {
    xs: "tablet:[&_svg]:size-4 tablet:text-body-4-regular",
    sm: "tablet:[&_svg]:size-5 tablet:text-body-2-regular",
    md: "tablet:[&_svg]:size-6 tablet:text-body-1-regular",
    lg: "tablet:[&_svg]:size-8 tablet:text-heading-2-medium",
  },
  desktop: {
    xs: "desktop:[&_svg]:size-4 desktop:text-body-4-regular",
    sm: "desktop:[&_svg]:size-5 desktop:text-body-2-regular",
    md: "desktop:[&_svg]:size-6 desktop:text-body-1-regular",
    lg: "desktop:[&_svg]:size-8 desktop:text-heading-2-medium",
  },
};

// 기본 모양의 높이(Figma: XSmall·Small·Medium 40 · Large 48). tight는 높이를 정하지 않고 내용 높이를 따른다
const heightClasses: ResponsiveClassTable<CheckMarkSize> = {
  base: {
    xs: "h-10",
    sm: "h-10",
    md: "h-10",
    lg: "h-12",
  },
  tablet: {
    xs: "tablet:h-10",
    sm: "tablet:h-10",
    md: "tablet:h-10",
    lg: "tablet:h-12",
  },
  desktop: {
    xs: "desktop:h-10",
    sm: "desktop:h-10",
    md: "desktop:h-10",
    lg: "desktop:h-12",
  },
};

// Figma 체크 아이콘(2px 선, 20 기준). 크기는 위 표의 `[&_svg]:size-*`, 색은 currentColor라 글자색 토큰으로 바꾼다
function CheckIcon({ className }: { className: string }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
      className={cn("shrink-0", className)}
    >
      <path
        d="M4.16667 10L8.33333 14.1667L15.8333 5.83333"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** 목록에서 선택된 항목을 표시하는 체크 표시. `onClick`을 주면 항목 전체가 눌리는 버튼이 된다 */
export function CheckMark({
  checked = false,
  children,
  size = "sm",
  tight = false,
  disabled = false,
  role = "checkbox",
  onClick,
  className,
  ...props
}: CheckMarkProps) {
  // 아이콘 색: 체크 안 됨 회색 → 체크 브랜드색. 누르는 동안(hover 포함) 한 단계 진하게, 비활성은 연한 회색
  const iconColor = disabled
    ? "text-icon-disabled"
    : checked
      ? "text-icon-brand group-hover/check:text-icon-brand-pressed group-active/check:text-icon-brand-pressed"
      : "text-icon-secondary group-hover/check:text-icon-default group-active/check:text-icon-default";

  const content = (
    <>
      <CheckIcon className={cn("transition-colors", iconColor)} />
      {children != null && (
        <span
          className={cn("whitespace-nowrap", disabled ? "text-text-disabled" : "text-text-primary")}
        >
          {children}
        </span>
      )}
    </>
  );

  const layout = cn(
    "group/check inline-flex items-center gap-2 text-left",
    responsiveClasses<CheckMarkSize>(size, "sm", lookClasses),
    tight ? "p-0" : cn("px-2", responsiveClasses<CheckMarkSize>(size, "sm", heightClasses)),
    className,
  );

  // 눌리지 않는 표시용: 체크는 장식이고, 선택 여부는 감싸는 목록이 aria-selected 등으로 알린다
  if (!onClick) {
    return (
      <span className={layout} data-checked={checked || undefined}>
        {content}
      </span>
    );
  }

  const state = role === "option" ? { "aria-selected": checked } : { "aria-checked": checked };

  return (
    <button
      type="button"
      role={role}
      {...state}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        layout,
        "relative cursor-pointer rounded-8 disabled:cursor-not-allowed",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus",
        // Figma 접근성: 터치 영역은 44px 이상. 보이는 높이(기본 40·48 · tight 20~32)는 그대로 두고 터치 화면에서 눌림 영역만 44px로 넓힌다
        "pointer-coarse:before:absolute pointer-coarse:before:inset-x-0 pointer-coarse:before:top-1/2 pointer-coarse:before:h-11 pointer-coarse:before:-translate-y-1/2",
      )}
      {...props}
    >
      {content}
    </button>
  );
}
