import { TextField } from "@futurewiz-rms/mint";

export default function LabelPosition() {
  return (
    <>
      <TextField label="위" placeholder="입력해 주세요" />
      <TextField label="왼쪽" placeholder="입력해 주세요" labelPosition="left" />
    </>
  );
}
