import { Button, Tooltip } from "@futurewiz-rms/mint";

export default function ArrowAlign() {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "64px 16px" }}>
      <Tooltip label="역할" arrowAlign="start" open>
        <Button size="sm" color="secondary">
          start
        </Button>
      </Tooltip>
      <Tooltip label="역할" arrowAlign="center" open>
        <Button size="sm" color="secondary">
          center
        </Button>
      </Tooltip>
      <Tooltip label="역할" arrowAlign="end" open>
        <Button size="sm" color="secondary">
          end
        </Button>
      </Tooltip>
    </div>
  );
}
