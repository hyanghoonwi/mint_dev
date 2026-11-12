import { Badge } from "@futurewiz-rms/mint";

export default function Responsive() {
  return (
    // 모바일 sm(20) → 태블릿(768px~) md(22)
    <Badge size={{ base: "sm", tablet: "md" }}>NEW</Badge>
  );
}
