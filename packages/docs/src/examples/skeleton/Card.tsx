import { SkeletonRectangle, SkeletonText } from "@futurewiz-rms/mint";

export default function Card() {
  return (
    <div
      aria-busy="true"
      className="bg-background-default rounded-16"
      style={{ padding: 16, display: "flex", flexDirection: "column", gap: 12, width: 240 }}
    >
      <SkeletonRectangle height={140} radius />
      <SkeletonText />
      <SkeletonText length="25%" />
    </div>
  );
}
