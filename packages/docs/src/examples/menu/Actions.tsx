import { Menu, MenuDivider, MenuItem } from "@futurewiz-rms/mint";

export default function Actions() {
  return (
    // value가 없는 항목은 고르지 않고 누르는 동작만 해요. onClick은 클라이언트 컴포넌트 안에서 넘겨요
    <Menu aria-label="코인 작업">
      <MenuItem>복사</MenuItem>
      <MenuItem>공유</MenuItem>
      <MenuDivider />
      <MenuItem>삭제</MenuItem>
    </Menu>
  );
}
