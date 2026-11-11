import { AvatarGroup } from "@futurewiz-rms/mint";

const members = [
  { name: "김민수" },
  { name: "이서연" },
  { name: "박지훈" },
  { name: "최유진" },
  { name: "정하늘" },
];

export default function Responsive() {
  return (
    // 모바일 24 → 태블릿(768px~) 40. 겹침 폭과 +N 칸도 함께 바뀌어요
    <AvatarGroup items={members} size={{ base: 24, tablet: 40 }} aria-label="참여자 5명" />
  );
}
