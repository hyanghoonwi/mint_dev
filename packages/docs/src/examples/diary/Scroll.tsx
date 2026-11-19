import { Box, Diary } from "@futurewiz-rms/mint";

// Diary는 부모 폭을 따라가요. 칸(96px)을 모두 보여 줄 수 없을 만큼 부모가 좁으면 가로로 넘겨요.
// 넘친 쪽 가장자리가 흐려지고, 마우스는 끌어서 넘겨요. 폭은 Box의 className으로 정해요
export default function Scroll() {
  return (
    <Box className="w-[280px]">
      <Diary
        today="2026-11-18"
        events={{ "2026-11-20": [{ label: "언락" }], "2026-11-24": [{ label: "상장" }] }}
      />
    </Box>
  );
}
