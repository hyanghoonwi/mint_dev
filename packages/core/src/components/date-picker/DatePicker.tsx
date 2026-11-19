"use client";

// 입력한 글자·열림 상태를 가져서 클라이언트 컴포넌트다.
// 디자인 시안이 확정되지 않은 컴포넌트다(시안 확정 전에 제품 요구로 추가, 2026-11). TextField + Popover + Calendar를 묶어서
// "입력 칸을 누르면 달력이 뜨고, 고른 날짜가 칸에 들어가는" 동작을 한 번에 준다. 모양은 세 컴포넌트를 그대로 따른다.
// 날짜는 문자열(`YYYY-MM-DD`)이고 오늘(`today`)은 사용하는 쪽이 넘긴다(렌더 중 현재 시각을 읽지 않는다).
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { useControllableState } from "../_internal/useControllableState";
import { daysInMonth, parseDate } from "../_internal/date";
import { Calendar } from "../calendar/Calendar";
import { CalendarBlankIcon } from "../icon/icons.generated";
import { Popover } from "../popover/Popover";
import { TextField, type TextFieldProps } from "../text-field/TextField";

export interface DatePickerProps extends Omit<
  TextFieldProps,
  "value" | "defaultValue" | "onChange" | "type" | "leftAddon" | "rightAddon" | "min" | "max"
> {
  /** 고른 날(`YYYY-MM-DD`, 제어). 비어 있으면 `""` */
  value?: string;
  /** 처음 고른 날(비제어) */
  defaultValue?: string;
  /** 오늘(`YYYY-MM-DD`, 필수). 서버·클라이언트 값이 같도록 사용하는 쪽이 넘긴다 */
  today: string;
  /** 공휴일(날짜 → 이름). 달력에서 빨간 글자로 보인다 */
  holidays?: Record<string, string>;
  /** 고를 수 없는 날들 */
  disabledDates?: string[];
  /** 고를 수 있는 처음·마지막 날(포함) */
  min?: string;
  max?: string;
  /** 주의 시작 요일. 0 일요일(기본) · 1 월요일 */
  weekStartsOn?: 0 | 1;
  /** 날짜가 바뀔 때. 달력에서 고르거나 올바른 날짜를 다 입력했을 때, 지우면 `""` */
  onChange?: (date: string) => void;
}

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

/**
 * 날짜를 입력받는 칸. 칸을 누르거나 ↓·Enter를 누르면 달력이 뜨고, 고른 날짜가 `YYYY-MM-DD`로 들어간다.
 * 직접 입력해도 되고, 올바르지 않은 날짜는 칸을 벗어날 때 원래 값으로 돌아간다.
 */
export function DatePicker({
  placeholder = "YYYY-MM-DD",
  value: valueProp,
  defaultValue = "",
  disabled,
  readOnly,
  today,
  holidays,
  disabledDates,
  min,
  max,
  weekStartsOn,
  onBlur,
  onChange,
  ...props
}: DatePickerProps) {
  const [value, setValue] = useControllableState(valueProp, defaultValue, onChange);
  const [text, setText] = useState(value);
  const [open, setOpen] = useState(false);
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const fieldRef = useRef<HTMLElement | null>(null);

  // 바깥에서 값이 바뀌면(제어·달력에서 고름) 칸의 글자도 맞춘다. 렌더 중에 비교해서 바로 맞춘다(effect를 쓰지 않음)
  const [syncedValue, setSyncedValue] = useState(value);
  if (value !== syncedValue) {
    setSyncedValue(value);
    setText(value);
  }

  const selectable = (date: string) => {
    if (!DATE_PATTERN.test(date)) return false;
    const [year, month, day] = parseDate(date);
    if (month < 1 || month > 12 || day < 1 || day > daysInMonth(year, month)) return false;
    if ((min && date < min) || (max && date > max)) return false;
    return !disabledDates?.includes(date);
  };

  const canOpen = !disabled && !readOnly;
  const openWith = (keyboard: boolean) => {
    if (!canOpen) return;
    setKeyboardOpen(keyboard);
    setOpen(true);
  };

  // 칸 상자 어디를 눌러도 연다(글자 영역뿐 아니라 왼쪽 여백·오른쪽 달력 아이콘도). 지우기(×) 버튼은 제외한다
  const openRef = useRef(openWith);
  useEffect(() => {
    openRef.current = openWith;
  });
  useEffect(() => {
    const field = fieldRef.current;
    if (!field) return;
    const handleClick = (event: MouseEvent) => {
      if (event.target instanceof Element && event.target.closest("button")) return;
      openRef.current(false);
    };
    field.addEventListener("click", handleClick);
    return () => field.removeEventListener("click", handleClick);
  }, []);

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown" || (event.key === "Enter" && !open)) {
      event.preventDefault();
      openWith(true);
    }
    // Tab으로 칸을 떠나면 달력을 닫는다(달력 안으로 들어가려면 ↓)
    if (event.key === "Tab") setOpen(false);
  };

  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
      anchorRef={fieldRef}
      autoFocus={keyboardOpen}
      initialFocus='[role="grid"] button[tabindex="0"]'
      aria-label="날짜 고르기"
      className="w-[320px] max-w-[calc(100vw-16px)]"
      // Popover의 열기·닫기 토글(onClick)은 쓰지 않는다. 칸을 누르면 열기만 한다(입력 중에 닫히지 않게)
      trigger={(triggerProps) => (
        <TextField
          {...props}
          {...triggerProps}
          onClick={props.onClick}
          ref={(element) => {
            inputRef.current = element;
            // 달력은 라벨·도움말이 아닌 입력 칸 바로 아래에 붙는다
            fieldRef.current = element?.parentElement ?? null;
          }}
          value={text}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          inputMode="numeric"
          autoComplete="off"
          rightAddon={<CalendarBlankIcon />}
          onKeyDown={handleKeyDown}
          onChange={(event) => {
            const next = event.target.value;
            setText(next);
            if (next === "") setValue("");
            else if (selectable(next)) setValue(next);
          }}
          onBlur={(event) => {
            // 끝까지 입력하지 않았거나 고를 수 없는 날짜면 원래 값으로 돌린다
            if (text !== "" && !selectable(text)) setText(value);
            onBlur?.(event);
          }}
        />
      )}
    >
      <Calendar
        today={today}
        value={value || null}
        min={min}
        max={max}
        disabledDates={disabledDates}
        holidays={holidays}
        weekStartsOn={weekStartsOn}
        onChange={(date) => {
          setValue(date);
          setText(date);
          setOpen(false);
          inputRef.current?.focus();
        }}
      />
    </Popover>
  );
}
