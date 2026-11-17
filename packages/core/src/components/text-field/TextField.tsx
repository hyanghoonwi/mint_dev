"use client";

// 값이 있는지(지우기 버튼)와 입력 값을 직접 다뤄서 클라이언트 컴포넌트다.
// Figma `Text Input`(node 2402:100565)의 `Text Field` · `Text Input Guidelines`(node 2402:101712).
// 한 줄 텍스트 입력. 라벨 + 입력 칸 + 도움말이 한 묶음이고, 라벨은 `Label` 컴포넌트를 그대로 쓴다(Select와 같은 틀).
// 진짜 <input>이라 폼 제출·자동 완성·키보드·스크린리더가 브라우저 기본 동작 그대로다. 여러 줄은 Textarea(따로)를 쓴다.
import {
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type ComponentProps,
  type MouseEvent,
  type ReactNode,
} from "react";
import { cn } from "../../utils/cn";
import {
  responsiveClasses,
  mapResponsive,
  type Responsive,
  type ResponsiveClassTable,
} from "../../utils/responsive";
import {
  fieldBodyPositionClasses,
  fieldHelperClasses,
  fieldHeightVarClasses,
  fieldLabelWrapClasses,
  fieldRootPositionClasses,
  type FieldLabelPosition,
  type FieldStatus,
  type FieldSize,
} from "../_internal/fieldLayout";
import { XCircleIcon } from "../icon/icons.generated";
import { Label } from "../label/Label";

/** Figma Size: Large(칸 높이 48) · Medium(40, 기본) · Small(32) */
export type TextFieldSize = FieldSize;
/** 라벨 위치: `top` 칸 위(기본) · `left` 칸 왼쪽 */
export type TextFieldLabelPosition = FieldLabelPosition;
/** 상태(Figma Status): 오류는 `negative`, 확인 완료는 `positive` */
export type TextFieldStatus = FieldStatus;

// 칸 크기(Figma Text Field): Large 48·모서리 12·Body 2 / Medium 40·모서리 10·Body 3 / Small 32·모서리 8·Body 4.
// 좌우 여백은 왼쪽 16(Small 12) · 오른쪽 12. 10은 반경 토큰에 없어서 임의 값이다. 크기는 값 하나 또는 구간별 객체를 받는다(utils/responsive.ts)
const fieldClasses: ResponsiveClassTable<TextFieldSize> = {
  base: {
    lg: "h-12 rounded-12 pl-4 pr-3 text-body-2-regular",
    md: "h-10 rounded-[10px] pl-4 pr-3 text-body-3-regular",
    sm: "h-8 rounded-8 pl-3 pr-3 text-body-4-regular",
  },
  tablet: {
    lg: "tablet:h-12 tablet:rounded-12 tablet:pl-4 tablet:pr-3 tablet:text-body-2-regular",
    md: "tablet:h-10 tablet:rounded-[10px] tablet:pl-4 tablet:pr-3 tablet:text-body-3-regular",
    sm: "tablet:h-8 tablet:rounded-8 tablet:pl-3 tablet:pr-3 tablet:text-body-4-regular",
  },
  desktop: {
    lg: "desktop:h-12 desktop:rounded-12 desktop:pl-4 desktop:pr-3 desktop:text-body-2-regular",
    md: "desktop:h-10 desktop:rounded-[10px] desktop:pl-4 desktop:pr-3 desktop:text-body-3-regular",
    sm: "desktop:h-8 desktop:rounded-8 desktop:pl-3 desktop:pr-3 desktop:text-body-4-regular",
  },
};

// 테두리·포커스 색(Figma): normal 회색(포커스 때 진한 색) · negative 빨강 · positive 초록. 포커스는 안쪽 1px를 더해 2px로 보이게 한다
const statusClasses: Record<TextFieldStatus, string> = {
  normal: "border-border-strong focus-within:border-border-focus focus-within:outline-border-focus",
  negative: "border-fill-danger focus-within:outline-fill-danger",
  positive: "border-fill-success focus-within:outline-fill-success",
};

export interface TextFieldProps extends Omit<ComponentProps<"input">, "size" | "prefix"> {
  /**
   * 칸 크기. `lg` 48 · `md` 40(기본) · `sm` 32.
   * 구간별로 바꾸려면 객체를 준다: `{ base: "lg", desktop: "md" }`
   */
  size?: Responsive<TextFieldSize>;
  /** 입력 이름. `Label` 컴포넌트로 그려진다. 없으면 `aria-label`을 꼭 준다 */
  label?: ReactNode;
  /** 칸 아래 도움말. 오류에는 이유와 해결 방법을 적는다 */
  helper?: ReactNode;
  /** 라벨 오른쪽 도움말 아이콘(`Label`의 `helpIcon`) */
  helpIcon?: boolean | ReactNode;
  /**
   * 입력 왼쪽(앞)에 붙는 요소. 아이콘 등(`<MagnifyingGlassIcon />`). 아이콘은 20px로 맞춰진다.
   * `Button`의 `leftAddon`과 같은 이름이다
   */
  leftAddon?: ReactNode;
  /**
   * 입력 오른쪽(뒤)에 붙는 요소. 글자(타이머 "03:00"), 아이콘, 버튼(`<Button size="sm" color="secondary">`)을 하나 또는 여러 개(`<>…</>`) 넘긴다.
   * 여러 개면 간격 8로 나란히 놓인다. 지우기 버튼 다음에 온다. `Button`의 `rightAddon`과 같은 이름이다
   */
  rightAddon?: ReactNode;
  /** 상태. `normal`(기본) · `negative` 오류(빨강) · `positive` 확인 완료(초록). 도움말 색도 따라간다 */
  status?: TextFieldStatus;
  /** 읽기 전용. 값은 진하게 보이고 선택·복사할 수 있지만 바꿀 수 없다(회색 칸, 지우기 버튼 없음). 폼으로 제출된다. `disabled`와 달리 포커스된다 */
  readOnly?: boolean;
  /** 값이 있고 입력 중일 때 나타나는 지우기 버튼(×). 기본 `true`. 지우면 `onChange`가 빈 값으로 호출된다 */
  clearButton?: boolean;
  /**
   * 라벨 위치. `top` 칸 위(기본) · `left` 칸 왼쪽(폭이 넓은 폼).
   * 구간별로 바꾸려면 객체를 준다: `{ base: "top", desktop: "left" }`
   */
  labelPosition?: Responsive<TextFieldLabelPosition>;
}

/** 한 줄 텍스트 입력. 라벨 + 입력 칸 + 도움말 한 묶음. 이름·이메일·검색처럼 짧은 글을 입력받는다 */
export function TextField({
  size = "md",
  label,
  helper,
  helpIcon,
  leftAddon,
  rightAddon,
  value,
  defaultValue,
  status = "normal",
  disabled = false,
  readOnly = false,
  required,
  clearButton = true,
  labelPosition = "top",
  type = "text",
  id,
  "aria-describedby": ariaDescribedby,
  "aria-label": ariaLabel,
  onChange,
  className,
  style,
  ref,
  ...props
}: TextFieldProps) {
  const generatedId = useId();
  const inputId = id ?? `${generatedId}-input`;
  const helperId = `${generatedId}-helper`;
  const inputRef = useRef<HTMLInputElement | null>(null);

  // 값이 있는지만 알면 되므로(지우기 버튼 표시) 비제어일 때만 입력을 따라 적어 둔다. 제어일 때는 value를 그대로 본다
  const [innerValue, setInnerValue] = useState(String(defaultValue ?? ""));
  const current = value !== undefined ? String(value) : innerValue;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (value === undefined) setInnerValue(event.target.value);
    onChange?.(event);
  };

  // 지우기: 입력 값을 직접 비우고 input 이벤트를 보내서, 제어·비제어 모두 `onChange`가 같은 방식으로 호출되게 한다
  const clear = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const input = inputRef.current;
    if (!input) return;
    const setValue = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set;
    setValue?.call(input, "");
    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.focus();
  };

  const labelSize = mapResponsive(size, (textFieldSize) => (textFieldSize === "sm" ? "sm" : "md"));
  // 읽기 전용·비활성에서는 값을 바꿀 수 없으므로 지우기 버튼을 보이지 않는다
  const showClear = clearButton && !disabled && !readOnly && current !== "";

  return (
    <div
      className={cn(
        "relative flex w-full gap-2",
        responsiveClasses<TextFieldLabelPosition>(labelPosition, "top", fieldRootPositionClasses),
        responsiveClasses<TextFieldSize>(size, "md", fieldHeightVarClasses),
        className,
      )}
      style={style}
    >
      {label != null && (
        // 왼쪽 라벨은 칸 높이(--mint-field-height)에 맞춰 세로 가운데에 놓고, 위 라벨은 높이를 따로 정하지 않는다
        <div
          className={cn(
            "flex shrink-0 items-center",
            responsiveClasses<TextFieldLabelPosition>(labelPosition, "top", fieldLabelWrapClasses),
          )}
        >
          <Label
            htmlFor={inputId}
            size={labelSize}
            required={required}
            disabled={disabled}
            helpIcon={helpIcon}
          >
            {label}
          </Label>
        </div>
      )}
      <div
        className={cn(
          "flex min-w-0 flex-col gap-2",
          responsiveClasses<TextFieldLabelPosition>(labelPosition, "top", fieldBodyPositionClasses),
        )}
      >
        <div
          // 칸의 빈 곳(여백·아이콘)을 눌러도 입력에 포커스가 가게 한다
          onClick={() => inputRef.current?.focus()}
          className={cn(
            "group/field flex cursor-text items-center gap-2 overflow-clip border",
            responsiveClasses<TextFieldSize>(size, "md", fieldClasses),
            disabled
              ? "cursor-not-allowed border-border-disabled bg-fill-disabled"
              : readOnly
                ? // 읽기 전용(Select와 같은 모양): 칸은 비활성 색, 값은 진하게 그대로. 포커스는 보이게 한다
                  "cursor-default border-border-disabled bg-fill-disabled focus-within:outline-1 focus-within:-outline-offset-1 focus-within:outline-border-focus"
                : cn(
                    "bg-fill-white focus-within:outline-1 focus-within:-outline-offset-1",
                    statusClasses[status],
                  ),
          )}
        >
          {leftAddon != null && (
            // 아이콘은 20px, 색은 icon-secondary(비활성은 icon-disabled). 글자·버튼은 자기 스타일을 따른다
            <span
              className={cn(
                "inline-flex shrink-0 items-center gap-2 [&>svg]:size-5",
                disabled ? "text-icon-disabled" : "text-icon-secondary",
              )}
            >
              {leftAddon}
            </span>
          )}
          <input
            ref={(node) => {
              inputRef.current = node;
              if (typeof ref === "function") ref(node);
              else if (ref) ref.current = node;
            }}
            id={inputId}
            type={type}
            value={value}
            defaultValue={defaultValue}
            onChange={handleChange}
            disabled={disabled}
            readOnly={readOnly}
            required={required}
            aria-label={label == null ? ariaLabel : undefined}
            aria-invalid={status === "negative" || undefined}
            aria-describedby={
              [helper != null ? helperId : undefined, ariaDescribedby].filter(Boolean).join(" ") ||
              undefined
            }
            className={cn(
              "min-w-0 flex-1 bg-transparent outline-none",
              "placeholder:text-text-tertiary disabled:cursor-not-allowed disabled:text-text-disabled disabled:placeholder:text-text-disabled",
              disabled ? "text-text-disabled" : "text-text-strong",
            )}
            {...props}
          />
          {showClear && (
            // 입력 중(포커스가 칸 안에 있을 때)에만 보인다. 값이 있을 때만 그려진다
            <button
              type="button"
              aria-label="입력 지우기"
              onClick={clear}
              className={cn(
                "relative hidden size-5 shrink-0 cursor-pointer items-center justify-center text-icon-secondary group-focus-within/field:inline-flex",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus",
                "pointer-coarse:before:absolute pointer-coarse:before:-inset-3 pointer-coarse:before:content-['']",
              )}
            >
              <XCircleIcon size={20} variant="fill" />
            </button>
          )}
          {rightAddon != null && (
            <span
              className={cn(
                "inline-flex shrink-0 items-center gap-2 [&>svg]:size-5",
                disabled ? "text-icon-disabled" : "text-icon-secondary",
              )}
            >
              {rightAddon}
            </span>
          )}
        </div>
        {helper != null && (
          <p
            id={helperId}
            className={cn(
              "text-body-5-regular",
              disabled ? "text-text-disabled" : fieldHelperClasses[status],
            )}
          >
            {helper}
          </p>
        )}
      </div>
    </div>
  );
}
