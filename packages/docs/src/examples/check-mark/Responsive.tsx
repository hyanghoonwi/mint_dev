import { CheckMark } from "@futurewiz-rms/mint";

export default function Responsive() {
  return (
    // 모바일·태블릿은 누르기 쉬운 md(체크 24), 데스크톱(1024px~)부터 기본 sm(체크 20)
    <CheckMark size={{ base: "md", desktop: "sm" }} checked>
      최신순
    </CheckMark>
  );
}
