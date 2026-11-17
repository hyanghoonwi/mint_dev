import { Menu, MenuItem } from "@futurewiz-rms/mint";

export default function ScrollBar() {
  return (
    // 항목 영역이 176px를 넘으면 그 안에서 스크롤돼요
    <Menu variant="radio" defaultValue="btc" maxHeight={176} aria-label="코인">
      <MenuItem value="btc">BTC</MenuItem>
      <MenuItem value="eth">ETH</MenuItem>
      <MenuItem value="xrp">XRP</MenuItem>
      <MenuItem value="sol">SOL</MenuItem>
      <MenuItem value="doge">DOGE</MenuItem>
      <MenuItem value="ada">ADA</MenuItem>
    </Menu>
  );
}
