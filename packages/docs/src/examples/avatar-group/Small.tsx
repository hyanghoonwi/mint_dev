import { AvatarGroup } from "@futurewiz-rms/mint";

export default function Small() {
  return (
    <>
      <AvatarGroup
        size={24}
        items={[{ src: "/img/avatar-sample.jpg" }, { name: "김민수" }, {}, { name: "이서" }, {}]}
        aria-label="참여자 5명"
      />
      <AvatarGroup
        size={32}
        items={[{ src: "/img/avatar-sample.jpg" }, { name: "김민수" }, {}, { name: "이서" }, {}]}
        aria-label="참여자 5명"
      />
    </>
  );
}
