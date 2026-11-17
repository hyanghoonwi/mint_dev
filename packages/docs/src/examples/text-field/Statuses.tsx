import { TextField } from "@futurewiz-rms/mint";

export default function Statuses() {
  return (
    <>
      <TextField label="이메일" helper="로그인에 쓰여요" defaultValue="mint@example.com" />
      <TextField
        label="이메일"
        helper="이메일 형식이 아니에요. @를 포함해 다시 입력해 주세요"
        defaultValue="mint"
        status="negative"
      />
      <TextField
        label="닉네임"
        helper="사용할 수 있는 닉네임이에요"
        defaultValue="mint"
        status="positive"
      />
    </>
  );
}
