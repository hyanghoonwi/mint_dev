import { Box, LiveStatus, Text } from "@futurewiz-rms/mint";

export default function NextToTitle() {
  return (
    <Box direction="horizontal" align="center" gap={12}>
      <Text variant="title-3-bold" as="h3">
        실시간 시세
      </Text>
      <LiveStatus />
    </Box>
  );
}
