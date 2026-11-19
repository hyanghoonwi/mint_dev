import { Box, ProgressBar } from "@futurewiz-rms/mint";

// 증감처럼 0을 기준으로 양쪽으로 벌어지는 값이에요(−100 ~ 100).
// 양수는 오른쪽 빨강, 음수는 왼쪽 파랑이고, 0은 가운데 점만 보여요
export default function Diverging() {
  return (
    <Box gap={16} className="w-full">
      <ProgressBar value={50} type="diverging" aria-label="상승 50" />
      <ProgressBar value={-50} type="diverging" aria-label="하락 50" />
      <ProgressBar value={0} type="diverging" aria-label="변화 없음" />
    </Box>
  );
}
