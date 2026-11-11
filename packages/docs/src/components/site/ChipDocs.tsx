"use client";

import { ArrowRightIcon, Chip, StarIcon, type ChipProps } from "@futurewiz-rms/mint";
import { DoDont } from "./DoDont";
import { jsx, Playground } from "./Playground";

export function ChipPlayground() {
  return (
    <Playground
      controls={[
        { prop: "variant", type: "select", options: ["solid", "outline"], default: "solid" },
        { prop: "size", type: "select", options: ["lg", "md", "sm"], default: "md" },
        { prop: "shape", type: "select", options: ["square", "pill"], default: "square" },
        {
          prop: "addon",
          type: "select",
          options: ["none", "leftAddon", "rightAddon", "leadingImage", "count"],
          default: "none",
        },
        { prop: "active", type: "boolean", default: true },
        { prop: "badge", type: "boolean", default: false },
        { prop: "disabled", type: "boolean", default: false },
        { prop: "children", type: "text", default: "시그널" },
      ]}
      render={(v) => (
        <span className={v.variant === "outline" ? "docs-gray-stage" : "docs-white-stage"}>
          <Chip
            variant={v.variant as ChipProps["variant"]}
            size={v.size as ChipProps["size"]}
            shape={v.shape as ChipProps["shape"]}
            active={v.active as boolean}
            badge={v.badge as boolean}
            disabled={v.disabled as boolean}
            leftAddon={v.addon === "leftAddon" ? <StarIcon /> : undefined}
            rightAddon={v.addon === "rightAddon" ? <ArrowRightIcon /> : undefined}
            leadingImage={v.addon === "leadingImage" ? <span /> : undefined}
            count={v.addon === "count" ? 12 : undefined}
          >
            {v.children as string}
          </Chip>
        </span>
      )}
      code={(v) =>
        jsx(
          "Chip",
          {
            variant: v.variant !== "solid" ? (v.variant as string) : undefined,
            size: v.size !== "md" ? (v.size as string) : undefined,
            shape: v.shape !== "square" ? (v.shape as string) : undefined,
            active: v.active as boolean,
            leftAddon: v.addon === "leftAddon" ? { expr: "<StarIcon />" } : undefined,
            rightAddon: v.addon === "rightAddon" ? { expr: "<ArrowRightIcon />" } : undefined,
            leadingImage:
              v.addon === "leadingImage" ? { expr: '<img src={coin.logo} alt="" />' } : undefined,
            count: v.addon === "count" ? 12 : undefined,
            badge: v.badge as boolean,
            disabled: v.disabled as boolean,
          },
          v.children as string,
          v.addon === "leftAddon"
            ? ["StarIcon"]
            : v.addon === "rightAddon"
              ? ["ArrowRightIcon"]
              : undefined,
        )
      }
    />
  );
}

/** Chip 사용 가이드 그림 */
export function ChipGuide() {
  return (
    <DoDont
      good={
        <span style={{ display: "flex", gap: 8 }}>
          <Chip active count={12}>
            시그널
          </Chip>
          <Chip count={3}>에어드랍</Chip>
          <Chip count={5}>공시</Chip>
        </span>
      }
      goodText={<>같은 줄의 칩은 크기와 모양을 맞추고, 개수는 Count로 알려요.</>}
      bad={
        <span style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <Chip size="lg">필터</Chip>
          <Chip shape="pill">정렬</Chip>
          <Chip size="sm" rightAddon={<ArrowRightIcon />}>
            상세 보기
          </Chip>
        </span>
      }
      badText={<>크기·모양을 섞거나 화면 이동 같은 행동에 쓰지 않아요.</>}
    />
  );
}
