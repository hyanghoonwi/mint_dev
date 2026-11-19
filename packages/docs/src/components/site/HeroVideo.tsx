"use client";

import { useEffect, useRef } from "react";

/**
 * 첫 화면 히어로의 장식 영상. 자동 재생·음소거라서 소리도 컨트롤도 없고, 반복하지 않고 한 번 재생한 뒤 마지막 장면에서 멈춘다
 * (읽을 내용이 아니므로 스크린리더에서 뺀다). 움직임 줄이기 설정이면 재생하지 않고 포스터(마지막 장면과 같은 프레임)만 보여 준다.
 */
export function HeroVideo() {
  const video = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const element = video.current;
    if (!element) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      if (reduce.matches) element.pause();
      else void element.play().catch(() => {});
    };
    sync();
    reduce.addEventListener("change", sync);
    return () => reduce.removeEventListener("change", sync);
  }, []);

  return (
    <video
      ref={video}
      className="docs-home__video-media"
      src="/video/hero.mp4"
      poster="/video/hero-poster.jpg"
      autoPlay
      muted
      playsInline
      preload="metadata"
      aria-hidden="true"
      tabIndex={-1}
      disablePictureInPicture
    />
  );
}
