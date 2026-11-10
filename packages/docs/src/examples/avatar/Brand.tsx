import { Avatar, BellIcon } from "@futurewiz-rms/mint";

export default function Brand() {
  return (
    <>
      <Avatar variant="brand" name="코인" />
      <Avatar variant="brand" icon={<BellIcon />} />
    </>
  );
}
