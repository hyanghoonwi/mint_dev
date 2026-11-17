import { Menu, MenuItem } from "@futurewiz-rms/mint";

export default function Normal() {
  return (
    <Menu defaultValue="latest" aria-label="정렬">
      <MenuItem value="latest">최신순</MenuItem>
      <MenuItem value="popular">인기순</MenuItem>
      <MenuItem value="price">가격순</MenuItem>
      <MenuItem value="volume">거래량순</MenuItem>
    </Menu>
  );
}
