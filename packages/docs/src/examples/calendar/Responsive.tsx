import { Calendar } from "@futurewiz-rms/mint";

export default function Responsive() {
  return (
    // 모바일·태블릿은 누르기 쉬운 lg(칸 56), 데스크톱(1024px~)부터 md(48). 폭은 부모를 꽉 채운다
    <Calendar
      today="2026-11-11"
      size={{ base: "lg", desktop: "md" }}
      marks={{ "2026-11-12": [{ color: "brand" }], "2026-11-20": [{ color: "danger" }] }}
      style={{ maxWidth: 400 }}
    />
  );
}
