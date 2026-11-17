import { Select } from "@futurewiz-rms/mint";

const markets = [
  { value: "krw", label: "원화" },
  { value: "btc", label: "BTC" },
  { value: "usdt", label: "USDT" },
];

export default function Sizes() {
  return (
    <>
      <Select size="lg" label="Large 48" options={markets} defaultValue="krw" />
      <Select size="md" label="Medium 40" options={markets} defaultValue="krw" />
      <Select size="sm" label="Small 32" options={markets} defaultValue="krw" />
    </>
  );
}
