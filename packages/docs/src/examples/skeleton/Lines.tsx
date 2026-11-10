import { SkeletonText } from "@futurewiz-rms/mint";

export default function Lines() {
  return (
    <div
      aria-busy="true"
      className="bg-background-default rounded-16"
      style={{ padding: 16, display: "flex", flexDirection: "column", gap: 8, width: 280 }}
    >
      <SkeletonText />
      <SkeletonText />
      <SkeletonText length="50%" />
    </div>
  );
}
