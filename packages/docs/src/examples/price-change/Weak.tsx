import { Box, PriceChange } from "@futurewiz-rms/mint";

export default function Weak() {
  return (
    <Box direction="horizontal" align="center" gap={12}>
      <PriceChange variant="weak" direction="up">
        100,000
      </PriceChange>
      <PriceChange variant="weak" type="percent" direction="up">
        3.42%
      </PriceChange>
      <PriceChange variant="weak" type="percent" direction="down">
        1.20%
      </PriceChange>
    </Box>
  );
}
