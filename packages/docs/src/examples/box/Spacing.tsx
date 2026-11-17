import { Box, Text } from "@futurewiz-rms/mint";

export default function Spacing() {
  return (
    <>
      <Box tone="outline" padding={8} gap={4}>
        <Text variant="body-5-regular">padding 8 · gap 4</Text>
        <Text variant="body-5-regular">항목</Text>
      </Box>
      <Box tone="outline" padding={16} gap={8}>
        <Text variant="body-5-regular">padding 16 · gap 8</Text>
        <Text variant="body-5-regular">항목</Text>
      </Box>
      <Box tone="outline" padding={24} gap={16}>
        <Text variant="body-5-regular">padding 24 · gap 16</Text>
        <Text variant="body-5-regular">항목</Text>
      </Box>
    </>
  );
}
