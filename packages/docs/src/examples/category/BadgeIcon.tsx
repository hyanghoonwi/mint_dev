import { Category, FireSimpleIcon, StarIcon } from "@futurewiz-rms/mint";

export default function BadgeIcon() {
  return (
    <Category
      aria-label="피드 분류"
      items={[
        { value: "fav", label: "관심", icon: <StarIcon /> },
        { value: "hot", label: "인기", icon: <FireSimpleIcon /> },
        { value: "news", label: "뉴스", badge: true },
      ]}
      style={{ width: 360, maxWidth: "100%" }}
    />
  );
}
