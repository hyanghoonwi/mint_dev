import { Box, Pagination } from "@futurewiz-rms/mint";

export default function Compact() {
  return (
    <Box align="center" gap={16}>
      <Pagination variant="extended" page={6} total={99} />
      <Pagination variant="compact" page={6} total={99} />
    </Box>
  );
}
