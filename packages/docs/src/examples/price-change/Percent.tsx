import { Box, PriceChange } from "@futurewiz-rms/mint";

export default function Percent() {
  return (
    <Box direction="horizontal" align="center" gap={16}>
      <PriceChange type="percent" direction="up">
        3.42%
      </PriceChange>
      <PriceChange type="percent" direction="down">
        12.05%
      </PriceChange>
      <PriceChange type="percent" direction="flat">
        0.00%
      </PriceChange>
    </Box>
  );
}
