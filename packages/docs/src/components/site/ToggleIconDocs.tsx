"use client";

import { HeartIcon, StarIcon, ToggleIcon, type ToggleIconProps } from "@futurewiz-rms/mint";
import { DoDont } from "./DoDont";
import { jsx, Playground } from "./Playground";

export function ToggleIconPlayground() {
  return (
    <Playground
      controls={[
        { prop: "size", type: "select", options: ["xs", "sm", "md", "lg"], default: "md" },
        { prop: "defaultActive", type: "boolean", default: false },
        { prop: "disabled", type: "boolean", default: false },
      ]}
      render={(values) => (
        <ToggleIcon
          // 처음 상태를 바꾸면 다시 그려서 바로 보이게 한다
          key={String(values.defaultActive)}
          size={values.size as ToggleIconProps["size"]}
          icon={<StarIcon />}
          defaultActive={values.defaultActive as boolean}
          disabled={values.disabled as boolean}
          aria-label="관심 코인"
        />
      )}
      code={(values) =>
        jsx(
          "ToggleIcon",
          {
            size: values.size !== "md" ? (values.size as string) : undefined,
            icon: { expr: "<StarIcon />" },
            defaultActive: values.defaultActive as boolean,
            disabled: values.disabled as boolean,
            "aria-label": "관심 코인",
          },
          undefined,
          ["StarIcon"],
        )
      }
    />
  );
}

/** ToggleIcon 사용 가이드 그림 */
export function ToggleIconGuide() {
  return (
    <DoDont
      good={
        <span style={{ display: "flex", gap: 8 }}>
          <ToggleIcon icon={<StarIcon />} defaultActive aria-label="관심 코인" />
          <ToggleIcon icon={<HeartIcon />} aria-label="좋아요" />
        </span>
      }
      goodText={<>켜면 채움, 끄면 선 모양으로 상태가 바로 보여요.</>}
      bad={
        <span style={{ display: "flex", gap: 8 }}>
          <ToggleIcon
            icon={<StarIcon />}
            activeIcon={<HeartIcon />}
            defaultActive
            aria-label="관심 코인"
          />
        </span>
      }
      badText={<>켜고 끌 때 다른 아이콘으로 바꾸지 않아요. 같은 아이콘의 선·채움만 바꿔요.</>}
    />
  );
}
