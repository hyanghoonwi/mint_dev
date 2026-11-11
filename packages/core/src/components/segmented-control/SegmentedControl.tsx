"use client";

// 선택 상태와 키보드 이동이 있어서 클라이언트 컴포넌트다.
// Figma `Segmented Control`(2208:23251) · `Segmented Control Guidelines`(2208:23564).
// 같은 영역의 보기 방식(목록/격자, 일/주/월)을 바로 바꾸는 토글형 선택 컨트롤. 회색 트랙 위에 선택된 항목이 흰 칩으로 보인다.
// 항상 하나가 선택돼 있다(선택 없음 상태가 없다). 2~6개.
// 선택 칩은 옆으로 미끄러진다(CSS transition, 움직임 줄이기 설정이면 바로 옮겨진다).
// 접근성: 한 개만 고르는 묶음이라 radiogroup/radio로 읽히고, 화살표 키로 옮기면 바로 선택된다(Category와 같은 동작).
import { useRef, useState, type ComponentProps, type KeyboardEvent, type ReactNode } from "react";
import { cn } from "../../utils/cn";
import {
  responsiveClasses,
  type Responsive,
  type ResponsiveClassTable,
} from "../../utils/responsive";

export type SegmentedControlSize = "sm" | "md" | "lg";

export interface SegmentedControlItem {
  /** 선택 값. 목록 안에서 겹치지 않게 준다 */
  value: string;
  /** 항목 글자. 1~4자로 짧게 쓴다 */
  label: ReactNode;
  /** 글자 앞 아이콘(`<ListIcon />`). 크기는 컨트롤 크기에 맞춰진다(lg 20 · md·sm 16) */
  icon?: ReactNode;
  /** 이 항목만 누를 수 없게 한다 */
  disabled?: boolean;
}

export interface SegmentedControlProps extends Omit<
  ComponentProps<"div">,
  "children" | "onChange" | "defaultValue"
> {
  /** 항목 목록. 2~6개 */
  items: SegmentedControlItem[];
  /** 선택된 값(제어). 생략하면 컴포넌트가 직접 상태를 가진다 */
  value?: string;
  /** 처음 선택 값(비제어). 기본은 첫 항목 */
  defaultValue?: string;
  /** 다른 항목을 눌렀을 때 새 값으로 호출된다 */
  onChange?: (value: string) => void;
  /**
   * `sm` 32 · `md` 40(기본) · `lg` 48(트랙 높이). 글자 label-3 · label-2 · label-1.
   * 구간별로 바꾸려면 객체를 준다: `{ base: "lg", desktop: "md" }`
   */
  size?: Responsive<SegmentedControlSize>;
  /** 부모 폭을 꽉 채운다(항목은 같은 폭으로 나눈다). 기본 `false`(가장 긴 항목 폭에 맞춰 같은 폭). 구간별 값도 받는다 */
  fullWidth?: Responsive<boolean>;
}

// 트랙: 회색(fill/neutral-weak) · 안쪽 여백 4 · 모서리 lg·md 12, sm 10. 항목은 모두 같은 폭(auto-cols-fr)
const trackClasses: ResponsiveClassTable<SegmentedControlSize> = {
  base: {
    lg: "rounded-12",
    md: "rounded-12",
    sm: "rounded-[10px]",
  },
  tablet: {
    lg: "tablet:rounded-12",
    md: "tablet:rounded-12",
    sm: "tablet:rounded-[10px]",
  },
  desktop: {
    lg: "desktop:rounded-12",
    md: "desktop:rounded-12",
    sm: "desktop:rounded-[10px]",
  },
};

// 항목(Figma Segment Item): lg 40·좌우16·모서리10 · md 32·12·8 · sm 24·8·8. md·sm은 터치 화면에서 눌림 영역만 44px로 넓힌다
const itemClasses: ResponsiveClassTable<SegmentedControlSize> = {
  base: {
    lg: "h-10 px-4 gap-1 rounded-[10px] text-label-1-medium [&_svg]:size-5 pointer-coarse:before:content-none",
    md: "h-8 px-3 gap-1 rounded-8 text-label-2-medium [&_svg]:size-4 pointer-coarse:before:absolute pointer-coarse:before:inset-x-0 pointer-coarse:before:top-1/2 pointer-coarse:before:h-11 pointer-coarse:before:-translate-y-1/2",
    sm: "h-6 px-2 gap-1 rounded-8 text-label-3-medium [&_svg]:size-4 pointer-coarse:before:absolute pointer-coarse:before:inset-x-0 pointer-coarse:before:top-1/2 pointer-coarse:before:h-11 pointer-coarse:before:-translate-y-1/2",
  },
  tablet: {
    lg: "tablet:h-10 tablet:px-4 tablet:gap-1 tablet:rounded-[10px] tablet:text-label-1-medium tablet:[&_svg]:size-5 tablet:pointer-coarse:before:content-none",
    md: "tablet:h-8 tablet:px-3 tablet:gap-1 tablet:rounded-8 tablet:text-label-2-medium tablet:[&_svg]:size-4 tablet:pointer-coarse:before:absolute tablet:pointer-coarse:before:inset-x-0 tablet:pointer-coarse:before:top-1/2 tablet:pointer-coarse:before:h-11 tablet:pointer-coarse:before:-translate-y-1/2",
    sm: "tablet:h-6 tablet:px-2 tablet:gap-1 tablet:rounded-8 tablet:text-label-3-medium tablet:[&_svg]:size-4 tablet:pointer-coarse:before:absolute tablet:pointer-coarse:before:inset-x-0 tablet:pointer-coarse:before:top-1/2 tablet:pointer-coarse:before:h-11 tablet:pointer-coarse:before:-translate-y-1/2",
  },
  desktop: {
    lg: "desktop:h-10 desktop:px-4 desktop:gap-1 desktop:rounded-[10px] desktop:text-label-1-medium desktop:[&_svg]:size-5 desktop:pointer-coarse:before:content-none",
    md: "desktop:h-8 desktop:px-3 desktop:gap-1 desktop:rounded-8 desktop:text-label-2-medium desktop:[&_svg]:size-4 desktop:pointer-coarse:before:absolute desktop:pointer-coarse:before:inset-x-0 desktop:pointer-coarse:before:top-1/2 desktop:pointer-coarse:before:h-11 desktop:pointer-coarse:before:-translate-y-1/2",
    sm: "desktop:h-6 desktop:px-2 desktop:gap-1 desktop:rounded-8 desktop:text-label-3-medium desktop:[&_svg]:size-4 desktop:pointer-coarse:before:absolute desktop:pointer-coarse:before:inset-x-0 desktop:pointer-coarse:before:top-1/2 desktop:pointer-coarse:before:h-11 desktop:pointer-coarse:before:-translate-y-1/2",
  },
};

// 선택 칩(thumb)의 모서리: lg 10 · md·sm 8(항목과 같다)
const thumbClasses: ResponsiveClassTable<SegmentedControlSize> = {
  base: {
    lg: "rounded-[10px]",
    md: "rounded-8",
    sm: "rounded-8",
  },
  tablet: {
    lg: "tablet:rounded-[10px]",
    md: "tablet:rounded-8",
    sm: "tablet:rounded-8",
  },
  desktop: {
    lg: "desktop:rounded-[10px]",
    md: "desktop:rounded-8",
    sm: "desktop:rounded-8",
  },
};

const fullWidthClasses: ResponsiveClassTable<"true" | "false"> = {
  base: {
    true: "grid w-full",
    false: "inline-grid w-auto",
  },
  tablet: {
    true: "tablet:grid tablet:w-full",
    false: "tablet:inline-grid tablet:w-auto",
  },
  desktop: {
    true: "desktop:grid desktop:w-full",
    false: "desktop:inline-grid desktop:w-auto",
  },
};

/** 같은 영역의 보기 방식을 바로 바꾸는 토글형 선택 컨트롤. 항상 하나가 선택돼 있다 */
export function SegmentedControl({
  items,
  value,
  defaultValue,
  onChange,
  size = "md",
  fullWidth = false,
  className,
  ...props
}: SegmentedControlProps) {
  const [inner, setInner] = useState(() => defaultValue ?? items[0]?.value);
  const selected = value ?? inner;
  const itemRefs = useRef(new Map<string, HTMLButtonElement>());

  const select = (next: string) => {
    if (next === selected) return;
    if (value === undefined) setInner(next);
    onChange?.(next);
  };

  // 라디오처럼: ←/→(↑/↓)로 옆 항목으로 옮기며 선택, Home/End로 처음·끝
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const enabled = items.filter((item) => !item.disabled);
    const index = enabled.findIndex((item) => item.value === selected);
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
    itemRefs.current.get(next.value)?.focus();
  };

  // Tab으로 들어올 항목: 선택된 항목. 선택 값이 목록에 없으면 처음 누를 수 있는 항목
  const focusable = items.some((item) => item.value === selected && !item.disabled)
    ? selected
    : items.find((item) => !item.disabled)?.value;

  // 흰 칩은 항목 위가 아니라 트랙에 하나만 두고, 선택이 바뀌면 옆으로 미끄러진다(FDS와 같은 움직임).
  // 항목이 모두 같은 폭이라 위치를 재지 않고 "순번 × 칩 폭"으로 옮긴다: 서버 렌더 첫 화면부터 제자리이고, 폭이 바뀌어도 어긋나지 않는다
  const selectedIndex = items.findIndex((item) => item.value === selected);

  return (
    <div
      role="radiogroup"
      onKeyDown={onKeyDown}
      className={cn(
        "relative auto-cols-fr grid-flow-col bg-fill-neutral-weak p-1",
        responsiveClasses<boolean>(fullWidth, false, fullWidthClasses),
        responsiveClasses<SegmentedControlSize>(size, "md", trackClasses),
        className,
      )}
      {...props}
    >
      {selectedIndex >= 0 && (
        <span
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute inset-y-1 left-1 bg-fill-white shadow-[0_1px_1px_rgba(0,0,0,0.09)]",
            "transition-transform duration-250 ease-[cubic-bezier(0.4,0,0.2,1)] motion-reduce:transition-none",
            responsiveClasses<SegmentedControlSize>(size, "md", thumbClasses),
          )}
          style={{
            width: `calc((100% - 8px) / ${items.length})`,
            transform: `translateX(${selectedIndex * 100}%)`,
          }}
        />
      )}
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
            role="radio"
            aria-checked={on}
            // 묶음 안에서는 선택된 항목 하나만 Tab으로 들어온다(나머지는 화살표 키)
            tabIndex={item.value === focusable ? 0 : -1}
            disabled={item.disabled}
            onClick={() => select(item.value)}
            className={cn(
              "relative z-10 inline-flex min-w-0 cursor-pointer items-center justify-center whitespace-nowrap transition-colors duration-250 ease-[cubic-bezier(0.4,0,0.2,1)]",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus",
              "disabled:cursor-not-allowed disabled:text-text-disabled",
              "[&_svg]:shrink-0",
              responsiveClasses<SegmentedControlSize>(size, "md", itemClasses),
              // 선택: 흰 칩(아래 thumb) 위 글자 strong. 선택 안 됨: 트랙 그대로 · 글자 secondary
              on
                ? "text-text-strong"
                : "text-text-secondary enabled:hover:text-text-strong enabled:active:text-text-strong",
            )}
          >
            {item.icon}
            <span className="truncate">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}
