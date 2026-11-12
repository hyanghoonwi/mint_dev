"use client";

import { Avatar, AvatarGroup, type AvatarSize } from "@futurewiz-rms/mint";
import { DoDont } from "./DoDont";
import { jsx, Playground, type Control, type Values } from "./Playground";

const sample = "/img/avatar-sample.jpg";

const avatarControls: Control[] = [
  { prop: "size", type: "select", options: [16, 24, 32, 40, 48, 64], default: 48 },
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
function avatarProps(values: Values) {
  return {
    size: values.size !== 40 ? (values.size as AvatarSize) : undefined,
    variant: values.variant !== "person" ? (values.variant as "brand") : undefined,
    src: values.content === "image" ? sample : undefined,
    name: values.content !== "icon" ? (values.name as string) : undefined,
    badge: values.badge === "dot" ? ("dot" as const) : values.badge === "number" ? 3 : undefined,
    badgeSize:
      values.badge !== "none" && values.badgeSize !== "auto"
        ? (values.badgeSize as "xs" | "sm" | "md" | "lg" | "xl")
        : undefined,
    disabled: values.disabled as boolean,
  };
}

/** 샌드박스: 왼쪽에 아바타, 오른쪽에서 props를 바꾸면 아래 코드도 같이 바뀌어요 */
export function AvatarPlayground() {
  return (
    <Playground
      controls={avatarControls}
      render={(values) => <Avatar {...avatarProps(values)} />}
      code={(values) => {
        const props = avatarProps(values);
        return jsx("Avatar", {
          ...props,
          badge: typeof props.badge === "number" ? props.badge : props.badge,
        });
      }}
    />
  );
}

const groupControls: Control[] = [
  { prop: "size", type: "select", options: [16, 24, 32, 40, 48, 64], default: 40 },
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
      render={(values) => (
        <AvatarGroup
          size={values.size as AvatarSize}
          max={values.max as number}
          aria-label={`참여자 ${values.items}명`}
          items={people.slice(0, values.items as number)}
        />
      )}
      code={(values) =>
        jsx("AvatarGroup", {
          size: values.size !== 40 ? (values.size as number) : undefined,
          max: values.max !== 3 ? (values.max as number) : undefined,
          "aria-label": `참여자 ${values.items}명`,
          items: { expr: itemsCode(values.items as number) },
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
