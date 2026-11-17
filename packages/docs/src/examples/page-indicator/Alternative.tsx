import { Box, PageCounter } from "@futurewiz-rms/mint";

export default function Alternative() {
  return (
    <Box direction="horizontal" align="center" gap={12}>
      <PageCounter variant="alternative" current={1} total={10} />
      <PageCounter variant="alternative" size="sm" current={1} total={10} />
    </Box>
  );
}
