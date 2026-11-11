import { Text } from "@futurewiz-rms/mint";

export default function Lines() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, width: 240 }}>
      <Text variant="body-3-medium" lines={1}>
        비트코인 현물 ETF 승인 이후 기관 자금 유입이 이어지고 있어요
      </Text>
      <Text variant="body-3-regular" color="secondary" lines={2}>
        비트코인 현물 ETF 승인 이후 기관 자금 유입이 이어지고 있어요. 이번 주에만 순유입이 크게
        늘었어요.
      </Text>
    </div>
  );
}
