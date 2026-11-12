import { BellIcon, BookmarkSimpleIcon, HeartIcon, StarIcon, ToggleIcon } from "@futurewiz-rms/mint";

export default function Icons() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <ToggleIcon icon={<StarIcon />} aria-label="관심 코인" defaultActive />
      <ToggleIcon icon={<HeartIcon />} aria-label="좋아요" defaultActive />
      <ToggleIcon icon={<BookmarkSimpleIcon />} aria-label="북마크" defaultActive />
      <ToggleIcon icon={<BellIcon />} aria-label="가격 알림" />
    </div>
  );
}
