import { Button, Menu, MenuItem } from "@futurewiz-rms/mint";

export default function ActionArea() {
  return (
    <Menu
      variant="checkbox"
      actionArea={
        <>
          <Button variant="ghost" color="neutral" size="sm">
            초기화
          </Button>
          <Button size="sm">적용</Button>
        </>
      }
      defaultValue={["krw"]}
      aria-label="시장"
    >
      <MenuItem value="krw">원화</MenuItem>
      <MenuItem value="btc">BTC</MenuItem>
      <MenuItem value="usdt">USDT</MenuItem>
    </Menu>
  );
}
