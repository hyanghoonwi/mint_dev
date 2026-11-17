"use client";
import { Box, FileItem, FileUploader, useFileUpload } from "@futurewiz-rms/mint";

// FileUploader는 useFileUpload와 함께 써요. 훅이 고른 파일 목록·미리보기·검사를 맡고, 컴포넌트는 모양만 맡아요.
// 허용 형식·최대 용량은 description에 미리 적어요
export default function Basic() {
  const upload = useFileUpload({ maxSize: 10 * 1024 * 1024, maxFiles: 5 });
  return (
    <Box gap={12}>
      <FileUploader
        label="증빙 서류"
        description="JPG / PNG / PDF · 최대 10MB"
        helper="파일은 5개까지 올릴 수 있어요"
        accept="image/*,.pdf"
        multiple
        {...upload.uploaderProps}
      />
      {upload.items.map((item) => (
        <FileItem key={item.id} {...upload.itemProps(item)} />
      ))}
    </Box>
  );
}
