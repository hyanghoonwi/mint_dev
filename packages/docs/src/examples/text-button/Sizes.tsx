import { TextButton } from "@futurewiz-rms/mint";

export default function Sizes() {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8 }}>
      <TextButton size="lg">Large</TextButton>
      <TextButton size="md">Medium</TextButton>
      <TextButton size="sm">Small</TextButton>
      <TextButton size="xs">XSmall</TextButton>
    </div>
  );
}
