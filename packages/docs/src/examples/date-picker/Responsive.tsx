// 모바일·태블릿은 라벨 위·칸 48, 데스크톱(1024px~)부터 라벨 왼쪽·칸 40이에요.
import { DatePicker } from "@futurewiz-rms/mint";

export default function Responsive() {
  return (
    <DatePicker
      size={{ base: "lg", desktop: "md" }}
      label="시작일"
      today="2026-11-17"
      labelPosition={{ base: "top", desktop: "left" }}
    />
  );
}
