"use client";
import { Box, FileItem, FileUploader, useFileUpload } from "@futurewiz-rms/mint";

// 모바일 웹이나 좁은 자리에서는 버튼 하나로 골라요(layout="button"). 허용 형식은 helper에 적어요
export default function ButtonLayout() {
  const upload = useFileUpload({ maxSize: 10 * 1024 * 1024 });
  return (
    <Box gap={12}>
      <FileUploader
        label="첨부"
        helper="JPG / PNG · 최대 10MB"
        accept="image/*"
        layout="button"
        {...upload.uploaderProps}
      />
      {upload.items.map((item) => (
        <FileItem key={item.id} size="sm" {...upload.itemProps(item)} />
      ))}
    </Box>
  );
}
