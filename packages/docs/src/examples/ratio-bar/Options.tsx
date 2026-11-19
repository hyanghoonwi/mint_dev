import { Box, RatioBar } from "@futurewiz-rms/mint";

const items = [
  { label: "비트코인", value: 56.2 },
  { label: "이더리움", value: 11.8 },
  { label: "스테이블코인", value: 10.9 },
];

// legend={false}면 범례를 끄고, showValues={false}면 막대 안 값을 숨겨요
export default function Options() {
  return (
    <Box gap={24}>
      <RatioBar size="lg" items={items} legend={false} />
      <RatioBar size="lg" items={items} showValues={false} />
    </Box>
  );
}
