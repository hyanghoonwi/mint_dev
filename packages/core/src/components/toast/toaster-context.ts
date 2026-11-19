// ToasterProvider와 useToaster가 함께 쓰는 Context·타입. 공개 API의 타입은 index에서 내보낸다.
import { createContext } from "react";
import type { ReactNode } from "react";
import type { ToastAction, ToastShape, ToastVariant } from "./Toast";

export interface ToasterOptions {
  /** 토스트 id. 같은 id가 떠 있으면 새로 쌓지 않고 내용을 바꾸며 시간을 처음부터 다시 잰다. 생략하면 자동으로 만든다 */
  id?: string;
  /** 종류. 기본 `normal` */
  variant?: ToastVariant;
  /** 모양. 생략하면 ToasterProvider의 `shape`(기본 `default`) */
  shape?: ToastShape;
  /** 앞 아이콘. `true`(기본) 종류별 아이콘 · `false` 없음 · 노드를 넘기면 그 아이콘 */
  icon?: boolean | ReactNode;
  /** 오른쪽 버튼 모양(`ghost` 글자만 · `button` 배경 있음). 기본은 버튼 없음. 글자는 `actionLabel`로 준다 */
  action?: Exclude<ToastAction, "none">;
  /** 버튼 글자(2~4자) */
  actionLabel?: ReactNode;
  /** 버튼을 눌렀을 때. 호출한 뒤 토스트는 자동으로 닫힌다 */
  onAction?: () => void;
  /** 사라지기까지의 시간(ms). 생략하면 ToasterProvider의 `duration`(버튼이 있으면 `actionDuration`). `null`이면 닫을 때까지 남는다 */
  duration?: number | null;
  /** 화면에서 사라질 때(자동·닫기·개수 초과) 한 번 호출된다 */
  onClose?: () => void;
}

/** 종류별 단축 함수에서는 variant를 이름으로 정하므로 옵션에서 뺀다 */
export type ToasterShortcutOptions = Omit<ToasterOptions, "variant">;

export interface ToasterApi {
  /** 토스트를 띄우고 id를 돌려준다 */
  (message: ReactNode, options?: ToasterOptions): string;
  normal: (message: ReactNode, options?: ToasterShortcutOptions) => string;
  positive: (message: ReactNode, options?: ToasterShortcutOptions) => string;
  cautionary: (message: ReactNode, options?: ToasterShortcutOptions) => string;
  negative: (message: ReactNode, options?: ToasterShortcutOptions) => string;
  /** id의 토스트를 닫는다. 생략하면 모두 닫는다 */
  dismiss: (id?: string) => void;
}

export const ToasterContext = createContext<ToasterApi | null>(null);
