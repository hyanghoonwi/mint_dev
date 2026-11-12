import { PriceChange, Text } from "@futurewiz-rms/mint";

const coins = [
  { name: "비트코인", price: "143,250,000", rate: 3.42 },
  { name: "이더리움", price: "5,120,000", rate: -1.2 },
  { name: "리플", price: "3,410", rate: 0 },
];

export default function InList() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, width: 280 }}>
      {coins.map((coin) => (
        <div
          key={coin.name}
          style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
        >
          <Text variant="body-3-regular" color="strong">
            {coin.name}
          </Text>
          <span style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
            <Text variant="body-4-semibold" color="strong">
              {coin.price}
            </Text>
            <PriceChange
              direction={coin.rate > 0 ? "up" : coin.rate < 0 ? "down" : "flat"}
              type="percent"
              size="sm"
            >
              {Math.abs(coin.rate).toFixed(2)}%
            </PriceChange>
          </span>
        </div>
      ))}
    </div>
  );
}
