import { Menu, MenuItem } from "@futurewiz-rms/mint";

export default function Sizes() {
  return (
    <>
      <Menu size="sm" defaultValue="latest" aria-label="정렬 Small">
        <MenuItem value="latest">최신순</MenuItem>
        <MenuItem value="popular">인기순</MenuItem>
        <MenuItem value="price">가격순</MenuItem>
      </Menu>
      <Menu size="md" defaultValue="latest" aria-label="정렬 Medium">
        <MenuItem value="latest">최신순</MenuItem>
        <MenuItem value="popular">인기순</MenuItem>
        <MenuItem value="price">가격순</MenuItem>
      </Menu>
      <Menu size="lg" defaultValue="latest" aria-label="정렬 Large">
        <MenuItem value="latest">최신순</MenuItem>
        <MenuItem value="popular">인기순</MenuItem>
        <MenuItem value="price">가격순</MenuItem>
      </Menu>
    </>
  );
}
