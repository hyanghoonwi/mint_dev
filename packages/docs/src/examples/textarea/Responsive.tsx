// 모바일은 라벨 위·lg, 태블릿(768px~)은 라벨 위·md, 데스크톱(1024px~)부터 라벨 왼쪽·sm이에요.
import { Textarea } from "@futurewiz-rms/mint";

export default function Responsive() {
  return (
    <Textarea
      size={{ base: "lg", tablet: "md", desktop: "sm" }}
      label="문의 내용"
      placeholder="화면 폭에 맞춰 패딩·글자 크기·라벨 위치가 바뀌어요"
      counter
      labelPosition={{ base: "top", desktop: "left" }}
      maxLength={500}
    />
  );
}
