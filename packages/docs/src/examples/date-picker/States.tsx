import { Box, DatePicker } from "@futurewiz-rms/mint";

// 상태는 TextField와 같아요. 비활성·읽기 전용은 달력이 열리지 않아요
export default function States() {
  return (
    <Box gap={16}>
      <DatePicker
        label="오류"
        helper="날짜를 골라 주세요"
        status="negative"
        required
        today="2026-11-17"
      />
      <DatePicker label="비활성" defaultValue="2026-11-17" disabled today="2026-11-17" />
      <DatePicker label="읽기 전용" defaultValue="2026-11-17" readOnly today="2026-11-17" />
    </Box>
  );
}
