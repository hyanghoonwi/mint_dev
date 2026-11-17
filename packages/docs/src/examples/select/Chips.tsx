import { Select } from "@futurewiz-rms/mint";

const markets = [
  { value: "krw", label: "원화" },
  { value: "btc", label: "BTC" },
  { value: "usdt", label: "USDT" },
  { value: "eth", label: "ETH" },
  { value: "xrp", label: "XRP" },
];

export default function Chips() {
  return (
    // 칩 크기는 size를 따라가요(lg · md · sm)
    <>
      <Select
        size="lg"
        label="Large"
        options={markets}
        defaultValue={["krw", "btc", "usdt"]}
        multiple
        render="chip"
      />
      <Select
        size="md"
        label="Medium"
        options={markets}
        defaultValue={["krw", "btc", "usdt"]}
        multiple
        render="chip"
      />
      <Select
        size="sm"
        label="Small"
        options={markets}
        defaultValue={["krw", "btc", "usdt"]}
        multiple
        render="chip"
      />
    </>
  );
}
