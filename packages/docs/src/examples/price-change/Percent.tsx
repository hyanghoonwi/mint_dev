import { PriceChange } from "@futurewiz-rms/mint";

export default function Percent() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      <PriceChange direction="up" type="percent">
        3.42%
      </PriceChange>
      <PriceChange direction="down" type="percent">
        12.05%
      </PriceChange>
      <PriceChange direction="flat" type="percent">
        0.00%
      </PriceChange>
    </div>
  );
}
