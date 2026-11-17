import { LiveStatus } from "@futurewiz-rms/mint";

export default function Label() {
  return (
    <>
      <LiveStatus label="시세 연결됨" />
      <LiveStatus label="연결이 끊겼어요" active={false} />
    </>
  );
}
