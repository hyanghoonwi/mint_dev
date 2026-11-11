"use client";

import { useState } from "react";
import { Calendar, Text, type CalendarMark } from "@futurewiz-rms/mint";

// 실제로는 onMonthChange에서 그 달의 일정을 서버에 요청한다(예시는 달마다 고정된 데이터)
const schedules: Record<string, Record<string, CalendarMark[]>> = {
  "2026-11": {
    "2026-11-03": [{ color: "brand", label: "결제일" }],
    "2026-11-12": [{ color: "brand", label: "정기 점검" }],
    "2026-11-20": [
      { color: "brand", label: "결제일" },
      { color: "danger", label: "마감" },
    ],
  },
  "2026-12": {
    "2026-12-03": [{ color: "brand", label: "결제일" }],
    "2026-12-24": [{ color: "success", label: "이벤트" }],
  },
};

export default function Schedule() {
  const [date, setDate] = useState<string | null>("2026-11-12");
  const [month, setMonth] = useState("2026-11");
  const marks = schedules[month] ?? {};
  const selected = date ? marks[date] : undefined;

  return (
    <div
      style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%", maxWidth: 360 }}
    >
      <Calendar
        today="2026-11-11"
        value={date}
        onChange={setDate}
        month={month}
        onMonthChange={setMonth}
        marks={marks}
      />
      <Text variant="body-3-regular" color="secondary">
        {date
          ? `${date} · ${selected ? selected.map((mark) => mark.label).join(", ") : "일정 없음"}`
          : "날짜를 골라 주세요"}
      </Text>
    </div>
  );
}
