// 날짜 계산(공개하지 않는 내부 구현). 날짜는 모두 문자열 `YYYY-MM-DD`, 달은 `YYYY-MM`이다.
// 계산은 UTC 기준 순수 함수라 서버(UTC)와 브라우저(KST)의 결과가 같다(시간대 때문에 하루가 밀리지 않는다).
// 현재 시각은 읽지 않는다(오늘은 사용하는 쪽이 넘긴다).

const pad = (value: number) => String(value).padStart(2, "0");

/** "2026-11-12" → [2026, 11, 12] */
export function parseDate(date: string): [number, number, number] {
  const [year, month, day] = date.split("-").map(Number);
  return [year, month, day ?? 1];
}

export const formatDate = (year: number, month: number, day: number) =>
  `${year}-${pad(month)}-${pad(day)}`;
export const formatMonth = (year: number, month: number) => `${year}-${pad(month)}`;

/** 그 달의 일수(윤년 포함) */
export const daysInMonth = (year: number, month: number) =>
  new Date(Date.UTC(year, month, 0)).getUTCDate();

/** 요일. 0 일요일 ~ 6 토요일 */
export function weekday(date: string) {
  const [year, month, day] = parseDate(date);
  return new Date(Date.UTC(year, month - 1, day)).getUTCDay();
}

/** "2026-11" + 1 → "2026-12" */
export function addMonths(month: string, count: number) {
  const [year, monthNumber] = parseDate(month);
  const index = year * 12 + (monthNumber - 1) + count;
  return formatMonth(Math.floor(index / 12), (index % 12) + 1);
}

/** 날짜에 count일을 더한다(달·해를 넘어간다) */
export function addDays(date: string, count: number) {
  const [year, month, day] = parseDate(date);
  const next = new Date(Date.UTC(year, month - 1, day + count));
  return formatDate(next.getUTCFullYear(), next.getUTCMonth() + 1, next.getUTCDate());
}

/** 날짜가 속한 달 "YYYY-MM" */
export const monthOf = (date: string) => date.slice(0, 7);

/**
 * 달력 칸(6주 × 7칸 = 42칸). 첫 주는 앞 달 날짜로, 마지막은 다음 달 날짜로 채운다.
 * `weekStartsOn` 0이면 일요일부터, 1이면 월요일부터
 */
export function monthGrid(month: string, weekStartsOn: 0 | 1): string[] {
  const first = `${month}-01`;
  const lead = (weekday(first) - weekStartsOn + 7) % 7;
  const start = addDays(first, -lead);
  return Array.from({ length: 42 }, (_, cellIndex) => addDays(start, cellIndex));
}

/** 한국어 표시 글자. Intl을 UTC로 고정해서 서버·브라우저 결과가 같다 */
const monthTitle = new Intl.DateTimeFormat("ko-KR", {
  year: "numeric",
  month: "long",
  timeZone: "UTC",
});
const dayName = new Intl.DateTimeFormat("ko-KR", {
  month: "long",
  day: "numeric",
  weekday: "long",
  timeZone: "UTC",
});
const weekdayShort = new Intl.DateTimeFormat("ko-KR", { weekday: "short", timeZone: "UTC" });

const toUTC = (date: string) => {
  const [year, month, day] = parseDate(date);
  return new Date(Date.UTC(year, month - 1, day));
};

/** "2026년 11월" */
export const formatMonthTitle = (month: string) => monthTitle.format(toUTC(`${month}-01`));
/** "11월 12일 수요일" */
export const formatDayName = (date: string) => dayName.format(toUTC(date));
/** 요일 머리글 7개("일"…"토"). 2023-01-01은 일요일 */
export const weekdayLabels = (weekStartsOn: 0 | 1) =>
  Array.from({ length: 7 }, (_, dayIndex) =>
    weekdayShort.format(toUTC(addDays("2023-01-01", dayIndex + weekStartsOn))),
  );
