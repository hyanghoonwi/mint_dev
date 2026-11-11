"use client";

// 값이 바뀐 뒤 `delay`만큼 더 바뀌지 않으면 그 값을 돌려준다. 검색어 입력처럼 빠르게 바뀌는 값으로 요청할 때 횟수를 줄인다.
// 기다리는 중인지(isDebouncing)와 바로 반영(flush)·취소(cancel)도 함께 돌려준다.
// 서버 렌더와 첫 렌더에서는 넘긴 값을 그대로 돌려준다(타이머는 effect 안에서만 쓴다).
import { useCallback, useEffect, useRef, useState } from "react";

export interface UseDebounceValueResult<T> {
  /** `delay` 동안 바뀌지 않아 확정된 값. 요청·필터에 쓴다 */
  debouncedValue: T;
  /** 값이 바뀌었는데 아직 확정을 기다리는 중인지. 입력 중 표시(로딩 점 등)에 쓴다 */
  isDebouncing: boolean;
  /** 기다리지 않고 지금 값을 바로 확정한다(예: Enter를 눌렀을 때) */
  flush: () => void;
  /** 기다리던 값을 버리고 이전 확정 값을 유지한다. 값이 다시 바뀌면 다시 기다린다 */
  cancel: () => void;
}

/**
 * 값이 `delay`(ms, 기본 300) 동안 바뀌지 않으면 확정한다.
 * `const { debouncedValue, isDebouncing } = useDebounceValue(query, 300)` → `debouncedValue`로 요청한다.
 * 객체·배열을 넘길 때는 매 렌더 새로 만들지 않는다(바뀐 것으로 보고 계속 기다린다)
 */
export function useDebounceValue<T>(value: T, delay = 300): UseDebounceValueResult<T> {
  const [debounced, setDebounced] = useState(value);
  // cancel()한 값. 이 값인 동안에는 기다리지 않는다
  const [cancelled, setCancelled] = useState<{ value: T } | null>(null);
  const latest = useRef(value);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    latest.current = value;
  });

  const immediate = delay <= 0;
  const skip = immediate || (cancelled !== null && Object.is(cancelled.value, value));

  useEffect(() => {
    if (skip) return;
    timer.current = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer.current);
  }, [value, delay, skip]);

  const flush = useCallback(() => {
    clearTimeout(timer.current);
    setCancelled(null);
    setDebounced(latest.current);
  }, []);

  const cancel = useCallback(() => {
    clearTimeout(timer.current);
    setCancelled({ value: latest.current });
  }, []);

  return {
    // delay가 0 이하면 기다리지 않고 바로 따라간다(상태를 거치지 않아서 다시 렌더가 반복되지 않는다)
    debouncedValue: immediate ? value : debounced,
    isDebouncing: !skip && !Object.is(value, debounced),
    flush,
    cancel,
  };
}
