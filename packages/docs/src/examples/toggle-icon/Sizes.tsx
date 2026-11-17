import { Box, StarIcon, ToggleIcon } from "@futurewiz-rms/mint";

export default function Sizes() {
  return (
    <Box direction="horizontal" align="center" gap={12}>
      <ToggleIcon size="lg" icon={<StarIcon />} defaultActive aria-label="관심 코인" />
      <ToggleIcon size="md" icon={<StarIcon />} defaultActive aria-label="관심 코인" />
      <ToggleIcon size="sm" icon={<StarIcon />} defaultActive aria-label="관심 코인" />
      <ToggleIcon size="xs" icon={<StarIcon />} defaultActive aria-label="관심 코인" />
    </Box>
  );
}
