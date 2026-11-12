"use client";

import { use } from "react";
import { ToastContext } from "./toast-context";
import type { ToastApi } from "./toast-context";

/**
 * 토스트를 띄우고 닫는 훅. 앱 최상단의 `ToastProvider` 안에서만 쓸 수 있다.
 * 반환값은 렌더 사이에 바뀌지 않아서 `useEffect` 의존성에 넣어도 다시 실행되지 않는다.
 *
 *   const toast = useToast();
 *   toast.positive("저장했어요");
 */
export function useToast(): ToastApi {
  const value = use(ToastContext);
  if (!value) {
    throw new Error("useToast는 <ToastProvider> 안에서만 쓸 수 있어요.");
  }
  return value;
}
