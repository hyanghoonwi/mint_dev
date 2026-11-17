import { Box, IconButton, PlusIcon } from "@futurewiz-rms/mint";

export default function Sizes() {
  return (
    <Box direction="horizontal" align="center" gap={12}>
      <IconButton variant="background" size="lg" icon={<PlusIcon />} aria-label="추가" />
      <IconButton variant="background" size="md" icon={<PlusIcon />} aria-label="추가" />
      <IconButton variant="background" size="sm" icon={<PlusIcon />} aria-label="추가" />
      <IconButton variant="background" size="xs" icon={<PlusIcon />} aria-label="추가" />
    </Box>
  );
}
