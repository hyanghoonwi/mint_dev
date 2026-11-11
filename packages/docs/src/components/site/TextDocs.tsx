"use client";

import { Text, type TextColor, type TextVariant } from "@futurewiz-rms/mint";
import { DoDont } from "./DoDont";
import { jsx, Playground } from "./Playground";

const roles = {
  display: { numbers: [1, 2, 3], weights: ["semibold", "bold"] },
  title: { numbers: [1, 2, 3], weights: ["medium", "semibold", "bold"] },
  heading: { numbers: [1, 2, 3], weights: ["medium", "semibold", "bold"] },
  body: { numbers: [1, 2, 3, 4, 5], weights: ["regular", "medium", "semibold", "bold"] },
  label: { numbers: [1, 2, 3], weights: ["medium", "semibold", "bold"] },
  caption: { numbers: [1, 2], weights: ["regular", "medium", "semibold"] },
} as const;

type Role = keyof typeof roles;

export function TextPlayground() {
  return (
    <Playground
      stageMinHeight={200}
      controls={[
        { prop: "role", type: "select", options: Object.keys(roles), default: "body" },
        {
          prop: "number",
          type: "select",
          options: (v) => [...roles[v.role as Role].numbers],
          default: 2,
        },
        {
          prop: "weight",
          type: "select",
          options: (v) => [...roles[v.role as Role].weights],
          default: "regular",
        },
        {
          prop: "color",
          type: "select",
          options: [
            "inherit",
            "strong",
            "primary",
            "secondary",
            "tertiary",
            "brand",
            "danger",
            "success",
          ],
          default: "primary",
        },
        { prop: "children", type: "text", default: "비트코인이 1억을 넘었어요" },
      ]}
      render={(v) => (
        <Text
          variant={`${v.role}-${v.number}-${v.weight}` as TextVariant}
          color={v.color as TextColor}
        >
          {v.children as string}
        </Text>
      )}
      code={(v) =>
        jsx(
          "Text",
          {
            variant: `${v.role}-${v.number}-${v.weight}`,
            color: v.color !== "primary" ? (v.color as string) : undefined,
          },
          v.children as string,
        )
      }
    />
  );
}

/** Text 사용 가이드 그림 */
export function TextGuide() {
  return (
    <DoDont
      good={
        <span style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <Text variant="heading-2-bold">관심 코인</Text>
          <Text variant="body-4-regular" color="tertiary">
            가격이 오르면 알려 드려요
          </Text>
        </span>
      }
      goodText={<>역할에 맞는 스타일과 시맨틱 색을 써요.</>}
      bad={
        <span style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <span style={{ fontSize: 21, fontWeight: 800, color: "#3355ff" }}>관심 코인</span>
          <span style={{ fontSize: 13.5, color: "#999" }}>가격이 오르면 알려 드려요</span>
        </span>
      }
      badText={<>토큰에 없는 크기나 색을 직접 쓰지 않아요.</>}
    />
  );
}
