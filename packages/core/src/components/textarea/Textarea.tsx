"use client";

// Figma Textarea 2410:110943 · Guidelines 2410:112415.
// 입력 글자 수·폼 초기화·자동 높이를 관리하므로 클라이언트 컴포넌트다.
import {
  useEffect,
  useId,
  useImperativeHandle,
  useRef,
  useState,
  type ComponentProps,
  type CSSProperties,
  type ReactNode,
} from "react";
import { cva } from "class-variance-authority";
import { cn } from "../../utils/cn";
import {
  mapResponsive,
  responsiveClasses,
  type Responsive,
  type ResponsiveClassTable,
} from "../../utils/responsive";
import {
  fieldBodyPositionClasses,
  fieldHeightVarClasses,
  fieldHelperClasses,
  fieldLabelWrapClasses,
  fieldRootPositionClasses,
  type FieldLabelPosition,
  type FieldSize,
  type FieldStatus,
} from "../_internal/fieldLayout";
import { Label } from "../label/Label";

export type TextareaSize = FieldSize;
export type TextareaStatus = FieldStatus;
export type TextareaLabelPosition = FieldLabelPosition;
export type TextareaHeightMode = "fixed" | "auto" | "resizable";

// TextField와 같은 좌우 패딩·본문·라벨 크기. 세로 여백은 간격 토큰 8·12를 쓴다.
const sizeClasses: ResponsiveClassTable<TextareaSize> = {
  base: {
    sm: "rounded-8 pl-3 pr-3 py-2 text-body-4-regular",
    md: "rounded-[10px] pl-4 pr-3 py-3 text-body-3-regular",
    lg: "rounded-12 pl-4 pr-3 py-3 text-body-2-regular",
  },
  tablet: {
    sm: "tablet:rounded-8 tablet:pl-3 tablet:pr-3 tablet:py-2 tablet:text-body-4-regular",
    md: "tablet:rounded-[10px] tablet:pl-4 tablet:pr-3 tablet:py-3 tablet:text-body-3-regular",
    lg: "tablet:rounded-12 tablet:pl-4 tablet:pr-3 tablet:py-3 tablet:text-body-2-regular",
  },
  desktop: {
    sm: "desktop:rounded-8 desktop:pl-3 desktop:pr-3 desktop:py-2 desktop:text-body-4-regular",
    md: "desktop:rounded-[10px] desktop:pl-4 desktop:pr-3 desktop:py-3 desktop:text-body-3-regular",
    lg: "desktop:rounded-12 desktop:pl-4 desktop:pr-3 desktop:py-3 desktop:text-body-2-regular",
  },
};

const fieldVariants = cva(
  "flex flex-col gap-2 border overflow-hidden min-h-(--mint-textarea-min-height) h-(--mint-textarea-min-height) focus-within:outline-1 focus-within:-outline-offset-1",
  {
    variants: {
      status: {
        normal:
          "border-border-strong focus-within:border-border-focus focus-within:outline-border-focus",
        negative: "border-fill-danger focus-within:outline-fill-danger",
        positive: "border-fill-success focus-within:outline-fill-success",
      },
    },
  },
);

export interface TextareaProps extends Omit<
  ComponentProps<"textarea">,
  "children" | "value" | "defaultValue"
> {
  /** TextField와 같은 크기 체계. 기본 md. 구간별 객체도 받는다. */
  size?: Responsive<TextareaSize>;
  /** 입력 이름. 없으면 aria-label 또는 aria-labelledby를 준다. */
  label?: ReactNode;
  helper?: ReactNode;
  helpIcon?: boolean | ReactNode;
  /** 칸 오른쪽 아래 요소. 텍스트·아이콘·버튼 또는 Fragment를 받는다. */
  addon?: ReactNode;
  /** 제어할 때의 값. 문자열만 받는다 */
  value?: string;
  /** 비제어 입력의 처음 값 */
  defaultValue?: string;
  status?: TextareaStatus;
  /** maxLength가 있을 때 현재 글자 수 / 최대 글자 수를 표시한다. */
  counter?: boolean;
  /**
   * 라벨 위치. `top` 칸 위(기본) · `left` 칸 왼쪽(폭이 넓은 폼). 왼쪽 라벨은 첫 줄 높이(칸 높이 48·40·32)에 맞춰 위쪽에 놓인다.
   * 구간별로 바꾸려면 객체를 준다: `{ base: "top", desktop: "left" }`
   */
  labelPosition?: Responsive<TextareaLabelPosition>;
  /** 테두리 영역 높이(px). auto·resizable에서는 시작·최소 높이. 기본 120. */
  height?: number;
  /** auto·resizable 최대 높이(px). 기본 240. height보다 작으면 height를 우선한다. */
  maxHeight?: number;
  /** fixed: 고정, auto: 내용에 맞춰 확장, resizable: 수직 크기 조절. 기본 fixed. */
  heightMode?: TextareaHeightMode;
}

export function Textarea({
  size = "md",
  label,
  helper,
  helpIcon,
  addon,
  value,
  defaultValue,
  status = "normal",
  disabled = false,
  readOnly = false,
  required,
  counter = false,
  labelPosition = "top",
  height = 120,
  maxHeight = 240,
  heightMode = "fixed",
  id,
  maxLength,
  "aria-describedby": ariaDescribedby,
  "aria-invalid": ariaInvalid,
  onChange,
  className,
  style,
  ref,
  ...props
}: TextareaProps) {
  const generatedId = useId();
  const inputId = id ?? `${generatedId}-textarea`;
  const helperId = `${generatedId}-helper`;
  const counterId = `${generatedId}-counter`;
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fieldRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const [innerValue, setInnerValue] = useState(String(defaultValue ?? ""));
  const currentValue = value === undefined ? innerValue : String(value);
  const showCounter = counter && maxLength !== undefined && maxLength >= 0;
  const labelSize = mapResponsive(size, (fieldSize) => (fieldSize === "sm" ? "sm" : "md"));
  const initialHeight = Number.isFinite(height) && height > 0 ? height : 120;
  const maximumHeight = Math.max(
    initialHeight,
    Number.isFinite(maxHeight) && maxHeight > 0 ? maxHeight : 240,
  );
  useImperativeHandle(ref, () => inputRef.current!, []);

  // reset은 input/change 이벤트를 보내지 않는다. 기본 동작 이후 실제 DOM 값과 카운터를 맞춘다.
  useEffect(() => {
    const input = inputRef.current;
    const form = input?.form;
    if (!input || !form) return;
    let frame = 0;
    const handleReset = () => {
      frame = requestAnimationFrame(() => setInnerValue(input.value));
    };
    form.addEventListener("reset", handleReset);
    return () => {
      cancelAnimationFrame(frame);
      form.removeEventListener("reset", handleReset);
    };
  }, [props.form]);

  // 수동 크기 조절로 생긴 inline 높이는 모드나 시작 높이가 바뀌면 초기화한다.
  useEffect(() => {
    const field = fieldRef.current;
    if (!field) return;
    field.style.height = "";
  }, [heightMode, initialHeight]);

  useEffect(() => {
    const input = inputRef.current;
    const field = fieldRef.current;
    if (!input || !field || heightMode !== "auto") return;
    const updateHeight = () => {
      const previousScroll = input.scrollTop;
      field.style.height = "var(--mint-textarea-min-height)";
      const chromeHeight = field.offsetHeight - input.clientHeight;
      field.style.height = `${Math.min(maximumHeight, input.scrollHeight + chromeHeight)}px`;
      input.scrollTop = previousScroll;
    };
    updateHeight();
    let previousWidth = input.clientWidth;
    // 구간별 크기는 CSS로 고르고, 줄바꿈 후 콘텐츠 높이만 측정한다.
    const observer = new ResizeObserver((entries) => {
      if (
        input.clientWidth !== previousWidth ||
        entries.some((entry) => entry.target === footerRef.current)
      ) {
        previousWidth = input.clientWidth;
        updateHeight();
      }
    });
    observer.observe(input);
    if (footerRef.current) observer.observe(footerRef.current);
    let active = true;
    // 글꼴이 늦게 로드되면 줄 높이가 바뀌므로 다시 잰다. `document.fonts`가 없는 환경에서는 건너뛴다
    void document.fonts?.ready.then(() => {
      if (active) updateHeight();
    });
    return () => {
      active = false;
      observer.disconnect();
      field.style.height = "";
    };
  }, [currentValue, heightMode, initialHeight, maximumHeight, size, addon, showCounter]);

  return (
    <div
      className={cn(
        "flex w-full min-w-0 gap-2",
        responsiveClasses<TextareaLabelPosition>(labelPosition, "top", fieldRootPositionClasses),
        responsiveClasses<TextareaSize>(size, "md", fieldHeightVarClasses),
        className,
      )}
      style={style}
    >
      {label != null && (
        // 왼쪽 라벨은 한 줄 칸 높이(--mint-field-height)에 맞춰 칸의 첫 줄 옆에 놓고, 위 라벨은 높이를 따로 정하지 않는다
        <div
          className={cn(
            "flex shrink-0 items-center",
            responsiveClasses<TextareaLabelPosition>(labelPosition, "top", fieldLabelWrapClasses),
          )}
        >
          <Label
            size={labelSize}
            helpIcon={helpIcon}
            disabled={disabled}
            required={required}
            htmlFor={inputId}
          >
            {label}
          </Label>
        </div>
      )}
      <div
        className={cn(
          "flex min-w-0 flex-col gap-2",
          responsiveClasses<TextareaLabelPosition>(labelPosition, "top", fieldBodyPositionClasses),
        )}
      >
        <div
          ref={fieldRef}
          style={
            {
              "--mint-textarea-min-height": `${initialHeight}px`,
              maxHeight: heightMode === "fixed" ? undefined : maximumHeight,
            } as CSSProperties
          }
          className={cn(
            fieldVariants({ status }),
            responsiveClasses<TextareaSize>(size, "md", sizeClasses),
            disabled || readOnly ? "border-border-disabled bg-fill-disabled" : "bg-fill-white",
            heightMode === "resizable" && !disabled && !readOnly ? "resize-y" : "resize-none",
          )}
        >
          <textarea
            {...props}
            id={inputId}
            value={value}
            defaultValue={defaultValue}
            disabled={disabled}
            readOnly={readOnly}
            required={required}
            maxLength={maxLength}
            aria-invalid={ariaInvalid ?? (status === "negative" || undefined)}
            aria-describedby={
              [
                helper != null ? helperId : undefined,
                showCounter ? counterId : undefined,
                ariaDescribedby,
              ]
                .filter(Boolean)
                .join(" ") || undefined
            }
            onChange={(event) => {
              if (value === undefined) setInnerValue(event.target.value);
              onChange?.(event);
            }}
            className="block w-full min-h-0 min-w-0 flex-1 resize-none overflow-auto bg-transparent text-text-strong outline-none placeholder:text-text-tertiary disabled:cursor-not-allowed disabled:text-text-disabled disabled:placeholder:text-text-disabled"
            ref={inputRef}
          />
          {(showCounter || addon != null) && (
            <div ref={footerRef} className="flex shrink-0 items-center gap-2">
              {showCounter && (
                <span
                  id={counterId}
                  className={cn(
                    "shrink-0 text-caption-1-regular",
                    disabled ? "text-text-disabled" : "text-text-tertiary",
                  )}
                >
                  {currentValue.length} / {maxLength}
                </span>
              )}
              {addon != null && (
                <div className="ml-auto flex min-w-0 items-center gap-2">{addon}</div>
              )}
            </div>
          )}
        </div>
        {helper != null && (
          <div
            id={helperId}
            className={cn(
              "text-body-5-regular",
              disabled ? "text-text-disabled" : fieldHelperClasses[status],
            )}
          >
            {helper}
          </div>
        )}
      </div>
    </div>
  );
}
