import { Box, RatioBar } from "@futurewiz-rms/mint";

const items = [
  { label: "비트코인", value: 56.2 },
  { label: "이더리움", value: 11.8 },
  { label: "스테이블코인", value: 10.9 },
];

// 막대 높이는 lg 32 · md 24(기본) · sm 16이에요. sm은 막대 안 값이 없어요
export default function Sizes() {
  return (
    <Box gap={24}>
      <RatioBar size="lg" items={items} />
      <RatioBar size="md" items={items} />
      <RatioBar size="sm" items={items} />
    </Box>
  );
}
