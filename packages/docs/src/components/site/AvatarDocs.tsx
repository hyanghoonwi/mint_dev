"use client";

import { Avatar, AvatarGroup, type AvatarSize } from "@futurewiz-rms/mint";
import { DoDont } from "./DoDont";
import { jsx, Playground, type Control, type Values } from "./Playground";

const sample = "/img/avatar-sample.jpg";

const avatarControls: Control[] = [
  { prop: "size", type: "select", options: [24, 32, 40, 48, 64], default: 48 },
  { prop: "variant", type: "select", options: ["person", "brand"], default: "person" },
  { prop: "content", type: "select", options: ["image", "name", "icon"], default: "image" },
  { prop: "name", type: "text", default: "김민수" },
  { prop: "badge", type: "select", options: ["none", "dot", "number"], default: "dot" },
  // 배지 크기: auto는 아바타 크기에 맞춤(생략)
  {
    prop: "badgeSize",
    type: "select",
    options: ["auto", "xs", "sm", "md", "lg", "xl"],
    default: "auto",
  },
  { prop: "disabled", type: "boolean", default: false },
];

/** 고른 내용(이미지·이름·아이콘)에 따라 넘길 props. 기본값과 같은 값은 뺀다 */
function avatarProps(v: Values) {
  return {
    size: v.size !== 40 ? (v.size as AvatarSize) : undefined,
    variant: v.variant !== "person" ? (v.variant as "brand") : undefined,
    src: v.content === "image" ? sample : undefined,
    name: v.content !== "icon" ? (v.name as string) : undefined,
    badge: v.badge === "dot" ? ("dot" as const) : v.badge === "number" ? 3 : undefined,
    badgeSize:
      v.badge !== "none" && v.badgeSize !== "auto"
        ? (v.badgeSize as "xs" | "sm" | "md" | "lg" | "xl")
        : undefined,
    disabled: v.disabled as boolean,
  };
}

/** 샌드박스: 왼쪽에 아바타, 오른쪽에서 props를 바꾸면 아래 코드도 같이 바뀌어요 */
export function AvatarPlayground() {
  return (
    <Playground
      controls={avatarControls}
      render={(v) => <Avatar {...avatarProps(v)} />}
      code={(v) => {
        const p = avatarProps(v);
        return jsx("Avatar", { ...p, badge: typeof p.badge === "number" ? p.badge : p.badge });
      }}
    />
  );
}

const groupControls: Control[] = [
  { prop: "size", type: "select", options: [24, 32, 40, 48, 64], default: 40 },
  { prop: "items", type: "select", options: [2, 3, 4, 5, 6], default: 5 },
  { prop: "max", type: "select", options: [2, 3, 4, 5], default: 3 },
];

const people = [
  { src: sample },
  { name: "김민수" },
  {},
  { name: "이서" },
  { name: "박준" },
  { name: "최" },
];

function itemsCode(count: number) {
  const parts = people
    .slice(0, count)
    .map((item) =>
      "src" in item ? `{ src: "${item.src}" }` : "name" in item ? `{ name: "${item.name}" }` : "{}",
    );
  // 아바타 하나에 한 줄씩(코드 패널에서 옆으로 길게 넘치지 않게)
  return `[\n${parts.map((part) => `    ${part},`).join("\n")}\n  ]`;
}

/** 샌드박스: 아바타 수와 최대 개수(max)를 바꾸면 +N이 어떻게 붙는지 보여요 */
export function AvatarGroupPlayground() {
  return (
    <Playground
      controls={groupControls}
      render={(v) => (
        <AvatarGroup
          size={v.size as AvatarSize}
          max={v.max as number}
          aria-label={`참여자 ${v.items}명`}
          items={people.slice(0, v.items as number)}
        />
      )}
      code={(v) =>
        jsx("AvatarGroup", {
          size: v.size !== 40 ? (v.size as number) : undefined,
          max: v.max !== 3 ? (v.max as number) : undefined,
          "aria-label": `참여자 ${v.items}명`,
          items: { expr: itemsCode(v.items as number) },
        })
      }
    />
  );
}

/** Avatar 사용 가이드 그림 */
export function AvatarGuide() {
  return (
    <DoDont
      good={
        <>
          <Avatar size={40} src={sample} name="김민수" />
          <Avatar size={40} name="이서" />
          <Avatar size={40} name="박준" />
        </>
      }
      goodText={<>같은 목록에서는 크기를 하나로 맞춰요.</>}
      bad={
        <>
          <Avatar size={64} src={sample} name="김민수" />
          <Avatar size={32} name="이서" />
          <Avatar size={48} name="박준" />
        </>
      }
      badText={<>한 목록 안에서 크기를 섞지 않아요.</>}
    />
  );
}

/** Avatar group 사용 가이드 그림 */
export function AvatarGroupGuide() {
  const many = [...people, { name: "정" }, { name: "한" }];
  return (
    <DoDont
      good={<AvatarGroup aria-label="참여자 8명" items={many} max={3} />}
      goodText={
        <>
          많으면 <code>max</code>로 줄이고 나머지는 <code>+N</code>으로 보여 줘요.
        </>
      }
      bad={<AvatarGroup aria-label="참여자 8명" items={many} max={8} />}
      badText={<>5개 넘게 펼치지 않아요.</>}
    />
  );
}
