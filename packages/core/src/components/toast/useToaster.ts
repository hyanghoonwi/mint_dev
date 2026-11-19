"use client";

import { use } from "react";
import { ToasterContext } from "./toaster-context";
import type { ToasterApi } from "./toaster-context";

/**
 * 토스트를 띄우고 닫는 훅. 앱 최상단의 `ToasterProvider` 안에서만 쓸 수 있다.
 * 반환값은 렌더 사이에 바뀌지 않아서 `useEffect` 의존성에 넣어도 다시 실행되지 않는다.
 *
 *   const toaster = useToaster();
 *   toaster.positive("저장했어요");
 *   toaster.normal("삭제했어요", { action: "ghost", actionLabel: "되돌리기", onAction: undo });
 */
export function useToaster(): ToasterApi {
  const value = use(ToasterContext);
  if (!value) {
    throw new Error("useToaster는 <ToasterProvider> 안에서만 쓸 수 있어요.");
  }
  return value;
}
