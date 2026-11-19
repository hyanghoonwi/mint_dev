// 상태·이벤트가 없어서 "use client"를 붙이지 않는다. 서버 컴포넌트에서도 그릴 수 있다(`onAction`을 넘길 때만 클라이언트 컴포넌트 안에서).
// 사용자 행동의 결과를 짧게 알리는 메시지. Figma `Toast`(node 2504:126500) · `Toast Guidelines`(2314:38233).
// 예전의 Toast와 Snackbar를 합친 컴포넌트다(2026-11): 버튼이 필요하면 `action`으로 더한다.
// 화면에 띄우고 자동으로 사라지게 하는 일은 ToasterProvider + useToaster가 한다. 이 컴포넌트는 모양만 그린다.
import type { ComponentProps, ReactNode } from "react";
import { cn } from "../../utils/cn";
import { StatusIcon, type StatusVariant } from "../_internal/StatusIcon";

export type ToastVariant = StatusVariant;
export type ToastShape = "default" | "pill";
/** `none` 버튼 없음 · `ghost` 글자만 있는 버튼 · `button` 배경이 있는 버튼 */
export type ToastAction = "none" | "ghost" | "button";

export interface ToastProps extends Omit<ComponentProps<"div">, "children"> {
  /** 종류. 완료는 `positive`, 주의는 `cautionary`, 오류는 `negative`. 기본 `normal` */
  variant?: ToastVariant;
  /** `default`는 모서리 12, `pill`은 알약 모양. 기본 `default` */
  shape?: ToastShape;
  /** 메시지. "저장했어요"처럼 결과만 한 문장으로 쓴다 */
  children: ReactNode;
  /** 앞 아이콘. `true`(기본)는 종류에 맞는 아이콘, `false`는 없음, 노드를 넘기면 그 아이콘(20px 칸에 맞춘다) */
  icon?: boolean | ReactNode;
  /** 오른쪽 버튼 모양. 기본 `none`. 버튼 글자는 `actionLabel`로 준다 */
  action?: ToastAction;
  /** 버튼 글자(2~4자). `action`이 `none`이면 쓰이지 않는다 */
  actionLabel?: ReactNode;
  /** 버튼을 눌렀을 때 */
  onAction?: () => void;
}

// 패딩(Figma): 버튼이 있으면 오른쪽을 12로 줄이고 세로를 13으로 맞춘다(버튼 높이 28 + 13·13 = 54). 13은 간격 스케일 밖이라 임의 값이다
const paddings = {
  default: { plain: "px-4 py-[14px]", action: "py-[13px] pr-3 pl-4" },
  pill: { plain: "px-5 py-[14px]", action: "py-[13px] pr-3 pl-5" },
} as const;

const actionBase =
  "inline-flex h-7 shrink-0 cursor-pointer items-center justify-center rounded-8 px-2 text-label-3-medium whitespace-nowrap text-text-on-fill transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fill-white";
const actionStyles: Record<Exclude<ToastAction, "none">, string> = {
  ghost: "hover:bg-fill-white/12 active:bg-fill-white/12",
  button: "bg-fill-neutral hover:bg-fill-neutral-pressed active:bg-fill-neutral-pressed",
};

/**
 * 토스트 한 개의 모양. 종류에 맞는 아이콘이 앞에 붙고, 필요하면 오른쪽에 버튼 하나를 둔다.
 * 배경은 반투명 회색 막(`fill-alpha-500`) + 블러 6이고, 시안에 그림자가 없어서 그림자를 주지 않는다.
 */
export function Toast({
  variant = "normal",
  shape = "default",
  children,
  icon = true,
  action = "none",
  actionLabel,
  onAction,
  className,
  ...props
}: ToastProps) {
  const hasAction = action !== "none" && actionLabel !== undefined;

  return (
    <div
      className={cn(
        "flex min-h-[54px] min-w-[min(300px,100%)] items-center gap-2 text-body-4-medium text-text-on-fill",
        "bg-fill-alpha-500 backdrop-blur-[6px]",
        shape === "pill" ? "rounded-full" : "rounded-12",
        paddings[shape][hasAction ? "action" : "plain"],
        className,
      )}
      {...props}
    >
      {icon === false ? null : icon === true || icon === undefined ? (
        <StatusIcon variant={variant} />
      ) : (
        <span
          aria-hidden="true"
          className="flex size-5 shrink-0 items-center justify-center text-icon-on-fill"
        >
          {icon}
        </span>
      )}
      <span className="min-w-0 flex-1 [overflow-wrap:anywhere]">{children}</span>
      {hasAction && (
        <button
          type="button"
          onClick={onAction}
          className={cn(actionBase, actionStyles[action as Exclude<ToastAction, "none">])}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
