import { Diary } from "@futurewiz-rms/mint";

// 일정이 maxEvents(기본 2)를 넘으면 나머지 개수를 +N으로 알려요
export default function MoreEvents() {
  return (
    <Diary
      count={3}
      today="2026-11-18"
      events={{
        "2026-11-17": [{ label: "언락" }],
        "2026-11-18": [
          { label: "언락" },
          { label: "메인넷", color: "teal" },
          { label: "상장" },
          { label: "점검" },
        ],
      }}
      start="2026-11-17"
    />
  );
}
