"use client";

// 선택 값을 Context로 내려 주고 키보드 이동(방향키)을 처리해서 클라이언트 컴포넌트다.
// Figma `Menu`(node 2370:70094) · `Menu Guidelines`(node 2370:71511).
// 옵션이나 액션을 쌓아 보여 주는 목록 상자다. 열고 닫는 것·위치는 사용하는 쪽이 정한다(떠 있게 하려면 Popover 안에 넣는다).
import {
  createContext,
  useContext,
  useId,
  useState,
  type ComponentProps,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
} from "react";
import { cn } from "../../utils/cn";
import { Avatar } from "../avatar/Avatar";
import { Box } from "../box/Box";
import { Divider } from "../divider/Divider";
import { SelectedCheckIcon } from "../icon/SelectedCheckIcon";
import { CheckboxMark } from "../_internal/controlMarks";

/** Figma Size: Small(항목 높이 36, 폭 200) · Medium(44, 240, 기본) · Large(52, 280) */
export type MenuSize = "sm" | "md" | "lg";

/** Figma Variant: Normal(체크 표시) · Radio(하나만 고르기) · Checkbox(여러 개 고르기) */
export type MenuVariant = "normal" | "radio" | "checkbox";

// 폭은 Figma 기본 폭 그대로라 임의 값을 쓴다(`className="w-full"`로 늘릴 수 있다). 최소 폭 160
const widthClasses: Record<MenuSize, string> = {
  sm: "w-[200px]",
  md: "w-[240px]",
  lg: "w-[280px]",
};

// 항목 높이·여백(Figma): Small 36(위아래 6) · Medium 44(8) · Large 52(12, 좌우 16). 6px는 간격 스케일 밖이라 임의 값이다
const itemSizeClasses: Record<MenuSize, string> = {
  sm: "min-h-9 px-3 py-[6px]",
  md: "min-h-11 px-3 py-2",
  lg: "min-h-[52px] px-4 py-3",
};

// 글자(Figma): Small body-5 · Medium body-4(선택은 label-2) · Large body-2. 일반 모양에서 선택된 항목만 SemiBold다
const textClasses: Record<MenuSize, { normal: string; selected: string }> = {
  sm: { normal: "text-body-5-medium", selected: "text-body-5-semibold" },
  md: { normal: "text-body-4-medium", selected: "text-label-2-semibold" },
  lg: { normal: "text-body-2-medium", selected: "text-body-2-semibold" },
};

interface MenuContextValue {
  variant: MenuVariant;
  size: MenuSize;
  /** 선택된 값. Checkbox는 배열, 나머지는 문자열 하나 */
  value: string | string[] | undefined;
  select: (itemValue: string) => void;
}

const MenuContext = createContext<MenuContextValue>({
  variant: "normal",
  size: "md",
  value: undefined,
  select: () => {},
});

interface MenuBaseProps extends Omit<
  ComponentProps<"div">,
  "onChange" | "defaultValue" | "role" | "children"
> {
  /** `sm` 항목 높이 36 · 폭 200 / `md` 44 · 240(기본) / `lg` 52 · 280 */
  size?: MenuSize;
  /** `MenuItem`·`MenuGroup`·`MenuDivider` */
  children: ReactNode;
  /** 아래 액션 영역(위에 선이 있는 52px 줄). 선택을 적용·초기화하는 버튼 둘을 `Button size="sm"`으로 넣는다. 양끝으로 벌어진다 */
  actionArea?: ReactNode;
  /** 항목 상자 안쪽 여백(px). 촘촘한 목록은 `8`(기본), 일반 목록은 `12` */
  cellPadding?: 8 | 12;
  /** 항목 영역의 최대 높이. 항목이 넘치면 이 높이에서 스크롤된다. 숫자는 px */
  maxHeight?: number | string;
  /** 메뉴 이름. 스크린리더가 읽는다 */
  "aria-label"?: string;
  "aria-labelledby"?: string;
}

/**
 * 고르는 방식에 따라 값 타입이 달라진다.
 * `normal`·`radio`는 값 하나(`string`), `checkbox`는 값 여러 개(`string[]`)다.
 * 값이 없는 항목(`MenuItem`의 `value` 생략)은 고르지 않고 누르는 동작만 한다.
 */
type MenuSelectionProps =
  | {
      variant?: "normal" | "radio";
      value?: string;
      defaultValue?: string;
      onChange?: (value: string) => void;
    }
  | {
      variant: "checkbox";
      value?: string[];
      defaultValue?: string[];
      onChange?: (value: string[]) => void;
    };

export type MenuProps = MenuBaseProps & MenuSelectionProps;

/** 옵션이나 액션을 쌓아 보여 주는 메뉴 상자. 항목은 `MenuItem`으로 넣는다 */
export function Menu({
  variant = "normal",
  size = "md",
  children,
  actionArea,
  value,
  defaultValue,
  cellPadding = 8,
  maxHeight,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledby,
  onChange,
  className,
  ...props
}: MenuProps) {
  const [inner, setInner] = useState<string | string[] | undefined>(defaultValue);
  const current = value ?? inner;

  // 고르는 방식(variant)마다 값 타입이 달라서, 판별 유니온을 좁힐 수 없는 이 한 곳에서만 캐스팅한다
  const notify = onChange as ((next: string | string[]) => void) | undefined;
  const select = (itemValue: string) => {
    let next: string | string[];
    if (variant === "checkbox") {
      const chosen = Array.isArray(current) ? current : [];
      next = chosen.includes(itemValue)
        ? chosen.filter((chosenValue) => chosenValue !== itemValue)
        : [...chosen, itemValue];
    } else {
      next = itemValue;
    }
    if (value === undefined) setInner(next);
    notify?.(next);
  };

  // 방향키로 항목 사이를 옮긴다. 끝에서는 반대쪽 끝으로 이어진다
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const keys = ["ArrowDown", "ArrowUp", "Home", "End"];
    if (!keys.includes(event.key)) return;
    const items = Array.from(
      event.currentTarget.querySelectorAll<HTMLElement>('[role^="menuitem"]:not(:disabled)'),
    );
    if (items.length === 0) return;
    event.preventDefault();
    const index = items.indexOf(document.activeElement as HTMLElement);
    let target = 0;
    if (event.key === "ArrowDown") target = (index + 1) % items.length;
    if (event.key === "ArrowUp") target = (index - 1 + items.length) % items.length;
    if (event.key === "End") target = items.length - 1;
    items[target].focus();
  };

  return (
    <MenuContext value={{ variant, size, value: current, select }}>
      {/* 겉 상자는 Box: 세로 쌓기 · 기본 테두리(outline) · 모서리 12 · 넘침 잘라냄. 배경은 Box tone에 없어서 색 토큰 클래스로 준다 */}
      <Box
        tone="outline"
        radius={12}
        overflow="hidden"
        className={cn("min-w-[160px] bg-fill-white", widthClasses[size], className)}
        {...props}
      >
        {/* 항목 영역도 Box: 여백 8은 Box padding으로, 12는 Box 단계(0·8·16·20·24)에 없어서 간격 토큰 클래스(p-3)로 준다 */}
        <Box
          role="menu"
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledby}
          onKeyDown={handleKeyDown}
          padding={cellPadding === 12 ? 0 : 8}
          radius={0}
          overflow="scroll"
          className={cn(cellPadding === 12 && "p-3", maxHeight !== undefined && "min-h-0")}
          style={maxHeight !== undefined ? { maxHeight } : undefined}
        >
          {children}
        </Box>
        {actionArea != null && (
          // 하단 액션 줄도 Box: 가로 · 세로 가운데 · 양끝 정렬. 위쪽 선과 높이는 토큰 클래스로 준다
          <Box
            direction="horizontal"
            align="center"
            justify="between"
            radius={0}
            className="h-[52px] shrink-0 border-t border-border-default px-3 py-2"
          >
            {actionArea}
          </Box>
        )}
      </Box>
    </MenuContext>
  );
}

export interface MenuItemProps extends Omit<ComponentProps<"button">, "value" | "role" | "type"> {
  /** 항목 글자 */
  children: ReactNode;
  /** 앞에 붙는 24px 동그란 이미지 주소(프로필·코인 등). 장식이라 스크린리더가 읽지 않는다 */
  leadingImage?: string;
  /**
   * 고를 수 있는 항목의 값. `Menu`의 `value`와 같으면 선택된 항목이 된다.
   * 생략하면 고르지 않고 `onClick`만 하는 액션 항목이다
   */
  value?: string;
}

/** 메뉴 항목 하나. 항목 전체가 눌리는 `<button>`이다 */
export function MenuItem({
  children,
  leadingImage,
  value,
  disabled = false,
  onClick,
  className,
  ...props
}: MenuItemProps) {
  const { variant, size, value: current, select } = useContext(MenuContext);

  const selected =
    value !== undefined && (Array.isArray(current) ? current.includes(value) : current === value);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (value !== undefined) select(value);
    onClick?.(event);
  };

  // Normal은 고른 항목에 체크 표시, Radio·Checkbox는 항목 앞에 동그라미·상자가 붙는다(상태는 aria로도 알린다)
  const role =
    variant === "radio"
      ? "menuitemradio"
      : variant === "checkbox"
        ? "menuitemcheckbox"
        : "menuitem";
  const textClass =
    variant === "normal" && selected ? textClasses[size].selected : textClasses[size].normal;

  return (
    <button
      type="button"
      role={role}
      aria-checked={variant === "normal" ? undefined : selected}
      aria-current={variant === "normal" && selected ? "true" : undefined}
      disabled={disabled}
      onClick={handleClick}
      className={cn(
        "group/control flex w-full cursor-pointer items-center gap-2 rounded-8 text-left transition-colors",
        "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-border-focus",
        itemSizeClasses[size],
        textClass,
        // hover와 누름은 같은 색이다(모바일웹 터치와 PC가 같은 피드백). 선택된 항목은 한 단계 진하게
        disabled
          ? "cursor-not-allowed text-text-disabled"
          : selected
            ? "bg-fill-brand-weak text-text-brand hover:bg-fill-brand-weak-pressed active:bg-fill-brand-weak-pressed"
            : "text-text-primary hover:bg-fill-neutral-weak active:bg-fill-neutral-weak",
        className,
      )}
      {...props}
    >
      {variant === "checkbox" && (
        <CheckboxMark checked={selected} indeterminate={false} disabled={disabled} ring={false} />
      )}
      {variant === "radio" && (
        // Radio 원. 입력 칸 없이 상태를 그리므로 Radio 컴포넌트의 원(peer 방식)을 쓰지 않고 같은 모양을 직접 그린다(Figma Radio Circle, 20px·테두리 6)
        <span
          aria-hidden="true"
          className={cn(
            "size-5 shrink-0 rounded-full border transition-[background-color,box-shadow]",
            disabled
              ? selected
                ? "border-0 bg-fill-white shadow-[inset_0_0_0_6px_var(--mint-fill-brand-weak-pressed)]"
                : "border-border-disabled bg-fill-disabled"
              : selected
                ? "border-0 bg-fill-white shadow-[inset_0_0_0_6px_var(--mint-fill-brand)] group-hover/control:shadow-[inset_0_0_0_6px_var(--mint-fill-brand-pressed)] group-active/control:shadow-[inset_0_0_0_6px_var(--mint-fill-brand-pressed)]"
                : "border-border-strong bg-fill-white group-hover/control:bg-fill-neutral-weak group-active/control:bg-fill-neutral-weak",
          )}
        />
      )}
      {leadingImage != null && <Avatar size={24} src={leadingImage} aria-hidden="true" />}
      <span className="min-w-0 flex-1">{children}</span>
      {variant === "normal" && selected && (
        <SelectedCheckIcon className={disabled ? "text-icon-disabled" : "text-icon-brand"} />
      )}
    </button>
  );
}

export interface MenuGroupProps extends Omit<ComponentProps<"div">, "role"> {
  /** 그룹 이름. 짧은 명사로 쓴다 */
  label: string;
}

/** 항목을 이름 붙은 묶음으로 나눈다. 묶음 위에 작은 이름이 보인다 */
export function MenuGroup({ children, label, className, ...props }: MenuGroupProps) {
  const labelId = useId();
  return (
    <Box role="group" aria-labelledby={labelId} radius={0} className={className} {...props}>
      <div
        id={labelId}
        className="px-3 pt-2 pb-1 text-body-5-medium whitespace-nowrap text-text-tertiary"
      >
        {label}
      </div>
      {children}
    </Box>
  );
}

/** 항목 묶음 사이의 가로선 */
export function MenuDivider({
  className,
  ...props
}: Omit<ComponentProps<"div">, "role" | "children">) {
  return (
    <div role="separator" className={cn("px-2 py-1", className)} {...props}>
      <Divider />
    </div>
  );
}
