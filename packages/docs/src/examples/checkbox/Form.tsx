import { Checkbox, Text } from "@futurewiz-rms/mint";

export default function Form() {
  return (
    <form style={{ display: "flex", flexDirection: "column" }}>
      <Text variant="body-3-regular" color="secondary">
        관심 분야
      </Text>
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
