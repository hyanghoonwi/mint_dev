"use client";

// 제어(value를 부모가 줌)와 비제어(defaultValue로 시작) 값을 한 훅으로 다룬다. 공개하지 않는 내부 구현이다.
import { useCallback, useState } from "react";

export function useControllableState<T>(
  value: T | undefined,
  defaultValue: T,
  onChange?: (next: T) => void,
): [T, (next: T) => void] {
  const [inner, setInner] = useState(defaultValue);
  const controlled = value !== undefined;
  const set = useCallback(
    (next: T) => {
      if (!controlled) setInner(next);
      onChange?.(next);
    },
    [controlled, onChange],
  );
  return [controlled ? value : inner, set];
}
