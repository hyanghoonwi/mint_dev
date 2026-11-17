"use client";

// 열림 상태·선택 값·방향키 이동·바깥 누름 닫기를 가져서 클라이언트 컴포넌트다.
// Figma `Select`(node 2363:58113) · `Select Guidelines`(node 2362:50975).
// Select = Label + Select Trigger(누르는 칸) + Select Menu(펼쳐지는 목록). 라벨은 `Label` 컴포넌트를 그대로 쓴다.
// 목록은 Menu와 모양이 달라(항목 폭 16 · 간격 12, 48·40·32) Menu를 재사용하지 않고, 역할도 `listbox`·`option`이다.
// 목록은 포털 없이 칸 바로 아래에 겹쳐 그린다(SSR 안전). `overflow: hidden` 영역 안에서는 잘릴 수 있다.
import {
  useEffect,
  useId,
  useRef,
  useState,
  type ComponentProps,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
} from "react";
import { cn } from "../../utils/cn";
import {
  mapResponsive,
  responsiveClasses,
  type Responsive,
  type ResponsiveClassTable,
} from "../../utils/responsive";
import {
  fieldBodyPositionClasses,
  fieldHelperClasses,
  fieldHeightVarClasses,
  fieldLabelWrapClasses,
  fieldRootPositionClasses,
  type FieldStatus,
} from "../_internal/fieldLayout";
import { Chip } from "../chip/Chip";
import { SelectedCheckIcon } from "../icon/SelectedCheckIcon";
import { Label } from "../label/Label";
import { CaretDownIcon, CaretUpIcon, WarningCircleIcon, XIcon } from "../icon/icons.generated";

/** Figma Size: Large(칸 높이 48) · Medium(40, 기본) · Small(32) */
export type SelectSize = "sm" | "md" | "lg";

/** 상태(Figma Status): `normal` · `negative` 오류 · `positive` 확인 완료. TextField와 같은 이름 */
export type SelectStatus = FieldStatus;

/** 라벨 위치: `top` 칸 위 · `left` 칸 왼쪽 */
export type SelectLabelPosition = "top" | "left";

/** 목록의 항목 하나 */
export interface SelectOption {
  /** 고르는 값. 같은 목록 안에서 겹치지 않게 한다 */
  value: string;
  /** 항목 글자. 한 줄로 짧게 쓴다 */
  label: string;
  /** 글자 아래 보조 설명(13px). 있으면 앞·뒤 요소가 위쪽에 맞춰진다 */
  description?: string;
  /** 글자 앞 20px 요소(아이콘 등) */
  leadingIcon?: ReactNode;
  /** 글자 뒤(체크 앞) 20px 요소 */
  trailingContent?: ReactNode;
  /** 고를 수 없게 한다 */
  disabled?: boolean;
}

/** 이름 붙은 항목 묶음. 묶음 사이에는 가로선이 들어간다 */
export interface SelectOptionGroup {
  /** 묶음 이름(목록 안에서 작게 보인다) */
  group: string;
  options: SelectOption[];
}

// 칸 크기(Figma Select Trigger): Large 48·모서리 12·Body 2 / Medium 40·모서리 10·Body 3 / Small 32·모서리 8·Body 4
// 10은 반경 토큰에 없어서 임의 값이다. 크기는 값 하나 또는 구간별 객체를 받으므로(utils/responsive.ts)
// 구간마다 클래스를 통째로 적은 표를 쓴다(Tailwind는 클래스 이름을 정적으로 찾는다)
const fieldClasses: ResponsiveClassTable<SelectSize> = {
  base: {
    lg: "h-12 rounded-12 px-4 text-body-2-regular",
    md: "h-10 rounded-[10px] px-4 text-body-3-regular",
    sm: "h-8 rounded-8 px-3 text-body-4-regular",
  },
  tablet: {
    lg: "tablet:h-12 tablet:rounded-12 tablet:px-4 tablet:text-body-2-regular",
    md: "tablet:h-10 tablet:rounded-[10px] tablet:px-4 tablet:text-body-3-regular",
    sm: "tablet:h-8 tablet:rounded-8 tablet:px-3 tablet:text-body-4-regular",
  },
  desktop: {
    lg: "desktop:h-12 desktop:rounded-12 desktop:px-4 desktop:text-body-2-regular",
    md: "desktop:h-10 desktop:rounded-[10px] desktop:px-4 desktop:text-body-3-regular",
    sm: "desktop:h-8 desktop:rounded-8 desktop:px-3 desktop:text-body-4-regular",
  },
};

// 항목 크기(Figma Select Item): Large 최소 48(위아래 12) · Medium 40(8) · Small 32(4). 글자는 Body 2 · 3 · 4, 고른 항목은 Medium
const itemBoxClasses: ResponsiveClassTable<SelectSize> = {
  base: {
    lg: "min-h-12 py-3",
    md: "min-h-10 py-2",
    sm: "min-h-8 py-1",
  },
  tablet: {
    lg: "tablet:min-h-12 tablet:py-3",
    md: "tablet:min-h-10 tablet:py-2",
    sm: "tablet:min-h-8 tablet:py-1",
  },
  desktop: {
    lg: "desktop:min-h-12 desktop:py-3",
    md: "desktop:min-h-10 desktop:py-2",
    sm: "desktop:min-h-8 desktop:py-1",
  },
};

const itemNormalClasses: ResponsiveClassTable<SelectSize> = {
  base: {
    lg: "text-body-2-regular",
    md: "text-body-3-regular",
    sm: "text-body-4-regular",
  },
  tablet: {
    lg: "tablet:text-body-2-regular",
    md: "tablet:text-body-3-regular",
    sm: "tablet:text-body-4-regular",
  },
  desktop: {
    lg: "desktop:text-body-2-regular",
    md: "desktop:text-body-3-regular",
    sm: "desktop:text-body-4-regular",
  },
};

const itemSelectedClasses: ResponsiveClassTable<SelectSize> = {
  base: {
    lg: "text-body-2-medium",
    md: "text-body-3-medium",
    sm: "text-body-4-medium",
  },
  tablet: {
    lg: "tablet:text-body-2-medium",
    md: "tablet:text-body-3-medium",
    sm: "tablet:text-body-4-medium",
  },
  desktop: {
    lg: "desktop:text-body-2-medium",
    md: "desktop:text-body-3-medium",
    sm: "desktop:text-body-4-medium",
  },
};

interface SelectBaseProps extends Omit<
  ComponentProps<"div">,
  "onChange" | "defaultValue" | "children" | "role"
> {
  /**
   * 칸 크기. `lg` 48 · `md` 40(기본) · `sm` 32. 목록 항목·칩도 같은 크기를 따른다.
   * 구간별로 바꾸려면 객체를 준다: `{ base: "lg", desktop: "md" }`
   */
  size?: Responsive<SelectSize>;
  /** 위(기본) 또는 왼쪽에 붙는 라벨. `Label` 컴포넌트로 그려진다. 없으면 `aria-label`을 꼭 준다 */
  label?: ReactNode;
  /** 고른 값이 없을 때 보이는 글자 */
  placeholder?: string;
  /** 칸 아래 도움말. 오류일 때는 빨갛게 보인다 */
  helper?: ReactNode;
  /** 라벨 오른쪽 도움말 아이콘(`Label`의 `helpIcon`) */
  helpIcon?: boolean | ReactNode;
  /** 칸 안 왼쪽 20px 요소(아이콘 등) */
  leadingIcon?: ReactNode;
  /** 고를 수 있는 항목. 평평한 목록이거나 `{ group, options }` 묶음이다 */
  options: (SelectOption | SelectOptionGroup)[];
  /** 목록이 열려 있는지(제어). 생략하면 칸을 눌러 열고 닫는다 */
  open?: boolean;
  /**
   * 상태. `normal`(기본) · `negative` 오류(빨간 테두리·도움말·경고 아이콘) · `positive` 확인 완료(초록 테두리·도움말).
   * TextField와 같은 이름이다
   */
  status?: SelectStatus;
  /** 비활성. 누를 수 없고 흐리게 보인다 */
  disabled?: boolean;
  /** 읽기 전용. 값은 보이지만 바꿀 수 없다 */
  readOnly?: boolean;
  /** 라벨 옆 빨간 `*`. 필수 선택일 때만 */
  required?: boolean;
  /**
   * 라벨 위치. `top` 칸 위(기본) · `left` 칸 왼쪽.
   * 구간별로 바꾸려면 객체를 준다: `{ base: "top", desktop: "left" }`
   */
  labelPosition?: Responsive<SelectLabelPosition>;
  /** 목록의 최대 높이(px). 넘치면 목록 안에서 스크롤된다. 기본 320 */
  menuMaxHeight?: number;
  /** 폼으로 제출할 이름. 값마다 숨은 입력이 생긴다 */
  name?: string;
  /** 라벨이 없을 때 칸의 이름(스크린리더) */
  "aria-label"?: string;
  /** 열림이 바뀔 때 */
  onOpenChange?: (open: boolean) => void;
}

/**
 * 하나를 고르는지(`multiple` 없음) 여러 개를 고르는지(`multiple`)에 따라 값 타입이 달라진다.
 * 하나는 `string`, 여러 개는 `string[]`이다.
 */
type SelectSelectionProps =
  | {
      value?: string;
      defaultValue?: string;
      multiple?: false;
      /** 여러 개 고를 때만 의미가 있다 */
      render?: "text";
      onChange?: (value: string) => void;
    }
  | {
      value?: string[];
      defaultValue?: string[];
      multiple: true;
      /**
       * 고른 값을 보이는 방식. `text` 칸에 쉼표로 이은 글자(기본) ·
       * `chip` 글자에 더해 칸 아래에 지울 수 있는 칩(칩 크기는 `size`를 따른다)
       */
      render?: "text" | "chip";
      onChange?: (value: string[]) => void;
    };

export type SelectProps = SelectBaseProps & SelectSelectionProps;

type Row =
  | { kind: "group"; key: string; label: string }
  | { kind: "divider"; key: string }
  | { kind: "option"; key: string; option: SelectOption; index: number };

function isGroup(entry: SelectOption | SelectOptionGroup): entry is SelectOptionGroup {
  return "group" in entry;
}

/** 라벨 + 누르는 칸 + 펼쳐지는 목록. 하나 또는 여러 개를 고른다 */
export function Select({
  size = "md",
  label,
  placeholder = "선택해 주세요",
  helper,
  helpIcon,
  leadingIcon,
  options,
  value,
  defaultValue,
  open: openProp,
  status = "normal",
  disabled = false,
  readOnly = false,
  required,
  multiple = false,
  render = "text",
  labelPosition = "top",
  menuMaxHeight = 320,
  name,
  "aria-label": ariaLabel,
  onChange,
  onOpenChange,
  className,
  ...props
}: SelectProps) {
  const id = useId();
  const triggerId = `${id}-trigger`;
  const listId = `${id}-list`;
  const helperId = `${id}-helper`;
  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const [innerValue, setInnerValue] = useState<string | string[] | undefined>(defaultValue);
  const [openState, setOpenState] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const current = value ?? innerValue;
  const selectedValues: string[] = multiple
    ? Array.isArray(current)
      ? current
      : []
    : typeof current === "string"
      ? [current]
      : [];

  const inactive = disabled || readOnly;
  const open = !inactive && (openProp ?? openState);

  const setOpen = (next: boolean) => {
    if (openProp === undefined) setOpenState(next);
    onOpenChange?.(next);
  };

  // 항목을 목록 모양(그룹 이름 · 가로선 · 항목)으로 펼치고, 방향키로 옮길 항목에는 번호를 붙인다
  const rows: Row[] = [];
  const flat: SelectOption[] = [];
  options.forEach((entry, entryIndex) => {
    if (isGroup(entry)) {
      if (entryIndex > 0) rows.push({ kind: "divider", key: `divider-${entryIndex}` });
      rows.push({ kind: "group", key: `group-${entryIndex}`, label: entry.group });
      for (const option of entry.options) {
        rows.push({ kind: "option", key: option.value, option, index: flat.length });
        flat.push(option);
      }
    } else {
      rows.push({ kind: "option", key: entry.value, option: entry, index: flat.length });
      flat.push(entry);
    }
  });

  const selectedOptions = selectedValues
    .map((selectedValue) => flat.find((option) => option.value === selectedValue))
    .filter((option): option is SelectOption => option !== undefined);

  // 고르는 방식(multiple)마다 값 타입이 달라서, 판별 유니온을 좁힐 수 없는 이 한 곳에서만 캐스팅한다
  const notify = onChange as ((next: string | string[]) => void) | undefined;
  const commit = (next: string | string[]) => {
    if (value === undefined) setInnerValue(next);
    notify?.(next);
  };

  const choose = (option: SelectOption) => {
    if (option.disabled) return;
    if (multiple) {
      commit(
        selectedValues.includes(option.value)
          ? selectedValues.filter((selectedValue) => selectedValue !== option.value)
          : [...selectedValues, option.value],
      );
    } else {
      commit(option.value);
      setOpen(false);
    }
  };

  const removeChip = (optionValue: string) => {
    commit(selectedValues.filter((selectedValue) => selectedValue !== optionValue));
  };

  // 건너뛸 수 없는(비활성) 항목을 빼고 다음 항목 번호를 찾는다. 끝에서는 반대쪽 끝으로 이어진다
  const step = (from: number, direction: 1 | -1) => {
    for (let count = 1; count <= flat.length; count += 1) {
      const next = (from + direction * count + flat.length * count) % flat.length;
      if (!flat[next].disabled) return next;
    }
    return -1;
  };

  const openList = (target: "selected" | "first" | "last") => {
    setOpen(true);
    const selectedIndex = flat.findIndex((option) => option.value === selectedValues[0]);
    if (target === "selected" && selectedIndex >= 0) setActiveIndex(selectedIndex);
    else setActiveIndex(target === "last" ? step(0, -1) : step(-1, 1));
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (inactive) return;
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        if (!open) openList("selected");
        else setActiveIndex(step(activeIndex, 1));
        break;
      case "ArrowUp":
        event.preventDefault();
        if (!open) openList("selected");
        else setActiveIndex(step(activeIndex < 0 ? 0 : activeIndex, -1));
        break;
      case "Home":
        if (open) {
          event.preventDefault();
          setActiveIndex(step(-1, 1));
        }
        break;
      case "End":
        if (open) {
          event.preventDefault();
          setActiveIndex(step(0, -1));
        }
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        if (!open) openList("selected");
        else if (activeIndex >= 0) choose(flat[activeIndex]);
        break;
      case "Escape":
        if (open) {
          event.preventDefault();
          setOpen(false);
        }
        break;
    }
  };

  // 키보드로 누른 클릭(detail 0)은 keydown에서 이미 처리했으므로 마우스·터치 클릭만 연다
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (inactive || event.detail === 0) return;
    if (open) setOpen(false);
    else openList("selected");
  };

  // 열려 있는 동안 바깥을 누르면 닫는다
  useEffect(() => {
    if (!open) return;
    const handlePointerDown = (event: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        if (openProp === undefined) setOpenState(false);
        onOpenChange?.(false);
      }
    };
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [open, openProp, onOpenChange]);

  // 키보드로 옮긴 항목이 목록 밖이면 보이는 곳으로 스크롤한다
  useEffect(() => {
    if (!open || activeIndex < 0) return;
    document.getElementById(`${id}-option-${activeIndex}`)?.scrollIntoView({ block: "nearest" });
  }, [open, activeIndex, id]);

  const showChips = multiple && render === "chip" && selectedOptions.length > 0;
  const valueText = selectedOptions.map((option) => option.label).join(", ");
  // 칸·항목·바깥 요소의 크기·라벨 위치 클래스. 값 하나든 구간별 객체든 같은 방식으로 고른다
  const fieldClass = responsiveClasses<SelectSize>(size, "md", fieldClasses);
  const itemBoxClass = responsiveClasses<SelectSize>(size, "md", itemBoxClasses);
  const itemNormalClass = responsiveClasses<SelectSize>(size, "md", itemNormalClasses);
  const itemSelectedClass = responsiveClasses<SelectSize>(size, "md", itemSelectedClasses);
  // 라벨 글자는 Large·Medium이 `md`, Small이 `sm`(Label 크기 이름으로 바꿔서 구간별로 넘긴다)
  const labelSize = mapResponsive(size, (selectSize) => (selectSize === "sm" ? "sm" : "md"));

  // 칸 아래 칩. 디자인 시스템 `Chip`을 `size`와 같은 이름으로 그대로 쓴다(Select lg·md·sm → Chip lg 40 · md 32 · sm 28).
  // Chip은 선택 토글(aria-pressed)이라, 지우는 버튼으로 쓰려고 aria-pressed를 빼고 이름을 "○○ 삭제"로 준다
  const chips = (
    <div className="flex flex-wrap gap-1">
      {selectedOptions.map((option) => (
        <Chip
          key={option.value}
          size={size}
          aria-pressed={undefined}
          aria-label={inactive ? option.label : `${option.label} 삭제`}
          disabled={inactive}
          rightAddon={inactive ? undefined : <XIcon />}
          onClick={() => removeChip(option.value)}
        >
          {option.label}
        </Chip>
      ))}
    </div>
  );

  const labelNode =
    label != null ? (
      <Label
        htmlFor={triggerId}
        size={labelSize}
        required={required}
        disabled={disabled}
        helpIcon={helpIcon}
      >
        {label}
      </Label>
    ) : null;

  // 테두리: 비활성 > 오류·확인 완료(열려 있어도 상태 색 유지, TextField와 같음) > 열림 > 기본
  const borderClass = inactive
    ? "border-border-disabled bg-fill-disabled"
    : status === "negative"
      ? "border-fill-danger bg-fill-white"
      : status === "positive"
        ? "border-fill-success bg-fill-white"
        : open
          ? "border-border-focus bg-fill-white"
          : "border-border-strong bg-fill-white";

  const body = (
    <div
      className={cn(
        "flex min-w-0 flex-col gap-2",
        responsiveClasses<SelectLabelPosition>(labelPosition, "top", fieldBodyPositionClasses),
      )}
    >
      <div className="relative">
        <button
          id={triggerId}
          type="button"
          role="combobox"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={open ? listId : undefined}
          aria-activedescendant={
            open && activeIndex >= 0 ? `${id}-option-${activeIndex}` : undefined
          }
          aria-label={label == null ? ariaLabel : undefined}
          aria-invalid={status === "negative" || undefined}
          aria-readonly={readOnly || undefined}
          aria-describedby={helper != null ? helperId : undefined}
          disabled={disabled}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          onBlur={(event) => {
            if (!rootRef.current?.contains(event.relatedTarget as Node | null)) setOpen(false);
          }}
          className={cn(
            "flex w-full items-center gap-2 overflow-clip border text-left outline-none",
            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus",
            fieldClass,
            borderClass,
            disabled ? "cursor-not-allowed" : inactive ? "cursor-default" : "cursor-pointer",
          )}
        >
          {leadingIcon != null && (
            <span
              className={cn(
                "inline-flex size-5 shrink-0 items-center justify-center [&_svg]:size-5",
                disabled ? "text-icon-disabled" : "text-icon-secondary",
              )}
            >
              {leadingIcon}
            </span>
          )}
          <span
            className={cn(
              "min-w-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap",
              valueText === ""
                ? "text-text-tertiary"
                : disabled
                  ? "text-text-disabled"
                  : "text-text-strong",
            )}
          >
            {valueText || placeholder}
          </span>
          {status === "negative" && !inactive && (
            <WarningCircleIcon size={20} variant="fill" className="shrink-0 text-icon-danger" />
          )}
          {!readOnly && (
            // 열려 있으면 위쪽 화살표
            <span
              className={cn(
                "inline-flex shrink-0",
                disabled ? "text-icon-disabled" : "text-icon-secondary",
              )}
            >
              {open ? <CaretUpIcon size={20} /> : <CaretDownIcon size={20} />}
            </span>
          )}
        </button>

        {open && (
          <div
            ref={listRef}
            id={listId}
            role="listbox"
            aria-multiselectable={multiple || undefined}
            aria-labelledby={label != null ? triggerId : undefined}
            aria-label={label == null ? ariaLabel : undefined}
            // 목록을 눌러도 칸의 포커스가 옮겨 가지 않게 한다(방향키 조작이 이어지도록)
            onPointerDown={(event) => event.preventDefault()}
            className="absolute inset-x-0 top-full z-50 mt-1 flex flex-col overflow-y-auto rounded-12 bg-background-floated p-2 shadow-floating"
            style={{ maxHeight: menuMaxHeight }}
          >
            {rows.map((row) => {
              if (row.kind === "group") {
                return (
                  <div
                    key={row.key}
                    role="presentation"
                    className="px-4 pt-2 pb-1 text-body-5-medium whitespace-nowrap text-text-tertiary"
                  >
                    {row.label}
                  </div>
                );
              }
              if (row.kind === "divider") {
                return (
                  <div key={row.key} role="separator" className="px-4 py-1">
                    <div className="h-px bg-border-default" />
                  </div>
                );
              }
              const { option, index } = row;
              const selected = selectedValues.includes(option.value);
              const active = index === activeIndex;
              return (
                <div
                  key={row.key}
                  id={`${id}-option-${index}`}
                  role="option"
                  aria-selected={selected}
                  aria-disabled={option.disabled || undefined}
                  onPointerEnter={() => !option.disabled && setActiveIndex(index)}
                  onClick={() => choose(option)}
                  className={cn(
                    "flex gap-3 rounded-8 px-4 transition-colors",
                    option.description != null ? "items-start" : "items-center",
                    itemBoxClass,
                    option.disabled
                      ? "cursor-not-allowed text-text-disabled"
                      : cn(
                          "cursor-pointer",
                          selected
                            ? cn(
                                "bg-fill-brand-weak text-text-brand active:bg-fill-brand-weak-pressed",
                                active && "bg-fill-brand-weak-pressed",
                              )
                            : cn(
                                "text-text-strong active:bg-fill-neutral-weak",
                                active && "bg-fill-neutral-weak",
                              ),
                        ),
                  )}
                >
                  {option.leadingIcon != null && (
                    <span className="inline-flex size-5 shrink-0 items-center justify-center [&_svg]:size-5">
                      {option.leadingIcon}
                    </span>
                  )}
                  <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <span
                      className={cn(
                        "overflow-hidden text-ellipsis whitespace-nowrap",
                        selected ? itemSelectedClass : itemNormalClass,
                      )}
                    >
                      {option.label}
                    </span>
                    {option.description != null && (
                      <span
                        className={cn(
                          "text-body-5-regular",
                          option.disabled ? "text-text-disabled" : "text-text-secondary",
                        )}
                      >
                        {option.description}
                      </span>
                    )}
                  </span>
                  {option.trailingContent != null && (
                    <span className="inline-flex size-5 shrink-0 items-center justify-center [&_svg]:size-5">
                      {option.trailingContent}
                    </span>
                  )}
                  {selected && <SelectedCheckIcon className="text-icon-brand" />}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {showChips && chips}

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
  );

  return (
    <div
      ref={rootRef}
      className={cn(
        "relative flex w-full gap-2",
        responsiveClasses<SelectLabelPosition>(labelPosition, "top", fieldRootPositionClasses),
        responsiveClasses<SelectSize>(size, "md", fieldHeightVarClasses),
        className,
      )}
      {...props}
    >
      {labelNode != null && (
        // 왼쪽 라벨은 칸 높이(--mint-field-height)에 맞춰 세로 가운데에 놓고, 위 라벨은 높이를 따로 정하지 않는다
        <div
          className={cn(
            "flex shrink-0 items-center",
            responsiveClasses<SelectLabelPosition>(labelPosition, "top", fieldLabelWrapClasses),
          )}
        >
          {labelNode}
        </div>
      )}
      {body}
      {name != null &&
        selectedValues.map((selectedValue) => (
          // 비활성이면 제출하지 않는다(네이티브 disabled 입력과 같음). 읽기 전용은 제출된다
          <input
            key={selectedValue}
            type="hidden"
            name={name}
            value={selectedValue}
            disabled={disabled}
          />
        ))}
    </div>
  );
}
