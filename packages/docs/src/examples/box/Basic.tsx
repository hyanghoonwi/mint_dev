import { Box, Text } from "@futurewiz-rms/mint";

export default function Basic() {
  return (
    <Box tone="outline" padding={16} gap={8} className="w-[240px]">
      <Text variant="label-2-semibold">오늘의 시세</Text>
      <Text variant="body-4-regular" color="secondary">
        BTC가 3.4% 올랐어요
      </Text>
    </Box>
  );
}
