import { Pagination } from "@futurewiz-rms/mint";

export default function Compact() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      <Pagination page={6} total={99} variant="extended" />
      <Pagination page={6} total={99} variant="compact" />
    </div>
  );
}
