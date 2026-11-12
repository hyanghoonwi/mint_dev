"use client";

// 가로로 넘치는 목록을 마우스로 끌어서 스크롤하게 하는 내부 훅(공개하지 않는다).
// 터치·트랙패드는 브라우저가 스크롤해 주므로 손대지 않고, 마우스(pointerType "mouse")만 다룬다.
// 조금 움직이고 뗀 것은 그대로 클릭이고, DRAG_THRESHOLD를 넘게 움직였으면 끈 것으로 보고 뒤따르는 클릭을 막는다.
// 손을 떼면 떼기 직전 속도로 조금 더 미끄러지다 멈춘다(관성). 움직임 줄이기 설정이면 바로 멈춘다.
import {
  useEffect,
  useRef,
  useState,
  type MouseEvent,
  type PointerEvent,
  type RefObject,
} from "react";

const DRAG_THRESHOLD = 5;
/** 떼기 직전 이 시간(ms) 동안의 움직임으로 속도를 잰다 */
const VELOCITY_WINDOW = 100;
/** 16ms(한 프레임)마다 남는 속도의 비율. 1에 가까울수록 멀리 미끄러진다 */
const FRICTION = 0.95;
/** 이보다 느리면(px/ms) 관성을 시작하지 않거나 멈춘다 */
const MIN_VELOCITY = 0.05;

export function useDragScroll(scrollerRef: RefObject<HTMLElement | null>) {
  const drag = useRef<{
    id: number;
    x: number;
    scroll: number;
    moved: boolean;
    samples: { time: number; x: number }[];
  } | null>(null);
  const suppressClick = useRef(false);
  const frame = useRef(0);
  const [dragging, setDragging] = useState(false);

  const stopMomentum = () => {
    cancelAnimationFrame(frame.current);
    frame.current = 0;
  };

  // 사라질 때 돌던 관성을 멈춘다
  useEffect(() => stopMomentum, []);

  const startMomentum = (velocity: number) => {
    const scroller = scrollerRef.current;
    if (!scroller || Math.abs(velocity) < MIN_VELOCITY) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let currentVelocity = velocity;
    let last = performance.now();
    const step = (now: number) => {
      const elapsed = Math.min(now - last, 32);
      last = now;
      const before = scroller.scrollLeft;
      scroller.scrollLeft = before - currentVelocity * elapsed;
      currentVelocity *= Math.pow(FRICTION, elapsed / 16);
      // 충분히 느려졌거나 끝에 닿아 더 움직이지 않으면 멈춘다
      if (Math.abs(currentVelocity) < MIN_VELOCITY || scroller.scrollLeft === before) {
        frame.current = 0;
        return;
      }
      frame.current = requestAnimationFrame(step);
    };
    frame.current = requestAnimationFrame(step);
  };

  const end = (event: PointerEvent<HTMLElement>) => {
    const state = drag.current;
    if (!state || state.id !== event.pointerId) return;
    drag.current = null;
    if (!state.moved) return;
    suppressClick.current = true;
    setDragging(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    // 떼기 직전 VELOCITY_WINDOW 동안 움직인 거리로 속도를 잰다(멈췄다 떼면 0이라 미끄러지지 않는다)
    const now = performance.now();
    const recent = state.samples.filter((sample) => now - sample.time <= VELOCITY_WINDOW);
    if (recent.length < 2 || event.type === "pointercancel") return;
    const first = recent[0];
    const lastSample = recent[recent.length - 1];
    const elapsed = lastSample.time - first.time;
    if (elapsed > 0) startMomentum((lastSample.x - first.x) / elapsed);
  };

  return {
    /** 끄는 중이면 true. 커서·글자 선택 막기에 쓴다 */
    dragging,
    handlers: {
      onPointerDown: (event: PointerEvent<HTMLElement>) => {
        // 어떤 입력이든 누르면 미끄러지던 것을 멈춘다(손가락으로 잡아 세우기 포함)
        stopMomentum();
        const scroller = scrollerRef.current;
        if (event.pointerType !== "mouse" || event.button !== 0 || !scroller) return;
        // 넘치지 않으면 끌 것이 없다
        if (scroller.scrollWidth <= scroller.clientWidth) return;
        suppressClick.current = false;
        drag.current = {
          id: event.pointerId,
          x: event.clientX,
          scroll: scroller.scrollLeft,
          moved: false,
          samples: [{ time: performance.now(), x: event.clientX }],
        };
      },
      onPointerMove: (event: PointerEvent<HTMLElement>) => {
        const state = drag.current;
        const scroller = scrollerRef.current;
        if (!state || state.id !== event.pointerId || !scroller) return;
        const deltaX = event.clientX - state.x;
        if (!state.moved) {
          if (Math.abs(deltaX) < DRAG_THRESHOLD) return;
          state.moved = true;
          setDragging(true);
          // 목록 밖으로 나가도 계속 끌 수 있게 포인터를 붙잡는다
          event.currentTarget.setPointerCapture(event.pointerId);
        }
        scroller.scrollLeft = state.scroll - deltaX;
        const now = performance.now();
        state.samples.push({ time: now, x: event.clientX });
        // 오래된 기록은 버린다
        while (state.samples.length > 2 && now - state.samples[0].time > VELOCITY_WINDOW) {
          state.samples.shift();
        }
      },
      onPointerUp: end,
      onPointerCancel: end,
      // 휠·트랙패드로 스크롤하면 미끄러지던 것을 멈추고 그 입력을 따른다
      onWheel: stopMomentum,
      // 끈 뒤 손을 떼며 생기는 클릭은 칩 선택으로 이어지지 않게 막는다
      onClickCapture: (event: MouseEvent<HTMLElement>) => {
        if (!suppressClick.current) return;
        suppressClick.current = false;
        event.preventDefault();
        event.stopPropagation();
      },
      // 링크·이미지를 끌어 옮기는 브라우저 기본 동작을 막는다
      onDragStart: (event: MouseEvent<HTMLElement>) => event.preventDefault(),
    },
  };
}
