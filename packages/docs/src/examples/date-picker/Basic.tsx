import { DatePicker } from "@futurewiz-rms/mint";

// 칸을 누르면 달력이 뜨고, 고른 날짜가 YYYY-MM-DD로 들어가요. 오늘(today)은 꼭 넘겨요
export default function Basic() {
  return <DatePicker label="시작일" helper="직접 입력해도 돼요" today="2026-11-17" />;
}
