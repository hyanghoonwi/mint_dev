import { SkeletonText } from "@futurewiz-rms/mint";

export default function Centered() {
  return (
    <div
      aria-busy="true"
      className="bg-background-default rounded-16"
      style={{ padding: 16, display: "flex", flexDirection: "column", gap: 8, width: 280 }}
    >
      <SkeletonText length="75%" align="center" height={20} />
      <SkeletonText length="50%" align="center" />
    </div>
  );
}
