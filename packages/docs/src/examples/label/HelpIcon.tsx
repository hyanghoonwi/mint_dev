import { Label, QuestionIcon, Tooltip } from "@futurewiz-rms/mint";

export default function HelpIcon() {
  return (
    <div style={{ display: "flex", gap: 24, paddingTop: 40 }}>
      <Label helpIcon>추천인 코드</Label>
      <Label
        helpIcon={
          <Tooltip label="가입할 때 쓴 이름이에요">
            <button type="button" aria-label="이름 도움말" style={{ display: "inline-flex" }}>
              <QuestionIcon size={16} />
            </button>
          </Tooltip>
        }
      >
        이름
      </Label>
    </div>
  );
}
