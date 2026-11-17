import { TextField } from "@futurewiz-rms/mint";

export default function Clear() {
  return (
    // 값이 있는 칸을 눌러 입력 중이면 지우기 버튼(×)이 나타나요. clearButton={false}로 끌 수 있어요
    <>
      <TextField label="닉네임" defaultValue="mint" />
      <TextField label="지우기 없음" defaultValue="mint" clearButton={false} />
    </>
  );
}
