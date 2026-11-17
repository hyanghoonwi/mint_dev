import { Box, Text } from "@futurewiz-rms/mint";

export default function ToneBackground() {
  return (
    // tone은 테두리만 정해요. 배경은 className에 같은 의미의 색 토큰(fill/*-weak)을 넣어 짝을 맞춰요
    <>
      <Box tone="brand" padding={16} className="bg-fill-brand-weak">
        <Text variant="body-4-medium">새 기능</Text>
      </Box>
      <Box tone="success" padding={16} className="bg-fill-success-weak">
        <Text variant="body-4-medium">입금 완료</Text>
      </Box>
      <Box tone="warning" padding={16} className="bg-fill-warning-weak">
        <Text variant="body-4-medium">점검 예정</Text>
      </Box>
      <Box tone="danger" padding={16} className="bg-fill-danger-weak">
        <Text variant="body-4-medium">출금 실패</Text>
      </Box>
    </>
  );
}
