import { Box, IconButton, PlusIcon } from "@futurewiz-rms/mint";

export default function Variants() {
  return (
    <Box direction="horizontal" gap={12}>
      <IconButton icon={<PlusIcon />} aria-label="추가" />
      <IconButton variant="background" icon={<PlusIcon />} aria-label="추가" />
      <IconButton variant="outline" icon={<PlusIcon />} aria-label="추가" />
      <IconButton variant="solid" icon={<PlusIcon />} aria-label="추가" />
    </Box>
  );
}
