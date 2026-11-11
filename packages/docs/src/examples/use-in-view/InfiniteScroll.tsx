"use client";

import { useEffect, useState } from "react";
import { SkeletonText, Text, useInView } from "@futurewiz-rms/mint";

const PAGE = 10;
const LAST = 40;

export default function InfiniteScroll() {
  const [root, setRoot] = useState<HTMLDivElement | null>(null);
  const [count, setCount] = useState(PAGE);
  const hasMore = count < LAST;
  // 바닥 120px 전에 미리 불러온다. 다 불러오면 관찰을 멈춘다
  const { ref, inView } = useInView({ root, rootMargin: "0px 0px 120px 0px", skip: !hasMore });

  // 끝 칸이 보이는 동안 다음 묶음을 더한다(불러온 뒤에도 보이면 한 번 더)
  useEffect(() => {
    if (!inView || !hasMore) return;
    // 실제로는 여기서 다음 페이지를 요청한다(예시는 0.4초 뒤에 10개를 더한다)
    const timer = setTimeout(() => setCount((c) => Math.min(c + PAGE, LAST)), 400);
    return () => clearTimeout(timer);
  }, [inView, hasMore, count]);

  return (
    <div ref={setRoot} style={{ height: 280, width: "100%", overflow: "auto" }}>
      {Array.from({ length: count }, (_, i) => (
        <Text key={i} as="p" variant="body-3-regular" className="px-4 py-3">
          코인 {i + 1}
        </Text>
      ))}
      {hasMore ? (
        <div ref={ref} className="px-4 py-3">
          <SkeletonText />
        </div>
      ) : (
        <Text as="p" variant="caption-1-regular" color="tertiary" className="px-4 py-3">
          마지막이에요
        </Text>
      )}
    </div>
  );
}
