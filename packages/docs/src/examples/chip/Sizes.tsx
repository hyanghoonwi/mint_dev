import { Box, Chip } from "@futurewiz-rms/mint";

export default function Sizes() {
  return (
    <Box direction="horizontal" align="center" gap={8}>
      <Chip size="lg">Large</Chip>
      <Chip size="md">Medium</Chip>
      <Chip size="sm">Small</Chip>
    </Box>
  );
}
