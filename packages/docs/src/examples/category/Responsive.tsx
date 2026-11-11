import { Category } from "@futurewiz-rms/mint";

export default function Responsive() {
  return (
    // 모바일·태블릿은 누르기 쉬운 lg(40), 데스크톱(1024px~)부터 촘촘한 md(32)
    <Category
      aria-label="코인 분류"
      size={{ base: "lg", desktop: "md" }}
      items={[
        { value: "major", label: "메이저" },
        { value: "defi", label: "디파이" },
        { value: "meme", label: "밈" },
      ]}
      style={{ width: 360, maxWidth: "100%" }}
    />
  );
}
