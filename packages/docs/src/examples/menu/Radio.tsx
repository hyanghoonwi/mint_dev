import { Menu, MenuItem } from "@futurewiz-rms/mint";

export default function Radio() {
  return (
    <Menu variant="radio" defaultValue="week" aria-label="기간">
      <MenuItem value="day">1일</MenuItem>
      <MenuItem value="week">1주</MenuItem>
      <MenuItem value="month">1개월</MenuItem>
      <MenuItem value="year">1년</MenuItem>
    </Menu>
  );
}
