import { Diary } from "@futurewiz-rms/mint";

// min보다 앞선 날은 흐려지고 누를 수 없어요. 지난 날을 막으려면 min에 오늘을 넘겨요
export default function PastDays() {
  return <Diary today="2026-11-18" min="2026-11-18" start="2026-11-15" />;
}
