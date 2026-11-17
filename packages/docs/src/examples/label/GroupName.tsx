import { Box, Label, Radio, RadioGroup } from "@futurewiz-rms/mint";

export default function GroupName() {
  return (
    // 선택지 묶음에는 Label이 내장되어 있지 않아서 Label을 따로 써요. 입력이 여러 개라 htmlFor 대신
    // 묶음에 role="group"(RadioGroup은 radiogroup)과 aria-labelledby를 주고 Label에 id를 줘요
    <Box>
      <Label id="sort-label">정렬 기준</Label>
      <RadioGroup defaultValue="latest" aria-labelledby="sort-label">
        <Radio value="latest">최신순</Radio>
        <Radio value="popular">인기순</Radio>
        <Radio value="price">가격순</Radio>
      </RadioGroup>
    </Box>
  );
}
