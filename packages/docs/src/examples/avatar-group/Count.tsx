import { AvatarGroup } from "@futurewiz-rms/mint";

export default function Count() {
  return (
    <AvatarGroup
      aria-label="참여자 128명"
      count="+125"
      items={[{ src: "/img/avatar-sample.jpg" }, { name: "김민수" }, { name: "이서" }, {}]}
    />
  );
}
