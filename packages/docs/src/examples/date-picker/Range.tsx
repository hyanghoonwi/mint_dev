import { DatePicker } from "@futurewiz-rms/mint";

// min·max 밖의 날과 disabledDates는 고를 수 없어요(달력에서 흐리게 보이고, 입력해도 들어가지 않아요)
export default function Range() {
  return (
    <DatePicker
      label="예약일"
      helper="오늘부터 12월 31일까지 고를 수 있어요"
      today="2026-11-17"
      disabledDates={["2026-11-25"]}
      min="2026-11-17"
      max="2026-12-31"
    />
  );
}
