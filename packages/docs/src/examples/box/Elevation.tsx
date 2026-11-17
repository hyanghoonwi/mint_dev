import { Box, Text } from "@futurewiz-rms/mint";

export default function Elevation() {
  return (
    <Box elevation="raised" radius={12} padding={16} gap={4} className="w-[200px]">
      <Text variant="label-2-semibold">내 자산</Text>
      <Text variant="title-3-bold">1,250,000원</Text>
    </Box>
  );
}
