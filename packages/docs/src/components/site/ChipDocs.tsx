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
      render={(values) => (
        <span className={values.variant === "outline" ? "docs-gray-stage" : "docs-white-stage"}>
          <Chip
            variant={values.variant as ChipProps["variant"]}
            size={values.size as ChipProps["size"]}
            shape={values.shape as ChipProps["shape"]}
            active={values.active as boolean}
            badge={values.badge as boolean}
            disabled={values.disabled as boolean}
            leftAddon={values.addon === "leftAddon" ? <StarIcon /> : undefined}
            rightAddon={values.addon === "rightAddon" ? <ArrowRightIcon /> : undefined}
            leadingImage={values.addon === "leadingImage" ? <span /> : undefined}
            count={values.addon === "count" ? 12 : undefined}
          >
            {values.children as string}
          </Chip>
        </span>
      )}
      code={(values) =>
        jsx(
          "Chip",
          {
            variant: values.variant !== "solid" ? (values.variant as string) : undefined,
            size: values.size !== "md" ? (values.size as string) : undefined,
            shape: values.shape !== "square" ? (values.shape as string) : undefined,
            active: values.active as boolean,
            leftAddon: values.addon === "leftAddon" ? { expr: "<StarIcon />" } : undefined,
            rightAddon: values.addon === "rightAddon" ? { expr: "<ArrowRightIcon />" } : undefined,
            leadingImage:
              values.addon === "leadingImage"
                ? { expr: '<img src={coin.logo} alt="" />' }
                : undefined,
            count: values.addon === "count" ? 12 : undefined,
            badge: values.badge as boolean,
            disabled: values.disabled as boolean,
          },
          values.children as string,
          values.addon === "leftAddon"
            ? ["StarIcon"]
            : values.addon === "rightAddon"
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
