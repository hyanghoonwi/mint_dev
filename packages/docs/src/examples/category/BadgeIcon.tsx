import { Category, FireSimpleIcon, StarIcon } from "@futurewiz-rms/mint";

export default function BadgeIcon() {
  return (
    <Category
      items={[
        { value: "fav", label: "관심", icon: <StarIcon /> },
        { value: "hot", label: "인기", icon: <FireSimpleIcon /> },
        { value: "news", label: "뉴스", badge: true },
      ]}
      aria-label="피드 분류"
      style={{ width: 360, maxWidth: "100%" }}
    />
  );
}
