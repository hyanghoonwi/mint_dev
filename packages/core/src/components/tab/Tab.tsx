"use client";

// 선택 상태와 키보드 이동이 있어서 클라이언트 컴포넌트다.
// Figma `Tab`(2325:40134) · `Tab Guidelines`(2325:40341).
// 같은 화면에서 보는 내용(섹션)을 바꾸는 밑줄형 탭. 항상 하나가 선택돼 있다(선택 없음 상태가 없다). 2~6개.
// 선택된 탭은 굵은 글자 + 아래 2px 밑줄, 나머지는 보통 굵기의 회색 글자. 눌림 상태는 따로 만들지 않는다.
// 넘치면 가로로 스크롤한다: 터치·트랙패드는 브라우저가, 마우스는 끌어서(useDragScroll, Category와 같다).
// 접근성: 탭 묶음은 tablist/tab(aria-selected)로 읽히고, 화살표 키로 옮기면 바로 선택된다(활성화 자동).
import {
  useEffect,
  useRef,
  useState,
  type ComponentProps,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { cn } from "../../utils/cn";
import { useDragScroll } from "../_internal/useDragScroll";
import {
  responsiveClasses,
  type Responsive,
  type ResponsiveClassTable,
} from "../../utils/responsive";

export type TabSize = "sm" | "md" | "lg";
export type TabLayout = "fill" | "hug";

export interface TabItem {
  /** 선택 값. 목록 안에서 겹치지 않게 준다 */
  value: string;
  /** 탭 이름. 2~6자 명사로 짧게 쓴다 */
  label: ReactNode;
  /** 새 소식이 있는 탭에만 글자 오른쪽 위에 브랜드 색 점을 보인다 */
  badge?: boolean;
  /** 이 탭만 누를 수 없게 한다 */
  disabled?: boolean;
}

export interface TabProps extends Omit<
  ComponentProps<"div">,
  "children" | "onChange" | "defaultValue"
> {
  /** 탭 목록. 2~6개 */
  items: TabItem[];
  /** 선택된 값(제어). 생략하면 컴포넌트가 직접 상태를 가진다 */
  value?: string;
  /** 처음 선택 값(비제어). 기본은 첫 탭 */
  defaultValue?: string;
  /** 다른 탭을 눌렀을 때 새 값으로 호출된다 */
  onChange?: (value: string) => void;
  /**
   * `sm` 32 · `md` 40 · `lg` 48(기본, 막대 높이). 글자 label-2 · label-2 · label-1.
   * 구간별로 바꾸려면 객체를 준다: `{ base: "lg", desktop: "md" }`
   */
  size?: Responsive<TabSize>;
  /**
   * `fill`(기본)은 탭이 폭을 똑같이 나눠 가지고, 이름이 길어 안 들어가면 이름 폭을 지키며 가로로 스크롤한다. `hug`는 탭이 이름 폭만큼만 차지하고 왼쪽부터 놓이며 넘치면 가로로 스크롤한다.
   * 5개 이하는 fill, 6개이거나 이름이 길면 hug. 구간별 값도 받는다
   */
  layout?: Responsive<TabLayout>;
  /** 탭이 넘칠 때 스크롤할 쪽 가장자리에 그라데이션을 보여 준다. 기본 `true`(넘칠 때만 자동으로 나타남) */
  fade?: boolean;
}

// 막대 높이: lg 48 · md 40 · sm 32. 아래 1px 구분선은 항상 부모 폭을 채운다
const barClasses: ResponsiveClassTable<TabSize> = {
  base: { lg: "h-12", md: "h-10", sm: "h-8" },
  tablet: { lg: "tablet:h-12", md: "tablet:h-10", sm: "tablet:h-8" },
  desktop: { lg: "desktop:h-12", md: "desktop:h-10", sm: "desktop:h-8" },
};

// hug는 막대 좌우 여백 16
const barLayoutClasses: ResponsiveClassTable<TabLayout> = {
  base: { fill: "px-0", hug: "px-4" },
  tablet: { fill: "tablet:px-0", hug: "tablet:px-4" },
  desktop: { fill: "desktop:px-0", hug: "desktop:px-4" },
};

// 탭(Figma Tab Item): lg 좌우 10 · label-1 / md 좌우 10 · label-2 / sm 좌우 8 · label-2.
// 글자 굵기는 선택 여부로 정해서 여기서는 글자 크기만 둔다. md·sm은 터치 화면에서 눌림 영역만 44px로 넓힌다
const itemSizeClasses: ResponsiveClassTable<TabSize> = {
  base: {
    lg: "px-[10px] text-label-1-medium",
    md: "px-[10px] text-label-2-medium pointer-coarse:before:absolute pointer-coarse:before:inset-x-0 pointer-coarse:before:top-1/2 pointer-coarse:before:h-11 pointer-coarse:before:-translate-y-1/2",
    sm: "px-2 text-label-2-medium pointer-coarse:before:absolute pointer-coarse:before:inset-x-0 pointer-coarse:before:top-1/2 pointer-coarse:before:h-11 pointer-coarse:before:-translate-y-1/2",
  },
  tablet: {
    lg: "tablet:px-[10px] tablet:text-label-1-medium",
    md: "tablet:px-[10px] tablet:text-label-2-medium tablet:pointer-coarse:before:absolute tablet:pointer-coarse:before:inset-x-0 tablet:pointer-coarse:before:top-1/2 tablet:pointer-coarse:before:h-11 tablet:pointer-coarse:before:-translate-y-1/2",
    sm: "tablet:px-2 tablet:text-label-2-medium tablet:pointer-coarse:before:absolute tablet:pointer-coarse:before:inset-x-0 tablet:pointer-coarse:before:top-1/2 tablet:pointer-coarse:before:h-11 tablet:pointer-coarse:before:-translate-y-1/2",
  },
  desktop: {
    lg: "desktop:px-[10px] desktop:text-label-1-medium",
    md: "desktop:px-[10px] desktop:text-label-2-medium desktop:pointer-coarse:before:absolute desktop:pointer-coarse:before:inset-x-0 desktop:pointer-coarse:before:top-1/2 desktop:pointer-coarse:before:h-11 desktop:pointer-coarse:before:-translate-y-1/2",
    sm: "desktop:px-2 desktop:text-label-2-medium desktop:pointer-coarse:before:absolute desktop:pointer-coarse:before:inset-x-0 desktop:pointer-coarse:before:top-1/2 desktop:pointer-coarse:before:h-11 desktop:pointer-coarse:before:-translate-y-1/2",
  },
};

// 선택된 탭은 굵은 글자(semibold). 크기는 itemSizeClasses가 정하므로 굵기만 덮어쓴다
const selectedWeightClasses: ResponsiveClassTable<TabSize> = {
  base: {
    lg: "text-label-1-semibold",
    md: "text-label-2-semibold",
    sm: "text-label-2-semibold",
  },
  tablet: {
    lg: "tablet:text-label-1-semibold",
    md: "tablet:text-label-2-semibold",
    sm: "tablet:text-label-2-semibold",
  },
  desktop: {
    lg: "desktop:text-label-1-semibold",
    md: "desktop:text-label-2-semibold",
    sm: "desktop:text-label-2-semibold",
  },
};

// fill은 폭을 똑같이 나누되 이름 폭 밑으로는 줄지 않는다(안 들어가면 막대가 가로로 스크롤). hug는 이름 폭만큼만 차지한다
const itemLayoutClasses: ResponsiveClassTable<TabLayout> = {
  base: { fill: "min-w-fit flex-1", hug: "flex-none" },
  tablet: { fill: "tablet:min-w-fit tablet:flex-1", hug: "tablet:flex-none" },
  desktop: { fill: "desktop:min-w-fit desktop:flex-1", hug: "desktop:flex-none" },
};

/** 같은 화면에서 보는 내용(섹션)을 바꾸는 밑줄형 탭. 항상 하나가 선택돼 있다 */
export function Tab({
  items,
  value,
  defaultValue,
  onChange,
  size = "lg",
  layout = "fill",
  fade = true,
  className,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledby,
  ...props
}: TabProps) {
  const [inner, setInner] = useState(() => defaultValue ?? items[0]?.value);
  const selected = value ?? inner;
  const itemRefs = useRef(new Map<string, HTMLButtonElement>());
  const scrollerRef = useRef<HTMLDivElement>(null);
  const { dragging, handlers: dragHandlers } = useDragScroll(scrollerRef);
  const [edges, setEdges] = useState({ start: false, end: false });

  // 스크롤 위치·크기가 바뀔 때마다 양 끝에 더 볼 탭이 있는지 계산한다(서버에서는 둘 다 false)
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
  }, [fade, items.length]);

  // 선택된 탭이 화면 밖에 있으면 보이게 옮긴다
  useEffect(() => {
    const tab = selected === undefined ? undefined : itemRefs.current.get(selected);
    tab?.scrollIntoView?.({ block: "nearest", inline: "nearest" });
  }, [selected]);

  const select = (next: string) => {
    if (next === selected) return;
    if (value === undefined) setInner(next);
    onChange?.(next);
  };

  // ←/→로 옆 탭으로 옮기며 선택, Home/End로 처음·끝(누를 수 없는 탭은 건너뜀)
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const enabled = items.filter((item) => !item.disabled);
    const index = enabled.findIndex((item) => item.value === selected);
    const keys: Record<string, number> = {
      ArrowRight: index + 1,
      ArrowLeft: index - 1,
      Home: 0,
      End: enabled.length - 1,
    };
    if (!(event.key in keys) || enabled.length === 0) return;
    event.preventDefault();
    const next = enabled[(keys[event.key] + enabled.length) % enabled.length];
    select(next.value);
    itemRefs.current.get(next.value)?.focus();
  };

  // Tab 키로 들어올 탭: 선택된 탭. 선택 값이 목록에 없으면 처음 누를 수 있는 탭
  const focusable = items.some((item) => item.value === selected && !item.disabled)
    ? selected
    : items.find((item) => !item.disabled)?.value;

  const fadeBase = "pointer-events-none absolute inset-y-0 w-8 transition-opacity duration-150";

  return (
    <div
      className={cn(
        "relative w-full border-b border-border-default bg-background-default",
        className,
      )}
      {...props}
    >
      <div
        ref={scrollerRef}
        role="tablist"
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledby}
        aria-orientation="horizontal"
        onKeyDown={onKeyDown}
        {...dragHandlers}
        className={cn(
          "flex w-full items-start overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          responsiveClasses<TabSize>(size, "lg", barClasses),
          responsiveClasses<TabLayout>(layout, "fill", barLayoutClasses),
          // 끄는 동안 글자가 선택되지 않게 하고, 탭 위에서도 잡은 손 모양을 보인다
          dragging && "cursor-grabbing select-none [&_*]:cursor-grabbing",
        )}
      >
        {items.map((item) => {
          const on = item.value === selected;
          return (
            <button
              key={item.value}
              ref={(node) => {
                if (node) itemRefs.current.set(item.value, node);
                else itemRefs.current.delete(item.value);
              }}
              type="button"
              role="tab"
              aria-selected={on}
              // 묶음 안에서는 선택된 탭 하나만 Tab 키로 들어온다(나머지는 화살표 키)
              tabIndex={item.value === focusable ? 0 : -1}
              disabled={item.disabled}
              onClick={() => select(item.value)}
              className={cn(
                "relative inline-flex h-full cursor-pointer items-center justify-center whitespace-nowrap rounded-8 transition-colors duration-250 ease-[cubic-bezier(0.4,0,0.2,1)]",
                "focus-visible:-outline-offset-2 focus-visible:outline-2 focus-visible:outline-border-focus",
                "disabled:cursor-not-allowed disabled:text-text-disabled",
                responsiveClasses<TabSize>(size, "lg", itemSizeClasses),
                responsiveClasses<TabLayout>(layout, "fill", itemLayoutClasses),
                // 선택: 굵은 글자 strong + 아래 밑줄. 선택 안 됨: 회색(tertiary)
                on
                  ? cn(
                      "text-text-strong",
                      responsiveClasses<TabSize>(size, "lg", selectedWeightClasses),
                    )
                  : "text-text-tertiary enabled:hover:text-text-strong",
              )}
            >
              <span className="inline-flex items-start gap-[2px]">
                {item.label}
                {item.badge && (
                  // Figma: 6px 점, 글자 위쪽 2px. 색은 브랜드 토큰(fill-brand)
                  <span
                    aria-hidden="true"
                    className="mt-[2px] size-[6px] rounded-full bg-fill-brand"
                  />
                )}
              </span>
              {item.badge && <span className="sr-only">(새 소식)</span>}
              {on && (
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 bottom-0 h-[2px] bg-fill-neutral"
                />
              )}
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
