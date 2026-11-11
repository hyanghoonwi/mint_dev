import { Calendar } from "@futurewiz-rms/mint";

export default function Range() {
  return (
    // 오늘부터 2주 안에서만 고르고, 점검일은 막는다
    <Calendar
      today="2026-11-11"
      min="2026-11-11"
      max="2026-11-25"
      disabledDates={["2026-11-18"]}
      style={{ maxWidth: 360 }}
    />
  );
}
