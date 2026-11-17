"use client";
import {
  Box,
  FileItem,
  FileUploader,
  useFileUpload,
  type FileUploadHelpers,
} from "@futurewiz-rms/mint";

// 서버 업로드를 흉내 내요. 실제로는 axios.post(url, form, { onUploadProgress, signal })처럼 진행률과 signal을 연결해요
function fakeUpload(_: File, { onProgress, signal }: FileUploadHelpers) {
  return new Promise<void>((resolve, reject) => {
    let percent = 0;
    const timer = setInterval(() => {
      percent += 20;
      onProgress(percent);
      if (percent >= 100) {
        clearInterval(timer);
        resolve();
      }
    }, 300);
    signal.addEventListener("abort", () => {
      clearInterval(timer);
      reject(signal.reason);
    });
  });
}

// 직접 파일을 골라 보세요. 목록·미리보기·진행률·취소·용량 검사는 useFileUpload가 맡아요
export default function FileList() {
  const upload = useFileUpload({ maxSize: 10 * 1024 * 1024, maxFiles: 5, upload: fakeUpload });
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
