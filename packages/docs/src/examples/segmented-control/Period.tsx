import { SegmentedControl } from "@futurewiz-rms/mint";

export default function Period() {
  return (
    <SegmentedControl
      size="sm"
      items={[
        { value: "day", label: "일" },
        { value: "week", label: "주" },
        { value: "month", label: "월" },
        { value: "year", label: "연" },
      ]}
      defaultValue="week"
      aria-label="차트 기간"
    />
  );
}
