import { Calendar } from "@futurewiz-rms/mint";

export default function Holidays() {
  return (
    // 공휴일은 계산할 수 없어서(음력·대체공휴일) 서비스가 가진 데이터를 넘긴다
    <Calendar
      today="2026-12-01"
      defaultMonth="2026-12"
      holidays={{ "2026-12-25": "성탄절" }}
      weekStartsOn={1}
      style={{ maxWidth: 360 }}
    />
  );
}
