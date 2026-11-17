"use client";

import {
  DatePicker,
  type TextFieldLabelPosition,
  type TextFieldSize,
  type TextFieldStatus,
} from "@futurewiz-rms/mint";
import { DoDont } from "./DoDont";
import { jsx, Playground } from "./Playground";
import { fieldControls } from "./fieldControls";

const controls = fieldControls({ label: "시작일", placeholder: "YYYY-MM-DD" });

/** 샌드박스: 칸을 눌러 달력을 열고, 오른쪽에서 크기·상태·라벨 위치를 바꿔요 */
export function DatePickerPlayground() {
  return (
    <Playground
      stageMinHeight={200}
      controls={controls}
      render={(values) => (
        <div style={{ width: "100%", maxWidth: 320 }}>
          <DatePicker
            size={values.size as TextFieldSize}
            label={values.label as string}
            placeholder={values.placeholder as string}
            helper={values.helper as string}
            helpIcon={values.helpIcon as boolean}
            status={values.status as TextFieldStatus}
            disabled={values.disabled as boolean}
            readOnly={values.readOnly as boolean}
            required={values.required as boolean}
            today="2026-11-17"
            labelPosition={values.labelPosition as TextFieldLabelPosition}
          />
        </div>
      )}
      code={(values) =>
        jsx("DatePicker", {
          size: values.size !== "md" ? (values.size as string) : undefined,
          label: values.label as string,
          placeholder:
            values.placeholder !== "YYYY-MM-DD" ? (values.placeholder as string) : undefined,
          helper: values.helper as string,
          helpIcon: values.helpIcon as boolean,
          status: values.status !== "normal" ? (values.status as string) : undefined,
          disabled: values.disabled as boolean,
          readOnly: values.readOnly as boolean,
          required: values.required as boolean,
          today: "2026-11-17",
          labelPosition:
            values.labelPosition !== "top" ? (values.labelPosition as string) : undefined,
        })
      }
    />
  );
}

/** DatePicker 사용 가이드 그림 */
export function DatePickerGuide() {
  return (
    <DoDont
      good={
        <DatePicker
          label="예약일"
          helper="오늘부터 고를 수 있어요"
          today="2026-11-17"
          min="2026-11-17"
        />
      }
      goodText={<>고를 수 있는 범위를 min·max로 막고 도움말로 알려요.</>}
      bad={<DatePicker label="예약일" placeholder="날짜" today="2026-11-17" />}
      badText={<>형식을 알 수 없는 안내 글자만 두지 않아요. 기본 YYYY-MM-DD를 그대로 써요.</>}
    />
  );
}
