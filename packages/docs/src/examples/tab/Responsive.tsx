import { Tab } from "@futurewiz-rms/mint";

export default function Responsive() {
  return (
    // 모바일은 크게(48) 폭을 나누고, 태블릿부터 이름 폭, 데스크톱(1024px~)부터 중간 크기(40)
    <Tab
      aria-label="내 정보"
      size={{ base: "lg", desktop: "md" }}
      layout={{ base: "fill", tablet: "hug" }}
      items={[
        { value: "home", label: "홈" },
        { value: "market", label: "시세" },
        { value: "assets", label: "내 자산" },
      ]}
    />
  );
}
