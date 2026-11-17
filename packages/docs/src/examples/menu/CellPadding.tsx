import { Menu, MenuItem } from "@futurewiz-rms/mint";

export default function CellPadding() {
  return (
    <>
      <Menu defaultValue="latest" cellPadding={8} aria-label="정렬 8px">
        <MenuItem value="latest">최신순</MenuItem>
        <MenuItem value="popular">인기순</MenuItem>
        <MenuItem value="price">가격순</MenuItem>
      </Menu>
      <Menu defaultValue="latest" cellPadding={12} aria-label="정렬 12px">
        <MenuItem value="latest">최신순</MenuItem>
        <MenuItem value="popular">인기순</MenuItem>
        <MenuItem value="price">가격순</MenuItem>
      </Menu>
    </>
  );
}
