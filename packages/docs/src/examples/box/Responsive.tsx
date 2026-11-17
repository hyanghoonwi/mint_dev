import { Box, Text } from "@futurewiz-rms/mint";

export default function Responsive() {
  return (
    // 모바일·태블릿은 세로·여백 16·간격 8, 데스크톱(1024px~)부터 가로·여백 24·간격 16
    <Box
      tone="outline"
      direction={{ base: "vertical", desktop: "horizontal" }}
      padding={{ base: 16, desktop: 24 }}
      gap={{ base: 8, desktop: 16 }}
      className="w-full"
    >
      <Text variant="label-2-semibold">거래량</Text>
      <Text variant="body-4-regular" color="secondary">
        창 폭을 바꿔 보세요
      </Text>
    </Box>
  );
}
