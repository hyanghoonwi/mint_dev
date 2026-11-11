import { Button } from "@futurewiz-rms/mint";

export default function Responsive() {
  return (
    // 모바일: 크고(lg) 가로 꽉 채움 → 태블릿(768px~)부터: 기본 크기(md)·내용 폭
    <Button size={{ base: "lg", tablet: "md" }} fullWidth={{ base: true, tablet: false }}>
      참여하기
    </Button>
  );
}
