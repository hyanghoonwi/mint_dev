import { Button } from "@futurewiz-rms/mint";

export default function Loading() {
  return (
    <>
      <Button size="sm" loading>
        저장
      </Button>
      <Button loading>저장</Button>
      <Button size="lg" loading>
        저장
      </Button>
    </>
  );
}
