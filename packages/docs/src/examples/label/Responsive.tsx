import { Label } from "@futurewiz-rms/mint";

export default function Responsive() {
  return (
    // 모바일·태블릿은 md(14), 데스크톱(1024px~)부터 lg(16)
    <Label size={{ base: "md", desktop: "lg" }} required>
      이름
    </Label>
  );
}
