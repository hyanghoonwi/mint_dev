"use client";

import {
  FileItem,
  FileUploader,
  type FileUploaderLayout,
  type FileUploaderSize,
  type FileUploaderStatus,
} from "@futurewiz-rms/mint";
import { DoDont } from "./DoDont";
import { jsx, Playground, type Control } from "./Playground";

const controls: Control[] = [
  { prop: "size", type: "select", options: ["sm", "md", "lg"], default: "md" },
  { prop: "label", type: "text", default: "증빙 서류" },
  { prop: "description", type: "text", default: "JPG / PNG / PDF · 최대 10MB" },
  { prop: "helper", type: "text", default: "도움말 메시지" },
  { prop: "helpIcon", type: "boolean", default: false },
  { prop: "status", type: "select", options: ["normal", "negative"], default: "normal" },
  { prop: "disabled", type: "boolean", default: false },
  { prop: "required", type: "boolean", default: false },
  { prop: "layout", type: "select", options: ["dropzone", "button"], default: "dropzone" },
];

/** 샌드박스: 파일을 끌어다 놓거나 버튼을 눌러 보세요. 오른쪽에서 모양·크기·상태를 바꿔요 */
export function FileUploaderPlayground() {
  return (
    <Playground
      stageMinHeight={320}
      controls={controls}
      render={(values) => (
        <div style={{ width: "100%", maxWidth: 360 }}>
          <FileUploader
            size={values.size as FileUploaderSize}
            label={values.label as string}
            description={values.description as string}
            helper={values.helper as string}
            helpIcon={values.helpIcon as boolean}
            status={values.status as FileUploaderStatus}
            disabled={values.disabled as boolean}
            required={values.required as boolean}
            layout={values.layout as FileUploaderLayout}
          />
        </div>
      )}
      // 복사해 쓰는 코드는 useFileUpload와 함께 쓰는 모양으로 보여 준다(목록·검사는 훅이 맡음)
      code={(values) => {
        const element = jsx("FileUploader", {
          size: values.size !== "md" ? (values.size as string) : undefined,
          label: values.label as string,
          description: values.description as string,
          helper: values.helper as string,
          helpIcon: values.helpIcon as boolean,
          status: values.status !== "normal" ? (values.status as string) : undefined,
          disabled: values.disabled as boolean,
          required: values.required as boolean,
          layout: values.layout !== "dropzone" ? (values.layout as string) : undefined,
        })
          .split("\n")
          .slice(2)
          .join("\n")
          // 훅 값은 마지막에 펼친다(평소 helper·status를 오류 때만 덮어쓰게)
          .replace(/\n?\s*\/>$/, (end) =>
            end.startsWith("\n")
              ? "\n  {...upload.uploaderProps}\n/>"
              : " {...upload.uploaderProps} />",
          );
        return [
          'import { FileItem, FileUploader, useFileUpload } from "@futurewiz-rms/mint";',
          "",
          "const upload = useFileUpload({ maxSize: 10 * 1024 * 1024 });",
          "",
          element,
          "{upload.items.map((item) => (",
          "  <FileItem key={item.id} {...upload.itemProps(item)} />",
          "))}",
        ].join("\n");
      }}
    />
  );
}

/** FileUploader 사용 가이드 그림 */
export function FileUploaderGuide() {
  return (
    <DoDont
      good={<FileItem name="용량초과.zip" status="negative" message="10MB보다 커요" />}
      goodText={<>실패한 파일은 지우지 않고 실패와 이유를 보여 줘요.</>}
      bad={<FileUploader label="첨부" />}
      badText={<>허용 형식과 최대 용량을 숨기지 않아요. description에 미리 적어요.</>}
    />
  );
}
