import { Checkbox } from "@futurewiz-rms/mint";

export default function Responsive() {
  return (
    // 모바일·태블릿은 누르기 쉬운 md(상자 24), 데스크톱(1024px~)부터 기본 sm(상자 20)
    <Checkbox size={{ base: "md", desktop: "sm" }} defaultChecked>
      약관에 모두 동의해요
    </Checkbox>
  );
}
