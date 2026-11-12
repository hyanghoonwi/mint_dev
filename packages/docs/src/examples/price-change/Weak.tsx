import { PriceChange } from "@futurewiz-rms/mint";

export default function Weak() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <PriceChange direction="up" variant="weak">
        100,000
      </PriceChange>
      <PriceChange direction="up" variant="weak" type="percent">
        3.42%
      </PriceChange>
      <PriceChange direction="down" variant="weak" type="percent">
        1.20%
      </PriceChange>
    </div>
  );
}
