import { Chip } from "@futurewiz-rms/mint";

export default function Sizes() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <Chip size="lg">Large</Chip>
      <Chip size="md">Medium</Chip>
      <Chip size="sm">Small</Chip>
    </div>
  );
}
