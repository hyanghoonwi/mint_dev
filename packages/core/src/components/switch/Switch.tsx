// 상태·이벤트가 없어서 "use client"를 붙이지 않는다. 켜짐·꺼짐 모양은 CSS(peer-checked)가 그린다.
// 서버 컴포넌트에서도 그대로 쓸 수 있다(`onChange`를 넘길 때만 클라이언트 컴포넌트 안에서 쓴다).
// Figma `Switch`(2325:40822) · `Switch Guidelines`(2325:40913).
// 누르면 바로 켜지고 꺼지는 컨트롤. 즉시 적용되는 설정에만 쓰고, 제출할 때 적용되는 선택은 Checkbox를 쓴다.
// 진짜 <input type="checkbox" role="switch">를 <label>로 감싼다. 그래서 레이블을 눌러도 켜지고, 폼 제출·키보드(Space)·스크린리더가 그대로 동작한다.
// 화면에 보이는 트랙·손잡이는 그림이고, 입력은 보이지 않게 겹쳐 둔다(포커스 링은 트랙에 그린다).
import type { ComponentProps, ReactNode } from "react";
import { cn } from "../../utils/cn";

export interface SwitchProps extends Omit<ComponentProps<"input">, "type" | "children" | "size"> {
  /** 설정 이름. 옆에 레이블로 적어 무엇을 켜는지 알린다. 없으면 트랙만 보이므로 `aria-label`을 꼭 준다 */
  children?: ReactNode;
}

// 트랙 색(Figma): 꺼짐 gray/200 → 누름 gray/300 → 비활성 gray/100, 켜짐 brand → 진한 brand → 연한 파랑. Hover는 Pressed와 같다
const trackColors = {
  enabled: [
    "bg-fill-neutral-medium peer-checked:bg-fill-brand",
    "group-hover/control:bg-fill-neutral-medium-pressed group-hover/control:peer-checked:bg-fill-brand-pressed",
    "group-active/control:bg-fill-neutral-medium-pressed group-active/control:peer-checked:bg-fill-brand-pressed",
  ],
  disabled: ["bg-fill-neutral-weak peer-checked:bg-fill-brand-weak-pressed"],
};

/** 누르면 바로 켜지고 꺼지는 컨트롤. 레이블을 눌러도 켜진다 */
export function Switch({ children, disabled = false, className, ref, ...props }: SwitchProps) {
  return (
    <label
      className={cn(
        "group/control relative inline-flex items-center gap-2",
        disabled ? "cursor-not-allowed" : "cursor-pointer",
        // Figma 접근성: 트랙이 24px이라도 터치 화면에서는 눌림 영역을 44px 이상으로
        "pointer-coarse:before:absolute pointer-coarse:before:inset-x-0 pointer-coarse:before:top-1/2 pointer-coarse:before:h-11 pointer-coarse:before:-translate-y-1/2",
        className,
      )}
    >
      {/* 트랙 44×24 · 손잡이 20(안쪽 여백 2). 입력·트랙·손잡이가 형제라서 peer-checked로 한 번에 바뀐다 */}
      <span className="relative block h-6 w-11 shrink-0">
        <input
          ref={ref}
          type="checkbox"
          role="switch"
          disabled={disabled}
          className="peer absolute inset-0 m-0 size-full cursor-[inherit] appearance-none opacity-0"
          {...props}
        />
        <span
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute inset-0 rounded-full transition-colors duration-150",
            "peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-border-focus",
            disabled ? trackColors.disabled : trackColors.enabled,
          )}
        />
        <span
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute left-[2px] top-[2px] size-5 rounded-full bg-fill-white transition-transform duration-150 motion-reduce:transition-none",
            "peer-checked:translate-x-5",
            // 그림자는 꺼짐·켜짐 모두 있고, 비활성만 없다(Figma)
            !disabled && "shadow-[0_1px_3px_rgba(0,0,0,0.2)]",
          )}
        />
      </span>
      {children != null && (
        <span
          className={cn(
            "whitespace-nowrap text-body-2-regular",
            disabled ? "text-text-disabled" : "text-text-primary",
          )}
        >
          {children}
        </span>
      )}
    </label>
  );
}
