import { Checkbox } from "@futurewiz-rms/mint";

export default function States() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, auto)", gap: 8 }}>
      <Checkbox>체크 안 됨</Checkbox>
      <Checkbox defaultChecked>체크됨</Checkbox>
      <Checkbox indeterminate>일부 선택</Checkbox>
      <Checkbox disabled>비활성</Checkbox>
      <Checkbox disabled defaultChecked>
        비활성 체크
      </Checkbox>
      <Checkbox disabled indeterminate>
        비활성 일부
      </Checkbox>
    </div>
  );
}
