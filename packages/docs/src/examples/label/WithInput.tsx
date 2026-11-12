import { Label } from "@futurewiz-rms/mint";

export default function WithInput() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, width: 280 }}>
      <Label htmlFor="phone">휴대폰 번호</Label>
      <input
        id="phone"
        placeholder="010-0000-0000"
        style={{ border: "1px solid #d3d8e0", borderRadius: 12, padding: "10px 12px" }}
      />
    </div>
  );
}
