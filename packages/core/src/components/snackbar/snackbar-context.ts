// ToastProvider와 useSnackbar가 함께 쓰는 Context·타입. 공개 API의 타입은 index에서 내보낸다.
// 스낵바는 토스트와 같은 ToastProvider가 그리고, 토스트와 같은 자리에 섞여 쌓인다.
import { createContext } from "react";
import type { ReactNode } from "react";
import type { SnackbarVariant } from "./Snackbar";

export interface SnackbarOptions {
  /** 스낵바 id. 같은 id가 떠 있으면 새로 쌓지 않고 내용을 바꾸며 시간을 처음부터 다시 잰다. 생략하면 자동으로 만든다 */
  id?: string;
  /** 종류. 기본 `normal` */
  variant?: SnackbarVariant;
  /** 설명. 필요할 때만 쓴다 */
  description?: ReactNode;
  /** 종류에 맞는 아이콘을 앞에 붙인다. 기본 `false` */
  icon?: boolean;
  /**
   * 오른쪽에 붙일 요소. 다음 행동 버튼을 직접 넣는다.
   * 누른 뒤 닫으려면 버튼에서 `snackbar.dismiss(id)`를 부른다(`id`를 옵션으로 정해 두면 편하다)
   */
  addOn?: ReactNode;
  /** 닫기 버튼(X)을 보인다. 기본 `false` */
  closable?: boolean;
  /** 사라지기까지의 시간(ms). 생략하면 ToastProvider의 `snackbarDuration`(기본 5000). `null`이면 닫을 때까지 남는다 */
  duration?: number | null;
  /** 화면에서 사라질 때(자동·닫기·버튼·개수 초과) 한 번 호출된다 */
  onClose?: () => void;
}

/** 종류별 단축 함수에서는 variant를 이름으로 정하므로 옵션에서 뺀다 */
export type SnackbarShortcutOptions = Omit<SnackbarOptions, "variant">;

export interface SnackbarApi {
  /** 스낵바를 띄우고 id를 돌려준다. 첫 인자는 제목(한 줄) */
  (heading: ReactNode, options?: SnackbarOptions): string;
  normal: (heading: ReactNode, options?: SnackbarShortcutOptions) => string;
  positive: (heading: ReactNode, options?: SnackbarShortcutOptions) => string;
  cautionary: (heading: ReactNode, options?: SnackbarShortcutOptions) => string;
  negative: (heading: ReactNode, options?: SnackbarShortcutOptions) => string;
  /** id의 스낵바를 닫는다. 생략하면 스낵바만 모두 닫는다(토스트는 그대로) */
  dismiss: (id?: string) => void;
}

export const SnackbarContext = createContext<SnackbarApi | null>(null);
