import { Select } from "@futurewiz-rms/mint";

const markets = [
  { value: "krw", label: "원화" },
  { value: "btc", label: "BTC" },
  { value: "usdt", label: "USDT" },
];

export default function LabelPosition() {
  return (
    <>
      <Select label="위" options={markets} />
      <Select label="왼쪽" options={markets} labelPosition="left" />
    </>
  );
}
