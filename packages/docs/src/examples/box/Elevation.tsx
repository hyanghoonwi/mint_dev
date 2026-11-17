import { Box, Text } from "@futurewiz-rms/mint";

// raised는 화면에 붙은 카드, floating은 위에 떠 있는 상자(Popover가 쓰는 모양)예요
export default function Elevation() {
  return (
    <Box direction="horizontal" gap={24}>
      <Box elevation="raised" radius={12} padding={16} gap={4} className="w-[200px]">
        <Text variant="label-2-semibold">내 자산</Text>
        <Text variant="title-3-bold">1,250,000원</Text>
      </Box>
      <Box elevation="floating" radius={12} padding={16} gap={4} className="w-[200px]">
        <Text variant="label-2-semibold">떠 있는 상자</Text>
        <Text variant="body-4-regular" color="secondary">
          Popover 모양
        </Text>
      </Box>
    </Box>
  );
}
