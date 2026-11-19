import { Box, RatioBar } from "@futurewiz-rms/mint";

// 구간은 3~5개예요. 구간 수마다 색 순서가 정해져 있어요(앞에서부터 진한 색).
// 값의 자릿수가 섞이면(9, 56.2) fractionDigits로 맞춰요
export default function Segments() {
  return (
    <Box gap={24}>
      <RatioBar
        items={[
          { label: "비트코인", value: 56.2 },
          { label: "이더리움", value: 11.8 },
          { label: "스테이블코인", value: 10.9 },
          { label: "기타 암호화폐", value: 21.1 },
        ]}
      />
      <RatioBar
        items={[
          { label: "비트코인", value: 56.2 },
          { label: "이더리움", value: 11.8 },
          { label: "스테이블코인", value: 10.9 },
          { label: "기타 암호화폐", value: 9 },
          { label: "알트코인", value: 12.1 },
        ]}
        fractionDigits={1}
      />
    </Box>
  );
}
