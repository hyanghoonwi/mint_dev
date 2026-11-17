import { TextField } from "@futurewiz-rms/mint";

export default function States() {
  return (
    <>
      <TextField label="필수 항목" placeholder="이름" required />
      <TextField label="비활성" helper="수정할 수 없어요" defaultValue="입력한 내용" disabled />
      <TextField
        label="읽기 전용"
        helper="인증된 이메일이에요"
        defaultValue="mint@example.com"
        readOnly
      />
    </>
  );
}
