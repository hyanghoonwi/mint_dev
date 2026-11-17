import { Box, FileUploader } from "@futurewiz-rms/mint";

// 크기는 안쪽 여백이 lg 32 · md 24(기본) · sm 16이에요. 글자·아이콘·버튼도 함께 바뀌어요
export default function Sizes() {
  return (
    <Box gap={24}>
      {(["lg", "md", "sm"] as const).map((size) => (
        <FileUploader key={size} size={size} label={size} description="PDF · 최대 10MB" />
      ))}
    </Box>
  );
}
