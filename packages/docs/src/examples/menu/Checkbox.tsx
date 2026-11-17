import { Menu, MenuItem } from "@futurewiz-rms/mint";

export default function Checkbox() {
  return (
    <Menu variant="checkbox" defaultValue={["krw", "usdt"]} aria-label="시장">
      <MenuItem value="krw">원화</MenuItem>
      <MenuItem value="btc">BTC</MenuItem>
      <MenuItem value="usdt">USDT</MenuItem>
      <MenuItem value="eth">ETH</MenuItem>
    </Menu>
  );
}
