import { Avatar } from "@futurewiz-rms/mint";

export default function Badge() {
  return (
    <>
      <Avatar name="김민수" badge="dot" />
      <Avatar name="김민수" badge={3} />
      <Avatar name="김민수" badge={120} />
    </>
  );
}
