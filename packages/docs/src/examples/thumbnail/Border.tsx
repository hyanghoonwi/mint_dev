import { Thumbnail } from "@futurewiz-rms/mint";

export default function Border() {
  return (
    <div style={{ display: "flex", gap: 16 }}>
      <Thumbnail aspectRatio="1:1" radius style={{ width: 96 }} />
      <Thumbnail aspectRatio="1:1" radius border style={{ width: 96 }} />
    </div>
  );
}
