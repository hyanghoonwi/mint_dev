import { PriceChange } from "@futurewiz-rms/mint";

export default function Amount() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      <PriceChange direction="up">1,200</PriceChange>
      <PriceChange direction="down">850</PriceChange>
      <PriceChange direction="flat">0</PriceChange>
    </div>
  );
}
