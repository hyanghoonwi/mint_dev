import { Radio, RadioGroup } from "@futurewiz-rms/mint";

export default function Responsive() {
  return (
    // 모바일·태블릿은 누르기 쉬운 md(원 24), 데스크톱(1024px~)부터 기본 sm(원 20)
    <RadioGroup aria-label="정렬 기준" defaultValue="latest" size={{ base: "md", desktop: "sm" }}>
      <Radio value="latest">최신순</Radio>
      <Radio value="popular">인기순</Radio>
    </RadioGroup>
  );
}
