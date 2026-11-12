"use client";

import { ArrowRightIcon, Button, PlusIcon, type ButtonStyle } from "@futurewiz-rms/mint";
import { DoDont } from "./DoDont";
import { jsx, Playground, type Control, type Values } from "./Playground";

/** Figma에서 가능한 조합만. outline은 neutral·primary, ghost는 neutral */
const colorsOf: Record<string, readonly string[]> = {
  solid: ["primary", "neutral", "secondary", "destructive"],
  outline: ["neutral", "primary"],
  ghost: ["neutral"],
};

const controls: Control[] = [
  { prop: "variant", type: "select", options: ["solid", "outline", "ghost"], default: "solid" },
  {
    prop: "color",
    type: "select",
    options: (values) => colorsOf[values.variant as string],
    default: "primary",
  },
  { prop: "size", type: "select", options: ["xs", "sm", "md", "lg"], default: "md" },
  { prop: "children", type: "text", default: "확인" },
  { prop: "leftAddon", type: "boolean", default: false },
  { prop: "rightAddon", type: "boolean", default: false },
  { prop: "loading", type: "boolean", default: false },
  { prop: "disabled", type: "boolean", default: false },
  { prop: "fullWidth", type: "boolean", default: false },
];

/** 기본값과 같은 값은 코드에서 뺀다 */
function attrs(values: Values) {
  const defaultColor = values.variant === "solid" ? "primary" : "neutral";
  return {
    variant: values.variant !== "solid" ? (values.variant as string) : undefined,
    color: values.color !== defaultColor ? (values.color as string) : undefined,
    size: values.size !== "md" ? (values.size as string) : undefined,
    leftAddon: values.leftAddon ? { expr: "<PlusIcon />" } : undefined,
    rightAddon: values.rightAddon ? { expr: "<ArrowRightIcon />" } : undefined,
    loading: values.loading as boolean,
    disabled: values.disabled as boolean,
    fullWidth: values.fullWidth as boolean,
  };
}

/** 샌드박스: 왼쪽에 버튼, 오른쪽에서 props를 바꾸면 아래 코드도 같이 바뀌어요 */
export function ButtonPlayground() {
  return (
    <Playground
      controls={controls}
      render={(values) => (
        <div style={{ width: values.fullWidth ? "100%" : undefined, maxWidth: 360 }}>
          <Button
            {...({ variant: values.variant, color: values.color } as ButtonStyle)}
            size={values.size as "xs" | "sm" | "md" | "lg"}
            leftAddon={values.leftAddon ? <PlusIcon /> : undefined}
            rightAddon={values.rightAddon ? <ArrowRightIcon /> : undefined}
            loading={values.loading as boolean}
            disabled={values.disabled as boolean}
            fullWidth={values.fullWidth as boolean}
          >
            {values.children as string}
          </Button>
        </div>
      )}
      code={(values) =>
        jsx("Button", attrs(values), values.children as string, [
          ...(values.leftAddon ? ["PlusIcon"] : []),
          ...(values.rightAddon ? ["ArrowRightIcon"] : []),
        ])
      }
    />
  );
}

/** Button 사용 가이드에 쓰는 미리보기 묶음 */
export function ButtonGuide() {
  return (
    <DoDont
      good={
        <>
          <Button variant="outline">공유</Button>
          <Button variant="outline">저장</Button>
        </>
      }
      goodText={
        <>
          같은 위계끼리 짝지어 써요. 닫기·취소와 확인은 <code>secondary</code>와 <code>solid</code>
          로 둬요.
        </>
      }
      bad={
        <>
          <Button>참여하기</Button>
          <Button variant="outline">공유</Button>
        </>
      }
      badText={
        <>
          <code>solid</code>와 <code>outline</code>을 섞으면 어떤 행동이 중요한지 헷갈려요. 버튼을
          3개 이상 나란히 두지도 않아요.
        </>
      }
    />
  );
}
