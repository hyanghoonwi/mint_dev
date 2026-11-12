"use client";

import { CaretRightIcon, PlusIcon, Text, TextButton } from "@futurewiz-rms/mint";
import { DoDont } from "./DoDont";
import { jsx, Playground, type Control } from "./Playground";

const controls: Control[] = [
  { prop: "color", type: "select", options: ["primary", "neutral"], default: "primary" },
  { prop: "size", type: "select", options: ["xs", "sm", "md", "lg"], default: "md" },
  { prop: "underline", type: "boolean", default: false },
  { prop: "leftAddon", type: "boolean", default: false },
  { prop: "rightAddon", type: "boolean", default: false },
  { prop: "disabled", type: "boolean", default: false },
  { prop: "loading", type: "boolean", default: false },
  { prop: "children", type: "text", default: "전체 보기" },
];

/** 샌드박스: 왼쪽에 텍스트 버튼, 오른쪽에서 props를 바꾸면 아래 코드도 같이 바뀌어요 */
export function TextButtonPlayground() {
  return (
    <Playground
      controls={controls}
      render={(values) => (
        <TextButton
          color={values.color as "primary" | "neutral"}
          size={values.size as "xs" | "sm" | "md" | "lg"}
          underline={values.underline as boolean}
          leftAddon={values.leftAddon ? <PlusIcon /> : undefined}
          rightAddon={values.rightAddon ? <CaretRightIcon /> : undefined}
          disabled={values.disabled as boolean}
          loading={values.loading as boolean}
        >
          {values.children as string}
        </TextButton>
      )}
      code={(values) =>
        jsx(
          "TextButton",
          {
            color: values.color !== "primary" ? (values.color as string) : undefined,
            size: values.size !== "md" ? (values.size as string) : undefined,
            underline: values.underline as boolean,
            leftAddon: values.leftAddon ? { expr: "<PlusIcon />" } : undefined,
            rightAddon: values.rightAddon ? { expr: "<CaretRightIcon />" } : undefined,
            disabled: values.disabled as boolean,
            loading: values.loading as boolean,
          },
          values.children as string,
          [
            ...(values.leftAddon ? ["PlusIcon"] : []),
            ...(values.rightAddon ? ["CaretRightIcon"] : []),
          ],
        )
      }
    />
  );
}

/** TextButton 사용 가이드 그림 */
export function TextButtonGuide() {
  return (
    <DoDont
      good={
        <span
          style={{
            display: "flex",
            width: 220,
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text variant="body-3-medium" color="strong">
            오늘의 뉴스
          </Text>
          <TextButton color="neutral" size="sm" rightAddon={<CaretRightIcon />}>
            전체 보기
          </TextButton>
        </span>
      }
      goodText={<>&quot;전체 보기 &gt;&quot;처럼 보조 이동에 써요.</>}
      bad={
        <span style={{ display: "flex", flexDirection: "column", gap: 12, width: 220 }}>
          <Text variant="body-3-medium" color="strong">
            이벤트에 참여하고 혜택을 받아 보세요
          </Text>
          <TextButton size="lg">지금 신청하기</TextButton>
        </span>
      }
      badText={<>화면의 주된 행동(CTA)에 쓰지 않아요. Button을 써요.</>}
    />
  );
}
