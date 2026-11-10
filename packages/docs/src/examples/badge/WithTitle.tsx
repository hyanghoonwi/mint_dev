import { Badge } from "@futurewiz-rms/mint";

export default function WithTitle() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <strong className="text-heading-2-bold text-text-strong">비트코인 리포트</strong>
      <Badge>NEW</Badge>
    </div>
  );
}
