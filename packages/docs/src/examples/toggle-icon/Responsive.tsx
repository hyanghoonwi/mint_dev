import { Box, HeartIcon, StarIcon, ToggleIcon } from "@futurewiz-rms/mint";

export default function Responsive() {
  return (
    // 모바일·태블릿은 목록처럼 sm(32), 데스크톱(1024px~)부터 md(40)
    <Box direction="horizontal" gap={8}>
      <ToggleIcon size={{ base: "sm", desktop: "md" }} icon={<StarIcon />} aria-label="관심 코인" />
      <ToggleIcon size={{ base: "sm", desktop: "md" }} icon={<HeartIcon />} aria-label="좋아요" />
    </Box>
  );
}
