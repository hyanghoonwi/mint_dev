// 상태·이벤트가 없어서 "use client"를 붙이지 않는다. 서버 컴포넌트에서도 그릴 수 있다.
// 사용자 행동의 결과를 짧게 알리는 메시지. Figma `Toast`(node 2314:38196) · `Toast Guidelines`(2314:38233).
// 화면에 띄우고 자동으로 사라지게 하는 일은 ToastProvider + useToast가 한다. 이 컴포넌트는 모양만 그린다.
import type { ComponentProps, ReactNode } from "react";
import { cn } from "../../utils/cn";
import { StatusIcon, type StatusVariant } from "../_internal/StatusIcon";

export type ToastVariant = StatusVariant;
export type ToastShape = "default" | "pill";

export interface ToastProps extends Omit<ComponentProps<"div">, "children"> {
  /** 종류. 완료는 `positive`, 주의는 `cautionary`, 오류는 `negative`. 기본 `normal` */
  variant?: ToastVariant;
  /** `default`는 모서리 12, `pill`은 알약 모양. 기본 `default` */
  shape?: ToastShape;
  /** 메시지. "저장했어요"처럼 결과만 한 문장으로 쓴다 */
  children: ReactNode;
}

/**
 * 토스트 한 개의 모양. 종류에 맞는 아이콘이 앞에 붙는다.
 * 배경은 반투명 회색 막(`fill-alpha-500`) + 블러, 떠 있는 요소라 `shadow-floating`을 쓴다.
 */
export function Toast({
  variant = "normal",
  shape = "default",
  className,
  children,
  ...props
}: ToastProps) {
  return (
    <div
      className={cn(
        "flex min-h-[54px] items-center gap-2 py-[14px] text-body-4-medium text-text-on-fill",
        "bg-fill-alpha-500 shadow-floating backdrop-blur-[6px]",
        shape === "pill" ? "rounded-full px-5" : "rounded-12 px-4",
        className,
      )}
      {...props}
    >
      <StatusIcon variant={variant} />
      <span className="min-w-0 flex-1 [overflow-wrap:anywhere]">{children}</span>
    </div>
  );
}
