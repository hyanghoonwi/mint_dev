import { TextField } from "@futurewiz-rms/mint";

export default function BuiltIn() {
  return (
    // TextField에는 Label이 내장되어 있어요. label · required · helpIcon만 주면 입력 칸과의 연결까지 알아서 해요
    <div style={{ width: 280 }}>
      <TextField label="휴대폰 번호" placeholder="010-0000-0000" required />
    </div>
  );
}
