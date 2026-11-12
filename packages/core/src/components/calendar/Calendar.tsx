"use client";

// 보이는 달·키보드 이동(포커스)을 상태로 가져서 클라이언트 컴포넌트다.
// ⚠️ 임시 컴포넌트: Figma 시안 전이라 칸 크기·점·색은 임시 값이다. 시안이 나오면 맞춘다(API는 설계안대로).
// 날짜는 모두 문자열(`YYYY-MM-DD`, 달은 `YYYY-MM`)이고, 오늘(`today`)은 사용하는 쪽이 넘긴다(렌더 중 현재 시각을 읽지 않는다).
// 날짜 계산은 _internal/date.ts의 UTC 순수 함수라서 서버·브라우저 결과가 같다. 날짜 라이브러리를 쓰지 않는다.
// 접근성: role="grid" 표, 칸마다 버튼. ←→↑↓ 하루·한 주, PageUp·PageDown 이전·다음 달, Home·End 주의 처음·끝.
import { useEffect, useRef, useState, type ComponentProps, type KeyboardEvent } from "react";
import { cn } from "../../utils/cn";
import {
  responsiveClasses,
  type Responsive,
  type ResponsiveClassTable,
} from "../../utils/responsive";
import {
  addDays,
  addMonths,
  daysInMonth,
  formatDate,
  formatDayName,
  formatMonthTitle,
  monthGrid,
  monthOf,
  parseDate,
  weekday,
  weekdayLabels,
} from "../_internal/date";
import { CaretLeftIcon, CaretRightIcon } from "../icon/icons.generated";
import { IconButton } from "../icon-button/IconButton";

export type CalendarSize = "md" | "lg";
export type CalendarMarkColor = "brand" | "danger" | "success" | "neutral";

/** 날짜 밑에 찍히는 점 하나 */
export interface CalendarMark {
  /** 점 색. 기본 `brand`. 일정 종류와 색의 연결은 사용하는 쪽이 정한다 */
  color?: CalendarMarkColor;
  /** 스크린리더가 읽을 이름(예: "결제일"). 없으면 "일정"으로 센다 */
  label?: string;
}

export interface CalendarProps extends Omit<
  ComponentProps<"div">,
  "onChange" | "defaultValue" | "children"
> {
  /** 오늘(`YYYY-MM-DD`, 필수). 서버·클라이언트 값이 같도록 사용하는 쪽이 넘긴다 */
  today: string;
  /** 선택한 날(제어). 생략하면 컴포넌트가 직접 상태를 가진다 */
  value?: string | null;
  /** 처음 선택한 날(비제어) */
  defaultValue?: string;
  /** 날짜를 누르면 그 날짜로 불린다 */
  onChange?: (date: string) => void;
  /** 보이는 달(`YYYY-MM`, 제어) */
  month?: string;
  /** 처음 보이는 달(비제어). 기본은 선택한 날의 달, 없으면 오늘의 달 */
  defaultMonth?: string;
  /** 보이는 달이 바뀌면 불린다. 여기서 그 달의 일정(`marks`)을 불러온다 */
  onMonthChange?: (month: string) => void;
  /** 날짜별 점(최대 3개까지 보인다). `{ "2026-11-12": [{ color: "brand" }] }` */
  marks?: Record<string, CalendarMark[]>;
  /** 공휴일(날짜 → 이름). 일요일처럼 빨간 글자로 보이고 이름이 스크린리더에 읽힌다 */
  holidays?: Record<string, string>;
  /** 고를 수 있는 처음·마지막 날(포함) */
  min?: string;
  max?: string;
  /** 고를 수 없는 날들 */
  disabledDates?: string[];
  /** 주의 시작 요일. 0 일요일(기본) · 1 월요일 */
  weekStartsOn?: 0 | 1;
  /**
   * `md` 칸 높이 48(기본) · `lg` 56(모바일 주요 화면). 폭은 부모를 꽉 채워 7칸으로 나눈다.
   * 구간별로 바꾸려면 객체를 준다: `{ base: "lg", desktop: "md" }`
   */
  size?: Responsive<CalendarSize>;
}

// 칸 높이(임시): md 48 · lg 56
const cellClasses: ResponsiveClassTable<CalendarSize> = {
  base: {
    md: "h-12",
    lg: "h-14",
  },
  tablet: {
    md: "tablet:h-12",
    lg: "tablet:h-14",
  },
  desktop: {
    md: "desktop:h-12",
    lg: "desktop:h-14",
  },
};

// 날짜 숫자 원(임시): md 32 · lg 40
const numberClasses: ResponsiveClassTable<CalendarSize> = {
  base: {
    md: "size-8 text-body-4-medium",
    lg: "size-10 text-body-2-medium",
  },
  tablet: {
    md: "tablet:size-8 tablet:text-body-4-medium",
    lg: "tablet:size-10 tablet:text-body-2-medium",
  },
  desktop: {
    md: "desktop:size-8 desktop:text-body-4-medium",
    lg: "desktop:size-10 desktop:text-body-2-medium",
  },
};

const markColors: Record<CalendarMarkColor, string> = {
  brand: "bg-fill-brand",
  danger: "bg-fill-danger",
  success: "bg-fill-success",
  neutral: "bg-fill-neutral",
};

const MAX_MARKS = 3;

/** 날짜·월 단위로 고르는 달력. 날짜 밑에 일정 점을 보여 줄 수 있다 */
export function Calendar({
  today,
  value,
  defaultValue,
  onChange,
  month,
  defaultMonth,
  onMonthChange,
  marks,
  holidays,
  min,
  max,
  disabledDates,
  weekStartsOn = 0,
  size = "md",
  className,
  ...props
}: CalendarProps) {
  const [innerValue, setInnerValue] = useState(defaultValue ?? null);
  const selected = value === undefined ? innerValue : value;
  const [innerMonth, setInnerMonth] = useState(() => defaultMonth ?? monthOf(selected ?? today));
  const visibleMonth = month ?? innerMonth;

  // 키보드로 옮겨 다니는 칸. 보이는 달 안이면 그 칸, 아니면 선택한 날·오늘·1일 순
  const [active, setActive] = useState<string | null>(null);
  const focusAfterRender = useRef(false);
  const gridRef = useRef<HTMLDivElement>(null);

  const days = monthGrid(visibleMonth, weekStartsOn);
  const inMonth = (date: string) => monthOf(date) === visibleMonth;
  const blocked = new Set(disabledDates);
  const isDisabled = (date: string) =>
    (min !== undefined && date < min) || (max !== undefined && date > max) || blocked.has(date);

  const focusable =
    [active, selected, today, `${visibleMonth}-01`].find(
      (date): date is string => !!date && inMonth(date),
    ) ?? `${visibleMonth}-01`;

  // 키보드로 옮긴 뒤에만 그 칸에 포커스를 준다(처음 그릴 때는 포커스를 빼앗지 않는다)
  useEffect(() => {
    if (!focusAfterRender.current) return;
    focusAfterRender.current = false;
    gridRef.current?.querySelector<HTMLButtonElement>(`[data-date="${focusable}"]`)?.focus();
  });

  const changeMonth = (next: string) => {
    if (month === undefined) setInnerMonth(next);
    onMonthChange?.(next);
  };

  const select = (date: string) => {
    if (isDisabled(date)) return;
    if (value === undefined) setInnerValue(date);
    setActive(date);
    onChange?.(date);
  };

  const moveTo = (date: string) => {
    setActive(date);
    focusAfterRender.current = true;
    if (!inMonth(date)) changeMonth(monthOf(date));
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const from = focusable;
    const offset = (weekday(from) - weekStartsOn + 7) % 7;
    const moves: Record<string, () => string> = {
      ArrowLeft: () => addDays(from, -1),
      ArrowRight: () => addDays(from, 1),
      ArrowUp: () => addDays(from, -7),
      ArrowDown: () => addDays(from, 7),
      Home: () => addDays(from, -offset),
      End: () => addDays(from, 6 - offset),
      PageUp: () => clampDay(addMonths(monthOf(from), -1), from),
      PageDown: () => clampDay(addMonths(monthOf(from), 1), from),
    };
    const move = moves[event.key];
    if (!move) return;
    event.preventDefault();
    moveTo(move());
  };

  const title = formatMonthTitle(visibleMonth);
  const previousMonth = addMonths(visibleMonth, -1);
  const nextMonth = addMonths(visibleMonth, 1);
  const previousDisabled = min !== undefined && `${previousMonth}-31` < min;
  const nextDisabled = max !== undefined && `${nextMonth}-01` > max;

  return (
    <div className={cn("flex w-full flex-col gap-2", className)} {...props}>
      <div className="flex items-center justify-between">
        <IconButton
          size="sm"
          icon={<CaretLeftIcon />}
          aria-label="이전 달"
          disabled={previousDisabled}
          onClick={() => changeMonth(previousMonth)}
        />
        {/* 달이 바뀌면 스크린리더가 새 달을 읽는다 */}
        <span className="text-heading-3-bold text-text-strong" aria-live="polite">
          {title}
        </span>
        <IconButton
          size="sm"
          icon={<CaretRightIcon />}
          aria-label="다음 달"
          disabled={nextDisabled}
          onClick={() => changeMonth(nextMonth)}
        />
      </div>

      <div ref={gridRef} role="grid" aria-label={title} onKeyDown={onKeyDown}>
        <div role="row" className="grid grid-cols-7">
          {weekdayLabels(weekStartsOn).map((label, columnIndex) => {
            const day = (columnIndex + weekStartsOn) % 7;
            return (
              <span
                key={label}
                role="columnheader"
                className={cn(
                  "flex h-8 items-center justify-center text-caption-1-medium",
                  day === 0
                    ? "text-text-danger"
                    : day === 6
                      ? "text-text-brand"
                      : "text-text-tertiary",
                )}
              >
                {label}
              </span>
            );
          })}
        </div>

        {Array.from({ length: 6 }, (_, week) => (
          <div key={week} role="row" className="grid grid-cols-7">
            {days.slice(week * 7, week * 7 + 7).map((date) => {
              const outside = !inMonth(date);
              const disabled = outside || isDisabled(date);
              const isSelected = date === selected && !outside;
              const isToday = date === today;
              const holiday = holidays?.[date];
              const day = weekday(date);
              const dayMarks = outside ? [] : (marks?.[date] ?? []);
              const markText =
                dayMarks.length === 0
                  ? ""
                  : dayMarks.some((mark) => mark.label)
                    ? dayMarks.map((mark) => mark.label ?? "일정").join(", ")
                    : `일정 ${dayMarks.length}개`;

              return (
                <div
                  key={date}
                  role="gridcell"
                  aria-selected={isSelected || undefined}
                  className={cn(
                    "flex justify-center",
                    responsiveClasses<CalendarSize>(size, "md", cellClasses),
                  )}
                >
                  {outside ? (
                    // 앞뒤 달 날짜는 흐린 숫자만(누를 수 없음, 스크린리더는 건너뜀)
                    <span
                      aria-hidden="true"
                      className={cn(
                        "flex items-center justify-center rounded-full text-text-disabled",
                        responsiveClasses<CalendarSize>(size, "md", numberClasses),
                      )}
                    >
                      {Number(date.slice(8))}
                    </span>
                  ) : (
                    <button
                      type="button"
                      data-date={date}
                      tabIndex={date === focusable ? 0 : -1}
                      disabled={disabled}
                      aria-current={isToday ? "date" : undefined}
                      aria-label={[formatDayName(date), isToday && "오늘", holiday, markText]
                        .filter(Boolean)
                        .join(", ")}
                      onClick={() => select(date)}
                      className="group/day relative flex cursor-pointer flex-col items-center gap-1 rounded-8 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus disabled:cursor-not-allowed"
                    >
                      <span
                        className={cn(
                          "flex items-center justify-center rounded-full transition-colors",
                          responsiveClasses<CalendarSize>(size, "md", numberClasses),
                          isSelected
                            ? "bg-fill-brand text-text-on-fill"
                            : cn(
                                disabled
                                  ? "text-text-disabled"
                                  : holiday || day === 0
                                    ? "text-text-danger"
                                    : day === 6
                                      ? "text-text-brand"
                                      : "text-text-primary",
                                !disabled &&
                                  "group-hover/day:bg-fill-pressed group-active/day:bg-fill-pressed",
                                // 오늘: 색만이 아니라 테두리로도 알린다
                                isToday && "border border-border-brand",
                              ),
                        )}
                      >
                        {Number(date.slice(8))}
                      </span>
                      <span aria-hidden="true" className="flex h-1 gap-[3px]">
                        {dayMarks.slice(0, MAX_MARKS).map((mark, markIndex) => (
                          <span
                            key={markIndex}
                            className={cn(
                              "size-1 rounded-full",
                              disabled ? "bg-fill-disabled" : markColors[mark.color ?? "brand"],
                            )}
                          />
                        ))}
                      </span>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

/** 같은 일(day)의 다른 달 날짜. 그 달에 없는 날(31일 등)이면 그 달의 마지막 날 */
function clampDay(month: string, from: string) {
  const [year, monthNumber] = parseDate(month);
  return formatDate(
    year,
    monthNumber,
    Math.min(Number(from.slice(8)), daysInMonth(year, monthNumber)),
  );
}
