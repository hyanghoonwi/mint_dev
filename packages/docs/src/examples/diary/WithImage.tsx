import { Diary } from "@futurewiz-rms/mint";

// 일정에 image를 주면 문구 앞에 16px 동그란 이미지가 붙어요(코인 로고 등)
export default function WithImage() {
  return (
    <Diary
      count={3}
      today="2026-11-18"
      events={{
        "2026-11-17": [{ label: "ARB 언락", image: "/img/avatar-sample.jpg" }],
        "2026-11-18": [
          { label: "ARB 언락", image: "/img/avatar-sample.jpg" },
          { label: "SUI 언락", image: "/img/avatar-sample.jpg" },
          { label: "점검" },
        ],
      }}
      start="2026-11-17"
    />
  );
}
