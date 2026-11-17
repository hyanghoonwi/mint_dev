import { LiveStatus } from "@futurewiz-rms/mint";

export default function Multiple() {
  return (
    // 여러 개를 나란히 두면 링이 0.26초씩 어긋나게 퍼져요
    <>
      <LiveStatus label="BTC" />
      <LiveStatus label="ETH" />
      <LiveStatus label="XRP" />
      <LiveStatus label="SOL" />
    </>
  );
}
