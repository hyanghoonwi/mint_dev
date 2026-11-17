"use client";
import {
  Box,
  FileItem,
  FileUploader,
  useFileUpload,
  type FileUploadHelpers,
} from "@futurewiz-rms/mint";

// 서버 업로드를 흉내 내요. 실제로는 axios.post(url, form, { onUploadProgress, signal })예요
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

// upload를 주면 고르자마자 올리고, 진행률·취소(×)를 연결해요. 이미지는 썸네일이 보여요
export default function AutoUpload() {
  const upload = useFileUpload({ maxSize: 10 * 1024 * 1024, upload: fakeUpload });
  return (
    <Box gap={12}>
      <FileUploader
        label="증빙 서류"
        description="JPG / PNG / PDF · 최대 10MB"
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
