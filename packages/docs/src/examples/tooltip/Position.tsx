import { Button, Tooltip } from "@futurewiz-rms/mint";

export default function Position() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 64 }}>
      <Tooltip label="위" open position="top">
        <Button color="secondary" size="sm">
          top
        </Button>
      </Tooltip>
      <Tooltip label="왼쪽" open position="left">
        <Button color="secondary" size="sm">
          left
        </Button>
      </Tooltip>
      <Tooltip label="오른쪽" open position="right">
        <Button color="secondary" size="sm">
          right
        </Button>
      </Tooltip>
      <Tooltip label="아래" open position="bottom">
        <Button color="secondary" size="sm">
          bottom
        </Button>
      </Tooltip>
    </div>
  );
}
