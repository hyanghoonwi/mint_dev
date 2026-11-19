import { RatioBar } from "@futurewiz-rms/mint";

// 구간 이름과 퍼센트 값을 items로 넘겨요. 폭은 부모를 채우고, 구간 폭은 값의 비율이에요
export default function Basic() {
  return (
    <RatioBar
      items={[
        { label: "비트코인", value: 56.2 },
        { label: "이더리움", value: 11.8 },
        { label: "스테이블코인", value: 10.9 },
      ]}
    />
  );
}
