// 상태·이벤트 처리가 없어서 "use client"를 붙이지 않는다. 서버 컴포넌트에서도 그대로 쓸 수 있다.
// (onClick은 사용하는 쪽이 클라이언트 컴포넌트에서 넘긴다)
// 이미지가 아직 안 왔거나 실패하면 회색 바탕(fill-neutral-medium)만 보인다(자리표시 아이콘은 쓰지 않는다).
import type { ComponentProps, MouseEventHandler, ReactNode } from "react";
import { cn } from "../../utils/cn";
import {
  responsiveClasses,
  type Responsive,
  type ResponsiveClassTable,
} from "../../utils/responsive";
import { UserIcon } from "../icon/icons.generated";

/** Figma Avatar의 Size 속성: 24 · 32 · 40 · 48 · 64px. 16은 촘촘한 목록·글자 옆 표시용으로 더했다(누르는 용도로 쓰지 않는다) */
export type AvatarSize = 16 | 24 | 32 | 40 | 48 | 64;

/** Figma Avatar Push Badge의 Size 속성: XSmall · Small · Medium · Large · XLarge */
export type AvatarBadgeSize = "xs" | "sm" | "md" | "lg" | "xl";

// 배지 크기별 모양: 점은 지름, 숫자는 최소 크기·좌우 여백·글자 크기(Figma 수치 그대로라 임의 값을 쓴다)
// 배지 크기별 모양(Figma 아바타 시안 수치). 점 배지는 숫자 배지와 같은 크기의 원이다(48px 아바타의 Large 점 = 18px).
// 숫자 배지는 높이 = 최소 폭이라 한 글자면 정원이고, 좌우 여백은 두 글자 이상(`12`, `99+`)일 때만 넣는다
// (한 글자에도 여백을 넣으면 폭이 높이보다 커져 가로로 찌그러진 타원이 된다).
const badgeSizes: Record<AvatarBadgeSize, { dot: string; number: string; padding: string }> = {
  xs: { dot: "size-[12px]", number: "h-[12px] min-w-[12px] text-[9px]", padding: "px-1" },
  sm: { dot: "size-[14px]", number: "h-[14px] min-w-[14px] text-[10px]", padding: "px-1" },
  md: { dot: "size-[16px]", number: "h-[16px] min-w-[16px] text-[11px]", padding: "px-[5px]" },
  lg: { dot: "size-[18px]", number: "h-[18px] min-w-[18px] text-[11px]", padding: "px-[5px]" },
  xl: { dot: "size-[22px]", number: "h-[22px] min-w-[22px] text-[12px]", padding: "px-[7px]" },
};

// 크기마다 달라지는 값을 구간별 클래스 표로 둔다(size는 값 하나 또는 구간별 객체, utils/responsive.ts).
// 5·7·9px 같은 값은 Figma 수치를 그대로 옮긴 것이라 간격 스케일 밖의 임의 값을 쓴다.
// 상자(지름)

const boxClasses: ResponsiveClassTable<`${AvatarSize}`> = {
  base: {
    16: "size-4",
    24: "size-6",
    32: "size-8",
    40: "size-10",
    48: "size-12",
    64: "size-16",
  },
  tablet: {
    16: "tablet:size-4",
    24: "tablet:size-6",
    32: "tablet:size-8",
    40: "tablet:size-10",
    48: "tablet:size-12",
    64: "tablet:size-16",
  },
  desktop: {
    16: "desktop:size-4",
    24: "desktop:size-6",
    32: "desktop:size-8",
    40: "desktop:size-10",
    48: "desktop:size-12",
    64: "desktop:size-16",
  },
};

// 이름 첫 글자

const initialClasses: ResponsiveClassTable<`${AvatarSize}`> = {
  base: {
    16: "text-caption-2-medium",
    24: "text-caption-2-medium",
    32: "text-body-5-medium",
    40: "text-body-3-medium",
    48: "text-body-1-medium",
    64: "text-title-3-medium",
  },
  tablet: {
    16: "tablet:text-caption-2-medium",
    24: "tablet:text-caption-2-medium",
    32: "tablet:text-body-5-medium",
    40: "tablet:text-body-3-medium",
    48: "tablet:text-body-1-medium",
    64: "tablet:text-title-3-medium",
  },
  desktop: {
    16: "desktop:text-caption-2-medium",
    24: "desktop:text-caption-2-medium",
    32: "desktop:text-body-5-medium",
    40: "desktop:text-body-3-medium",
    48: "desktop:text-body-1-medium",
    64: "desktop:text-title-3-medium",
  },
};

// 아이콘 크기

const iconClasses: ResponsiveClassTable<`${AvatarSize}`> = {
  base: {
    16: "[&_svg]:size-[10px]",
    24: "[&_svg]:size-[14px]",
    32: "[&_svg]:size-4",
    40: "[&_svg]:size-5",
    48: "[&_svg]:size-6",
    64: "[&_svg]:size-8",
  },
  tablet: {
    16: "tablet:[&_svg]:size-[10px]",
    24: "tablet:[&_svg]:size-[14px]",
    32: "tablet:[&_svg]:size-4",
    40: "tablet:[&_svg]:size-5",
    48: "tablet:[&_svg]:size-6",
    64: "tablet:[&_svg]:size-8",
  },
  desktop: {
    16: "desktop:[&_svg]:size-[10px]",
    24: "desktop:[&_svg]:size-[14px]",
    32: "desktop:[&_svg]:size-4",
    40: "desktop:[&_svg]:size-5",
    48: "desktop:[&_svg]:size-6",
    64: "desktop:[&_svg]:size-8",
  },
};

// brand(둥근 사각형) 모서리

const brandRadiusClasses: ResponsiveClassTable<`${AvatarSize}`> = {
  base: {
    16: "rounded-4",
    24: "rounded-4",
    32: "rounded-8",
    40: "rounded-8",
    48: "rounded-12",
    64: "rounded-16",
  },
  tablet: {
    16: "tablet:rounded-4",
    24: "tablet:rounded-4",
    32: "tablet:rounded-8",
    40: "tablet:rounded-8",
    48: "tablet:rounded-12",
    64: "tablet:rounded-16",
  },
  desktop: {
    16: "desktop:rounded-4",
    24: "desktop:rounded-4",
    32: "desktop:rounded-8",
    40: "desktop:rounded-8",
    48: "desktop:rounded-12",
    64: "desktop:rounded-16",
  },
};

// 배지 위치(아바타 크기를 따른다)

const personOffsetClasses: ResponsiveClassTable<`${AvatarSize}`> = {
  base: {
    16: "-top-[3px] -right-[3px]",
    24: "-top-1 -right-1",
    32: "-top-[5px] -right-[5px]",
    40: "-top-[6px] -right-[6px]",
    48: "-top-[6px] -right-[6px]",
    64: "-top-[8px] -right-[8px]",
  },
  tablet: {
    16: "tablet:-top-[3px] tablet:-right-[3px]",
    24: "tablet:-top-1 tablet:-right-1",
    32: "tablet:-top-[5px] tablet:-right-[5px]",
    40: "tablet:-top-[6px] tablet:-right-[6px]",
    48: "tablet:-top-[6px] tablet:-right-[6px]",
    64: "tablet:-top-[8px] tablet:-right-[8px]",
  },
  desktop: {
    16: "desktop:-top-[3px] desktop:-right-[3px]",
    24: "desktop:-top-1 desktop:-right-1",
    32: "desktop:-top-[5px] desktop:-right-[5px]",
    40: "desktop:-top-[6px] desktop:-right-[6px]",
    48: "desktop:-top-[6px] desktop:-right-[6px]",
    64: "desktop:-top-[8px] desktop:-right-[8px]",
  },
};

const brandOffsetClasses: ResponsiveClassTable<`${AvatarSize}`> = {
  base: {
    16: "-top-[4px] -right-[4px]",
    24: "-top-[5px] -right-[5px]",
    32: "-top-[6px] -right-[6px]",
    40: "-top-[6px] -right-[6px]",
    48: "-top-[7px] -right-[7px]",
    64: "-top-[9px] -right-[9px]",
  },
  tablet: {
    16: "tablet:-top-[4px] tablet:-right-[4px]",
    24: "tablet:-top-[5px] tablet:-right-[5px]",
    32: "tablet:-top-[6px] tablet:-right-[6px]",
    40: "tablet:-top-[6px] tablet:-right-[6px]",
    48: "tablet:-top-[7px] tablet:-right-[7px]",
    64: "tablet:-top-[9px] tablet:-right-[9px]",
  },
  desktop: {
    16: "desktop:-top-[4px] desktop:-right-[4px]",
    24: "desktop:-top-[5px] desktop:-right-[5px]",
    32: "desktop:-top-[6px] desktop:-right-[6px]",
    40: "desktop:-top-[6px] desktop:-right-[6px]",
    48: "desktop:-top-[7px] desktop:-right-[7px]",
    64: "desktop:-top-[9px] desktop:-right-[9px]",
  },
};

// badgeSize를 주지 않으면 배지 크기가 아바타 크기를 따른다(16 점 8px · 24 xs · 32 sm · 40 md · 48 lg · 64 xl). 점 · 숫자 · 두 글자 이상일 때의 좌우 여백

const autoBadgeDotClasses: ResponsiveClassTable<`${AvatarSize}`> = {
  base: {
    16: "size-[8px]",
    24: "size-[12px]",
    32: "size-[14px]",
    40: "size-[16px]",
    48: "size-[18px]",
    64: "size-[22px]",
  },
  tablet: {
    16: "tablet:size-[8px]",
    24: "tablet:size-[12px]",
    32: "tablet:size-[14px]",
    40: "tablet:size-[16px]",
    48: "tablet:size-[18px]",
    64: "tablet:size-[22px]",
  },
  desktop: {
    16: "desktop:size-[8px]",
    24: "desktop:size-[12px]",
    32: "desktop:size-[14px]",
    40: "desktop:size-[16px]",
    48: "desktop:size-[18px]",
    64: "desktop:size-[22px]",
  },
};

const autoBadgeNumberClasses: ResponsiveClassTable<`${AvatarSize}`> = {
  base: {
    16: "h-[12px] min-w-[12px] text-[9px]",
    24: "h-[12px] min-w-[12px] text-[9px]",
    32: "h-[14px] min-w-[14px] text-[10px]",
    40: "h-[16px] min-w-[16px] text-[11px]",
    48: "h-[18px] min-w-[18px] text-[11px]",
    64: "h-[22px] min-w-[22px] text-[12px]",
  },
  tablet: {
    16: "tablet:h-[12px] tablet:min-w-[12px] tablet:text-[9px]",
    24: "tablet:h-[12px] tablet:min-w-[12px] tablet:text-[9px]",
    32: "tablet:h-[14px] tablet:min-w-[14px] tablet:text-[10px]",
    40: "tablet:h-[16px] tablet:min-w-[16px] tablet:text-[11px]",
    48: "tablet:h-[18px] tablet:min-w-[18px] tablet:text-[11px]",
    64: "tablet:h-[22px] tablet:min-w-[22px] tablet:text-[12px]",
  },
  desktop: {
    16: "desktop:h-[12px] desktop:min-w-[12px] desktop:text-[9px]",
    24: "desktop:h-[12px] desktop:min-w-[12px] desktop:text-[9px]",
    32: "desktop:h-[14px] desktop:min-w-[14px] desktop:text-[10px]",
    40: "desktop:h-[16px] desktop:min-w-[16px] desktop:text-[11px]",
    48: "desktop:h-[18px] desktop:min-w-[18px] desktop:text-[11px]",
    64: "desktop:h-[22px] desktop:min-w-[22px] desktop:text-[12px]",
  },
};

const autoBadgePaddingClasses: ResponsiveClassTable<`${AvatarSize}`> = {
  base: {
    16: "px-1",
    24: "px-1",
    32: "px-1",
    40: "px-[5px]",
    48: "px-[5px]",
    64: "px-[7px]",
  },
  tablet: {
    16: "tablet:px-1",
    24: "tablet:px-1",
    32: "tablet:px-1",
    40: "tablet:px-[5px]",
    48: "tablet:px-[5px]",
    64: "tablet:px-[7px]",
  },
  desktop: {
    16: "desktop:px-1",
    24: "desktop:px-1",
    32: "desktop:px-1",
    40: "desktop:px-[5px]",
    48: "desktop:px-[5px]",
    64: "desktop:px-[7px]",
  },
};

export interface AvatarProps extends Omit<ComponentProps<"div">, "children" | "onClick"> {
  /** 지름(px). 기본 40. 구간별로 바꾸려면 `{ base: 32, tablet: 40 }`(배지 위치·자동 배지 크기도 함께 바뀐다) */
  size?: Responsive<AvatarSize>;
  /** `person`은 원형, `brand`는 둥근 사각형(서비스·코인·조직 등 사람이 아닌 대상). 기본 `person` */
  variant?: "person" | "brand";
  /** 이미지 주소. 주면 이미지를 보여 준다(불러오는 동안·실패하면 회색 바탕) */
  src?: string;
  /** 이름. `src`가 없으면 첫 글자를 보여 주고, 스크린리더에는 이름으로 읽힌다 */
  name?: string;
  /** `src`와 `name`이 모두 없을 때 보여 줄 아이콘. 생략하면 사용자 아이콘 */
  icon?: ReactNode;
  /** 알림 배지. `"dot"`은 점, 숫자는 개수(99를 넘으면 `99+`, 0 이하는 숨김) */
  badge?: "dot" | number;
  /** 배지 크기. 생략하면 아바타 크기에 맞춘다(16 점 8px · 24 xs · 32 sm · 40 md · 48 lg · 64 xl) */
  badgeSize?: AvatarBadgeSize;
  /** 비활성 */
  disabled?: boolean;
  /** 주면 눌리는 아바타(`<button>`)가 된다. hover·pressed 색이 같은 피드백을 준다 */
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

/** 이름의 첫 글자. 영문은 대문자로 */
function initialOf(name: string) {
  const first = Array.from(name.trim())[0] ?? "";
  return first.toUpperCase();
}

export function Avatar({
  size = 40,
  variant = "person",
  src,
  name,
  icon,
  badge,
  badgeSize,
  disabled = false,
  onClick,
  className,
  "aria-label": ariaLabel,
  ...props
}: AvatarProps) {
  const sizeClasses = <K extends string>(table: ResponsiveClassTable<K>) =>
    responsiveClasses<AvatarSize>(size, 40, table as ResponsiveClassTable<`${AvatarSize}`>);
  const kind = src ? "image" : name ? "initial" : "icon";
  const interactive = onClick !== undefined && !disabled;
  const label = ariaLabel ?? name;
  const shape = variant === "brand" ? sizeClasses(brandRadiusClasses) : "rounded-full";

  // 면 색: normal / pressed(눌림·hover 같은 색) / disabled
  const tone = {
    image: disabled ? "bg-fill-disabled" : "bg-fill-neutral-medium",
    initial: disabled
      ? "bg-fill-disabled text-text-disabled"
      : cn(
          "bg-fill-brand-weak text-text-brand",
          interactive &&
            "group-hover/avatar:bg-fill-brand-weak-pressed group-active/avatar:bg-fill-brand-weak-pressed",
        ),
    icon: disabled
      ? "bg-fill-disabled text-icon-disabled"
      : cn(
          "bg-fill-neutral-weak text-icon-secondary",
          interactive &&
            "group-hover/avatar:bg-fill-neutral-weak-pressed group-active/avatar:bg-fill-neutral-weak-pressed",
        ),
  }[kind];

  const count = typeof badge === "number" ? (badge > 99 ? "99+" : String(badge)) : null;
  const showBadge = badge === "dot" || (typeof badge === "number" && badge > 0);
  // badgeSize를 주면 그 크기 하나, 주지 않으면 아바타 크기(구간별)를 따른다
  const badgeShape =
    badge === "dot"
      ? badgeSize
        ? badgeSizes[badgeSize].dot
        : sizeClasses(autoBadgeDotClasses)
      : cn(
          badgeSize ? badgeSizes[badgeSize].number : sizeClasses(autoBadgeNumberClasses),
          count !== null &&
            count.length > 1 &&
            (badgeSize ? badgeSizes[badgeSize].padding : sizeClasses(autoBadgePaddingClasses)),
        );

  const content = (
    <>
      <span
        className={cn(
          "relative flex size-full items-center justify-center overflow-hidden",
          shape,
          sizeClasses(iconClasses),
          tone,
          kind === "image" && "border border-border-default",
        )}
      >
        {kind === "image" && (
          <>
            <img
              src={src}
              alt=""
              draggable={false}
              loading="lazy"
              decoding="async"
              className={cn("absolute inset-0 size-full object-cover", disabled && "opacity-40")}
            />
            {interactive && (
              <span
                aria-hidden="true"
                className="absolute inset-0 bg-fill-pressed opacity-0 group-hover/avatar:opacity-100 group-active/avatar:opacity-100"
              />
            )}
          </>
        )}
        {kind === "initial" && (
          <span className={sizeClasses(initialClasses)}>{initialOf(name!)}</span>
        )}
        {kind === "icon" && (icon ?? <UserIcon />)}
      </span>
      {showBadge && (
        <span
          aria-hidden="true"
          className={cn(
            // 흰 테두리 1.5px는 Figma처럼 안쪽에 그린다(inset 그림자). 테두리가 폭에 더해지지 않아 "99+"가 넓어지지 않는다
            "absolute inline-flex items-center justify-center rounded-full bg-fill-brand font-medium leading-none whitespace-nowrap text-text-on-fill shadow-[inset_0_0_0_1.5px_var(--mint-fill-white)]",
            variant === "brand"
              ? sizeClasses(brandOffsetClasses)
              : sizeClasses(personOffsetClasses),
            badgeShape,
          )}
        >
          {count}
        </span>
      )}
    </>
  );

  const rootClass = cn(
    "group/avatar relative inline-flex shrink-0",
    sizeClasses(boxClasses),
    interactive &&
      "cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus",
    onClick && disabled && "cursor-not-allowed",
    className,
  );

  if (onClick !== undefined) {
    return (
      <button
        type="button"
        disabled={disabled}
        onClick={onClick}
        aria-label={label}
        className={rootClass}
        {...(props as ComponentProps<"button">)}
      >
        {content}
      </button>
    );
  }
  return (
    <div
      role={label ? "img" : undefined}
      aria-label={label}
      aria-disabled={disabled || undefined}
      className={rootClass}
      {...props}
    >
      {content}
    </div>
  );
}

// 겹침(px): 24 → 10 · 32 → 12 · 40 → 12 · 48 → 16 · 64 → 20. size가 구간별 값이어도 맞도록 표로 둔다

const overlapClasses: ResponsiveClassTable<`${AvatarSize}`> = {
  base: {
    16: "[&>*:not(:first-child)]:-ml-[6px]",
    24: "[&>*:not(:first-child)]:-ml-[10px]",
    32: "[&>*:not(:first-child)]:-ml-[12px]",
    40: "[&>*:not(:first-child)]:-ml-[12px]",
    48: "[&>*:not(:first-child)]:-ml-[16px]",
    64: "[&>*:not(:first-child)]:-ml-[20px]",
  },
  tablet: {
    16: "tablet:[&>*:not(:first-child)]:-ml-[6px]",
    24: "tablet:[&>*:not(:first-child)]:-ml-[10px]",
    32: "tablet:[&>*:not(:first-child)]:-ml-[12px]",
    40: "tablet:[&>*:not(:first-child)]:-ml-[12px]",
    48: "tablet:[&>*:not(:first-child)]:-ml-[16px]",
    64: "tablet:[&>*:not(:first-child)]:-ml-[20px]",
  },
  desktop: {
    16: "desktop:[&>*:not(:first-child)]:-ml-[6px]",
    24: "desktop:[&>*:not(:first-child)]:-ml-[10px]",
    32: "desktop:[&>*:not(:first-child)]:-ml-[12px]",
    40: "desktop:[&>*:not(:first-child)]:-ml-[12px]",
    48: "desktop:[&>*:not(:first-child)]:-ml-[16px]",
    64: "desktop:[&>*:not(:first-child)]:-ml-[20px]",
  },
};

// "+N" 칸: 아바타와 같은 지름·글자

const countClasses: ResponsiveClassTable<`${AvatarSize}`> = {
  base: {
    16: "size-4 text-caption-2-medium",
    24: "size-6 text-caption-2-medium",
    32: "size-8 text-body-5-medium",
    40: "size-10 text-body-3-medium",
    48: "size-12 text-body-1-medium",
    64: "size-16 text-title-3-medium",
  },
  tablet: {
    16: "tablet:size-4 tablet:text-caption-2-medium",
    24: "tablet:size-6 tablet:text-caption-2-medium",
    32: "tablet:size-8 tablet:text-body-5-medium",
    40: "tablet:size-10 tablet:text-body-3-medium",
    48: "tablet:size-12 tablet:text-body-1-medium",
    64: "tablet:size-16 tablet:text-title-3-medium",
  },
  desktop: {
    16: "desktop:size-4 desktop:text-caption-2-medium",
    24: "desktop:size-6 desktop:text-caption-2-medium",
    32: "desktop:size-8 desktop:text-body-5-medium",
    40: "desktop:size-10 desktop:text-body-3-medium",
    48: "desktop:size-12 desktop:text-body-1-medium",
    64: "desktop:size-16 desktop:text-title-3-medium",
  },
};

export type AvatarGroupItem = Pick<AvatarProps, "src" | "name" | "icon">;

export interface AvatarGroupProps extends Omit<ComponentProps<"div">, "children"> {
  /** 겹쳐 보여 줄 아바타들 */
  items: AvatarGroupItem[];
  /** 지름(px). 기본 40. 구간별 값도 받는다(`{ base: 32, tablet: 40 }`) */
  size?: Responsive<AvatarSize>;
  /** 보여 줄 최대 개수. 넘치면 마지막에 `+N`이 붙는다. 기본 3 */
  max?: number;
  /** 넘친 칸의 글자를 직접 정한다(기본은 `+남은 수`) */
  count?: string;
}

/**
 * 아바타를 흰 테두리로 겹쳐 놓는다. 넘치면 `+N`. 스크린리더에 읽히도록 `aria-label`을 준다.
 * 겹침 순서는 **오른쪽이 항상 위**다(맨 오른쪽 칸이 맨 위). 칸마다 `z-index`를 왼쪽부터 1씩 올려 지정하고,
 * 묶음을 `isolate`로 감싸서 이 값이 바깥 요소의 쌓임에 영향을 주지 않게 한다.
 */
export function AvatarGroup({
  items,
  size = 40,
  max = 3,
  count,
  className,
  ...props
}: AvatarGroupProps) {
  const visible = items.slice(0, max);
  const rest = items.length - visible.length;
  return (
    <div
      role="group"
      className={cn(
        "isolate inline-flex items-center",
        responsiveClasses<AvatarSize>(
          size,
          40,
          overlapClasses as ResponsiveClassTable<`${AvatarSize}`>,
        ),
        className,
      )}
      {...props}
    >
      {visible.map((item, index) => (
        <span
          key={index}
          style={{ zIndex: index }}
          className="relative inline-flex rounded-full bg-fill-white p-[2px]"
        >
          <Avatar size={size} {...item} />
        </span>
      ))}
      {rest > 0 && (
        <span
          style={{ zIndex: visible.length }}
          className="relative inline-flex rounded-full bg-fill-white p-[2px]"
        >
          <span
            className={cn(
              "inline-flex items-center justify-center rounded-full bg-fill-neutral-medium whitespace-nowrap text-text-secondary",
              responsiveClasses<AvatarSize>(
                size,
                40,
                countClasses as ResponsiveClassTable<`${AvatarSize}`>,
              ),
            )}
          >
            {count ?? `+${rest}`}
          </span>
        </span>
      )}
    </div>
  );
}
