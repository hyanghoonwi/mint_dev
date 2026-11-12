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
import {
  responsiveClasses,
  type Responsive,
  type ResponsiveClassTable,
} from "../../utils/responsive";
import { RadioMark } from "../_internal/controlMarks";
import { RadioGroupContext, type RadioGroupSize } from "../_internal/radioGroupContext";

/** Figma Size: XSmall(원 16) · Small(20, 기본) · Medium(24) · Large(32) */
export type RadioSize = RadioGroupSize;

// 원 · 가운데 흰 점(Figma Radio Circle 2280:32059): 16·6 / 20·8 / 24·10 / 32·12. 점 크기 = 원 − 브랜드 테두리(--mint-radio-ring) × 2
const markClasses: ResponsiveClassTable<RadioSize> = {
  base: {
    xs: "size-4 [--mint-radio-ring:5px]",
    sm: "size-5 [--mint-radio-ring:6px]",
    md: "size-6 [--mint-radio-ring:7px]",
    lg: "size-8 [--mint-radio-ring:10px]",
  },
  tablet: {
    xs: "tablet:size-4 tablet:[--mint-radio-ring:5px]",
    sm: "tablet:size-5 tablet:[--mint-radio-ring:6px]",
    md: "tablet:size-6 tablet:[--mint-radio-ring:7px]",
    lg: "tablet:size-8 tablet:[--mint-radio-ring:10px]",
  },
  desktop: {
    xs: "desktop:size-4 desktop:[--mint-radio-ring:5px]",
    sm: "desktop:size-5 desktop:[--mint-radio-ring:6px]",
    md: "desktop:size-6 desktop:[--mint-radio-ring:7px]",
    lg: "desktop:size-8 desktop:[--mint-radio-ring:10px]",
  },
};

// 레이블(Figma, 글자 토큰): XSmall body-4 · Small body-2 · Medium body-1 Regular · Large heading-2 Medium(Checkbox·CheckMark와 같음)
const labelClasses: ResponsiveClassTable<RadioSize> = {
  base: {
    xs: "text-body-4-regular",
    sm: "text-body-2-regular",
    md: "text-body-1-regular",
    lg: "text-heading-2-medium",
  },
  tablet: {
    xs: "tablet:text-body-4-regular",
    sm: "tablet:text-body-2-regular",
    md: "tablet:text-body-1-regular",
    lg: "tablet:text-heading-2-medium",
  },
  desktop: {
    xs: "desktop:text-body-4-regular",
    sm: "desktop:text-body-2-regular",
    md: "desktop:text-body-1-regular",
    lg: "desktop:text-heading-2-medium",
  },
};

// 높이(Figma): 기본 40·40·40·48 · tight 20·24·28·32
const heightClasses: ResponsiveClassTable<RadioSize> = {
  base: {
    xs: "h-10",
    sm: "h-10",
    md: "h-10",
    lg: "h-12",
  },
  tablet: {
    xs: "tablet:h-10",
    sm: "tablet:h-10",
    md: "tablet:h-10",
    lg: "tablet:h-12",
  },
  desktop: {
    xs: "desktop:h-10",
    sm: "desktop:h-10",
    md: "desktop:h-10",
    lg: "desktop:h-12",
  },
};

const tightHeightClasses: ResponsiveClassTable<RadioSize> = {
  base: {
    xs: "h-5",
    sm: "h-6",
    md: "h-7",
    lg: "h-8",
  },
  tablet: {
    xs: "tablet:h-5",
    sm: "tablet:h-6",
    md: "tablet:h-7",
    lg: "tablet:h-8",
  },
  desktop: {
    xs: "desktop:h-5",
    sm: "desktop:h-6",
    md: "desktop:h-7",
    lg: "desktop:h-8",
  },
};

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
  /**
   * 그룹 안 라디오의 크기. `xs` 원 16 · `sm` 20(기본) · `md` 24 · `lg` 32. 라디오마다 `size`를 주면 그 값이 우선.
   * 구간별로 바꾸려면 객체를 준다: `{ base: "md", desktop: "sm" }`
   */
  size?: Responsive<RadioSize>;
}

/** 라디오 묶음. 선택지를 세로로 나열하고, 그 안에서 하나만 선택되게 한다 */
export function RadioGroup({
  value,
  defaultValue,
  onChange,
  name,
  disabled = false,
  size,
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
    <RadioGroupContext value={{ name: name ?? autoName, value: current, disabled, select, size }}>
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
  /**
   * `xs` 원 16 · `sm` 20(기본) · `md` 24 · `lg` 32. 레이블 글자와 높이(기본 40, `lg` 48)도 함께 바뀐다.
   * 생략하면 `RadioGroup`의 `size`를 따른다. 구간별로 바꾸려면 객체를 준다: `{ base: "md", desktop: "sm" }`
   */
  size?: Responsive<RadioSize>;
  /** 바깥 여백(8px)을 없앤 촘촘한 모양. 촘촘한 목록에서만 쓴다. 기본 `false` */
  tight?: boolean;
}

/** 여러 선택지 중 하나만 고르는 라디오. 보통 `RadioGroup` 안에 넣는다 */
export function Radio({
  value,
  children,
  size: sizeProp,
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
  const size = sizeProp ?? group?.size ?? "sm";

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
        tight
          ? cn("p-0", responsiveClasses<RadioSize>(size, "sm", tightHeightClasses))
          : cn("px-2", responsiveClasses<RadioSize>(size, "sm", heightClasses)),
        isDisabled ? "cursor-not-allowed" : "cursor-pointer",
        // 터치 화면에서는 보이는 높이(기본 40·48 · tight 20~32)와 상관없이 눌림 영역을 44px로
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
      <RadioMark sizeClassName={responsiveClasses<RadioSize>(size, "sm", markClasses)} />
      {children != null && (
        <span
          className={cn(
            "whitespace-nowrap text-text-primary peer-disabled:text-text-disabled",
            responsiveClasses<RadioSize>(size, "sm", labelClasses),
          )}
        >
          {children}
        </span>
      )}
    </label>
  );
}
