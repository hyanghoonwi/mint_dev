// 상태가 없어서 "use client"를 붙이지 않는다(Button과 같은 방식). onClick·onClose는 클라이언트 컴포넌트에서 넘긴다.
// 작업 뒤 다음 행동을 제안하는 메시지. Figma `Snackbar`(node 2316:39591) · `Snackbar Guidelines`(2316:39631).
// 토스트처럼 띄웠다 사라지는 것이 아니라 본문 안에 그대로 렌더링해 두는 컴포넌트다. 보이고 숨기는 것은 사용하는 쪽이 정한다.
import type { ComponentProps, ReactNode } from "react";
import { cn } from "../../utils/cn";
import { StatusIcon, type StatusVariant } from "../_internal/StatusIcon";
import { XIcon } from "../icon/icons.generated";

export type SnackbarVariant = StatusVariant;

export interface SnackbarProps extends Omit<ComponentProps<"div">, "children" | "title"> {
  /** 종류. 완료는 `positive`, 주의는 `cautionary`, 오류는 `negative`. 기본 `normal` */
  variant?: SnackbarVariant;
  /** 제목. 한 줄로 쓰고, 넘치면 말줄임 */
  heading: ReactNode;
  /** 설명. 필요할 때만 쓴다 */
  description?: ReactNode;
  /** 종류에 맞는 아이콘을 앞에 붙인다. 기본 `false` */
  icon?: boolean;
  /**
   * 오른쪽에 붙일 요소. 다음 행동 버튼을 직접 넣는다(Figma는 Outline Neutral md 버튼 하나):
   * `<Button variant="outline" color="neutral" size="md">되돌리기</Button>`
   */
  addOn?: ReactNode;
  /** 넘기면 닫기 버튼(X)이 생기고, 누르면 호출된다 */
  onClose?: () => void;
}

/**
 * 본문 안에 놓는 스낵바. 배경 gray-600, 모서리 12, 폭은 놓인 자리를 채우고 최대 420.
 * 오른쪽 `addOn`에는 Outline Neutral(md) 버튼 하나를 넣는 것이 기본이다. 본문에 붙어 있는 요소라 그림자는 쓰지 않는다.
 * 닫기 버튼(`onClose`)을 누르면 사용하는 쪽이 상태를 바꿔 숨긴다.
 */
export function Snackbar({
  variant = "normal",
  heading,
  description,
  icon = false,
  addOn,
  onClose,
  className,
  ...props
}: SnackbarProps) {
  return (
    <div
      className={cn(
        "flex min-h-[54px] w-full max-w-[420px] items-center gap-2 rounded-12 py-3 pr-3 pl-4",
        // Figma가 아토믹 gray-600을 직접 쓴다(불투명 배경)
        "bg-[var(--color-atomic-gray-600)] text-text-on-fill",
        className,
      )}
      {...props}
    >
      {icon && <StatusIcon variant={variant} />}
      <div className="flex min-w-0 flex-1 flex-col gap-[2px]">
        <p className="truncate text-body-4-semibold">{heading}</p>
        {description && <p className="text-body-5-regular">{description}</p>}
      </div>
      {addOn}
      {onClose && (
        <button
          type="button"
          aria-label="닫기"
          onClick={onClose}
          className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full text-icon-on-fill transition-colors hover:bg-fill-alpha-200 active:bg-fill-alpha-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus"
        >
          <XIcon size={20} />
        </button>
      )}
    </div>
  );
}
