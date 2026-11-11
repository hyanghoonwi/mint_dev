import { Radio, RadioGroup } from "@futurewiz-rms/mint";

export default function States() {
  return (
    <div style={{ display: "flex", gap: 24 }}>
      <RadioGroup aria-label="기본" defaultValue="on">
        <Radio value="off">안 고름</Radio>
        <Radio value="on">고름</Radio>
      </RadioGroup>
      <RadioGroup aria-label="비활성" defaultValue="on" disabled>
        <Radio value="off">비활성</Radio>
        <Radio value="on">비활성 고름</Radio>
      </RadioGroup>
    </div>
  );
}
