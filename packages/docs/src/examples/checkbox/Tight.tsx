import { Checkbox } from "@futurewiz-rms/mint";

export default function Tight() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <Checkbox tight defaultChecked>
        거래 체결 알림
      </Checkbox>
      <Checkbox tight>입출금 알림</Checkbox>
      <Checkbox tight>가격 도달 알림</Checkbox>
    </div>
  );
}
