"use client";

// RadioGroup이 이름·선택 값을 Context로 내려 주므로 클라이언트 컴포넌트다.
// Figma `Radio`(2204:17914) · `Radio Guidelines`(2204:18059).
// 진짜 <input type="radio">를 <label>로 감싼다. 같은 name끼리 하나만 선택되고, 방향키로 선택을 옮기고 Space로 고르는 것,
// 레이블을 눌러도 선택되는 것, 폼 제출이 브라우저 기본 동작 그대로다.
// 원 모양은 입력의 :checked를 CSS(peer)로 읽어 그린다. 같은 그룹의 다른 라디오가 선택되면 이전 라디오에는 이벤트가 오지 않아서
// JS 상태로 그리면 어긋나기 때문이다.
import {
  useContext,
  useId,
  useState,
  type ChangeEvent,
  type ComponentProps,
  type ReactNode,
} from "react";
import { cn } from "../../utils/cn";
import { RadioMark } from "../_internal/controlMarks";
import { RadioGroupContext } from "../_internal/radioGroupContext";

export interface RadioGroupProps extends Omit<
  ComponentProps<"div">,
  "onChange" | "defaultValue" | "role"
> {
  /** 선택된 값(제어). 생략하면 컴포넌트가 직접 상태를 가진다 */
  value?: string;
  /** 처음 선택 값(비제어). Figma 규칙: 처음부터 기본값 하나를 선택해 둔다 */
  defaultValue?: string;
  /** 다른 선택지를 골랐을 때 새 값으로 호출된다 */
  onChange?: (value: string) => void;
  /** 폼으로 제출할 이름. 생략하면 자동으로 만든다 */
  name?: string;
  /** 그룹 전체를 누를 수 없게 한다 */
  disabled?: boolean;
  /** `Radio` 2~4개 */
  children: ReactNode;
}

/** 라디오 묶음. 선택지를 세로로 나열하고, 그 안에서 하나만 선택되게 한다 */
export function RadioGroup({
  value,
  defaultValue,
  onChange,
  name,
  disabled = false,
  children,
  className,
  ...props
}: RadioGroupProps) {
  const autoName = useId();
  const [inner, setInner] = useState(defaultValue);
  const current = value ?? inner;

  const select = (next: string) => {
    if (value === undefined) setInner(next);
    onChange?.(next);
  };

  return (
    <RadioGroupContext value={{ name: name ?? autoName, value: current, disabled, select }}>
      <div role="radiogroup" className={cn("flex flex-col", className)} {...props}>
        {children}
      </div>
    </RadioGroupContext>
  );
}

export interface RadioProps extends Omit<ComponentProps<"input">, "type" | "children" | "size"> {
  /** 선택 값. `RadioGroup` 안에서는 필수 */
  value?: string;
  /** 레이블. 없으면 원만 보이므로 `aria-label`을 준다 */
  children?: ReactNode;
  /** 바깥 여백(8px)을 없앤 촘촘한 모양. 촘촘한 목록에서만 쓴다. 기본 `false` */
  tight?: boolean;
}

/** 여러 선택지 중 하나만 고르는 라디오. 보통 `RadioGroup` 안에 넣는다 */
export function Radio({
  value,
  children,
  tight = false,
  checked,
  defaultChecked,
  disabled,
  name,
  onChange,
  className,
  style,
  ...props
}: RadioProps) {
  const group = useContext(RadioGroupContext);
  const isDisabled = Boolean(disabled ?? group?.disabled);

  // 그룹 안이면 그룹의 이름·선택 값을 따른다(그룹 값이 이 라디오의 checked를 정한다)
  const groupProps = group
    ? {
        name: group.name,
        checked: group.value === undefined ? false : group.value === value,
        onChange: (event: ChangeEvent<HTMLInputElement>) => {
          if (event.target.checked && value !== undefined) group.select(value);
          onChange?.(event);
        },
      }
    : { name, checked, defaultChecked, onChange };

  return (
    <label
      className={cn(
        "group/control relative inline-flex items-center gap-2",
        tight ? "p-0" : "p-2",
        isDisabled ? "cursor-not-allowed" : "cursor-pointer",
        // 터치 화면에서는 보이는 높이(40 · tight 24)와 상관없이 눌림 영역을 44px로
        "pointer-coarse:before:absolute pointer-coarse:before:inset-x-0 pointer-coarse:before:top-1/2 pointer-coarse:before:h-11 pointer-coarse:before:-translate-y-1/2",
        className,
      )}
      style={style}
    >
      <input
        type="radio"
        value={value}
        disabled={isDisabled}
        className="peer sr-only"
        {...groupProps}
        {...props}
      />
      <RadioMark />
      {children != null && (
        <span className="text-body-2-regular whitespace-nowrap text-text-primary peer-disabled:text-text-disabled">
          {children}
        </span>
      )}
    </label>
  );
}
