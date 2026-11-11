import { Chip } from "@futurewiz-rms/mint";

export default function Responsive() {
  return (
    // 모바일은 촘촘하게 sm(28), 태블릿(768px~)부터 md(32)
    <div style={{ display: "flex", gap: 8 }}>
      <Chip size={{ base: "sm", tablet: "md" }} active>
        시그널
      </Chip>
      <Chip size={{ base: "sm", tablet: "md" }}>에어드랍</Chip>
      <Chip size={{ base: "sm", tablet: "md" }}>공시</Chip>
    </div>
  );
}
