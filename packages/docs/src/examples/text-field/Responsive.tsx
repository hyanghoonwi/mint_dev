import { TextField } from "@futurewiz-rms/mint";

export default function Responsive() {
  return (
    // 모바일·태블릿은 라벨이 위·칸 48(lg), 데스크톱(1024px~)부터 라벨이 왼쪽·칸 40(md)
    <TextField
      size={{ base: "lg", desktop: "md" }}
      label="이름"
      placeholder="홍길동"
      helper="창 폭을 바꿔 보세요"
      labelPosition={{ base: "top", desktop: "left" }}
    />
  );
}
