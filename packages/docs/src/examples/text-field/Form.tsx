import { Button, TextField } from "@futurewiz-rms/mint";

export default function Form() {
  return (
    // name · type · autoComplete 같은 <input> 속성이 그대로 전달돼요. 제출하면 입력한 값이 넘어가요
    <form style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <TextField label="이메일" required type="email" name="email" autoComplete="email" />
      <TextField label="닉네임" helper="12자까지 입력할 수 있어요" name="nickname" maxLength={12} />
      <Button type="submit">가입하기</Button>
    </form>
  );
}
