import {
  BellIcon,
  BookmarkSimpleIcon,
  Box,
  HeartIcon,
  StarIcon,
  ToggleIcon,
} from "@futurewiz-rms/mint";

export default function Icons() {
  return (
    <Box direction="horizontal" align="center" gap={12}>
      <ToggleIcon icon={<StarIcon />} defaultActive aria-label="관심 코인" />
      <ToggleIcon icon={<HeartIcon />} defaultActive aria-label="좋아요" />
      <ToggleIcon icon={<BookmarkSimpleIcon />} defaultActive aria-label="북마크" />
      <ToggleIcon icon={<BellIcon />} aria-label="가격 알림" />
    </Box>
  );
}
