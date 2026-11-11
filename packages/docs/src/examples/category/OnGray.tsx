import { Category } from "@futurewiz-rms/mint";

export default function OnGray() {
  return (
    <div className="bg-background-lower rounded-16" style={{ padding: 16 }}>
      <Category
        aria-label="거래 내역 분류"
        variant="outline"
        size="md"
        items={[
          { value: "buy", label: "매수" },
          { value: "sell", label: "매도" },
          { value: "deposit", label: "입금" },
        ]}
        style={{ width: 300, maxWidth: "100%" }}
      />
    </div>
  );
}
