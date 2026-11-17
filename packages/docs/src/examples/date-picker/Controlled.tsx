"use client";
import { useState } from "react";
import { Box, DatePicker, Text } from "@futurewiz-rms/mint";

// 값을 직접 들고 있으려면 value·onChange를 써요. 지우면 ""가 와요
export default function Controlled() {
  const [date, setDate] = useState("2026-11-17");
  return (
    <Box gap={8}>
      <DatePicker label="거래일" value={date} today="2026-11-17" onChange={setDate} />
      <Text variant="body-3-regular" color="secondary">
        고른 날: {date || "없음"}
      </Text>
    </Box>
  );
}
