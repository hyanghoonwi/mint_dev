"use client";
// 모바일은 버튼(높이 48), 태블릿(768px~)부터 끌어다 놓는 칸(여백 32), 데스크톱(1024px~)부터 칸 여백 24예요.
// 모양이 바뀌어도 훅이 들고 있는 목록은 그대로예요.
import { Box, FileItem, FileUploader, useFileUpload } from "@futurewiz-rms/mint";

export default function Responsive() {
  const upload = useFileUpload({ maxSize: 10 * 1024 * 1024 });
  return (
    <Box gap={12}>
      <FileUploader
        size={{ base: "lg", desktop: "md" }}
        label="증빙 서류"
        description="PDF · 최대 10MB"
        helper="PDF · 최대 10MB"
        accept=".pdf"
        multiple
        layout={{ base: "button", tablet: "dropzone" }}
        {...upload.uploaderProps}
      />
      {upload.items.map((item) => (
        <FileItem key={item.id} size={{ base: "sm", tablet: "md" }} {...upload.itemProps(item)} />
      ))}
    </Box>
  );
}
