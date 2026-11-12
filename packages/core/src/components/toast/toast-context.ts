// ToastProvider와 useToast가 함께 쓰는 Context·타입. 공개 API의 타입은 index에서 내보낸다.
import { createContext } from "react";
import type { ReactNode } from "react";
import type { ToastShape, ToastVariant } from "./Toast";

export interface ToastOptions {
  /** 토스트 id. 같은 id가 떠 있으면 새로 쌓지 않고 내용을 바꾸며 시간을 처음부터 다시 잰다. 생략하면 자동으로 만든다 */
  id?: string;
  /** 종류. 기본 `normal` */
  variant?: ToastVariant;
  /** 모양. 생략하면 ToastProvider의 `shape`(기본 `default`) */
  shape?: ToastShape;
  /** 사라지기까지의 시간(ms). 생략하면 ToastProvider의 `duration`(기본 3000). `null`이면 닫을 때까지 남는다 */
  duration?: number | null;
  /** 화면에서 사라질 때(자동·닫기·개수 초과) 한 번 호출된다 */
  onClose?: () => void;
}

/** 종류별 단축 함수에서는 variant를 이름으로 정하므로 옵션에서 뺀다 */
export type ToastShortcutOptions = Omit<ToastOptions, "variant">;

export interface ToastApi {
  /** 토스트를 띄우고 id를 돌려준다 */
  (message: ReactNode, options?: ToastOptions): string;
  normal: (message: ReactNode, options?: ToastShortcutOptions) => string;
  positive: (message: ReactNode, options?: ToastShortcutOptions) => string;
  cautionary: (message: ReactNode, options?: ToastShortcutOptions) => string;
  negative: (message: ReactNode, options?: ToastShortcutOptions) => string;
  /** id의 토스트를 닫는다. 생략하면 모두 닫는다 */
  dismiss: (id?: string) => void;
}

export const ToastContext = createContext<ToastApi | null>(null);
