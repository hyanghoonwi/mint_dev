import { Diary } from "@futurewiz-rms/mint";

// 일요일은 자동으로 빨간 글자예요. 공휴일은 계산할 수 없어서 holidays로 넘겨요
export default function Holidays() {
  return <Diary today="2026-11-18" holidays={{ "2026-11-17": "임시 공휴일" }} />;
}
