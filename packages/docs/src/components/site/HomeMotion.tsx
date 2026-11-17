"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { createViewake } from "viewake";

/** 서버 콘텐츠는 그대로 표시하고 마운트 이후 Viewake를 시작한다. */
export function HomeMotion({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!root.current) return;

    const elements = root.current.querySelectorAll<HTMLElement>("[data-viewake]");
    const heroElements = root.current.querySelectorAll<HTMLElement>(
      ".docs-home__hero [data-viewake]",
    );
    const controller = createViewake({
      threshold: 0.15,
      mode: "once",
      duration: 1000,
      respectReducedMotion: true,
    });

    // Viewake는 처음부터 화면 안에 있으면 active로 시작한다.
    // 히어로의 첫 등장에도 같은 CSS 전환을 쓰도록 pending을 한 프레임 먼저 그린다.
    const animateHero =
      "IntersectionObserver" in window &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (animateHero) {
      for (const element of heroElements) {
        const bounds = element.getBoundingClientRect();
        if (bounds.bottom > 0 && bounds.top < window.innerHeight) {
          element.setAttribute("data-viewake-state", "pending");
        }
      }
    }

    let animationFrame = requestAnimationFrame(() => {
      animationFrame = requestAnimationFrame(() => controller.observe(elements));
    });

    return () => {
      cancelAnimationFrame(animationFrame);
      controller.destroy();
      for (const element of heroElements) element.removeAttribute("data-viewake-state");
    };
  }, []);

  return (
    <div className="docs-home" ref={root}>
      {children}
    </div>
  );
}
