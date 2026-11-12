"use client";

import { Thumbnail, type ThumbnailAspectRatio } from "@futurewiz-rms/mint";
import { DoDont } from "./DoDont";
import { jsx, Playground, type Control } from "./Playground";

const controls: Control[] = [
  {
    prop: "aspectRatio",
    type: "select",
    options: ["1:1", "4:3", "3:2", "16:9", "21:9", "3:4", "9:16"],
    default: "16:9",
  },
  { prop: "radius", type: "boolean", default: true },
  { prop: "border", type: "boolean", default: false },
  { prop: "overlay", type: "boolean", default: false },
];

/** 샌드박스: 왼쪽에 썸네일, 오른쪽에서 props를 바꾸면 아래 코드도 같이 바뀌어요 */
export function ThumbnailPlayground() {
  return (
    <Playground
      controls={controls}
      render={(v) => (
        <Thumbnail
          aspectRatio={v.aspectRatio as ThumbnailAspectRatio}
          radius={v.radius as boolean}
          border={v.border as boolean}
          overlay={v.overlay as boolean}
          style={{ width: 200 }}
        />
      )}
      code={(v) =>
        jsx("Thumbnail", {
          src: { expr: "news.image" },
          alt: "기사 대표 이미지",
          aspectRatio: v.aspectRatio !== "1:1" ? (v.aspectRatio as string) : undefined,
          radius: v.radius as boolean,
          border: v.border as boolean,
          overlay: v.overlay as boolean,
        })
      }
    />
  );
}

/** Thumbnail 사용 가이드 그림 */
export function ThumbnailGuide() {
  return (
    <DoDont
      good={
        <span style={{ display: "flex", gap: 8 }}>
          {[0, 1, 2].map((i) => (
            <Thumbnail key={i} aspectRatio="4:3" radius style={{ width: 72 }} />
          ))}
        </span>
      }
      goodText={<>한 목록 안에서는 같은 비율과 모서리를 써요.</>}
      bad={
        <span style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
          <Thumbnail aspectRatio="4:3" radius style={{ width: 72 }} />
          <Thumbnail aspectRatio="1:1" style={{ width: 72 }} />
          <Thumbnail aspectRatio="9:16" radius style={{ width: 48 }} />
        </span>
      }
      badText={<>같은 목록에서 비율과 모서리를 섞지 않아요.</>}
    />
  );
}
