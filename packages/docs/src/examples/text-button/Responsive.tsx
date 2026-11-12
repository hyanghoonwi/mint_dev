import { TextButton } from "@futurewiz-rms/mint";

export default function Responsive() {
  return (
    // 모바일·태블릿 sm(24px), 데스크톱(1024px~)부터 md(28px)
    <TextButton size={{ base: "sm", desktop: "md" }}>전체 보기</TextButton>
  );
}
