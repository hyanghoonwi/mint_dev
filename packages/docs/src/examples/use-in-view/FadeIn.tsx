"use client";

import { useState } from "react";
import { Text, useInView } from "@futurewiz-rms/mint";

export default function FadeIn() {
  const [root, setRoot] = useState<HTMLDivElement | null>(null);
  // 처음 보일 때 한 번만 나타나고, 다시 스크롤해도 사라지지 않는다
  const { ref, inView } = useInView({ root, triggerOnce: true, threshold: 0.5 });

  return (
    <div ref={setRoot} style={{ height: 240, width: "100%", overflow: "auto" }}>
      <Text as="p" variant="body-3-regular" color="tertiary" className="p-4">
        아래로 스크롤해 보세요
      </Text>
      <div style={{ height: 320 }} />
      <div
        ref={ref}
        className="m-4 rounded-12 bg-fill-brand-weak p-5"
        style={{
          opacity: inView ? 1 : 0,
          transform: inView ? "none" : "translateY(16px)",
          transition: "opacity 0.4s, transform 0.4s",
        }}
      >
        <Text as="p" variant="heading-3-bold">
          이번 주 인기 코인
        </Text>
      </div>
      <div style={{ height: 120 }} />
    </div>
  );
}
