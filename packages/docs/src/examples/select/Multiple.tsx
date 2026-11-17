import { Select } from "@futurewiz-rms/mint";

const markets = [
  { value: "krw", label: "원화" },
  { value: "btc", label: "BTC" },
  { value: "usdt", label: "USDT" },
  { value: "eth", label: "ETH" },
];

export default function Multiple() {
  return <Select label="시장" options={markets} defaultValue={["krw", "usdt"]} open multiple />;
}
