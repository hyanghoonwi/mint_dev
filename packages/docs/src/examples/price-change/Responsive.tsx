import { PriceChange } from "@futurewiz-rms/mint";

export default function Responsive() {
  return (
    // 모바일·태블릿 sm(12px), 데스크톱(1024px~)부터 md(14px)
    <PriceChange size={{ base: "sm", desktop: "md" }} type="percent" direction="up">
      3.42%
    </PriceChange>
  );
}
