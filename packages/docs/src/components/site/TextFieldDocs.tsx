"use client";

import {
  EnvelopeIcon,
  TextField,
  type TextFieldSize,
  type TextFieldStatus,
  Text,
} from "@futurewiz-rms/mint";
import { DoDont } from "./DoDont";
import { jsx, Playground } from "./Playground";
import { fieldControls } from "./fieldControls";

const controls = fieldControls({
  label: "이름",
  placeholder: "입력해 주세요",
  content: [
    { prop: "leftAddon", type: "boolean", default: false },
    { prop: "rightAddon", type: "boolean", default: false },
  ],
  behavior: [{ prop: "clearButton", type: "boolean", default: true }],
});

/** 샌드박스: 오른쪽에서 props를 바꾸면 입력 칸과 아래 코드가 함께 바뀌어요. 칸에 값을 입력해 보세요 */
export function TextFieldPlayground() {
  return (
    <Playground
      stageMinHeight={360}
      controls={controls}
      render={(values) => (
        <TextField
          size={values.size as TextFieldSize}
          label={values.label as string}
          placeholder={values.placeholder as string}
          helper={values.helper as string}
          helpIcon={values.helpIcon as boolean}
          leftAddon={values.leftAddon ? <EnvelopeIcon /> : undefined}
          rightAddon={
            values.rightAddon ? (
              <Text variant="body-4-medium" color="secondary">
                03:00
              </Text>
            ) : undefined
          }
          status={values.status as TextFieldStatus}
          disabled={values.disabled as boolean}
          readOnly={values.readOnly as boolean}
          required={values.required as boolean}
          clearButton={values.clearButton as boolean}
          labelPosition={values.labelPosition as "top" | "left"}
        />
      )}
      code={(values) =>
        jsx(
          "TextField",
          {
            size: values.size !== "md" ? (values.size as string) : undefined,
            label: values.label as string,
            placeholder: values.placeholder as string,
            helper: values.helper as string,
            helpIcon: values.helpIcon as boolean,
            leftAddon: values.leftAddon ? { expr: "<EnvelopeIcon />" } : undefined,
            rightAddon: values.rightAddon
              ? { expr: '<Text variant="body-4-medium" color="secondary">03:00</Text>' }
              : undefined,
            status: values.status !== "normal" ? (values.status as string) : undefined,
            disabled: values.disabled as boolean,
            readOnly: values.readOnly as boolean,
            required: values.required as boolean,
            clearButton: values.clearButton ? undefined : { expr: "false" },
            labelPosition:
              values.labelPosition !== "top" ? (values.labelPosition as string) : undefined,
          },
          undefined,
          [...(values.leftAddon ? ["EnvelopeIcon"] : []), ...(values.rightAddon ? ["Text"] : [])],
        )
      }
    />
  );
}

/** Text Field 사용 가이드 그림 */
export function TextFieldGuide() {
  return (
    <DoDont
      good={
        <TextField
          size="sm"
          label="이메일"
          helper="이메일 형식이 아니에요. @를 포함해 다시 입력해 주세요"
          defaultValue="mint"
          status="negative"
        />
      }
      goodText={<>오류는 negative와 함께 도움말에 이유와 해결 방법을 적어요.</>}
      bad={
        <TextField
          size="sm"
          label="이메일"
          helper="잘못된 입력이에요"
          defaultValue="mint"
          status="negative"
        />
      }
      badText={<>"잘못된 입력이에요"만 쓰지 않고 무엇이 문제인지 말해요.</>}
    />
  );
}
