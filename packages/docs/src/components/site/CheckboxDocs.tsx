"use client";

import { useState } from "react";
import { Checkbox, type CheckboxSize, Text } from "@futurewiz-rms/mint";
import { DoDont } from "./DoDont";
import { jsx, Playground } from "./Playground";

export function CheckboxPlayground() {
  return (
    <Playground
      controls={[
        {
          prop: "checked",
          type: "select",
          options: ["unchecked", "checked", "indeterminate"],
          default: "checked",
        },
        { prop: "size", type: "select", options: ["xs", "sm", "md", "lg"], default: "sm" },
        { prop: "label", type: "boolean", default: true },
        { prop: "bold", type: "boolean", default: false },
        { prop: "tight", type: "boolean", default: false },
        { prop: "disabled", type: "boolean", default: false },
        { prop: "children", type: "text", default: "텍스트" },
      ]}
      render={(values) => (
        <Checkbox
          // 상태를 바꿀 때마다 새로 그려서 defaultChecked가 반영되게 한다
          key={String(values.checked)}
          defaultChecked={values.checked === "checked"}
          indeterminate={values.checked === "indeterminate"}
          size={values.size as CheckboxSize}
          bold={values.bold as boolean}
          tight={values.tight as boolean}
          disabled={values.disabled as boolean}
          aria-label={values.label ? undefined : (values.children as string)}
        >
          {values.label ? (values.children as string) : undefined}
        </Checkbox>
      )}
      code={(values) =>
        jsx(
          "Checkbox",
          {
            defaultChecked: values.checked === "checked",
            indeterminate: values.checked === "indeterminate",
            size: values.size !== "sm" ? (values.size as string) : undefined,
            bold: values.bold as boolean,
            tight: values.tight as boolean,
            disabled: values.disabled as boolean,
            "aria-label": values.label ? undefined : (values.children as string),
          },
          values.label ? (values.children as string) : undefined,
        )
      }
    />
  );
}

/** Checkbox 사용 가이드 그림 */
export function CheckboxGuide() {
  const [terms, setTerms] = useState([true, false]);
  const all = terms.every(Boolean);
  return (
    <DoDont
      good={
        <span style={{ display: "flex", flexDirection: "column" }}>
          <Checkbox
            bold
            checked={all}
            indeterminate={terms.some(Boolean) && !all}
            onChange={(event) => setTerms(terms.map(() => event.target.checked))}
          >
            전체 동의
          </Checkbox>
          {["이용약관 동의", "마케팅 정보 받기"].map((label, index) => (
            <Checkbox
              key={label}
              checked={terms[index]}
              onChange={() =>
                setTerms(terms.map((on, termIndex) => (termIndex === index ? !on : on)))
              }
            >
              {label}
            </Checkbox>
          ))}
        </span>
      }
      goodText={<>전체 선택과 하위 선택은 일부 선택(indeterminate)으로 연결해요.</>}
      bad={
        <span style={{ display: "flex", flexDirection: "column" }}>
          <Text variant="body-3-regular" color="secondary">
            결제 수단
          </Text>
          <Checkbox defaultChecked>카드</Checkbox>
          <Checkbox>계좌이체</Checkbox>
        </span>
      }
      badText={<>하나만 고르는 경우에 Checkbox를 쓰지 않아요. Radio를 써요.</>}
    />
  );
}
