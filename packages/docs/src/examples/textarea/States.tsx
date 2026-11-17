import { Box, Textarea } from "@futurewiz-rms/mint";
export default function States() {
  return (
    <Box gap={16}>
      <Textarea
        label="문의 내용"
        helper="10자 이상 입력해 주세요"
        defaultValue="문의"
        status="negative"
        required
      />
      <Textarea
        label="확인 완료"
        helper="등록할 수 있어요"
        defaultValue="문의할 내용을 모두 적었어요"
        status="positive"
      />
      <Textarea label="비활성" defaultValue="수정할 수 없어요" disabled />
      <Textarea label="읽기 전용" defaultValue="선택하고 복사할 수 있어요" readOnly />
    </Box>
  );
}
