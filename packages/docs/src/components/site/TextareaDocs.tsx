"use client";

import { Textarea, TextButton, type TextareaSize, type TextareaStatus } from "@futurewiz-rms/mint";
import { DoDont } from "./DoDont";
import { jsx, Playground } from "./Playground";
import { fieldControls } from "./fieldControls";

const controls = fieldControls({
  label: "문의 내용",
  placeholder: "문의할 내용을 입력해 주세요",
  content: [{ prop: "addon", type: "boolean", default: false }],
  behavior: [
    { prop: "counter", type: "boolean", default: false },
    { prop: "height", type: "select", options: [120, 160, 200], default: 120 },
    { prop: "maxHeight", type: "select", options: [240, 320, 400], default: 240 },
    {
      prop: "heightMode",
      type: "select",
      options: ["fixed", "auto", "resizable"],
      default: "fixed",
    },
    { prop: "maxLength", type: "select", options: ["없음", 100, 500, 1000], default: "없음" },
  ],
});

export function TextareaPlayground() {
  return (
    <Playground
      controls={controls}
      render={(values) => (
        <Textarea
          size={values.size as TextareaSize}
          label={values.label as string}
          placeholder={values.placeholder as string}
          helper={values.helper as string}
          helpIcon={values.helpIcon as boolean}
          addon={
            values.addon ? (
              <TextButton size="sm" disabled={values.disabled as boolean}>
                텍스트
              </TextButton>
            ) : undefined
          }
          status={values.status as TextareaStatus}
          disabled={values.disabled as boolean}
          readOnly={values.readOnly as boolean}
          required={values.required as boolean}
          counter={values.counter as boolean}
          labelPosition={values.labelPosition as "top" | "left"}
          height={values.height as number}
          maxHeight={values.maxHeight as number}
          heightMode={values.heightMode as "fixed" | "auto" | "resizable"}
          maxLength={typeof values.maxLength === "number" ? values.maxLength : undefined}
        />
      )}
      code={(values) =>
        jsx(
          "Textarea",
          {
            size: values.size !== "md" ? (values.size as string) : undefined,
            label: values.label as string,
            placeholder: values.placeholder as string,
            helper: values.helper as string,
            helpIcon: values.helpIcon as boolean,
            addon: values.addon
              ? {
                  expr: `<TextButton size="sm"${values.disabled ? " disabled" : ""}>텍스트</TextButton>`,
                }
              : undefined,
            status: values.status !== "normal" ? (values.status as string) : undefined,
            disabled: values.disabled as boolean,
            readOnly: values.readOnly as boolean,
            required: values.required as boolean,
            counter: values.counter as boolean,
            labelPosition:
              values.labelPosition !== "top" ? (values.labelPosition as string) : undefined,
            height: values.height !== 120 ? (values.height as number) : undefined,
            maxHeight: values.maxHeight !== 240 ? (values.maxHeight as number) : undefined,
            heightMode: values.heightMode !== "fixed" ? (values.heightMode as string) : undefined,
            maxLength: typeof values.maxLength === "number" ? values.maxLength : undefined,
          },
          undefined,
          values.addon ? ["TextButton"] : [],
        )
      }
    />
  );
}

export function TextareaGuide() {
  return (
    <DoDont
      good={
        <Textarea
          label="문의 내용"
          placeholder="문제가 발생한 상황을 적어 주세요"
          helper="500자까지 입력할 수 있어요"
          counter
          maxLength={500}
        />
      }
      goodText={<>입력 예시와 글자 수 제한을 미리 알려요.</>}
      bad={<Textarea placeholder="입력" maxLength={500} aria-label="문의 내용" />}
      badText={<>입력 이름과 글자 수 제한을 숨기지 않아요.</>}
    />
  );
}
