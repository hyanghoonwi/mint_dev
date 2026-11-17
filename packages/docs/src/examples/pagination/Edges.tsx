import { Box, Pagination } from "@futurewiz-rms/mint";

export default function Edges() {
  return (
    <Box align="center" gap={16}>
      <Pagination variant="extended" page={1} total={99} />
      <Pagination variant="extended" page={99} total={99} />
      <Pagination variant="extended" page={3} total={5} />
    </Box>
  );
}
