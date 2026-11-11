import { Avatar, AvatarGroup, Text } from "@futurewiz-rms/mint";

export default function Inline() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {/* 작성자 이름 옆: 16px 아바타 */}
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <Avatar size={16} name="김민수" />
        <Text variant="body-4-medium">김민수</Text>
        <Text variant="caption-1-regular" color="tertiary">
          3분 전
        </Text>
      </div>
      {/* 참여자 묶음도 16px로 */}
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <AvatarGroup
          size={16}
          items={[{ name: "민" }, { name: "코" }, { name: "랩" }, { name: "인" }, { name: "트" }]}
        />
        <Text variant="caption-1-regular" color="secondary">
          5명이 보고 있어요
        </Text>
      </div>
    </div>
  );
}
