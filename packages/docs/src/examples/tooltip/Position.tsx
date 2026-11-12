import { Button, Tooltip } from "@futurewiz-rms/mint";

export default function Position() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 64 }}>
      <Tooltip label="위" position="top" open>
        <Button size="sm" color="secondary">
          top
        </Button>
      </Tooltip>
      <Tooltip label="왼쪽" position="left" open>
        <Button size="sm" color="secondary">
          left
        </Button>
      </Tooltip>
      <Tooltip label="오른쪽" position="right" open>
        <Button size="sm" color="secondary">
          right
        </Button>
      </Tooltip>
      <Tooltip label="아래" position="bottom" open>
        <Button size="sm" color="secondary">
          bottom
        </Button>
      </Tooltip>
    </div>
  );
}
