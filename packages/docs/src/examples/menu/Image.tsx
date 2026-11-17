import { Menu, MenuItem } from "@futurewiz-rms/mint";

export default function Image() {
  return (
    <Menu defaultValue="main" aria-label="계정">
      <MenuItem leadingImage="/img/avatar-sample.jpg" value="main">
        메인 계정
      </MenuItem>
      <MenuItem leadingImage="/img/avatar-sample.jpg" value="sub">
        보조 계정
      </MenuItem>
    </Menu>
  );
}
