import { Box, ProgressBar } from "@futurewiz-rms/mint";

// value는 0~100(%)이에요. 폭은 부모를 채우고, 이름은 aria-label로 꼭 알려요
export default function Basic() {
  return (
    <Box gap={16} className="w-full">
      {[0, 25, 50, 75, 100].map((value) => (
        <ProgressBar key={value} value={value} aria-label={`진행 ${value}%`} />
      ))}
    </Box>
  );
}
