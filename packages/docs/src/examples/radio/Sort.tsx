import { Radio, RadioGroup } from "@futurewiz-rms/mint";

export default function Sort() {
  return (
    <RadioGroup aria-label="정렬 기준" name="sort" defaultValue="latest">
      <Radio value="latest">최신순</Radio>
      <Radio value="popular">인기순</Radio>
      <Radio value="price">가격 높은순</Radio>
    </RadioGroup>
  );
}
