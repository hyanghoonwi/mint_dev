"use client";

// 요소가 화면(또는 스크롤 상자)에 들어왔는지 알려 준다. FDS `useInView`와 같은 API(react-intersection-observer 방식).
// IntersectionObserver는 effect 안에서만 만든다(렌더 중 브라우저 API 금지). 서버 렌더에서는 `initialInView` 값이다.
import { useCallback, useEffect, useRef, useState } from "react";

export interface UseInViewOptions {
  /** 요소가 얼마나 보일 때 `inView`로 볼지(0~1). 배열이면 각 값을 넘을 때마다 알린다. 기본 `0`(1px이라도 보이면) */
  threshold?: number | number[];
  /** 보이는지 판단하는 기준 영역(스크롤 상자). 생략하면 브라우저 화면 */
  root?: Element | Document | null;
  /** 기준 영역을 키우거나 줄이는 여백(CSS `margin` 형식). 예: `"0px 0px 200px 0px"`는 바닥 200px 전에 미리 보인 것으로 친다 */
  rootMargin?: string;
  /** true면 처음 보이는 순간 한 번만 알리고 관찰을 멈춘다. 이후 `inView`는 계속 `true` */
  triggerOnce?: boolean;
  /** true면 관찰하지 않는다 */
  skip?: boolean;
  /** 처음 관찰 결과가 나오기 전의 `inView` 값. 기본 `false` */
  initialInView?: boolean;
  /** `IntersectionObserver`가 없는 환경에서 쓸 `inView` 값 */
  fallbackInView?: boolean;
  /** 보이는 상태가 바뀔 때마다 호출된다 */
  onChange?: (inView: boolean, entry: IntersectionObserverEntry) => void;
}

export type UseInViewResult = [
  ref: (node: Element | null) => void,
  inView: boolean,
  entry: IntersectionObserverEntry | undefined,
] & {
  ref: (node: Element | null) => void;
  inView: boolean;
  entry: IntersectionObserverEntry | undefined;
};

/**
 * 요소가 화면(또는 스크롤 상자)에 보이는지 알려 준다. 무한 스크롤, 보일 때 나타나기, 지연 불러오기에 쓴다.
 * `react-intersection-observer`의 `useInView`와 같은 방식이다.
 *
 * `const [ref, inView, entry] = useInView()` 또는 `const { ref, inView, entry } = useInView()`로 쓰고,
 * `ref`를 관찰할 요소에 붙인다.
 */
export function useInView({
  threshold,
  root,
  rootMargin,
  triggerOnce = false,
  skip = false,
  initialInView = false,
  fallbackInView,
  onChange,
}: UseInViewOptions = {}): UseInViewResult {
  const [node, setNode] = useState<Element | null>(null);
  const [state, setState] = useState<{
    inView: boolean;
    entry: IntersectionObserverEntry | undefined;
  }>({ inView: initialInView, entry: undefined });

  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  });

  // 요소가 사라지면(언마운트 등) 처음 상태로 되돌린다. 한 번만 알리는 모드에서는 결과를 유지한다.
  // IntersectionObserver가 없는 환경이면 요소가 붙을 때 `fallbackInView`를 쓴다(ref 콜백은 브라우저에서만 불린다)
  const ref = useCallback(
    (next: Element | null) => {
      setNode(next);
      if (!next && !triggerOnce && !skip) {
        setState({ inView: initialInView, entry: undefined });
      }
      if (
        next &&
        !skip &&
        fallbackInView !== undefined &&
        typeof IntersectionObserver === "undefined"
      ) {
        setState((prev) => ({ ...prev, inView: fallbackInView }));
      }
    },
    [triggerOnce, skip, initialInView, fallbackInView],
  );

  // threshold는 배열일 수 있어(매 렌더 새 배열) 문자열 키로 비교하고, effect 안에서 다시 숫자로 바꾼다
  const thresholdKey = Array.isArray(threshold) ? threshold.join(",") : threshold;

  useEffect(() => {
    if (!node || skip || typeof IntersectionObserver === "undefined") {
      return;
    }
    const thresholdValue =
      thresholdKey === undefined ? undefined : String(thresholdKey).split(",").map(Number);
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[entries.length - 1];
        if (!entry) {
          return;
        }
        const inView = entry.isIntersecting;
        setState({ inView, entry });
        onChangeRef.current?.(inView, entry);
        if (inView && triggerOnce) {
          observer.disconnect();
        }
      },
      { threshold: thresholdValue, root, rootMargin },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [node, skip, thresholdKey, root, rootMargin, triggerOnce]);

  const result = [ref, state.inView, state.entry] as UseInViewResult;
  result.ref = ref;
  result.inView = state.inView;
  result.entry = state.entry;
  return result;
}
