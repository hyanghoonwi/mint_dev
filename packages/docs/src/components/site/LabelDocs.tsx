"use client";

import { Label, type LabelSize, Text } from "@futurewiz-rms/mint";
import { DoDont } from "./DoDont";
import { jsx, Playground } from "./Playground";

export function LabelPlayground() {
  return (
    <Playground
      stageMinHeight={160}
      controls={[
        { prop: "size", type: "select", options: ["sm", "md", "lg"], default: "md" },
        { prop: "required", type: "boolean", default: false },
        { prop: "helpIcon", type: "boolean", default: false },
        { prop: "disabled", type: "boolean", default: false },
      ]}
      render={(values) => (
        <Label
          size={values.size as LabelSize}
          required={values.required as boolean}
          helpIcon={values.helpIcon as boolean}
          disabled={values.disabled as boolean}
        >
          이름
        </Label>
      )}
      code={(values) =>
        jsx(
          "Label",
          {
            size: values.size !== "md" ? (values.size as string) : undefined,
            required: values.required ? true : undefined,
            helpIcon: values.helpIcon ? true : undefined,
            disabled: values.disabled ? true : undefined,
          },
          "이름",
        )
      }
    />
  );
}

/** Label 사용 가이드 그림 */
export function LabelGuide() {
  return (
    <DoDont
      good={
        <div style={{ display: "flex", flexDirection: "column", gap: 8, width: 220 }}>
          <Label required>휴대폰 번호</Label>
          <span style={{ border: "1px solid #d3d8e0", borderRadius: 12, padding: "10px 12px" }}>
            <Text as="span" variant="body-3-regular" color="tertiary">
              010-0000-0000
            </Text>
          </span>
        </div>
      }
      goodText={<>이름처럼 명사로 짧게 쓰고, 입력 예시는 Placeholder에 둬요.</>}
      bad={
        <div
          aria-hidden="true"
          style={{
            border: "1px solid #d3d8e0",
            borderRadius: 12,
            padding: "10px 12px",
            width: 220,
          }}
        >
          <Text as="span" variant="body-3-regular" color="tertiary">
            휴대폰 번호
          </Text>
        </div>
      }
      badText={<>Placeholder만 있으면 입력하는 순간 무엇인지 알 수 없어요.</>}
    />
  );
}
