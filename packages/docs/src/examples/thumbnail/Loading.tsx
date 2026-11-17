import { SkeletonRectangle, Thumbnail } from "@futurewiz-rms/mint";

export default function Loading() {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
      {/* 이미지를 불러오기 전: 같은 비율의 Skeleton */}
      <SkeletonRectangle radius width={160} height="auto" style={{ aspectRatio: "16 / 9" }} />
      <Thumbnail radius aspectRatio="16:9" alt="" style={{ width: 160 }} />
    </div>
  );
}
