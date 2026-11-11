import { Checkbox } from "@futurewiz-rms/mint";

export default function Form() {
  return (
    <form style={{ display: "flex", flexDirection: "column" }}>
      <span className="text-body-3-regular text-text-secondary">관심 분야</span>
      <Checkbox name="interest" value="major" defaultChecked>
        메이저 코인
      </Checkbox>
      <Checkbox name="interest" value="defi">
        디파이
      </Checkbox>
      <Checkbox name="interest" value="nft">
        NFT
      </Checkbox>
    </form>
  );
}
