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
    options: (v) => colorsOf[v.variant as string],
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
function attrs(v: Values) {
  const defaultColor = v.variant === "solid" ? "primary" : "neutral";
  return {
    variant: v.variant !== "solid" ? (v.variant as string) : undefined,
    color: v.color !== defaultColor ? (v.color as string) : undefined,
    size: v.size !== "md" ? (v.size as string) : undefined,
    leftAddon: v.leftAddon ? { expr: "<PlusIcon />" } : undefined,
    rightAddon: v.rightAddon ? { expr: "<ArrowRightIcon />" } : undefined,
    loading: v.loading as boolean,
    disabled: v.disabled as boolean,
    fullWidth: v.fullWidth as boolean,
  };
}

/** 샌드박스: 왼쪽에 버튼, 오른쪽에서 props를 바꾸면 아래 코드도 같이 바뀌어요 */
export function ButtonPlayground() {
  return (
    <Playground
      controls={controls}
      render={(v) => (
        <div style={{ width: v.fullWidth ? "100%" : undefined, maxWidth: 360 }}>
          <Button
            {...({ variant: v.variant, color: v.color } as ButtonStyle)}
            size={v.size as "xs" | "sm" | "md" | "lg"}
            leftAddon={v.leftAddon ? <PlusIcon /> : undefined}
            rightAddon={v.rightAddon ? <ArrowRightIcon /> : undefined}
            loading={v.loading as boolean}
            disabled={v.disabled as boolean}
            fullWidth={v.fullWidth as boolean}
          >
            {v.children as string}
          </Button>
        </div>
      )}
      code={(v) =>
        jsx("Button", attrs(v), v.children as string, [
          ...(v.leftAddon ? ["PlusIcon"] : []),
          ...(v.rightAddon ? ["ArrowRightIcon"] : []),
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
