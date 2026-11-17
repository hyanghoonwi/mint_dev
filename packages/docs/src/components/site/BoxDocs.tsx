"use client";

import {
  Box,
  type BoxGap,
  type BoxPadding,
  type BoxRadius,
  type BoxTone,
  Text,
} from "@futurewiz-rms/mint";
import { DoDont } from "./DoDont";
import { jsx, Playground, type Control } from "./Playground";

// tone과 짝이 되는 배경 토큰(Figma: 배경 fill/*-weak + 짝이 되는 테두리). 배경은 className으로 준다
const backgrounds: Record<string, string | undefined> = {
  none: undefined,
  outline: undefined,
  neutral: "bg-fill-neutral-weak",
  brand: "bg-fill-brand-weak",
  success: "bg-fill-success-weak",
  warning: "bg-fill-warning-weak",
  danger: "bg-fill-danger-weak",
};

const controls: Control[] = [
  {
    prop: "tone",
    type: "select",
    options: ["none", "outline", "neutral", "brand", "success", "warning", "danger"],
    default: "outline",
  },
  { prop: "background", type: "boolean", default: false },
  { prop: "elevation", type: "select", options: ["none", "raised", "floating"], default: "none" },
  { prop: "radius", type: "select", options: [0, 4, 8, 12, 16, 20, "full"], default: 8 },
  { prop: "direction", type: "select", options: ["vertical", "horizontal"], default: "vertical" },
  {
    prop: "align",
    type: "select",
    options: ["start", "center", "end", "stretch"],
    default: "stretch",
  },
  {
    prop: "justify",
    type: "select",
    options: ["start", "center", "between", "end"],
    default: "start",
  },
  { prop: "padding", type: "select", options: [0, 8, 16, 20, 24], default: 16 },
  { prop: "gap", type: "select", options: [0, 4, 8, 12, 16, 24, 32], default: 8 },
];

/** 샌드박스: 오른쪽에서 props를 바꾸면 Box와 아래 코드가 함께 바뀌어요. 배경을 켜면 tone과 짝이 되는 색 토큰을 className으로 넣어요 */
export function BoxPlayground() {
  return (
    <Playground
      stageMinHeight={220}
      controls={controls}
      render={(values) => {
        const background = values.background ? backgrounds[values.tone as string] : undefined;
        return (
          <Box
            tone={values.tone as BoxTone}
            elevation={values.elevation as "none" | "raised" | "floating"}
            radius={(values.radius === "full" ? "full" : Number(values.radius)) as BoxRadius}
            direction={values.direction as "vertical" | "horizontal"}
            align={values.align as "start" | "center" | "end" | "stretch"}
            justify={values.justify as "start" | "center" | "between" | "end"}
            padding={values.padding as BoxPadding}
            gap={values.gap as BoxGap}
            className={["w-[240px]", background].filter(Boolean).join(" ")}
          >
            <Text variant="label-2-semibold">제목</Text>
            <Text variant="body-4-regular" color="secondary">
              설명 글
            </Text>
          </Box>
        );
      }}
      code={(values) => {
        const background = values.background ? backgrounds[values.tone as string] : undefined;
        return jsx(
          "Box",
          {
            tone: values.tone !== "none" ? (values.tone as string) : undefined,
            elevation: values.elevation !== "none" ? (values.elevation as string) : undefined,
            radius:
              values.radius === 8
                ? undefined
                : values.radius === "full"
                  ? "full"
                  : { expr: String(values.radius) },
            direction: values.direction !== "vertical" ? (values.direction as string) : undefined,
            align: values.align !== "stretch" ? (values.align as string) : undefined,
            justify: values.justify !== "start" ? (values.justify as string) : undefined,
            padding: values.padding !== 0 ? { expr: String(values.padding) } : undefined,
            gap: values.gap !== 0 ? { expr: String(values.gap) } : undefined,
            className: ["w-[240px]", background].filter(Boolean).join(" "),
          },
          '\n  <Text variant="label-2-semibold">제목</Text>\n  <Text variant="body-4-regular" color="secondary">설명 글</Text>\n',
          ["Text"],
        );
      }}
    />
  );
}

/** Box 사용 가이드 그림 */
export function BoxGuide() {
  return (
    <DoDont
      good={
        <Box tone="brand" padding={16} className="bg-fill-brand-weak">
          <Text variant="body-4-medium">새 기능이 나왔어요</Text>
        </Box>
      }
      goodText={<>배경은 tone과 같은 의미의 색 토큰(`bg-fill-brand-weak`)을 className으로 줘요.</>}
      bad={
        <Box tone="brand" padding={16} style={{ background: "#ffe3f1" }}>
          <Text variant="body-4-medium">새 기능이 나왔어요</Text>
        </Box>
      }
      badText={<>hex 색이나 tone과 다른 의미의 배경을 쓰지 않아요.</>}
    />
  );
}
