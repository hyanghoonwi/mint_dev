import { Box, FileUploader } from "@futurewiz-rms/mint";

// 상태는 TextField와 같은 이름이에요. 오류는 status="negative"와 helper에 이유를 적어요
export default function States() {
  return (
    <Box gap={24}>
      <FileUploader
        label="오류"
        description="JPG / PNG · 최대 10MB"
        helper="10MB보다 큰 파일은 올릴 수 없어요"
        status="negative"
      />
      <FileUploader label="필수" description="PDF · 최대 10MB" required />
      <FileUploader label="비활성" description="PDF · 최대 10MB" disabled />
    </Box>
  );
}
