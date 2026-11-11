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
import {
  responsiveClasses,
  type Responsive,
  type ResponsiveClassTable,
} from "../../utils/responsive";
import { CheckboxMark } from "../_internal/controlMarks";

/** Figma Size: XSmall(상자 16) · Small(20, 기본) · Medium(24) · Large(32) */
export type CheckboxSize = "xs" | "sm" | "md" | "lg";

// 상자 · 체크 · 일부 선택 막대(Figma 2261:28970 Checkbox Box): 16·12·8×1.5 / 20·16·10×2 / 24·20·12×2.5 / 32·26·16×3. 모서리는 모두 4
const markClasses: ResponsiveClassTable<CheckboxSize> = {
  base: {
    xs: "size-4 [&_svg]:size-3 [&>span]:h-[1.5px] [&>span]:w-2",
    sm: "size-5 [&_svg]:size-4 [&>span]:h-[2px] [&>span]:w-[10px]",
    md: "size-6 [&_svg]:size-5 [&>span]:h-[2.5px] [&>span]:w-3",
    lg: "size-8 [&_svg]:size-[26px] [&>span]:h-[3px] [&>span]:w-4",
  },
  tablet: {
    xs: "tablet:size-4 tablet:[&_svg]:size-3 tablet:[&>span]:h-[1.5px] tablet:[&>span]:w-2",
    sm: "tablet:size-5 tablet:[&_svg]:size-4 tablet:[&>span]:h-[2px] tablet:[&>span]:w-[10px]",
    md: "tablet:size-6 tablet:[&_svg]:size-5 tablet:[&>span]:h-[2.5px] tablet:[&>span]:w-3",
    lg: "tablet:size-8 tablet:[&_svg]:size-[26px] tablet:[&>span]:h-[3px] tablet:[&>span]:w-4",
  },
  desktop: {
    xs: "desktop:size-4 desktop:[&_svg]:size-3 desktop:[&>span]:h-[1.5px] desktop:[&>span]:w-2",
    sm: "desktop:size-5 desktop:[&_svg]:size-4 desktop:[&>span]:h-[2px] desktop:[&>span]:w-[10px]",
    md: "desktop:size-6 desktop:[&_svg]:size-5 desktop:[&>span]:h-[2.5px] desktop:[&>span]:w-3",
    lg: "desktop:size-8 desktop:[&_svg]:size-[26px] desktop:[&>span]:h-[3px] desktop:[&>span]:w-4",
  },
};

// 레이블(Figma Checkbox 2278:30242, 글자 토큰): XSmall body-4 · Small body-2 · Medium body-1 Regular · Large heading-2 Medium
const labelClasses: ResponsiveClassTable<CheckboxSize> = {
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

// bold(SemiBold) 레이블(Figma): XSmall label-2 · Small body-2 · Medium heading-3 · Large heading-2. 일반 레이블과 스타일 줄이 다르다
const boldLabelClasses: ResponsiveClassTable<CheckboxSize> = {
  base: {
    xs: "text-label-2-semibold",
    sm: "text-body-2-semibold",
    md: "text-heading-3-semibold",
    lg: "text-heading-2-semibold",
  },
  tablet: {
    xs: "tablet:text-label-2-semibold",
    sm: "tablet:text-body-2-semibold",
    md: "tablet:text-heading-3-semibold",
    lg: "tablet:text-heading-2-semibold",
  },
  desktop: {
    xs: "desktop:text-label-2-semibold",
    sm: "desktop:text-body-2-semibold",
    md: "desktop:text-heading-3-semibold",
    lg: "desktop:text-heading-2-semibold",
  },
};

// 기본 모양의 높이(Figma: XSmall·Small·Medium 40 · Large 48)
// tight 높이(Figma 고정 값): XSmall 20 · Small 24 · Medium 28 · Large 32. 레이블 줄 간격이 더 커도(XSmall Body 4 = 22) 틀은 이 높이로 둔다
const tightHeightClasses: ResponsiveClassTable<CheckboxSize> = {
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

const heightClasses: ResponsiveClassTable<CheckboxSize> = {
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

export interface CheckboxProps extends Omit<ComponentProps<"input">, "type" | "children" | "size"> {
  /** 레이블. 없으면 상자만 보이므로 `aria-label`을 꼭 준다 */
  children?: ReactNode;
  /** 일부만 선택된 상태(전체 선택 칸). 체크 대신 가로 막대를 보여 주고 스크린리더에는 "일부 선택"으로 읽힌다 */
  indeterminate?: boolean;
  /**
   * `xs` 상자 16 · `sm` 20(기본) · `md` 24 · `lg` 32. 레이블 글자와 높이(기본 40, `lg` 48)도 함께 바뀐다.
   * 구간별로 바꾸려면 객체를 준다: `{ base: "md", desktop: "sm" }`
   */
  size?: Responsive<CheckboxSize>;
  /** 바깥 여백(8px)을 없앤 촘촘한 모양. 촘촘한 목록에서만 쓴다. 기본 `false` */
  tight?: boolean;
  /** 레이블을 굵게(SemiBold). 전체 선택 같은 강조 레이블에 쓴다. 기본 `false` */
  bold?: boolean;
}

/** 여러 개를 고르거나 한 항목을 켜고 끄는 체크박스. 레이블을 눌러도 선택된다 */
export function Checkbox({
  children,
  indeterminate = false,
  size = "sm",
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
        tight
          ? cn("p-0", responsiveClasses<CheckboxSize>(size, "sm", tightHeightClasses))
          : cn("px-2", responsiveClasses<CheckboxSize>(size, "sm", heightClasses)),
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
      <CheckboxMark
        checked={isChecked}
        indeterminate={indeterminate}
        disabled={disabled}
        sizeClassName={responsiveClasses<CheckboxSize>(size, "sm", markClasses)}
      />
      {children != null && (
        <span
          className={cn(
            "whitespace-nowrap",
            responsiveClasses<CheckboxSize>(size, "sm", bold ? boldLabelClasses : labelClasses),
            disabled ? "text-text-disabled" : "text-text-primary",
          )}
        >
          {children}
        </span>
      )}
    </label>
  );
}
