import { Textarea } from "@futurewiz-rms/mint";
export default function Basic() {
  return (
    <Textarea
      label="문의 내용"
      placeholder="문제가 발생한 상황을 입력해 주세요"
      helper="500자까지 입력할 수 있어요"
      counter
      maxLength={500}
    />
  );
}
