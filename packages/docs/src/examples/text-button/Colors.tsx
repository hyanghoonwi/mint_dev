import { Box, TextButton } from "@futurewiz-rms/mint";

export default function Colors() {
  return (
    <Box direction="horizontal" gap={12}>
      <TextButton>자세히 보기</TextButton>
      <TextButton color="neutral">자세히 보기</TextButton>
    </Box>
  );
}
