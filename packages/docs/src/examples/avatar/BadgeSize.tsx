import { Avatar } from "@futurewiz-rms/mint";

export default function BadgeSize() {
  return (
    <>
      <Avatar size={48} name="김민수" badge={1} badgeSize="xs" />
      <Avatar size={48} name="김민수" badge={1} badgeSize="sm" />
      <Avatar size={48} name="김민수" badge={1} badgeSize="md" />
      <Avatar size={48} name="김민수" badge={12} badgeSize="lg" />
      <Avatar size={48} name="김민수" badge={120} badgeSize="xl" />
    </>
  );
}
