import { Box, StarIcon, ToggleIcon } from "@futurewiz-rms/mint";

export default function Disabled() {
  return (
    <Box direction="horizontal" align="center" gap={12}>
      <ToggleIcon icon={<StarIcon />} disabled aria-label="관심 코인" />
      <ToggleIcon icon={<StarIcon />} defaultActive disabled aria-label="관심 코인" />
    </Box>
  );
}
