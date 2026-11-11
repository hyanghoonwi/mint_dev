import { SegmentedControl } from "@futurewiz-rms/mint";

export default function FullWidth() {
  return (
    <SegmentedControl
      aria-label="거래 내역"
      fullWidth
      items={[
        { value: "all", label: "전체" },
        { value: "buy", label: "매수" },
        { value: "sell", label: "매도" },
      ]}
    />
  );
}
