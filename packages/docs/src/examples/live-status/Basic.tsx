import { LiveStatus } from "@futurewiz-rms/mint";

export default function Basic() {
  return (
    <>
      <LiveStatus />
      <LiveStatus active={false} />
    </>
  );
}
