// 상태·이벤트가 없어서 "use client"를 붙이지 않는다. 서버 컴포넌트에서도 그대로 쓸 수 있다.
import type { ComponentProps, CSSProperties } from "react";
import { cn } from "../../utils/cn";

type Span4 = 1 | 2 | 3 | 4;
type Span8 = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
type Span12 = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

/** 구간별로 차지할 컬럼 수. 컬럼은 모바일 4 · 태블릿 8 · 데스크톱 12개라서 구간마다 넣을 수 있는 값이 다르다. */
export interface GridSpan {
  /** 모바일(0~767px, 4컬럼) */
  base: Span4;
  /** 태블릿(768px~, 8컬럼). 생략하면 `base` 값을 따른다 */
  tablet?: Span8;
  /** 데스크톱(1024px~, 12컬럼). 생략하면 `tablet`(없으면 `base`) 값을 따른다 */
  desktop?: Span12;
}

export interface GridProps extends ComponentProps<"div"> {}

export interface GridItemProps extends ComponentProps<"div"> {
  /**
   * 구간별로 차지할 컬럼 수. 생략하면 한 줄을 모두 차지한다(모바일 4 · 태블릿 8 · 데스크톱 12).
   * 예) `{ base: 4, tablet: 4, desktop: 3 }` → 모바일 1개/줄, 태블릿 2개/줄, 데스크톱 4개/줄
   */
  span?: GridSpan;
}

const fullRow: GridSpan = { base: 4, tablet: 8, desktop: 12 };

/**
 * 반응형 컬럼 그리드. 컬럼 수(모바일 4 · 태블릿 8 · 데스크톱 12)와 컬럼 사이 간격(20px)은 구간에 맞게 알아서 바뀐다.
 * 화면 좌우 여백과 콘텐츠 최대 폭(1440px)은 `Container`가 맡는다.
 */
export function Grid({ className, ...props }: GridProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-[repeat(var(--mint-grid-columns),minmax(0,1fr))] gap-(--mint-grid-gutter)",
        className,
      )}
      {...props}
    />
  );
}

/** `Grid` 안에서 컬럼을 차지하는 칸. 구간별 컬럼 수는 값이 CSS 변수로 전달되어 클래스는 항상 같다. */
function GridItem({ span = fullRow, className, style, ...props }: GridItemProps) {
  const tablet = span.tablet ?? span.base;
  const desktop = span.desktop ?? tablet;
  return (
    <div
      className={cn(
        "col-span-(--mint-span) tablet:col-span-(--mint-span-tablet) desktop:col-span-(--mint-span-desktop)",
        className,
      )}
      style={
        {
          "--mint-span": span.base,
          "--mint-span-tablet": tablet,
          "--mint-span-desktop": desktop,
          ...style,
        } as CSSProperties
      }
      {...props}
    />
  );
}

// `Grid.Item`은 함수에 속성을 붙인 방식이다. 이 파일에 "use client"를 붙이면 Next.js의 서버 컴포넌트에서 `Grid.Item`처럼
// 점으로 접근할 수 없게 된다(클라이언트 모듈은 참조로만 전달되어 안의 속성을 읽지 못한다).
// 그래서 `Grid`는 상태나 이벤트 없이 서버 컴포넌트로 유지한다. 부득이하게 클라이언트 컴포넌트가 필요하면
// `GridItem`을 별도 이름으로도 내보내고 사용처를 `GridItem`으로 바꾼다.
Grid.Item = GridItem;

export interface ContainerProps extends ComponentProps<"div"> {}

/**
 * 페이지 틀. 화면 좌우에 여백(20px)을 두고, 콘텐츠를 최대 1440px(안쪽 여백 포함)로 가운데에 고정한다.
 * 모바일과 태블릿은 제한 없이 화면을 가득 채우고, 1440px보다 넓은 화면에서는 바깥 여백만 늘어난다.
 */
export function Container({ className, ...props }: ContainerProps) {
  return (
    <div
      className={cn("mx-auto w-full max-w-(--mint-content-max) px-(--mint-grid-margin)", className)}
      {...props}
    />
  );
}
