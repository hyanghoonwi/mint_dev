"use client";

// 틀(Framed Style). Figma `Framed Style`(2200:9900) · `Framed Style Guidelines`(2200:10166).
// 여러 요소를 하나의 틀로 묶어 한 덩어리로 보여 주고, 선택된 틀을 테두리로 강조한다. 선택 의미가 있을 때만 쓴다.
//  - FramedCheckbox · FramedRadio: 틀 전체가 <label>이라 어디를 눌러도 안의 컨트롤이 선택된다. 선택 테두리는 입력의 :checked를 CSS로 읽는다.
//  - Framed: 다른 내용(Select Item 등)을 담는 틀만. 선택 여부는 `selected`로 넘긴다.
// FramedCheckbox는 비제어 체크 상태·indeterminate를, FramedRadio는 RadioGroup의 Context를 쓰므로 클라이언트 컴포넌트다.
import {
  useContext,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type ComponentProps,
  type ReactNode,
} from "react";
import { cn } from "../../utils/cn";
import { CheckboxMark, RadioMark } from "../_internal/controlMarks";
import { RadioGroupContext } from "../_internal/radioGroupContext";

export type FramedSize = "sm" | "md" | "lg";

interface FramedLook {
  /** `sm` 여백 12·모서리 8 · `md` 16·12(기본) · `lg` 20·16. 내용 양에 맞춰 고른다 */
  size?: FramedSize;
  /** 오류 상태. 빨간 테두리로 보여 주고, 안의 컨트롤에 `aria-invalid`를 붙인다. Input 등과 같은 이름. 기본 `false` */
  error?: boolean;
  /** 그림자로 띄워 보이게 한다. 기본 `false` */
  shadow?: boolean;
}

const sizes: Record<FramedSize, string> = {
  sm: "rounded-8 p-3",
  md: "rounded-12 p-4",
  lg: "rounded-16 p-5",
};

/** 틀 공통 모양. selected는 Framed에만 쓰고, 컨트롤이 든 틀은 :checked(has-checked)로 테두리를 바꾼다 */
function frameClasses({
  size = "md",
  error = false,
  shadow = false,
  disabled = false,
  selected,
  interactive,
}: FramedLook & { disabled?: boolean; selected?: boolean; interactive: boolean }) {
  return cn(
    "relative flex w-full items-center gap-3 border text-left transition-[background-color,border-color]",
    sizes[size],
    // Figma 그림자: 0 2 4 rgba(0,0,0,.08). MINT에는 그림자 토큰이 없다
    shadow && "shadow-[0_2px_4px_rgba(0,0,0,0.08)]",
    disabled
      ? "cursor-not-allowed border-border-disabled bg-fill-disabled"
      : cn(
          "bg-fill-white",
          error
            ? "border-fill-danger"
            : cn(
                "border-border-default",
                selected && "border-border-brand",
                interactive && "has-checked:border-border-brand",
              ),
          // 누름(hover 포함): 흰 바탕 위에 fill-pressed를 한 겹 덮는다(Figma Pressed)
          interactive &&
            "cursor-pointer hover:[background-image:linear-gradient(var(--mint-fill-pressed),var(--mint-fill-pressed))] active:[background-image:linear-gradient(var(--mint-fill-pressed),var(--mint-fill-pressed))]",
        ),
    // 키보드 포커스 링은 컨트롤 대신 틀 전체에 그린다
    interactive &&
      "has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-border-focus",
  );
}

/** 레이블 + 설명 */
function FramedText({ label, description }: { label: ReactNode; description?: ReactNode }) {
  return (
    <span className="flex min-w-0 flex-1 flex-col gap-[2px]">
      <span className="text-body-2-regular text-text-primary">{label}</span>
      {description != null && (
        <span className="text-body-5-regular text-text-tertiary">{description}</span>
      )}
    </span>
  );
}

export interface FramedProps extends FramedLook, ComponentProps<"div"> {
  /** 선택됨. 테두리가 브랜드 색으로 진해진다 */
  selected?: boolean;
  /** 비활성 모양(회색 바탕) */
  disabled?: boolean;
}

/** 다른 내용을 담는 틀. 안의 컨트롤이 선택을 맡고, 틀은 `selected`로 강조만 한다 */
export function Framed({
  size,
  error,
  shadow,
  selected = false,
  disabled = false,
  className,
  ...props
}: FramedProps) {
  return (
    <div
      className={cn(
        frameClasses({ size, error, shadow, disabled, selected, interactive: false }),
        className,
      )}
      {...props}
    />
  );
}

interface FramedControlProps
  extends FramedLook, Omit<ComponentProps<"input">, "type" | "size" | "children"> {
  /** 레이블(Body 2) */
  label: ReactNode;
  /** 레이블 아래 설명(Body 5). 설명이 긴 선택지에 쓴다 */
  description?: ReactNode;
}

export type FramedCheckboxProps = FramedControlProps & {
  /** 일부만 선택된 상태(전체 선택 칸) */
  indeterminate?: boolean;
};

/** 체크박스를 담은 틀. 틀 어디를 눌러도 체크가 바뀌고, 체크되면 테두리가 진해진다 */
export function FramedCheckbox({
  label,
  description,
  size,
  error,
  shadow,
  indeterminate = false,
  checked,
  defaultChecked,
  disabled = false,
  onChange,
  className,
  style,
  ref,
  ...props
}: FramedCheckboxProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [inner, setInner] = useState(Boolean(defaultChecked));
  const isChecked = checked ?? inner;

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
        "group/control",
        frameClasses({ size, error, shadow, disabled, interactive: true }),
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
        aria-invalid={error || undefined}
        {...props}
      />
      <CheckboxMark
        checked={isChecked}
        indeterminate={indeterminate}
        disabled={disabled}
        ring={false}
      />
      <FramedText label={label} description={description} />
    </label>
  );
}

export type FramedRadioProps = FramedControlProps & {
  /** 선택 값. `RadioGroup` 안에서는 필수 */
  value?: string;
};

/** 라디오를 담은 틀. `RadioGroup` 안에 넣고, 틀 어디를 눌러도 선택된다 */
export function FramedRadio({
  label,
  description,
  size,
  error,
  shadow,
  value,
  checked,
  defaultChecked,
  disabled,
  name,
  onChange,
  className,
  style,
  ...props
}: FramedRadioProps) {
  const group = useContext(RadioGroupContext);
  const isDisabled = Boolean(disabled ?? group?.disabled);

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
        "group/control",
        frameClasses({ size, error, shadow, disabled: isDisabled, interactive: true }),
        className,
      )}
      style={style}
    >
      <input
        type="radio"
        value={value}
        disabled={isDisabled}
        className="peer sr-only"
        aria-invalid={error || undefined}
        {...groupProps}
        {...props}
      />
      <RadioMark ring={false} />
      <FramedText label={label} description={description} />
    </label>
  );
}
