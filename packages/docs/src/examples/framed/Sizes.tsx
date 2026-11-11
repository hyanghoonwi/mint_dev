import { FramedCheckbox } from "@futurewiz-rms/mint";

export default function Sizes() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, width: 360, maxWidth: "100%" }}>
      <FramedCheckbox size="sm" label="Small" description="여백 12 · 모서리 8" />
      <FramedCheckbox size="md" label="Medium" description="여백 16 · 모서리 12" />
      <FramedCheckbox size="lg" label="Large" description="여백 20 · 모서리 16" shadow />
    </div>
  );
}
