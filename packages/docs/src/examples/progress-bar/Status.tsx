import { Box, ProgressBar } from "@futurewiz-rms/mint";

// 진행 중(normal, brand) · 실패(negative, danger) · 완료(positive, success)
export default function Status() {
  return (
    <Box gap={16} className="w-full">
      <ProgressBar value={60} aria-label="업로드 진행" />
      <ProgressBar value={60} status="negative" aria-label="업로드 실패" />
      <ProgressBar value={100} status="positive" aria-label="업로드 완료" />
    </Box>
  );
}
