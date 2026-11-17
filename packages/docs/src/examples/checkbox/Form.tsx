import { Checkbox, Label } from "@futurewiz-rms/mint";

export default function Form() {
  return (
    <form>
      {/* 묶음의 이름은 Label로 붙이고, role="group"과 aria-labelledby로 묶음에 이어 줘요. 그래야 스크린리더가 체크박스마다 "관심 분야"를 함께 읽어요 */}
      <div
        role="group"
        aria-labelledby="interest-label"
        style={{ display: "flex", flexDirection: "column" }}
      >
        <Label id="interest-label">관심 분야</Label>
        <Checkbox value="major" defaultChecked name="interest">
          메이저 코인
        </Checkbox>
        <Checkbox value="defi" name="interest">
          디파이
        </Checkbox>
        <Checkbox value="nft" name="interest">
          NFT
        </Checkbox>
      </div>
    </form>
  );
}
