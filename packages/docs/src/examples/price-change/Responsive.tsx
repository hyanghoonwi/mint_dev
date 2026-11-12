import { PriceChange } from "@futurewiz-rms/mint";

export default function Responsive() {
  return (
    // 모바일·태블릿 sm(12px), 데스크톱(1024px~)부터 md(14px)
    <PriceChange direction="up" type="percent" size={{ base: "sm", desktop: "md" }}>
      3.42%
    </PriceChange>
  );
}
