"use client";

// 켜짐 상태를 직접 가질 수 있어서(defaultActive) 클라이언트 컴포넌트다.
// Figma `Toggle Icon`(2316:39931) · `Toggle Icon Guidelines`(2316:40004).
// 눌러서 켜고 끄는 아이콘 하나. 관심 코인·좋아요·북마크처럼 상태를 유지한다.
// 꺼지면 선(Line) 아이콘 `icon-default`, 켜지면 채움(Fill) 아이콘 `icon-brand`. hover·누름은 원형 `fill-neutral-weak` 바탕.
// 접근성: 켜짐 상태는 `aria-pressed`로 읽힌다. 이름(aria-label)은 상태와 관계없이 같게 준다("관심 코인").
import {
  cloneElement,
  isValidElement,
  useState,
  type ComponentProps,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
} from "react";
import { cn } from "../../utils/cn";
import {
  responsiveClasses,
  type Responsive,
  type ResponsiveClassTable,
} from "../../utils/responsive";
import type { IconProps } from "../icon/Icon";

export type ToggleIconSize = "xs" | "sm" | "md" | "lg";

// 크기는 IconButton과 같다: xs 28 · sm 32 · md 40 · lg 48, 아이콘 14 · 16 · 20 · 24.
// 터치 화면에서 xs·sm은 보이는 크기는 그대로 두고 눌림 영역만 44px로 넓힌다(md·lg로 바뀌는 구간에서는 넓힌 영역을 없앤다)
const sizeClasses: ResponsiveClassTable<ToggleIconSize> = {
  base: {
    xs: "size-7 [&_svg]:size-[14px] pointer-coarse:before:absolute pointer-coarse:before:top-1/2 pointer-coarse:before:left-1/2 pointer-coarse:before:size-11 pointer-coarse:before:-translate-x-1/2 pointer-coarse:before:-translate-y-1/2",
    sm: "size-8 [&_svg]:size-4 pointer-coarse:before:absolute pointer-coarse:before:top-1/2 pointer-coarse:before:left-1/2 pointer-coarse:before:size-11 pointer-coarse:before:-translate-x-1/2 pointer-coarse:before:-translate-y-1/2",
    md: "size-10 [&_svg]:size-5 pointer-coarse:before:content-none",
    lg: "size-12 [&_svg]:size-6 pointer-coarse:before:content-none",
  },
  tablet: {
    xs: "tablet:size-7 tablet:[&_svg]:size-[14px] tablet:pointer-coarse:before:absolute tablet:pointer-coarse:before:top-1/2 tablet:pointer-coarse:before:left-1/2 tablet:pointer-coarse:before:size-11 tablet:pointer-coarse:before:-translate-x-1/2 tablet:pointer-coarse:before:-translate-y-1/2",
    sm: "tablet:size-8 tablet:[&_svg]:size-4 tablet:pointer-coarse:before:absolute tablet:pointer-coarse:before:top-1/2 tablet:pointer-coarse:before:left-1/2 tablet:pointer-coarse:before:size-11 tablet:pointer-coarse:before:-translate-x-1/2 tablet:pointer-coarse:before:-translate-y-1/2",
    md: "tablet:size-10 tablet:[&_svg]:size-5 tablet:pointer-coarse:before:content-none",
    lg: "tablet:size-12 tablet:[&_svg]:size-6 tablet:pointer-coarse:before:content-none",
  },
  desktop: {
    xs: "desktop:size-7 desktop:[&_svg]:size-[14px] desktop:pointer-coarse:before:absolute desktop:pointer-coarse:before:top-1/2 desktop:pointer-coarse:before:left-1/2 desktop:pointer-coarse:before:size-11 desktop:pointer-coarse:before:-translate-x-1/2 desktop:pointer-coarse:before:-translate-y-1/2",
    sm: "desktop:size-8 desktop:[&_svg]:size-4 desktop:pointer-coarse:before:absolute desktop:pointer-coarse:before:top-1/2 desktop:pointer-coarse:before:left-1/2 desktop:pointer-coarse:before:size-11 desktop:pointer-coarse:before:-translate-x-1/2 desktop:pointer-coarse:before:-translate-y-1/2",
    md: "desktop:size-10 desktop:[&_svg]:size-5 desktop:pointer-coarse:before:content-none",
    lg: "desktop:size-12 desktop:[&_svg]:size-6 desktop:pointer-coarse:before:content-none",
  },
};

export interface ToggleIconProps extends Omit<
  ComponentProps<"button">,
  "children" | "aria-pressed" | "onChange"
> {
  /**
   * 아이콘(`<StarIcon />`). 꺼지면 선 모양, 켜지면 같은 아이콘의 채움 모양(`variant="fill"`)으로 바뀐다.
   * 크기·색은 컴포넌트가 맞춘다
   */
  icon: ReactElement<IconProps>;
  /** 켜졌을 때 따로 보여 줄 아이콘. 생략하면 `icon`의 채움 모양을 쓴다 */
  activeIcon?: ReactNode;
  /** 이름(필수). 상태와 관계없이 같은 이름을 준다. 예: "관심 코인" */
  "aria-label": string;
  /** 켜짐 상태(제어). 생략하면 컴포넌트가 직접 상태를 가진다 */
  active?: boolean;
  /** 처음 켜짐 상태(비제어). 기본 false */
  defaultActive?: boolean;
  /** 눌러서 상태가 바뀔 때 새 값으로 호출된다 */
  onActiveChange?: (active: boolean) => void;
  /**
   * `xs` 28 · `sm` 32 · `md` 40(기본) · `lg` 48. 카드 위는 `md`, 목록은 `sm`.
   * 구간별로 바꾸려면 객체를 준다: `{ base: "sm", desktop: "md" }`. 빈 구간은 앞 구간 값을 이어받는다
   */
  size?: Responsive<ToggleIconSize>;
}

/** 눌러서 켜고 끄는 아이콘. 관심 코인·좋아요·북마크처럼 상태를 유지한다 */
export function ToggleIcon({
  icon,
  activeIcon,
  active,
  defaultActive = false,
  onActiveChange,
  size = "md",
  className,
  type = "button",
  onClick,
  ...props
}: ToggleIconProps) {
  const [own, setOwn] = useState(defaultActive);
  const isActive = active ?? own;

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);
    if (event.defaultPrevented) return;
    const next = !isActive;
    if (active === undefined) setOwn(next);
    onActiveChange?.(next);
  };

  const shown = isActive
    ? (activeIcon ?? (isValidElement(icon) ? cloneElement(icon, { variant: "fill" }) : icon))
    : icon;

  return (
    <button
      type={type}
      aria-pressed={isActive}
      onClick={handleClick}
      className={cn(
        "relative inline-flex shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors",
        "hover:bg-fill-neutral-weak active:bg-fill-neutral-weak",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus",
        "disabled:cursor-not-allowed disabled:bg-transparent disabled:text-icon-disabled",
        "[&_svg]:pointer-events-none [&_svg]:shrink-0",
        isActive ? "text-icon-brand" : "text-icon-default",
        responsiveClasses<ToggleIconSize>(size, "md", sizeClasses),
        className,
      )}
      {...props}
    >
      {shown}
    </button>
  );
}
