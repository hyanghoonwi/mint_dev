import { Badge, Box, Text } from "@futurewiz-rms/mint";

export default function WithTitle() {
  return (
    <Box direction="horizontal" align="center" gap={8}>
      <Text variant="heading-2-bold" color="strong" as="strong">
        비트코인 리포트
      </Text>
      <Badge>NEW</Badge>
    </Box>
  );
}
