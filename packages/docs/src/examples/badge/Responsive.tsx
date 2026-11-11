import { Badge } from "@futurewiz-rms/mint";

export default function Responsive() {
  return (
    // 모바일 sm(20) → 태블릿(768px~) md(24)
    <Badge size={{ base: "sm", tablet: "md" }}>NEW</Badge>
  );
}
