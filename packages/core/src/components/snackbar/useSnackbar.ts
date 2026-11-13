"use client";

import { use } from "react";
import { SnackbarContext } from "./snackbar-context";
import type { SnackbarApi } from "./snackbar-context";

/**
 * 스낵바를 띄우고 닫는 훅. 앱 최상단의 `ToastProvider` 안에서만 쓸 수 있다(토스트와 같은 Provider).
 * 띄운 스낵바는 토스트와 같은 자리에 섞여 쌓인다.
 * 반환값은 렌더 사이에 바뀌지 않아서 `useEffect` 의존성에 넣어도 다시 실행되지 않는다.
 *
 *   const snackbar = useSnackbar();
 *   snackbar("삭제했어요.", { id: "delete", addOn: <Button onClick={undo}>되돌리기</Button> });
 */
export function useSnackbar(): SnackbarApi {
  const value = use(SnackbarContext);
  if (!value) {
    throw new Error("useSnackbar는 <ToastProvider> 안에서만 쓸 수 있어요.");
  }
  return value;
}
