// 상태·이벤트가 없어서 "use client"를 붙이지 않는다. 서버 컴포넌트에서도 그대로 쓸 수 있다.
// 전체를 100%로 보고 여러 구간의 비율을 한 줄 막대로 보여 주는 표시 전용 부품이다. Figma `Ratio Bar`(node 2501:124784).
// 구간 폭은 값을 그대로 flex-grow로 줘서 비율로 나눈다(합이 100이 아니어도 전체를 꽉 채운다).
import type { ComponentProps } from "react";
import { cn } from "../../utils/cn";
import {
  responsiveClasses,
  type Responsive,
  type ResponsiveClassTable,
} from "../../utils/responsive";

/** Figma Size: Small → `sm` · Medium → `md`(기본) · Large → `lg` */
export type RatioBarSize = "sm" | "md" | "lg";

/**
 * 구간 색. **시맨틱 토큰 이름만** 받는다: 채움 `fill-*`(brand · neutral · danger · success · warning · up · down, `-pressed`·`-weak` 단계)와
 * 차트 `chart-1`~`chart-7`(의미 없는 분류용, `-weak` 단계). 아토믹 색·hex는 받지 않는다. 글자색(막대 안 값)은 바탕에 맞춰 자동으로 정해진다
 */
export type RatioBarColor =
  | "fill-brand"
  | "fill-brand-pressed"
  | "fill-brand-weak"
  | "fill-brand-weak-pressed"
  | "fill-neutral"
  | "fill-neutral-pressed"
  | "fill-neutral-weak"
  | "fill-neutral-weak-pressed"
  | "fill-neutral-medium"
  | "fill-neutral-medium-pressed"
  | "fill-danger"
  | "fill-danger-pressed"
  | "fill-danger-weak"
  | "fill-success"
  | "fill-success-weak"
  | "fill-warning"
  | "fill-warning-weak"
  | "fill-up"
  | "fill-up-weak"
  | "fill-down"
  | "fill-down-weak"
  | "chart-1"
  | "chart-1-weak"
  | "chart-2"
  | "chart-2-weak"
  | "chart-3"
  | "chart-3-weak"
  | "chart-4"
  | "chart-4-weak"
  | "chart-5"
  | "chart-5-weak"
  | "chart-6"
  | "chart-6-weak"
  | "chart-7"
  | "chart-7-weak";

/** 한 구간. `value`는 퍼센트 숫자(`56.2`)이고 화면에는 `56.2%`로 보인다 */
export interface RatioBarItem {
  /** 구간 이름(범례에 보인다. 예: "비트코인") */
  label: string;
  /** 퍼센트 값. 구간 폭이 이 값의 비율로 정해진다. 0보다 작으면 0으로 본다 */
  value: number;
  /** 이 구간의 색(시맨틱 토큰 이름, 예: `"fill-success"` `"chart-2"`). 생략하면 구간 수(3~5)에 맞는 기본 색 순서를 따른다. 같은 막대에서는 구간끼리 구분되는 색을 고른다 */
  color?: RatioBarColor;
}

// 색 이름별 바탕·글자(막대 안 값). 클래스 이름을 조립하지 않고 통째로 적어 Tailwind가 찾게 한다.
// 진한 채움 위는 on-fill(흰색), 주황 계열(fill-warning·chart-4)은 on-fill-warning, 연한 채움 위는 text-strong
const colorClasses: Record<RatioBarColor, { background: string; text: string }> = {
  "fill-brand": { background: "bg-fill-brand", text: "text-text-on-fill" },
  "fill-brand-pressed": { background: "bg-fill-brand-pressed", text: "text-text-on-fill" },
  "fill-brand-weak": { background: "bg-fill-brand-weak", text: "text-text-strong" },
  "fill-brand-weak-pressed": { background: "bg-fill-brand-weak-pressed", text: "text-text-strong" },
  "fill-neutral": { background: "bg-fill-neutral", text: "text-text-on-fill" },
  "fill-neutral-pressed": { background: "bg-fill-neutral-pressed", text: "text-text-on-fill" },
  "fill-neutral-weak": { background: "bg-fill-neutral-weak", text: "text-text-strong" },
  "fill-neutral-weak-pressed": {
    background: "bg-fill-neutral-weak-pressed",
    text: "text-text-strong",
  },
  "fill-neutral-medium": { background: "bg-fill-neutral-medium", text: "text-text-strong" },
  "fill-neutral-medium-pressed": {
    background: "bg-fill-neutral-medium-pressed",
    text: "text-text-strong",
  },
  "fill-danger": { background: "bg-fill-danger", text: "text-text-on-fill" },
  "fill-danger-pressed": { background: "bg-fill-danger-pressed", text: "text-text-on-fill" },
  "fill-danger-weak": { background: "bg-fill-danger-weak", text: "text-text-strong" },
  "fill-success": { background: "bg-fill-success", text: "text-text-on-fill" },
  "fill-success-weak": { background: "bg-fill-success-weak", text: "text-text-strong" },
  "fill-warning": { background: "bg-fill-warning", text: "text-text-on-fill-warning" },
  "fill-warning-weak": { background: "bg-fill-warning-weak", text: "text-text-strong" },
  "fill-up": { background: "bg-fill-up", text: "text-text-on-fill" },
  "fill-up-weak": { background: "bg-fill-up-weak", text: "text-text-strong" },
  "fill-down": { background: "bg-fill-down", text: "text-text-on-fill" },
  "fill-down-weak": { background: "bg-fill-down-weak", text: "text-text-strong" },
  "chart-1": { background: "bg-chart-1", text: "text-text-on-fill" },
  "chart-1-weak": { background: "bg-chart-1-weak", text: "text-text-strong" },
  "chart-2": { background: "bg-chart-2", text: "text-text-on-fill" },
  "chart-2-weak": { background: "bg-chart-2-weak", text: "text-text-strong" },
  "chart-3": { background: "bg-chart-3", text: "text-text-on-fill" },
  "chart-3-weak": { background: "bg-chart-3-weak", text: "text-text-strong" },
  "chart-4": { background: "bg-chart-4", text: "text-text-on-fill-warning" },
  "chart-4-weak": { background: "bg-chart-4-weak", text: "text-text-strong" },
  "chart-5": { background: "bg-chart-5", text: "text-text-on-fill" },
  "chart-5-weak": { background: "bg-chart-5-weak", text: "text-text-strong" },
  "chart-6": { background: "bg-chart-6", text: "text-text-on-fill" },
  "chart-6-weak": { background: "bg-chart-6-weak", text: "text-text-strong" },
  "chart-7": { background: "bg-chart-7", text: "text-text-on-fill" },
  "chart-7-weak": { background: "bg-chart-7-weak", text: "text-text-strong" },
};

// 기본 구간 색(Figma): 3구간·4구간·5구간마다 정해진 순서. 첫 구간이 가장 진하고 마지막이 가장 연한 회색이다.
// 범례 점은 같은 색을 쓴다. 색만으로 구분하지 않도록 범례에 이름과 값을 함께 보여 준다
const defaultColors: Record<3 | 4 | 5, RatioBarColor[]> = {
  3: ["fill-brand", "fill-brand-weak-pressed", "fill-neutral-medium"],
  4: ["fill-brand", "fill-brand-weak-pressed", "fill-brand-weak", "fill-neutral-medium"],
  5: [
    "fill-brand",
    "fill-brand-weak-pressed",
    "fill-brand-weak",
    "fill-neutral-medium-pressed",
    "fill-neutral-medium",
  ],
};

// 크기마다 달라지는 값을 구간별 클래스 표로 둔다(size는 값 하나 또는 구간별 객체, utils/responsive.ts)
// 막대 높이·모서리: sm 16·4 · md 24·8 · lg 32·10(Figma `radius-10`은 토큰에 없어 임의 값)
const barClasses: ResponsiveClassTable<RatioBarSize> = {
  base: {
    sm: "h-4 rounded-4",
    md: "h-6 rounded-8",
    lg: "h-8 rounded-[10px]",
  },
  tablet: {
    sm: "tablet:h-4 tablet:rounded-4",
    md: "tablet:h-6 tablet:rounded-8",
    lg: "tablet:h-8 tablet:rounded-[10px]",
  },
  desktop: {
    sm: "desktop:h-4 desktop:rounded-4",
    md: "desktop:h-6 desktop:rounded-8",
    lg: "desktop:h-8 desktop:rounded-[10px]",
  },
};

// 범례 점: sm 6 · md·lg 8
const dotClasses: ResponsiveClassTable<RatioBarSize> = {
  base: {
    sm: "size-[6px]",
    md: "size-2",
    lg: "size-2",
  },
  tablet: {
    sm: "tablet:size-[6px]",
    md: "tablet:size-2",
    lg: "tablet:size-2",
  },
  desktop: {
    sm: "desktop:size-[6px]",
    md: "desktop:size-2",
    lg: "desktop:size-2",
  },
};

// 범례 이름: sm Caption 2 Medium(11/16) · md Caption 1 Medium(12/18) · lg Body 5 Regular(13/20)
const legendLabelClasses: ResponsiveClassTable<RatioBarSize> = {
  base: {
    sm: "text-caption-2-medium",
    md: "text-caption-1-medium",
    lg: "text-body-5-regular",
  },
  tablet: {
    sm: "tablet:text-caption-2-medium",
    md: "tablet:text-caption-1-medium",
    lg: "tablet:text-body-5-regular",
  },
  desktop: {
    sm: "desktop:text-caption-2-medium",
    md: "desktop:text-caption-1-medium",
    lg: "desktop:text-body-5-regular",
  },
};

// 범례 값: sm Caption 2 SemiBold · md Caption 1 SemiBold · lg Body 5 Bold
const legendValueClasses: ResponsiveClassTable<RatioBarSize> = {
  base: {
    sm: "text-caption-2-semibold",
    md: "text-caption-1-semibold",
    lg: "text-body-5-bold",
  },
  tablet: {
    sm: "tablet:text-caption-2-semibold",
    md: "tablet:text-caption-1-semibold",
    lg: "tablet:text-body-5-bold",
  },
  desktop: {
    sm: "desktop:text-caption-2-semibold",
    md: "desktop:text-caption-1-semibold",
    lg: "desktop:text-body-5-bold",
  },
};

// 막대 안 값: sm은 막대가 얇아 글자를 그리지 않고, md Caption 1 SemiBold · lg Body 5 Bold
// (구간별로 sm에서 md·lg로 바뀔 때 다시 보이도록 md·lg에도 display를 적는다)
const segmentValueClasses: ResponsiveClassTable<RatioBarSize> = {
  base: {
    sm: "hidden",
    md: "block text-caption-1-semibold",
    lg: "block text-body-5-bold",
  },
  tablet: {
    sm: "tablet:hidden",
    md: "tablet:block tablet:text-caption-1-semibold",
    lg: "tablet:block tablet:text-body-5-bold",
  },
  desktop: {
    sm: "desktop:hidden",
    md: "desktop:block desktop:text-caption-1-semibold",
    lg: "desktop:block desktop:text-body-5-bold",
  },
};

// 막대 안 값 보이기·숨기기(구간별 객체를 받는다). 감싸는 요소만 `contents`(레이아웃에 끼지 않음)로 두고,
// 크기에 따른 숨김(sm)은 안쪽 요소가 따로 맡아서 "값을 켜도 sm이면 숨김"이 CSS만으로 맞는다
const showValuesClasses: ResponsiveClassTable<"true" | "false"> = {
  base: { true: "contents", false: "hidden" },
  tablet: { true: "tablet:contents", false: "tablet:hidden" },
  desktop: { true: "desktop:contents", false: "desktop:hidden" },
};

// 범례 보이기·숨기기(구간별 객체를 받는다)
const legendClasses: ResponsiveClassTable<"true" | "false"> = {
  base: { true: "flex", false: "hidden" },
  tablet: { true: "tablet:flex", false: "tablet:hidden" },
  desktop: { true: "desktop:flex", false: "desktop:hidden" },
};

export interface RatioBarProps extends Omit<ComponentProps<"div">, "children"> {
  /** 막대 높이 `sm` 16 · `md` 24 · `lg` 32px. 기본 `md`. 구간별로 바꾸려면 `{ base: "md", desktop: "lg" }` */
  size?: Responsive<RatioBarSize>;
  /** 구간 목록(필수). 3~5개로 쓴다. 앞에서부터 진한 색이 칠해진다 */
  items: RatioBarItem[];
  /** 값의 소수점 자릿수를 맞춘다(`1`이면 `9` → `9.0%`). 생략하면 넘긴 숫자 그대로(`9` → `9%`) */
  fractionDigits?: number;
  /** 막대 위 범례(점 + 이름 + 값)를 보일지. 기본 `true`. 구간별로 바꾸려면 `{ base: false, desktop: true }` */
  legend?: Responsive<boolean>;
  /** 막대 안에 값(`56.2%`)을 보일지. 기본 `true`. `sm`은 막대가 얇아 항상 숨는다. 구간별로 바꾸려면 `{ base: false, desktop: true }` */
  showValues?: Responsive<boolean>;
}

/** 전체를 100%로 보고 구간별 비율을 한 줄 막대로 보여 준다(예: 시장 도미넌스). 눌러도 동작이 없는 표시 전용이다 */
export function RatioBar({
  size,
  items,
  fractionDigits,
  legend,
  showValues,
  className,
  ...props
}: RatioBarProps) {
  const palette = defaultColors[Math.min(Math.max(items.length, 3), 5) as 3 | 4 | 5];
  // 구간에 color를 줬으면 그 색, 아니면 기본 색 순서(구간 수를 넘으면 마지막 색)
  const colorOf = (index: number) =>
    colorClasses[items[index]?.color ?? palette[index] ?? palette[palette.length - 1]];
  const format = (value: number) =>
    `${fractionDigits === undefined ? value : value.toFixed(fractionDigits)}%`;
  const summary = items.map((item) => `${item.label} ${format(item.value)}`).join(", ");

  return (
    <div
      // 그림 전체를 하나의 이미지처럼 읽는다. 구간 이름과 값이 이름에 들어 있어 범례를 끄거나 값을 숨겨도 같다
      role="img"
      aria-label={summary}
      className={cn("flex w-full min-w-0 flex-col gap-3", className)}
      {...props}
    >
      <div
        aria-hidden="true"
        className={cn(
          "flex-wrap gap-x-4 gap-y-2",
          responsiveClasses<boolean>(legend, true, legendClasses),
        )}
      >
        {items.map((item, index) => (
          <span key={`${item.label}-${index}`} className="flex items-center gap-[6px]">
            <span
              className={cn(
                "shrink-0 rounded-full",
                colorOf(index).background,
                responsiveClasses<RatioBarSize>(size, "md", dotClasses),
              )}
            />
            <span
              className={cn(
                "whitespace-nowrap text-text-secondary",
                responsiveClasses<RatioBarSize>(size, "md", legendLabelClasses),
              )}
            >
              {item.label}
            </span>
            <span
              className={cn(
                "whitespace-nowrap text-text-strong",
                responsiveClasses<RatioBarSize>(size, "md", legendValueClasses),
              )}
            >
              {format(item.value)}
            </span>
          </span>
        ))}
      </div>

      <div
        aria-hidden="true"
        className={cn(
          "flex w-full gap-[2px] overflow-hidden",
          responsiveClasses<RatioBarSize>(size, "md", barClasses),
        )}
      >
        {items.map((item, index) => (
          <span
            key={`${item.label}-${index}`}
            // 값을 그대로 flex-grow로 줘서 비율로 나눈다
            style={{ flex: `${Math.max(item.value, 0)} 0 0` }}
            className={cn(
              "flex h-full min-w-px items-center justify-center overflow-hidden",
              colorOf(index).background,
              colorOf(index).text,
            )}
          >
            <span className={responsiveClasses<boolean>(showValues, true, showValuesClasses)}>
              <span
                className={cn(
                  "overflow-hidden text-ellipsis whitespace-nowrap",
                  responsiveClasses<RatioBarSize>(size, "md", segmentValueClasses),
                )}
              >
                {format(item.value)}
              </span>
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
