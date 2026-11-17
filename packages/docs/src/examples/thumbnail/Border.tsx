import { Box, Thumbnail } from "@futurewiz-rms/mint";

export default function Border() {
  return (
    <Box direction="horizontal" gap={16}>
      <Thumbnail radius aspectRatio="1:1" style={{ width: 96 }} />
      <Thumbnail radius border aspectRatio="1:1" style={{ width: 96 }} />
    </Box>
  );
}
