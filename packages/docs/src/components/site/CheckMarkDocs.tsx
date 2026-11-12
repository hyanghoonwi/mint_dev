"use client";

import { CheckMark, type CheckMarkSize, Text } from "@futurewiz-rms/mint";
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
      render={(values) => (
        <CheckMark
          size={values.size as CheckMarkSize}
          checked={values.checked as boolean}
          tight={values.tight as boolean}
          disabled={values.disabled as boolean}
          aria-label={values.label ? undefined : (values.children as string)}
          onClick={() => {}}
        >
          {values.label ? (values.children as string) : undefined}
        </CheckMark>
      )}
      code={(values) =>
        jsx(
          "CheckMark",
          {
            size: values.size !== "sm" ? (values.size as string) : undefined,
            checked: values.checked as boolean,
            tight: values.tight as boolean,
            disabled: values.disabled as boolean,
            "aria-label": values.label ? undefined : (values.children as string),
            onClick: { expr: "() => setChecked(!checked)" },
          },
          values.label ? (values.children as string) : undefined,
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
          <Text variant="body-3-regular" color="secondary">
            약관 동의 (필수)
          </Text>
          <CheckMark onClick={() => {}}>이용약관</CheckMark>
          <CheckMark onClick={() => {}}>개인정보 처리방침</CheckMark>
        </span>
      }
      badText={<>폼에서 값을 입력받는 용도로 쓰지 않아요. Checkbox를 써요.</>}
    />
  );
}
