"use client";
import { Box, FileItem } from "@futurewiz-rms/mint";

// 대기 · 올리는 중(진행 막대) · 완료(체크) · 실패(빨간 글자와 다시 시도). 대기·올리는 중의 ×는 취소, 완료·실패의 휴지통은 삭제예요
export default function FileItems() {
  const remove = () => console.log("지우기");
  return (
    <Box gap={8}>
      <FileItem name="계약서.pdf" fileSize="2.4MB" status="waiting" onRemove={remove} />
      <FileItem
        name="거래내역.pdf"
        fileSize="2.4MB"
        status="uploading"
        progress={45}
        onRemove={remove}
      />
      <FileItem name="신분증.pdf" fileSize="1.1MB" status="complete" onRemove={remove} />
      <FileItem
        name="용량초과.zip"
        status="negative"
        message="10MB보다 커요"
        onRemove={remove}
        onRetry={() => console.log("다시 시도")}
      />
    </Box>
  );
}
