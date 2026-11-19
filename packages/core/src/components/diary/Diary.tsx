"use client";

// 선택한 날(상태)과 가로 스크롤 위치(가장자리 흐림)를 가져서 클라이언트 컴포넌트다.
// 출처: Figma `Calendar Day Cell`(2467:123204 변형 14개)·`Calendar Day Strip`(2467:123316). 이름은 `Diary`로 정했다(2026-11 결정).
// 날짜는 모두 문자열(`YYYY-MM-DD`)이고, 오늘(`today`)은 사용하는 쪽이 넘긴다(렌더 중 현재 시각을 읽지 않는다).
// 날짜 계산은 _internal/date.ts의 UTC 순수 함수라서 서버·브라우저 결과가 같다.
// 접근성: 날짜 칸마다 버튼(`aria-pressed`로 선택, `aria-current="date"`로 오늘). 마우스는 끌어서 넘길 수 있다.
import { useEffect, useRef, useState, type ComponentProps } from "react";
import { cn } from "../../utils/cn";
import { Badge, type BadgeColor } from "../badge/Badge";
import { addDays, formatDayName, weekday, weekdayLabels } from "../_internal/date";
import { useControllableState } from "../_internal/useControllableState";
import { useDragScroll } from "../_internal/useDragScroll";

/** 날짜 칸에 쌓이는 일정 뱃지 하나 */
export interface DiaryEvent {
  /** 뱃지 문구. 1~4자로 짧게 쓴다(긴 제목은 날짜를 눌러 연 곳에서 보여 준다) */
  label: string;
  /** 일정 종류를 구분하는 색. 기본 `brand`. 종류와 색의 연결은 사용하는 쪽이 정하고 범례를 같이 보여 준다 */
  color?: BadgeColor;
}

export interface DiaryProps extends Omit<
  ComponentProps<"div">,
  "onChange" | "defaultValue" | "children"
> {
  /** 보여 줄 날짜 수. 기본 `7`. 화면보다 길면 가로로 넘겨 본다 */
  count?: number;
  /** 선택한 날(제어). 생략하면 컴포넌트가 직접 상태를 가진다 */
  value?: string | null;
  /** 처음 선택한 날(비제어) */
  defaultValue?: string;
  /** 오늘(`YYYY-MM-DD`, 필수). 서버·클라이언트 값이 같도록 사용하는 쪽이 넘긴다 */
  today: string;
  /** 공휴일(날짜 → 이름). 일요일처럼 빨간 글자로 보이고 이름이 스크린리더에 읽힌다 */
  holidays?: Record<string, string>;
  /** 누를 수 없는 날들 */
  disabledDates?: string[];
  /** 이 날보다 앞선 날은 흐려지고 누를 수 없다(지난 날 막기: `min={today}`) */
  min?: string;
  /** 날짜별 일정. `{ "2026-11-20": [{ label: "언락" }] }` */
  events?: Record<string, DiaryEvent[]>;
  /** 한 칸에 보여 줄 일정 뱃지 수. 넘치는 개수는 `+N`으로 알린다. 기본 `2` */
  maxEvents?: number;
  /** 첫 번째 칸의 날짜(`YYYY-MM-DD`, 필수). 여기서부터 `count`일을 이어서 보여 준다 */
  start: string;
  /** 날짜를 누르면 그 날짜로 불린다 */
  onChange?: (date: string) => void;
}

const labels = weekdayLabels(0);
// 가장자리 흐림(Figma Overlay Left 24px · Right 28px)
const fadeLeft = "bg-[linear-gradient(to_right,var(--mint-background-default),transparent)]";
const fadeRight = "bg-[linear-gradient(to_left,var(--mint-background-default),transparent)]";

/** 날짜별 일정을 가로로 넘겨 보는 날짜 칸 줄. 칸을 누르면 그날을 고른다 */
export function Diary({
  count = 7,
  value,
  defaultValue,
  today,
  holidays,
  disabledDates,
  min,
  events,
  maxEvents = 2,
  start,
  onChange,
  className,
  ...props
}: DiaryProps) {
  const [selected, select] = useControllableState<string | null>(
    value,
    defaultValue ?? null,
    onChange as ((next: string | null) => void) | undefined,
  );
  const blocked = new Set(disabledDates);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const { dragging, handlers } = useDragScroll(scrollerRef);
  const [edges, setEdges] = useState({ left: false, right: false });

  // 넘친 쪽 가장자리에만 흐림을 보여 준다
  const measure = () => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const left = scroller.scrollLeft > 0;
    const right = scroller.scrollLeft + scroller.clientWidth < scroller.scrollWidth - 1;
    setEdges((previous) =>
      previous.left === left && previous.right === right ? previous : { left, right },
    );
  };
  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [start, count]);

  const days = Array.from({ length: Math.max(count, 0) }, (_, index) => addDays(start, index));

  return (
    <div className={cn("relative w-full min-w-0 overflow-hidden", className)} {...props}>
      <div
        ref={scrollerRef}
        role="group"
        onScroll={measure}
        className={cn(
          "flex w-full overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          dragging && "cursor-grabbing select-none",
        )}
        {...handlers}
      >
        {days.map((date) => {
          const holiday = holidays?.[date];
          const isToday = date === today;
          const isSelected = date === selected;
          const disabled = (min !== undefined && date < min) || blocked.has(date);
          const dayEvents = events?.[date] ?? [];
          const shown = dayEvents.slice(0, maxEvents);
          const hidden = dayEvents.length - shown.length;
          // 오늘은 파랑, 일요일·공휴일은 빨강, 나머지는 기본(오늘이 가장 먼저)
          const tone = isToday ? "today" : weekday(date) === 0 || holiday ? "holiday" : "default";

          return (
            <button
              key={date}
              type="button"
              data-date={date}
              disabled={disabled}
              aria-pressed={isSelected}
              aria-current={isToday ? "date" : undefined}
              aria-label={[
                formatDayName(date),
                isToday && "오늘",
                holiday,
                dayEvents.length > 0 && `일정 ${dayEvents.length}개`,
              ]
                .filter(Boolean)
                .join(", ")}
              onClick={() => select(date)}
              className={cn(
                "relative flex min-h-[142px] w-24 shrink-0 cursor-pointer flex-col items-start gap-1 border-r border-solid border-border-default px-2 py-3 text-left transition-colors focus-visible:z-10 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-border-focus",
                isSelected ? "bg-fill-neutral-weak" : "bg-background-default",
                disabled
                  ? "cursor-not-allowed opacity-50"
                  : !isSelected && "hover:bg-fill-brand-weak active:bg-fill-brand-weak",
              )}
            >
              <span
                className={cn(
                  "text-caption-1-medium",
                  tone === "today"
                    ? "text-text-brand"
                    : tone === "holiday"
                      ? "text-text-up"
                      : "text-text-subtle",
                )}
              >
                {isToday ? "오늘" : labels[weekday(date)]}
              </span>
              <span
                className={cn(
                  "text-body-2-bold",
                  tone === "today"
                    ? "text-text-brand"
                    : tone === "holiday"
                      ? "text-text-up"
                      : "text-text-strong",
                )}
              >
                {Number(date.slice(8))}
              </span>
              {dayEvents.length > 0 && (
                <span aria-hidden="true" className="flex flex-col items-start gap-1">
                  {shown.map((event, index) => (
                    <Badge key={index} variant="weak" size="sm" color={event.color ?? "brand"}>
                      {event.label}
                    </Badge>
                  ))}
                  {hidden > 0 && (
                    <Badge variant="fill" color="neutral" size="md">
                      +{hidden}
                    </Badge>
                  )}
                </span>
              )}
              {/* 윗줄: 기본 1px 회색 · 오늘 2px 파랑 · 선택 2px 검정(오늘이면 파랑이 먼저) */}
              <span
                aria-hidden="true"
                className={cn(
                  "absolute top-0 left-0 -right-px",
                  isToday
                    ? "h-[2px] bg-border-brand"
                    : isSelected
                      ? "h-[2px] bg-border-selected"
                      : "h-px bg-border-strong",
                )}
              />
            </button>
          );
        })}
      </div>
      {edges.left && (
        <span
          aria-hidden="true"
          className={cn("pointer-events-none absolute inset-y-0 left-0 w-6", fadeLeft)}
        />
      )}
      {edges.right && (
        <span
          aria-hidden="true"
          className={cn("pointer-events-none absolute inset-y-0 right-0 w-7", fadeRight)}
        />
      )}
    </div>
  );
}
