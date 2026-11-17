import { Box, Text } from "@futurewiz-rms/mint";

export default function Radius() {
  return (
    <>
      <Box tone="outline" radius={0} padding={16}>
        <Text variant="body-5-regular">0</Text>
      </Box>
      <Box tone="outline" padding={16}>
        <Text variant="body-5-regular">8(기본)</Text>
      </Box>
      <Box tone="outline" radius={16} padding={16}>
        <Text variant="body-5-regular">16</Text>
      </Box>
      <Box tone="outline" radius="full" padding={16}>
        <Text variant="body-5-regular">full</Text>
      </Box>
    </>
  );
}
