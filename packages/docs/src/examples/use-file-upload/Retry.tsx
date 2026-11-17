"use client";
import { useRef } from "react";
import {
  Box,
  FileItem,
  FileUploader,
  useFileUpload,
  type FileUploadHelpers,
} from "@futurewiz-rms/mint";

// 실패하면 FileItem에 이유와 "다시 시도"가 보여요. 이 예시는 처음 한 번은 실패하고 다시 시도하면 올라가요
export default function Retry() {
  const attempts = useRef(new Map<string, number>());
  const upload = useFileUpload({
    upload: (file: File, { onProgress }: FileUploadHelpers) => {
      const count = (attempts.current.get(file.name) ?? 0) + 1;
      attempts.current.set(file.name, count);
      onProgress(50);
      return new Promise((resolve, reject) =>
        setTimeout(() => (count === 1 ? reject(new Error("network")) : resolve(null)), 600),
      );
    },
    messages: { failed: "네트워크 오류로 올리지 못했어요" },
  });
  return (
    <Box gap={12}>
      <FileUploader
        label="첨부"
        helper="아무 파일이나 골라 보세요"
        layout="button"
        {...upload.uploaderProps}
      />
      {upload.items.map((item) => (
        <FileItem key={item.id} {...upload.itemProps(item)} />
      ))}
    </Box>
  );
}
