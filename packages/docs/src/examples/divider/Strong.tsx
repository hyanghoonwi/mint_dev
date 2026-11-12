import { Divider, Text } from "@futurewiz-rms/mint";

export default function Strong() {
  return (
    <div style={{ width: 320, background: "var(--mint-background-default)" }}>
      <div className="p-5" style={{ display: "flex", justifyContent: "space-between" }}>
        <Text variant="body-3-regular" color="tertiary">
          주문 금액
        </Text>
        <Text variant="body-3-regular">100,000원</Text>
      </div>
      <Divider variant="strong" inset />
      <div className="p-5" style={{ display: "flex", justifyContent: "space-between" }}>
        <Text variant="body-2-semibold" color="strong">
          총 결제 금액
        </Text>
        <Text variant="body-2-semibold" color="strong">
          100,500원
        </Text>
      </div>
    </div>
  );
}
