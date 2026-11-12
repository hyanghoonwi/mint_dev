import { HeartIcon, StarIcon, ToggleIcon } from "@futurewiz-rms/mint";

export default function Responsive() {
  return (
    // 모바일·태블릿은 목록처럼 sm(32), 데스크톱(1024px~)부터 md(40)
    <div style={{ display: "flex", gap: 8 }}>
      <ToggleIcon icon={<StarIcon />} aria-label="관심 코인" size={{ base: "sm", desktop: "md" }} />
      <ToggleIcon icon={<HeartIcon />} aria-label="좋아요" size={{ base: "sm", desktop: "md" }} />
    </div>
  );
}
