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

const animate: Control = { prop: "animate", type: "boolean", default: true };
const animateAttribute = (values: Values) => (values.animate ? undefined : { expr: "false" });

const color: Control = {
  prop: "color",
  type: "select",
  options: ["normal", "white"],
  default: "normal",
};

/** 미리보기 칸이 회색이라 normal은 흰 카드, white는 회색 카드 위에 보여 줘요 */
function stage(values: Values, node: React.ReactNode) {
  return values.color === "white" ? (
    <span className="docs-gray-stage">{node}</span>
  ) : (
    <span className="docs-white-stage">{node}</span>
  );
}

const colorAttribute = (values: Values) =>
  values.color !== "normal" ? (values.color as string) : undefined;

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
        animate,
      ]}
      render={(values) =>
        stage(
          values,
          <SkeletonText
            width={240}
            length={values.length as SkeletonTextLength}
            align={values.align as SkeletonTextAlign}
            color={values.color as SkeletonColor}
            animate={values.animate as boolean}
          />,
        )
      }
      code={(values) =>
        jsx("SkeletonText", {
          length: values.length !== "100%" ? (values.length as string) : undefined,
          align: values.align !== "leading" ? (values.align as string) : undefined,
          color: colorAttribute(values),
          animate: animateAttribute(values),
        })
      }
    />
  );
}

export function SkeletonRectanglePlayground() {
  return (
    <Playground
      stageMinHeight={200}
      controls={[{ prop: "radius", type: "boolean", default: false }, color, animate]}
      render={(values) =>
        stage(
          values,
          <SkeletonRectangle
            width={120}
            height={80}
            radius={values.radius as boolean}
            color={values.color as SkeletonColor}
            animate={values.animate as boolean}
          />,
        )
      }
      code={(values) =>
        jsx("SkeletonRectangle", {
          width: 120,
          height: 80,
          radius: values.radius ? true : undefined,
          color: colorAttribute(values),
          animate: animateAttribute(values),
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
        animate,
      ]}
      render={(values) =>
        stage(
          values,
          <SkeletonCircle
            size={values.size as number}
            color={values.color as SkeletonColor}
            animate={values.animate as boolean}
          />,
        )
      }
      code={(values) =>
        jsx("SkeletonCircle", {
          size: values.size !== 40 ? (values.size as number) : undefined,
          color: colorAttribute(values),
          animate: animateAttribute(values),
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
