import { Label } from "@futurewiz-rms/mint";

export default function Required() {
  return (
    <div style={{ display: "flex", gap: 24 }}>
      <Label required>이름</Label>
      <Label>닉네임</Label>
    </div>
  );
}
