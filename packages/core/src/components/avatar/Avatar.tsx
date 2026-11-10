// 상태·이벤트 처리가 없어서 "use client"를 붙이지 않는다. 서버 컴포넌트에서도 그대로 쓸 수 있다.
// (onClick은 사용하는 쪽이 클라이언트 컴포넌트에서 넘긴다)
// 이미지가 아직 안 왔거나 실패하면 회색 바탕(fill-neutral-medium)만 보인다(자리표시 아이콘은 쓰지 않는다).
import type { ComponentProps, MouseEventHandler, ReactNode } from "react";
import { cn } from "../../utils/cn";
import { UserIcon } from "../icon/icons.generated";

/** Figma Avatar의 Size 속성: 24 · 32 · 40 · 48 · 64px */
export type AvatarSize = 24 | 32 | 40 | 48 | 64;

// 크기마다 달라지는 값: 상자, 이름 첫 글자, 아이콘, brand 모서리, 배지 위치.
// 배지 위치는 아바타 크기를 따르고, 배지 크기는 badgeSize로 따로 고를 수 있다(아래 badgeSizes).
// 5·7·9px 같은 값은 Figma 수치를 그대로 옮긴 것이라 간격 스케일 밖의 임의 값을 쓴다.
const sizeStyles: Record<
  AvatarSize,
  {
    box: string;
    initial: string;
    icon: string;
    brandRadius: string;
    personOffset: string;
    brandOffset: string;
  }
> = {
  24: {
    box: "size-6",
    initial: "text-caption-2-medium",
    icon: "[&_svg]:size-[14px]",
    brandRadius: "rounded-4",
    personOffset: "-top-1 -right-1",
    brandOffset: "-top-[5px] -right-[5px]",
  },
  32: {
    box: "size-8",
    initial: "text-body-5-medium",
    icon: "[&_svg]:size-4",
    brandRadius: "rounded-8",
    personOffset: "-top-[5px] -right-[5px]",
    brandOffset: "-top-[6px] -right-[6px]",
  },
  40: {
    box: "size-10",
    initial: "text-body-3-medium",
    icon: "[&_svg]:size-5",
    brandRadius: "rounded-8",
    personOffset: "-top-[6px] -right-[6px]",
    brandOffset: "-top-[6px] -right-[6px]",
  },
  48: {
    box: "size-12",
    initial: "text-body-1-medium",
    icon: "[&_svg]:size-6",
    brandRadius: "rounded-12",
    personOffset: "-top-[6px] -right-[6px]",
    brandOffset: "-top-[7px] -right-[7px]",
  },
  64: {
    box: "size-16",
    initial: "text-title-3-medium",
    icon: "[&_svg]:size-8",
    brandRadius: "rounded-16",
    personOffset: "-top-[8px] -right-[8px]",
    brandOffset: "-top-[9px] -right-[9px]",
  },
};

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

/** badgeSize를 주지 않으면 아바타 크기에 맞춘다(24 xs · 32 sm · 40 md · 48 lg · 64 xl) */
const defaultBadgeSize: Record<AvatarSize, AvatarBadgeSize> = {
  24: "xs",
  32: "sm",
  40: "md",
  48: "lg",
  64: "xl",
};

export interface AvatarProps extends Omit<ComponentProps<"div">, "children" | "onClick"> {
  /** 지름(px). 기본 40 */
  size?: AvatarSize;
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
  /** 배지 크기. 생략하면 아바타 크기에 맞춘다(24 xs · 32 sm · 40 md · 48 lg · 64 xl) */
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
  const s = sizeStyles[size];
  const kind = src ? "image" : name ? "initial" : "icon";
  const interactive = onClick !== undefined && !disabled;
  const label = ariaLabel ?? name;
  const shape = variant === "brand" ? s.brandRadius : "rounded-full";

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
  const b = badgeSizes[badgeSize ?? defaultBadgeSize[size]];

  const content = (
    <>
      <span
        className={cn(
          "relative flex size-full items-center justify-center overflow-hidden",
          shape,
          s.icon,
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
        {kind === "initial" && <span className={s.initial}>{initialOf(name!)}</span>}
        {kind === "icon" && (icon ?? <UserIcon />)}
      </span>
      {showBadge && (
        <span
          aria-hidden="true"
          className={cn(
            // 흰 테두리 1.5px는 Figma처럼 안쪽에 그린다(inset 그림자). 테두리가 폭에 더해지지 않아 "99+"가 넓어지지 않는다
            "absolute inline-flex items-center justify-center rounded-full bg-fill-brand font-medium leading-none whitespace-nowrap text-text-on-fill shadow-[inset_0_0_0_1.5px_var(--mint-fill-white)]",
            variant === "brand" ? s.brandOffset : s.personOffset,
            badge === "dot" ? b.dot : b.number,
            count !== null && count.length > 1 && b.padding,
          )}
        >
          {count}
        </span>
      )}
    </>
  );

  const rootClass = cn(
    "group/avatar relative inline-flex shrink-0",
    s.box,
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

// 겹침(px)과 "+N" 글자: 24 → 10 · 32 → 12 · 40 → 12 · 48 → 16 · 64 → 20
const groupStyles: Record<AvatarSize, { overlap: string; count: string; box: string }> = {
  24: {
    overlap: "[&>*:not(:first-child)]:-ml-[10px]",
    count: "text-caption-2-medium",
    box: "size-6",
  },
  32: { overlap: "[&>*:not(:first-child)]:-ml-[12px]", count: "text-body-5-medium", box: "size-8" },
  40: {
    overlap: "[&>*:not(:first-child)]:-ml-[12px]",
    count: "text-body-3-medium",
    box: "size-10",
  },
  48: {
    overlap: "[&>*:not(:first-child)]:-ml-[16px]",
    count: "text-body-1-medium",
    box: "size-12",
  },
  64: {
    overlap: "[&>*:not(:first-child)]:-ml-[20px]",
    count: "text-title-3-medium",
    box: "size-16",
  },
};

export type AvatarGroupItem = Pick<AvatarProps, "src" | "name" | "icon">;

export interface AvatarGroupProps extends Omit<ComponentProps<"div">, "children"> {
  /** 겹쳐 보여 줄 아바타들 */
  items: AvatarGroupItem[];
  /** 지름(px). 기본 40 */
  size?: AvatarSize;
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
  const g = groupStyles[size];
  const visible = items.slice(0, max);
  const rest = items.length - visible.length;
  return (
    <div
      role="group"
      className={cn("isolate inline-flex items-center", g.overlap, className)}
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
              g.box,
              g.count,
            )}
          >
            {count ?? `+${rest}`}
          </span>
        </span>
      )}
    </div>
  );
}
