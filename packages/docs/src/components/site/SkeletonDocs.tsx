"use client";

import {
  SkeletonCircle,
  SkeletonRectangle,
  SkeletonText,
  type SkeletonColor,
  type SkeletonTextAlign,
  type SkeletonTextLength,
} from "@futurewiz-rms/mint";
import { DoDont } from "./DoDont";
import { jsx, Playground, type Control, type Values } from "./Playground";

const color: Control = {
  prop: "color",
  type: "select",
  options: ["normal", "white"],
  default: "normal",
};

/** 미리보기 칸이 회색이라 normal은 흰 카드, white는 회색 카드 위에 보여 줘요 */
function stage(v: Values, node: React.ReactNode) {
  return v.color === "white" ? (
    <span className="docs-gray-stage">{node}</span>
  ) : (
    <span className="docs-white-stage">{node}</span>
  );
}

const colorAttr = (v: Values) => (v.color !== "normal" ? (v.color as string) : undefined);

export function SkeletonTextPlayground() {
  return (
    <Playground
      stageMinHeight={200}
      controls={[
        { prop: "length", type: "select", options: ["100%", "75%", "50%", "25%"], default: "100%" },
        {
          prop: "align",
          type: "select",
          options: ["leading", "center", "trailing"],
          default: "leading",
        },
        color,
      ]}
      render={(v) =>
        stage(
          v,
          <SkeletonText
            width={240}
            length={v.length as SkeletonTextLength}
            align={v.align as SkeletonTextAlign}
            color={v.color as SkeletonColor}
          />,
        )
      }
      code={(v) =>
        jsx("SkeletonText", {
          length: v.length !== "100%" ? (v.length as string) : undefined,
          align: v.align !== "leading" ? (v.align as string) : undefined,
          color: colorAttr(v),
        })
      }
    />
  );
}

export function SkeletonRectanglePlayground() {
  return (
    <Playground
      stageMinHeight={200}
      controls={[{ prop: "radius", type: "boolean", default: false }, color]}
      render={(v) =>
        stage(
          v,
          <SkeletonRectangle
            width={120}
            height={80}
            radius={v.radius as boolean}
            color={v.color as SkeletonColor}
          />,
        )
      }
      code={(v) =>
        jsx("SkeletonRectangle", {
          width: 120,
          height: 80,
          radius: v.radius ? true : undefined,
          color: colorAttr(v),
        })
      }
    />
  );
}

export function SkeletonCirclePlayground() {
  return (
    <Playground
      stageMinHeight={200}
      controls={[
        { prop: "size", type: "select", options: [24, 32, 40, 48, 64], default: 40 },
        color,
      ]}
      render={(v) =>
        stage(v, <SkeletonCircle size={v.size as number} color={v.color as SkeletonColor} />)
      }
      code={(v) =>
        jsx("SkeletonCircle", {
          size: v.size !== 40 ? (v.size as number) : undefined,
          color: colorAttr(v),
        })
      }
    />
  );
}

/** Skeleton 사용 가이드 그림 */
export function SkeletonGuide() {
  return (
    <DoDont
      good={
        <span style={{ display: "flex", alignItems: "center", gap: 12, width: 220 }}>
          <SkeletonCircle size={40} />
          <span style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
            <SkeletonText length="50%" />
            <SkeletonText length="75%" height={12} />
          </span>
        </span>
      }
      goodText={<>실제 콘텐츠와 같은 모양·크기로 자리를 잡아요.</>}
      bad={<SkeletonRectangle width={220} height={64} radius />}
      badText={<>영역 전체를 덩어리 하나로 덮지 않아요.</>}
    />
  );
}
