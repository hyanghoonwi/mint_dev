import { Pagination } from "@futurewiz-rms/mint";

export default function Edges() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      <Pagination page={1} total={99} variant="extended" />
      <Pagination page={99} total={99} variant="extended" />
      <Pagination page={3} total={5} variant="extended" />
    </div>
  );
}
