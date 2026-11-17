import { Box, PriceChange } from "@futurewiz-rms/mint";

export default function Amount() {
  return (
    <Box direction="horizontal" align="center" gap={16}>
      <PriceChange direction="up">1,200</PriceChange>
      <PriceChange direction="down">850</PriceChange>
      <PriceChange direction="flat">0</PriceChange>
    </Box>
  );
}
