import { Select } from "@futurewiz-rms/mint";

const markets = [
  { value: "krw", label: "원화" },
  { value: "btc", label: "BTC" },
  { value: "usdt", label: "USDT" },
  { value: "eth", label: "ETH" },
];

export default function Basic() {
  return <Select label="시장" helper="거래할 시장을 골라요" options={markets} defaultValue="krw" />;
}
