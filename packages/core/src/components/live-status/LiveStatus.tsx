"use client";

// 링 모션을 Web Animations API(`element.animate`)로 걸고 화면 안 링의 순서를 알아야 해서 클라이언트 컴포넌트다.
// 애니메이션은 마운트 뒤(useEffect)에만 시작한다. 서버 렌더와 첫 화면은 정지 모양이라 hydration이 어긋나지 않는다.
// Figma `Live Status`(node 2372:79475) · `Live Status Guidelines`(node 2372:79509).
// 데이터가 실시간으로 반영되는지 점과 글자로 알린다.
import { useEffect, useRef, type ComponentProps } from "react";
import { cn } from "../../utils/cn";

// 링 모션(Figma): 1.8초 반복, 1배 → 3.2배·투명도 0.55 → 0, easing cubic-bezier(.2,.6,.3,1).
// 같은 화면에 여러 개 있으면 0.26초씩 어긋나게 시작한다(Figma). 링은 `data-mint-ping`으로 찾는다
const PING_KEYFRAMES = [
  { transform: "scale(1)", opacity: 0.55 },
  { transform: "scale(3.2)", opacity: 0 },
];
const PING_DURATION = 1800;
const PING_STAGGER = 260;
// 지연이 한 번 도는 시간(1.8초)보다 길어지면 첫 링이 한참 뒤에야 나타나서, 7칸(0.26 × 7 ≈ 1.8초)을 돌려 쓴다
const PING_SLOTS = 7;

export interface LiveStatusProps extends Omit<ComponentProps<"span">, "children"> {
  /** 점 옆 글자. 기본은 켜짐 "실시간 반영 중", 꺼짐 "일시정지". 상황에 맞는 문구로 바꾼다 */
  label?: string;
  /** 실시간으로 반영 중이면 `true`(빨간 점과 퍼지는 링, 기본), 멈췄으면 `false`(회색 점) */
  active?: boolean;
}

/** 값이 실시간으로 갱신되는지 보여 주는 표시. 제목 옆이나 카드 상단에 작게 붙여 쓴다 */
export function LiveStatus({ label, active = true, className, ...props }: LiveStatusProps) {
  const ringRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const ring = ringRef.current;
    if (!ring) return;
    // 움직임 줄이기 설정이면 정지 모양 그대로 둔다
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // 화면 안 링의 순서대로 0.26초씩 늦게 시작한다
    const order = Array.from(document.querySelectorAll("[data-mint-ping]")).indexOf(ring);
    const animation = ring.animate(PING_KEYFRAMES, {
      duration: PING_DURATION,
      delay: (Math.max(order, 0) % PING_SLOTS) * PING_STAGGER,
      iterations: Infinity,
      easing: "cubic-bezier(.2,.6,.3,1)",
    });
    return () => animation.cancel();
  }, [active]);

  return (
    <span className={cn("inline-flex items-center gap-2", className)} {...props}>
      {/* 점(8px). 상태는 색만으로 알리지 않고 글자로도 알리므로 점은 스크린리더가 읽지 않는다 */}
      <span aria-hidden="true" className="relative size-2 shrink-0">
        {active ? (
          <>
            {/* 링. 아래 style은 정지 모양(Figma: 지름 18 = 점의 2.25배, 투명도 25%)이고, 움직임이 시작되면 애니메이션이 덮어쓴다 */}
            <span
              ref={ringRef}
              data-mint-ping=""
              className="absolute inset-0 rounded-full bg-fill-danger-pressed"
              style={{ transform: "scale(2.25)", opacity: 0.25 }}
            />
            <span className="absolute inset-0 rounded-full bg-fill-danger-pressed" />
          </>
        ) : (
          <span className="absolute inset-0 rounded-full bg-icon-tertiary" />
        )}
      </span>
      <span className="text-body-4-regular whitespace-nowrap text-text-tertiary">
        {label ?? (active ? "실시간 반영 중" : "일시정지")}
      </span>
    </span>
  );
}
