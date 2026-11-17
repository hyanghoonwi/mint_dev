import { Box, Textarea } from "@futurewiz-rms/mint";
export default function Height() {
  return (
    <Box gap={16}>
      <Textarea label="고정 높이 160px" height={160} />
      <Textarea
        label="자동 높이"
        placeholder="여러 줄을 입력해 보세요"
        counter
        height={120}
        maxHeight={320}
        heightMode="auto"
        maxLength={1000}
      />
      <Textarea
        label="내부 스크롤"
        defaultValue={Array.from(
          { length: 12 },
          (_, index) => `${index + 1}. 최대 높이를 넘으면 안에서 스크롤해요.`,
        ).join("\n")}
        heightMode="auto"
      />
      <Textarea
        label="직접 크기 조절"
        helper="오른쪽 아래 모서리를 끌어 높이를 늘려 보세요"
        height={160}
        maxHeight={400}
        heightMode="resizable"
      />
    </Box>
  );
}
