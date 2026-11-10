import { SkeletonCircle, SkeletonText } from "@futurewiz-rms/mint";

export default function OnGray() {
  return (
    <div
      aria-busy="true"
      className="bg-background-lower rounded-16"
      style={{ display: "flex", alignItems: "center", gap: 12, width: 320, padding: 16 }}
    >
      <SkeletonCircle color="white" size={32} />
      <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
        <SkeletonText color="white" length="75%" />
        <SkeletonText color="white" length="25%" />
      </div>
    </div>
  );
}
