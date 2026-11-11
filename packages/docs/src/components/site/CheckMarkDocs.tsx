"use client";

import { CheckMark, type CheckMarkSize } from "@futurewiz-rms/mint";
import { DoDont } from "./DoDont";
import { jsx, Playground } from "./Playground";

export function CheckMarkPlayground() {
  return (
    <Playground
      controls={[
        { prop: "size", type: "select", options: ["xs", "sm", "md", "lg"], default: "sm" },
        { prop: "checked", type: "boolean", default: true },
        { prop: "label", type: "boolean", default: true },
        { prop: "tight", type: "boolean", default: false },
        { prop: "disabled", type: "boolean", default: false },
        { prop: "children", type: "text", default: "텍스트" },
      ]}
      render={(v) => (
        <CheckMark
          size={v.size as CheckMarkSize}
          checked={v.checked as boolean}
          tight={v.tight as boolean}
          disabled={v.disabled as boolean}
          aria-label={v.label ? undefined : (v.children as string)}
          onClick={() => {}}
        >
          {v.label ? (v.children as string) : undefined}
        </CheckMark>
      )}
      code={(v) =>
        jsx(
          "CheckMark",
          {
            size: v.size !== "sm" ? (v.size as string) : undefined,
            checked: v.checked as boolean,
            tight: v.tight as boolean,
            disabled: v.disabled as boolean,
            "aria-label": v.label ? undefined : (v.children as string),
            onClick: { expr: "() => setChecked(!checked)" },
          },
          v.label ? (v.children as string) : undefined,
        )
      }
    />
  );
}

/** CheckMark 사용 가이드 그림 */
export function CheckMarkGuide() {
  return (
    <DoDont
      good={
        <span style={{ display: "flex", flexDirection: "column", width: 200 }}>
          <CheckMark role="radio" checked onClick={() => {}} className="w-full">
            최신순
          </CheckMark>
          <CheckMark role="radio" onClick={() => {}} className="w-full">
            인기순
          </CheckMark>
        </span>
      }
      goodText={<>항목 전체를 눌러서 선택되게 해요.</>}
      bad={
        <span style={{ display: "flex", flexDirection: "column", gap: 8, width: 200 }}>
          <span className="text-body-3-regular text-text-secondary">약관 동의 (필수)</span>
          <CheckMark onClick={() => {}}>이용약관</CheckMark>
          <CheckMark onClick={() => {}}>개인정보 처리방침</CheckMark>
        </span>
      }
      badText={<>폼에서 값을 입력받는 용도로 쓰지 않아요. Checkbox를 써요.</>}
    />
  );
}
