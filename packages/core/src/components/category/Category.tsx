"use client";

// 선택 상태·키보드 이동·가장자리 그라데이션(스크롤 위치를 읽는다)이 있어서 클라이언트 컴포넌트다.
// Figma `Category`(2200:6278) · `Category Guidelines`(2200:6493).
// 같은 목록을 거르거나 분류를 고르는 칩 목록. 한 번에 하나만 선택하고(항상 하나가 선택됨), 넘치면 가로로 스크롤한다.
// 접근성: 한 개만 고르는 묶음이라 radiogroup/radio로 읽히고, 화살표 키로 옮기면 바로 선택된다(라디오와 같은 동작).
import {
  useEffect,
  useRef,
  useState,
  type ComponentProps,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { cn } from "../../utils/cn";
import {
  responsiveClasses,
  type Responsive,
  type ResponsiveClassTable,
} from "../../utils/responsive";

export type CategoryVariant = "solid" | "outline";
export type CategorySize = "lg" | "md";
export type CategoryShape = "square" | "pill";

/** "전체" 칩의 값 */
export const CATEGORY_ALL = "all";

export interface CategoryItem {
  /** 선택 값. 목록 안에서 겹치지 않게 준다(`"all"`은 "전체" 칩이 쓴다) */
  value: string;
  /** 칩 글자 */
  label: ReactNode;
  /** 글자 앞 아이콘(16px). `<HouseIcon />`처럼 넘긴다 */
  icon?: ReactNode;
  /** 글자 오른쪽 위의 빨간 점. 새 소식이 있는 분류에 쓴다 */
  badge?: boolean;
  /** 이 칩만 누를 수 없게 한다 */
  disabled?: boolean;
}

export interface CategoryProps extends Omit<
  ComponentProps<"div">,
  "children" | "onChange" | "defaultValue"
> {
  /** 칩 목록. 3~7개를 권장하고, 넘치면 가로로 스크롤한다 */
  items: CategoryItem[];
  /** 선택된 값(제어). 생략하면 컴포넌트가 직접 상태를 가진다 */
  value?: string;
  /** 처음 선택 값(비제어). 기본은 "전체"(`all`이 켜져 있으면) 또는 첫 칩 */
  defaultValue?: string;
  /** 다른 칩을 눌렀을 때 새 값으로 호출된다 */
  onChange?: (value: string) => void;
  /** 맨 앞에 "전체" 칩을 둔다(값 `"all"`). 기본 `true` */
  all?: boolean;
  /** "전체" 칩 글자. 기본 `"전체"` */
  allLabel?: ReactNode;
  /** `solid` 흰 화면(기본) · `outline` 회색 배경 위 */
  variant?: CategoryVariant;
  /** `lg` 40(기본, 모바일웹 기본) · `md` 32(촘촘한 영역). Figma Large·Medium, Chip과 같은 이름. 구간별로 바꾸려면 `{ base: "lg", desktop: "md" }` */
  size?: Responsive<CategorySize>;
  /** `square` 둥근 사각형(기본) · `pill` 알약형 */
  shape?: CategoryShape;
  /** 칩이 넘칠 때 스크롤할 쪽 가장자리에 그라데이션을 보여 준다. 기본 `true`(넘칠 때만 자동으로 나타남) */
  fade?: boolean;
}

// 칩 높이·좌우 여백·모서리(Figma: Large 40 / Medium 32, Square 12·8 / Pill full). md(32)는 터치 화면에서 눌림 영역만 44px.
// 값 하나 또는 구간별 객체를 받는다(utils/responsive.ts)
const squareSizeClasses: ResponsiveClassTable<CategorySize> = {
  base: {
    lg: "h-10 px-4 rounded-12 pointer-coarse:before:content-none",
    md: "h-8 px-3 rounded-8 pointer-coarse:before:absolute pointer-coarse:before:inset-x-0 pointer-coarse:before:top-1/2 pointer-coarse:before:h-11 pointer-coarse:before:-translate-y-1/2",
  },
  tablet: {
    lg: "tablet:h-10 tablet:px-4 tablet:rounded-12 tablet:pointer-coarse:before:content-none",
    md: "tablet:h-8 tablet:px-3 tablet:rounded-8 tablet:pointer-coarse:before:absolute tablet:pointer-coarse:before:inset-x-0 tablet:pointer-coarse:before:top-1/2 tablet:pointer-coarse:before:h-11 tablet:pointer-coarse:before:-translate-y-1/2",
  },
  desktop: {
    lg: "desktop:h-10 desktop:px-4 desktop:rounded-12 desktop:pointer-coarse:before:content-none",
    md: "desktop:h-8 desktop:px-3 desktop:rounded-8 desktop:pointer-coarse:before:absolute desktop:pointer-coarse:before:inset-x-0 desktop:pointer-coarse:before:top-1/2 desktop:pointer-coarse:before:h-11 desktop:pointer-coarse:before:-translate-y-1/2",
  },
};

const pillSizeClasses: ResponsiveClassTable<CategorySize> = {
  base: {
    lg: "h-10 px-5 rounded-full pointer-coarse:before:content-none",
    md: "h-8 px-4 rounded-full pointer-coarse:before:absolute pointer-coarse:before:inset-x-0 pointer-coarse:before:top-1/2 pointer-coarse:before:h-11 pointer-coarse:before:-translate-y-1/2",
  },
  tablet: {
    lg: "tablet:h-10 tablet:px-5 tablet:rounded-full tablet:pointer-coarse:before:content-none",
    md: "tablet:h-8 tablet:px-4 tablet:rounded-full tablet:pointer-coarse:before:absolute tablet:pointer-coarse:before:inset-x-0 tablet:pointer-coarse:before:top-1/2 tablet:pointer-coarse:before:h-11 tablet:pointer-coarse:before:-translate-y-1/2",
  },
  desktop: {
    lg: "desktop:h-10 desktop:px-5 desktop:rounded-full desktop:pointer-coarse:before:content-none",
    md: "desktop:h-8 desktop:px-4 desktop:rounded-full desktop:pointer-coarse:before:absolute desktop:pointer-coarse:before:inset-x-0 desktop:pointer-coarse:before:top-1/2 desktop:pointer-coarse:before:h-11 desktop:pointer-coarse:before:-translate-y-1/2",
  },
};

// 선택 여부에 따른 색. 색만이 아니라 배경(테두리)과 글자 대비를 함께 바꾼다(Figma 접근성 규칙)
const chipColors: Record<CategoryVariant, { off: string; on: string }> = {
  solid: {
    off: "bg-fill-neutral-medium text-text-secondary hover:bg-fill-neutral-medium-pressed active:bg-fill-neutral-medium-pressed",
    on: "bg-fill-neutral text-text-on-fill",
  },
  outline: {
    off: "border border-border-strong bg-fill-white text-text-secondary hover:bg-fill-pressed active:bg-fill-pressed",
    on: "border border-border-selected bg-fill-white text-text-strong",
  },
};

/** 같은 목록을 거르거나 분류를 고르는 칩 목록. 한 번에 하나만 선택한다 */
export function Category({
  items,
  value,
  defaultValue,
  onChange,
  all = true,
  allLabel = "전체",
  variant = "solid",
  size = "lg",
  shape = "square",
  fade = true,
  className,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledby,
  ...props
}: CategoryProps) {
  const chips: CategoryItem[] = all ? [{ value: CATEGORY_ALL, label: allLabel }, ...items] : items;
  const [inner, setInner] = useState(() => defaultValue ?? chips[0]?.value);
  const selected = value ?? inner;

  const scrollerRef = useRef<HTMLDivElement>(null);
  const chipRefs = useRef(new Map<string, HTMLButtonElement>());
  const [edges, setEdges] = useState({ start: false, end: false });

  // 스크롤 위치·크기가 바뀔 때마다 양 끝에 더 볼 칩이 있는지 계산한다(서버에서는 둘 다 false)
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller || !fade) return;
    const update = () => {
      const max = scroller.scrollWidth - scroller.clientWidth;
      setEdges({ start: scroller.scrollLeft > 1, end: scroller.scrollLeft < max - 1 });
    };
    update();
    scroller.addEventListener("scroll", update, { passive: true });
    const observer = new ResizeObserver(update);
    observer.observe(scroller);
    return () => {
      scroller.removeEventListener("scroll", update);
      observer.disconnect();
    };
  }, [fade, chips.length]);

  // 선택된 칩이 화면 밖에 있으면 보이게 옮긴다
  useEffect(() => {
    const chip = selected === undefined ? undefined : chipRefs.current.get(selected);
    chip?.scrollIntoView?.({ block: "nearest", inline: "nearest" });
  }, [selected]);

  const select = (next: string) => {
    if (next === selected) return;
    if (value === undefined) setInner(next);
    onChange?.(next);
  };

  // 라디오처럼: ←/→(↑/↓)로 옆 칩으로 옮기며 선택, Home/End로 처음·끝
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const enabled = chips.filter((chip) => !chip.disabled);
    const index = enabled.findIndex((chip) => chip.value === selected);
    const keys: Record<string, number> = {
      ArrowRight: index + 1,
      ArrowDown: index + 1,
      ArrowLeft: index - 1,
      ArrowUp: index - 1,
      Home: 0,
      End: enabled.length - 1,
    };
    if (!(event.key in keys) || enabled.length === 0) return;
    event.preventDefault();
    const next = enabled[(keys[event.key] + enabled.length) % enabled.length];
    select(next.value);
    chipRefs.current.get(next.value)?.focus();
  };

  // Tab으로 들어올 칩: 선택된 칩. 선택 값이 목록에 없으면 처음 누를 수 있는 칩
  const focusable = chips.some((chip) => chip.value === selected && !chip.disabled)
    ? selected
    : chips.find((chip) => !chip.disabled)?.value;

  const fadeBase = "pointer-events-none absolute inset-y-0 w-8 transition-opacity duration-150";

  return (
    <div className={cn("relative bg-background-default", className)} {...props}>
      <div
        ref={scrollerRef}
        role="radiogroup"
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledby}
        onKeyDown={onKeyDown}
        className="flex h-14 items-center gap-2 overflow-x-auto px-4 py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {chips.map((chip) => {
          const on = chip.value === selected;
          return (
            <button
              key={chip.value}
              ref={(node) => {
                if (node) chipRefs.current.set(chip.value, node);
                else chipRefs.current.delete(chip.value);
              }}
              type="button"
              role="radio"
              aria-checked={on}
              // 묶음 안에서는 선택된 칩 하나만 Tab으로 들어온다(나머지는 화살표 키)
              tabIndex={chip.value === focusable ? 0 : -1}
              disabled={chip.disabled}
              onClick={() => select(chip.value)}
              className={cn(
                "relative inline-flex shrink-0 cursor-pointer items-center justify-center gap-1 text-label-2-medium whitespace-nowrap transition-colors",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus",
                "disabled:cursor-not-allowed disabled:bg-fill-disabled disabled:text-text-disabled",
                "[&_svg]:size-4 [&_svg]:shrink-0",
                responsiveClasses<CategorySize>(
                  size,
                  "lg",
                  shape === "pill" ? pillSizeClasses : squareSizeClasses,
                ),
                on ? chipColors[variant].on : chipColors[variant].off,
              )}
            >
              {chip.icon}
              <span className="inline-flex items-start gap-[2px]">
                {chip.label}
                {chip.badge && (
                  // Figma: 6px 점, 글자 위쪽 2px. 시맨틱 색 중 가장 가까운 danger를 쓴다
                  <span
                    aria-hidden="true"
                    className="mt-[2px] size-[6px] rounded-full bg-fill-danger"
                  />
                )}
              </span>
              {chip.badge && <span className="sr-only">(새 소식)</span>}
            </button>
          );
        })}
      </div>
      {fade && (
        <>
          <div
            aria-hidden="true"
            className={cn(
              fadeBase,
              "left-0 bg-linear-to-r from-background-default to-transparent",
              edges.start ? "opacity-100" : "opacity-0",
            )}
          />
          <div
            aria-hidden="true"
            className={cn(
              fadeBase,
              "right-0 bg-linear-to-l from-background-default to-transparent",
              edges.end ? "opacity-100" : "opacity-0",
            )}
          />
        </>
      )}
    </div>
  );
}
