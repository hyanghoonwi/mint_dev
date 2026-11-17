import { Menu, MenuDivider, MenuGroup, MenuItem } from "@futurewiz-rms/mint";

export default function Groups() {
  return (
    <Menu defaultValue="latest" aria-label="정렬과 보기">
      <MenuGroup label="정렬">
        <MenuItem value="latest">최신순</MenuItem>
        <MenuItem value="popular">인기순</MenuItem>
      </MenuGroup>
      <MenuDivider />
      <MenuGroup label="보기">
        <MenuItem value="list">목록</MenuItem>
        <MenuItem value="grid">격자</MenuItem>
      </MenuGroup>
    </Menu>
  );
}
