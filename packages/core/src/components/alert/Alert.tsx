"use client";

// <dialog>를 열고 닫는 effect가 있어서 클라이언트 컴포넌트다.
// 포커스 가두기·Esc·뒤 화면 비활성·닫을 때 원래 자리로 포커스 복귀는 브라우저의 모달 <dialog>(showModal)가 맡는다.
// 모달 <dialog>는 화면 맨 위 레이어에 그려져서 포털이 필요 없고, 서버에서는 닫힌 <dialog>만 렌더되어 hydration이 어긋나지 않는다.
import { useEffect, useId, useRef, type ComponentProps, type ReactNode } from "react";
import { cn } from "../../utils/cn";

// 열린 Alert 수. 여러 개가 쌓였을 때 먼저 연 것이 닫혀도 마지막 하나가 닫힐 때까지 스크롤을 잠가 둔다
let scrollLocks = 0;
let previousOverflow = "";

function lockScroll() {
  if (scrollLocks === 0) {
    previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
  }
  scrollLocks += 1;
}

function unlockScroll() {
  scrollLocks = Math.max(0, scrollLocks - 1);
  if (scrollLocks === 0) document.body.style.overflow = previousOverflow;
}

export interface AlertProps extends Omit<
  ComponentProps<"dialog">,
  "open" | "onClose" | "children" | "role"
> {
  /** 열림 여부. 상태는 사용하는 쪽이 갖는다 */
  open: boolean;
  /** Esc를 눌렀을 때 호출된다. 여기서 `open`을 `false`로 바꾼다. 버튼을 눌렀을 때는 각 버튼의 `onClick`에서 닫는다 */
  onClose?: () => void;
  /** 한 줄로 상황을 요약한다. 없으면 제목 줄이 사라진다 */
  heading?: ReactNode;
  /** 본문. 해결 방법을 적는다 */
  body: ReactNode;
  /**
   * 하단 버튼 영역. 버튼을 1~2개 넣는다(`Button` 등). 오른쪽 끝에 정렬되고 사이 간격은 8이다.
   * 취소 같은 보조 행동은 앞에, 주된 행동은 뒤(오른쪽 끝)에 둔다. 버튼을 눌러 닫는 것은 각 버튼의 `onClick`에서 `open`을 바꿔서 한다.
   */
  action: ReactNode;
}

export function Alert({
  open,
  onClose,
  heading,
  body,
  action,
  className,
  onCancel,
  ref,
  ...props
}: AlertProps) {
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const headingId = useId();
  const bodyId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  // 열려 있는 동안 뒤 화면이 스크롤되지 않게 한다
  useEffect(() => {
    if (!open) return;
    lockScroll();
    return unlockScroll;
  }, [open]);

  return (
    <dialog
      ref={(node) => {
        dialogRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      }}
      role="alertdialog"
      aria-labelledby={heading ? headingId : undefined}
      aria-describedby={bodyId}
      // Esc로 닫는 것도 `open`이 바꾸게 한다(브라우저가 혼자 닫으면 상태와 어긋난다)
      onCancel={(event) => {
        event.preventDefault();
        onClose?.();
        onCancel?.(event);
      }}
      // 닫힌 <dialog>는 브라우저가 숨긴다. 그래서 display는 열렸을 때만 준다.
      // 안쪽 여백: 위·좌우 24, 아래 20(하단 action에 Button을 넣는 구조라 버튼 아래 20)
      className={cn(
        "m-auto w-[320px] max-w-[min(320px,calc(100vw-40px))] min-w-[280px] gap-5 rounded-16 border-0 bg-fill-white px-6 pt-6 pb-5 text-left open:flex open:flex-col backdrop:bg-[var(--color-atomic-grayAlpha-600)]",
        className,
      )}
      {...props}
    >
      <div className="flex flex-col gap-2 break-words">
        {heading && (
          <h2 id={headingId} className="text-heading-3-semibold text-text-strong">
            {heading}
          </h2>
        )}
        <div id={bodyId} className="text-body-3-regular text-text-secondary">
          {body}
        </div>
      </div>
      <div className="flex items-center justify-end gap-2">{action}</div>
    </dialog>
  );
}
