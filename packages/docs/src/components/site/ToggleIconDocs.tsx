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
      render={(v) => (
        <ToggleIcon
          // 처음 상태를 바꾸면 다시 그려서 바로 보이게 한다
          key={String(v.defaultActive)}
          icon={<StarIcon />}
          aria-label="관심 코인"
          size={v.size as ToggleIconProps["size"]}
          defaultActive={v.defaultActive as boolean}
          disabled={v.disabled as boolean}
        />
      )}
      code={(v) =>
        jsx(
          "ToggleIcon",
          {
            icon: { expr: "<StarIcon />" },
            "aria-label": "관심 코인",
            size: v.size !== "md" ? (v.size as string) : undefined,
            defaultActive: v.defaultActive as boolean,
            disabled: v.disabled as boolean,
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
          <ToggleIcon icon={<StarIcon />} aria-label="관심 코인" defaultActive />
          <ToggleIcon icon={<HeartIcon />} aria-label="좋아요" />
        </span>
      }
      goodText={<>켜면 채움, 끄면 선 모양으로 상태가 바로 보여요.</>}
      bad={
        <span style={{ display: "flex", gap: 8 }}>
          <ToggleIcon
            icon={<StarIcon />}
            activeIcon={<HeartIcon />}
            aria-label="관심 코인"
            defaultActive
          />
        </span>
      }
      badText={<>켜고 끌 때 다른 아이콘으로 바꾸지 않아요. 같은 아이콘의 선·채움만 바꿔요.</>}
    />
  );
}
