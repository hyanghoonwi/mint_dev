// 상태·이벤트 처리가 없어서 "use client"를 붙이지 않는다(Button과 같은 방식). 서버 컴포넌트에서도 그대로 쓸 수 있다.
// onClick은 사용하는 쪽이 클라이언트 컴포넌트에서 넘긴다. 이동이면 href(<a>), 동작이면 onClick(<button>)으로 구분한다.
// Figma `Text Button`(node 2301:34737) · `Text Button Guidelines`(2301:35218).
// 글자만 있는 가장 약한 행동. 평소에는 배경 없이 글자만 보이고, 누르는 동안(hover 포함)만 연한 박스가 생긴다.
// core는 next/link를 import하지 않는다. Next.js 링크가 필요하면 linkComponent={Link}로 넘긴다.
import type { ComponentProps, ElementType, ReactNode } from "react";
import { cn } from "../../utils/cn";
import {
  responsiveClasses,
  type Responsive,
  type ResponsiveClassTable,
} from "../../utils/responsive";
import { Circular } from "../circular/Circular";

export type TextButtonSize = "xs" | "sm" | "md" | "lg";
export type TextButtonColor = "primary" | "neutral";

// 높이 xs 20 · sm 24 · md 28 · lg 28. 글자 Label 3 · Label 3 · Label 2 · Label 1 Medium, 아이콘 16 · 16 · 16 · 20.
// xs의 패딩 6×2·모서리 6은 Figma 수치를 그대로 옮긴 임의 값이다. 값 하나 또는 구간별 객체를 받는다(utils/responsive.ts)
const boxSizeClasses: ResponsiveClassTable<TextButtonSize> = {
  base: {
    xs: "h-5 gap-1 rounded-[6px] px-[6px] py-[2px] text-label-3-medium [&_svg]:size-4",
    sm: "h-6 gap-1 rounded-8 px-2 py-1 text-label-3-medium [&_svg]:size-4",
    md: "h-7 gap-1 rounded-8 px-2 py-1 text-label-2-medium [&_svg]:size-4",
    lg: "h-7 gap-1 rounded-8 px-2 py-1 text-label-1-medium [&_svg]:size-5",
  },
  tablet: {
    xs: "tablet:h-5 tablet:gap-1 tablet:rounded-[6px] tablet:px-[6px] tablet:py-[2px] tablet:text-label-3-medium tablet:[&_svg]:size-4",
    sm: "tablet:h-6 tablet:gap-1 tablet:rounded-8 tablet:px-2 tablet:py-1 tablet:text-label-3-medium tablet:[&_svg]:size-4",
    md: "tablet:h-7 tablet:gap-1 tablet:rounded-8 tablet:px-2 tablet:py-1 tablet:text-label-2-medium tablet:[&_svg]:size-4",
    lg: "tablet:h-7 tablet:gap-1 tablet:rounded-8 tablet:px-2 tablet:py-1 tablet:text-label-1-medium tablet:[&_svg]:size-5",
  },
  desktop: {
    xs: "desktop:h-5 desktop:gap-1 desktop:rounded-[6px] desktop:px-[6px] desktop:py-[2px] desktop:text-label-3-medium desktop:[&_svg]:size-4",
    sm: "desktop:h-6 desktop:gap-1 desktop:rounded-8 desktop:px-2 desktop:py-1 desktop:text-label-3-medium desktop:[&_svg]:size-4",
    md: "desktop:h-7 desktop:gap-1 desktop:rounded-8 desktop:px-2 desktop:py-1 desktop:text-label-2-medium desktop:[&_svg]:size-4",
    lg: "desktop:h-7 desktop:gap-1 desktop:rounded-8 desktop:px-2 desktop:py-1 desktop:text-label-1-medium desktop:[&_svg]:size-5",
  },
};

const inlineSizeClasses: ResponsiveClassTable<TextButtonSize> = {
  base: {
    xs: "h-4 gap-1 text-label-3-medium [&_svg]:size-4",
    sm: "h-4 gap-1 text-label-3-medium [&_svg]:size-4",
    md: "h-5 gap-1 text-label-2-medium [&_svg]:size-4",
    lg: "h-5 gap-1 text-label-1-medium [&_svg]:size-5",
  },
  tablet: {
    xs: "tablet:h-4 tablet:gap-1 tablet:text-label-3-medium tablet:[&_svg]:size-4",
    sm: "tablet:h-4 tablet:gap-1 tablet:text-label-3-medium tablet:[&_svg]:size-4",
    md: "tablet:h-5 tablet:gap-1 tablet:text-label-2-medium tablet:[&_svg]:size-4",
    lg: "tablet:h-5 tablet:gap-1 tablet:text-label-1-medium tablet:[&_svg]:size-5",
  },
  desktop: {
    xs: "desktop:h-4 desktop:gap-1 desktop:text-label-3-medium desktop:[&_svg]:size-4",
    sm: "desktop:h-4 desktop:gap-1 desktop:text-label-3-medium desktop:[&_svg]:size-4",
    md: "desktop:h-5 desktop:gap-1 desktop:text-label-2-medium desktop:[&_svg]:size-4",
    lg: "desktop:h-5 desktop:gap-1 desktop:text-label-1-medium desktop:[&_svg]:size-5",
  },
};

// 색. hover와 pressed는 같다. 박스형은 연한 박스, inline은 글자 색만 바뀐다
const tones: Record<TextButtonColor, { normal: string; box: string; inline: string }> = {
  primary: {
    normal: "text-text-brand",
    box: "hover:bg-fill-brand-weak-pressed hover:text-text-brand-pressed active:bg-fill-brand-weak-pressed active:text-text-brand-pressed",
    inline: "hover:text-text-brand-pressed active:text-text-brand-pressed",
  },
  neutral: {
    normal: "text-text-secondary",
    box: "hover:bg-fill-neutral-weak-pressed hover:text-text-strong active:bg-fill-neutral-weak-pressed active:text-text-strong",
    inline: "hover:text-text-strong active:text-text-strong",
  },
};

export type TextButtonProps = Omit<ComponentProps<"button">, "color"> &
  Pick<ComponentProps<"a">, "href" | "target" | "rel"> & {
    /** `primary`는 브랜드 색, `neutral`은 회색 글자. 기본 `primary` */
    color?: TextButtonColor;
    /** 높이 xs 20 · sm 24 · md 28 · lg 28(글자 12 · 12 · 14 · 16). 본문 글자 크기에 맞춰 고른다. 기본 `md`. 구간별로 `{ base: "sm", desktop: "md" }` */
    size?: Responsive<TextButtonSize>;
    /** 밑줄. 문장 속 링크는 켜서 눈에 띄게 한다. 기본 `false` */
    underline?: boolean;
    /** 문장 속 링크. 패딩과 눌림 박스가 없고 밑줄이 항상 켜진다. 기본 `false` */
    inline?: boolean;
    /** 글자 앞 아이콘 */
    leftAddon?: ReactNode;
    /** 글자 뒤 아이콘. 화살표(>)를 붙여 이동을 암시한다 */
    rightAddon?: ReactNode;
    /** 진행 중. 글자를 숨기고 진행 원을 보여 주며 크기는 그대로 둔다. 누를 수 없다 */
    loading?: boolean;
    /** 다른 페이지로 이동하면 주소를 넘긴다. `<a>`로 그린다 */
    href?: string;
    /** `href`를 그릴 링크 컴포넌트(예: Next.js `Link`). 생략하면 `<a>` */
    linkComponent?: ElementType;
  };

export function TextButton({
  color = "primary",
  size,
  underline = false,
  inline = false,
  leftAddon,
  rightAddon,
  loading = false,
  disabled = false,
  href,
  linkComponent,
  target,
  rel,
  className,
  children,
  type = "button",
  ...props
}: TextButtonProps) {
  const blocked = disabled || loading;
  const tone = tones[color];
  const classes = cn(
    "relative inline-flex shrink-0 items-center justify-center font-mint whitespace-nowrap transition-colors",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
    inline
      ? cn(
          "rounded-4 align-baseline",
          responsiveClasses<TextButtonSize>(size, "md", inlineSizeClasses),
        )
      : cn(
          responsiveClasses<TextButtonSize>(size, "md", boxSizeClasses),
          // 터치 화면에서는 보이는 크기는 그대로 두고 눌림 영역만 44px로 넓힌다
          "pointer-coarse:before:absolute pointer-coarse:before:inset-x-0 pointer-coarse:before:top-1/2 pointer-coarse:before:h-11 pointer-coarse:before:-translate-y-1/2",
        ),
    disabled
      ? "cursor-not-allowed text-text-disabled"
      : [tone.normal, !loading && "cursor-pointer", !blocked && (inline ? tone.inline : tone.box)],
    loading && "cursor-progress",
    className,
  );

  const content = (
    <>
      {loading && (
        // 원 크기는 아이콘 크기 규칙([&_svg]:size-*)을 따른다
        <Circular size={16} aria-hidden="true" className="absolute text-current" />
      )}
      <span
        className={cn(
          "relative inline-flex items-center gap-[inherit]",
          // 글자는 투명하게만 숨긴다. invisible로 숨기면 스크린리더에서도 이름이 사라진다
          loading && "opacity-0",
        )}
      >
        {leftAddon}
        <span>{children}</span>
        {rightAddon}
        {(inline || underline) && (
          // 밑줄은 글자 장식(text-decoration)이 아니라 줄(아이콘 포함) 아래에 따로 그린 1px 선이다.
          // 줄 바로 아래(1px 띄움)에 두어 글자·아이콘과 겹치지 않고, 앞뒤 아이콘 끝까지 이어진다. 높이에는 영향이 없다
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-[calc(100%+1px)] h-px bg-current"
          />
        )}
      </span>
    </>
  );

  // 이동: 링크. 비활성·진행 중이면 주소를 빼서 이동을 막는다
  if (href !== undefined) {
    const Link = linkComponent ?? "a";
    return (
      <Link
        href={blocked ? undefined : href}
        target={target}
        rel={rel}
        aria-disabled={blocked || undefined}
        aria-busy={loading || undefined}
        className={classes}
        {...(props as ComponentProps<"a">)}
      >
        {content}
      </Link>
    );
  }

  // 동작: 버튼
  return (
    <button
      type={type}
      disabled={blocked}
      aria-busy={loading || undefined}
      className={classes}
      {...props}
    >
      {content}
    </button>
  );
}
