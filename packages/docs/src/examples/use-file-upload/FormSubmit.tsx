"use client";
import type { FormEvent } from "react";
import { Box, Button, FileItem, FileUploader, useFileUpload } from "@futurewiz-rms/mint";

// upload를 주지 않으면 목록만 관리해요(고른 파일은 바로 첨부됨으로 보여요). 보낼 때 items의 file을 직접 담아요
export default function FormSubmit() {
  const upload = useFileUpload({ maxFiles: 3 });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData();
    upload.items.forEach((item) => form.append("documents", item.file));
    console.log("보낼 파일", form.getAll("documents"));
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box gap={12}>
        <FileUploader
          label="첨부 서류"
          description="최대 3개"
          helper="파일은 3개까지 올릴 수 있어요"
          multiple
          {...upload.uploaderProps}
        />
        {upload.items.map((item) => (
          <FileItem key={item.id} {...upload.itemProps(item)} />
        ))}
        <Button disabled={upload.items.length === 0} type="submit">
          보내기
        </Button>
      </Box>
    </form>
  );
}
