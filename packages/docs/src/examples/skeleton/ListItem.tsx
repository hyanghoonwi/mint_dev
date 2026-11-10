import { SkeletonCircle, SkeletonText } from "@futurewiz-rms/mint";

export default function ListItem() {
  return (
    <div
      aria-busy="true"
      className="bg-background-default rounded-16"
      style={{ padding: 16, display: "flex", alignItems: "center", gap: 12, width: 320 }}
    >
      <SkeletonCircle size={40} />
      <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
        <SkeletonText length="50%" />
        <SkeletonText length="75%" height={12} />
      </div>
    </div>
  );
}
