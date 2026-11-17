import { Button, Tooltip } from "@futurewiz-rms/mint";

export default function ArrowAlign() {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "64px 16px" }}>
      <Tooltip label="역할" open arrowAlign="start">
        <Button color="secondary" size="sm">
          start
        </Button>
      </Tooltip>
      <Tooltip label="역할" open arrowAlign="center">
        <Button color="secondary" size="sm">
          center
        </Button>
      </Tooltip>
      <Tooltip label="역할" open arrowAlign="end">
        <Button color="secondary" size="sm">
          end
        </Button>
      </Tooltip>
    </div>
  );
}
