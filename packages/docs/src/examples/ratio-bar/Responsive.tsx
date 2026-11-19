import { RatioBar } from "@futurewiz-rms/mint";

// 모바일은 sm(막대 16), 태블릿(768px~)은 md(막대 24), 데스크톱(1024px~)은 lg(막대 32)예요.
// 막대 안 값은 데스크톱부터 보이고, 그 아래에서는 범례로 읽어요. 범례는 모든 구간에서 켜 둬요
export default function Responsive() {
  return (
    <RatioBar
      size={{ base: "sm", tablet: "md", desktop: "lg" }}
      items={[
        { label: "비트코인", value: 56.2 },
        { label: "이더리움", value: 11.8 },
        { label: "스테이블코인", value: 10.9 },
        { label: "기타 암호화폐", value: 21.1 },
      ]}
      legend={{ base: true }}
      showValues={{ base: false, desktop: true }}
    />
  );
}
