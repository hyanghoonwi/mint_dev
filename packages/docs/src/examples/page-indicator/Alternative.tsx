import { PageCounter } from "@futurewiz-rms/mint";

export default function Alternative() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <PageCounter current={1} total={10} variant="alternative" />
      <PageCounter current={1} total={10} variant="alternative" size="sm" />
    </div>
  );
}
