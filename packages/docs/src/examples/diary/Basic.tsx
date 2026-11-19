"use client";
import { useState } from "react";
import { Box, Diary, Text } from "@futurewiz-rms/mint";

// 칸을 누르면 그날을 골라요. 시작일(start)과 오늘(today)은 꼭 넘겨요
export default function Basic() {
  const [date, setDate] = useState<string | null>("2026-11-20");
  return (
    <Box gap={12}>
      <Diary
        value={date}
        today="2026-11-18"
        events={{
          "2026-11-18": [{ label: "언락" }, { label: "메인넷", color: "teal" }],
          "2026-11-20": [{ label: "언락" }],
        }}
        start="2026-11-15"
        onChange={setDate}
      />
      <Text variant="body-3-regular" color="secondary">
        고른 날: {date ?? "없음"}
      </Text>
    </Box>
  );
}
