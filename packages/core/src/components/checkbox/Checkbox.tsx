"use client";

// 비제어(defaultChecked) 상태를 그리기 위해 상태를 갖고, indeterminate는 DOM 속성이라 effect로 넣어서 클라이언트 컴포넌트다.
// Figma `Checkbox`(2200:8114) · `Checkbox Guidelines`(2200:8359).
// 진짜 <input type="checkbox">를 <label>로 감싼다. 그래서 레이블을 눌러도 선택되고, 폼 제출·키보드(Space)·스크린리더가 그대로 동작한다.
// 화면에 보이는 상자는 그림이고, 입력은 보이지 않게 겹쳐 둔다(포커스 링은 상자에 그린다).
import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type ComponentProps,
  type ReactNode,
} from "react";
import { cn } from "../../utils/cn";
import { CheckboxMark } from "../_internal/controlMarks";

export interface CheckboxProps extends Omit<ComponentProps<"input">, "type" | "children" | "size"> {
  /** 레이블. 없으면 상자만 보이므로 `aria-label`을 꼭 준다 */
  children?: ReactNode;
  /** 일부만 선택된 상태(전체 선택 칸). 체크 대신 가로 막대를 보여 주고 스크린리더에는 "일부 선택"으로 읽힌다 */
  indeterminate?: boolean;
  /** 바깥 여백(8px)을 없앤 촘촘한 모양. 촘촘한 목록에서만 쓴다. 기본 `false` */
  tight?: boolean;
  /** 레이블을 굵게(SemiBold). 전체 선택 같은 강조 레이블에 쓴다. 기본 `false` */
  bold?: boolean;
}

/** 여러 개를 고르거나 한 항목을 켜고 끄는 체크박스. 레이블을 눌러도 선택된다 */
export function Checkbox({
  children,
  indeterminate = false,
  tight = false,
  bold = false,
  checked,
  defaultChecked,
  disabled = false,
  onChange,
  className,
  style,
  ref,
  ...props
}: CheckboxProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  // 비제어일 때 화면에 그릴 체크 상태. 제어(checked)면 그 값을 따른다
  const [inner, setInner] = useState(Boolean(defaultChecked));
  const isChecked = checked ?? inner;

  // indeterminate는 HTML 속성이 아니라 DOM 속성이라 렌더 후에 넣는다(스크린리더는 "일부 선택"으로 읽는다)
  useEffect(() => {
    if (inputRef.current) inputRef.current.indeterminate = indeterminate;
  });

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (checked === undefined) setInner(event.target.checked);
    onChange?.(event);
  };

  return (
    <label
      className={cn(
        "group/control relative inline-flex items-center gap-2",
        tight ? "p-0" : "p-2",
        disabled ? "cursor-not-allowed" : "cursor-pointer",
        // Figma 접근성: 박스가 20px이라도 레이블을 포함해 영역을 넓힌다. 터치 화면에서는 눌림 영역을 44px 이상으로
        "pointer-coarse:before:absolute pointer-coarse:before:inset-x-0 pointer-coarse:before:top-1/2 pointer-coarse:before:h-11 pointer-coarse:before:-translate-y-1/2",
        className,
      )}
      style={style}
    >
      <input
        ref={(node) => {
          inputRef.current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) ref.current = node;
        }}
        type="checkbox"
        checked={checked}
        defaultChecked={defaultChecked}
        disabled={disabled}
        onChange={handleChange}
        className="peer sr-only"
        {...props}
      />
      <CheckboxMark checked={isChecked} indeterminate={indeterminate} disabled={disabled} />
      {children != null && (
        <span
          className={cn(
            "whitespace-nowrap",
            bold ? "text-body-2-semibold" : "text-body-2-regular",
            disabled ? "text-text-disabled" : "text-text-primary",
          )}
        >
          {children}
        </span>
      )}
    </label>
  );
}
