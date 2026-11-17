import { Box, Textarea, TextField } from "@futurewiz-rms/mint";
export default function Sizes() {
  return (
    <Box gap={24}>
      {(["sm", "md", "lg"] as const).map((size) => (
        <Box key={size} gap={8}>
          <TextField size={size} label={`TextField ${size}`} placeholder="한 줄 입력" />
          <Textarea size={size} label={`Textarea ${size}`} placeholder="여러 줄 입력" />
        </Box>
      ))}
    </Box>
  );
}
