"use client";

import { BellIcon, IconButton, PlusIcon, XIcon, type IconButtonProps } from "@futurewiz-rms/mint";
import { DoDont } from "./DoDont";
import { jsx, Playground } from "./Playground";

export function IconButtonPlayground() {
  return (
    <Playground
      controls={[
        {
          prop: "variant",
          type: "select",
          options: ["normal", "background", "outline", "solid"],
          default: "normal",
        },
        { prop: "size", type: "select", options: ["xs", "sm", "md", "lg"], default: "md" },
        { prop: "badge", type: "boolean", default: false },
        { prop: "disabled", type: "boolean", default: false },
      ]}
      render={(values) => (
        <IconButton
          icon={<PlusIcon />}
          aria-label="추가"
          variant={values.variant as IconButtonProps["variant"]}
          size={values.size as IconButtonProps["size"]}
          badge={values.badge as boolean}
          disabled={values.disabled as boolean}
        />
      )}
      code={(values) =>
        jsx(
          "IconButton",
          {
            icon: { expr: "<PlusIcon />" },
            "aria-label": "추가",
            variant: values.variant !== "normal" ? (values.variant as string) : undefined,
            size: values.size !== "md" ? (values.size as string) : undefined,
            badge: values.badge as boolean,
            disabled: values.disabled as boolean,
          },
          undefined,
          ["PlusIcon"],
        )
      }
    />
  );
}

/** IconButton 사용 가이드 그림 */
export function IconButtonGuide() {
  return (
    <DoDont
      good={
        <span style={{ display: "flex", gap: 8 }}>
          <IconButton icon={<XIcon />} aria-label="닫기" />
          <IconButton icon={<BellIcon />} aria-label="알림" badge />
        </span>
      }
      goodText={<>닫기·알림처럼 의미가 널리 알려진 아이콘을 쓰고 이름을 붙여요.</>}
      bad={
        <span style={{ display: "flex", gap: 4 }}>
          {[1, 2, 3, 4, 5].map((number) => (
            <IconButton key={number} icon={<PlusIcon />} aria-label={`동작 ${number}`} size="sm" />
          ))}
        </span>
      }
      badText={<>같은 줄에 4개 이상 늘어놓지 않아요. 더보기로 묶어요.</>}
    />
  );
}
