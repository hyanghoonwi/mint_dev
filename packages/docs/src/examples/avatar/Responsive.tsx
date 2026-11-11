import { Avatar } from "@futurewiz-rms/mint";

export default function Responsive() {
  return (
    // 모바일 32 → 태블릿(768px~) 48. 배지(badgeSize 생략)의 위치·크기도 아바타 크기를 따라가요
    <Avatar name="김민수" size={{ base: 32, tablet: 48 }} badge={3} />
  );
}
