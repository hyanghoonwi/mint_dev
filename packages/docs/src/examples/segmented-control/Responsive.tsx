import { SegmentedControl } from "@futurewiz-rms/mint";

export default function Responsive() {
  return (
    // 모바일은 크게 꽉 채우고, 태블릿부터 내용 폭, 데스크톱(1024px~)은 기본 크기
    <SegmentedControl
      size={{ base: "lg", desktop: "md" }}
      items={[
        { value: "day", label: "일" },
        { value: "week", label: "주" },
        { value: "month", label: "월" },
      ]}
      fullWidth={{ base: true, tablet: false }}
      aria-label="기간"
    />
  );
}
