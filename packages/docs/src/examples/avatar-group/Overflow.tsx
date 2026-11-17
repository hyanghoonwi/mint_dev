import { AvatarGroup } from "@futurewiz-rms/mint";

export default function Overflow() {
  return (
    <>
      <AvatarGroup
        items={[{ src: "/img/avatar-sample.jpg" }, { name: "김민수" }, {}]}
        aria-label="참여자 3명"
      />
      <AvatarGroup
        items={[
          { src: "/img/avatar-sample.jpg" },
          { name: "김민수" },
          {},
          { name: "이서" },
          { name: "박준" },
        ]}
        aria-label="참여자 5명"
      />
    </>
  );
}
