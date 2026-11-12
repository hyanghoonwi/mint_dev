"use client";

// 버튼 위에 마우스를 올리거나 키보드로 포커스했을 때 짧은 보조 정보(이름·단축키)를 보여 주는 말풍선.
// Figma `Tooltip`(node 2286:32659) · `Tooltip Guidelines`(2286:33092).
// 위치는 CSS(absolute)로만 정한다. 포털·화면 크기 측정이 없어서 서버 렌더와 결과가 같다.
// `size`·`position`은 구간별 값도 받는다(클래스 표 + CSS 변수). 열림 상태와 Esc 닫기만 JS로 다룬다(그래서 "use client").
import {
  cloneElement,
  isValidElement,
  useEffect,
  useId,
  useState,
  type ComponentProps,
  type ReactElement,
  type ReactNode,
} from "react";
import { cn } from "../../utils/cn";
import {
  responsiveClasses,
  type Responsive,
  type ResponsiveClassTable,
} from "../../utils/responsive";

export type TooltipPosition = "top" | "bottom" | "left" | "right";
export type TooltipArrowAlign = "start" | "center" | "end";
export type TooltipSize = "sm" | "md" | "lg";

// 크기: 높이 30 · 36 · 42, 글자 Caption 1 · Body 5 · Body 4 Medium, 패딩 10×6 · 12×8 · 14×10, 모서리 10 · 12 · 14.
// 화살표 칸 두께(t) 6 · 8 · 10, 가운데 화살표(cw×ch) 16 · 20 · 24, 모서리 쐐기(kw×kh) 8 · 10 · 12.
// 말풍선·화살표가 이 CSS 변수를 읽어서, 구간마다 크기가 바뀌어도 위치 조합 표가 따로 필요 없다
const sizeClasses: ResponsiveClassTable<TooltipSize> = {
  base: {
    sm: "text-caption-1-medium [--mint-tt-px:10px] [--mint-tt-py:6px] [--mint-tt-r:10px] [--mint-tt-t:6px] [--mint-tt-cw:16px] [--mint-tt-ch:5.5px] [--mint-tt-kw:8px] [--mint-tt-kh:6.2px]",
    md: "text-body-5-medium [--mint-tt-px:12px] [--mint-tt-py:8px] [--mint-tt-r:12px] [--mint-tt-t:8px] [--mint-tt-cw:20px] [--mint-tt-ch:6.875px] [--mint-tt-kw:10px] [--mint-tt-kh:7.75px]",
    lg: "text-body-4-medium [--mint-tt-px:14px] [--mint-tt-py:10px] [--mint-tt-r:14px] [--mint-tt-t:10px] [--mint-tt-cw:24px] [--mint-tt-ch:8.25px] [--mint-tt-kw:12px] [--mint-tt-kh:9.3px]",
  },
  tablet: {
    sm: "tablet:text-caption-1-medium tablet:[--mint-tt-px:10px] tablet:[--mint-tt-py:6px] tablet:[--mint-tt-r:10px] tablet:[--mint-tt-t:6px] tablet:[--mint-tt-cw:16px] tablet:[--mint-tt-ch:5.5px] tablet:[--mint-tt-kw:8px] tablet:[--mint-tt-kh:6.2px]",
    md: "tablet:text-body-5-medium tablet:[--mint-tt-px:12px] tablet:[--mint-tt-py:8px] tablet:[--mint-tt-r:12px] tablet:[--mint-tt-t:8px] tablet:[--mint-tt-cw:20px] tablet:[--mint-tt-ch:6.875px] tablet:[--mint-tt-kw:10px] tablet:[--mint-tt-kh:7.75px]",
    lg: "tablet:text-body-4-medium tablet:[--mint-tt-px:14px] tablet:[--mint-tt-py:10px] tablet:[--mint-tt-r:14px] tablet:[--mint-tt-t:10px] tablet:[--mint-tt-cw:24px] tablet:[--mint-tt-ch:8.25px] tablet:[--mint-tt-kw:12px] tablet:[--mint-tt-kh:9.3px]",
  },
  desktop: {
    sm: "desktop:text-caption-1-medium desktop:[--mint-tt-px:10px] desktop:[--mint-tt-py:6px] desktop:[--mint-tt-r:10px] desktop:[--mint-tt-t:6px] desktop:[--mint-tt-cw:16px] desktop:[--mint-tt-ch:5.5px] desktop:[--mint-tt-kw:8px] desktop:[--mint-tt-kh:6.2px]",
    md: "desktop:text-body-5-medium desktop:[--mint-tt-px:12px] desktop:[--mint-tt-py:8px] desktop:[--mint-tt-r:12px] desktop:[--mint-tt-t:8px] desktop:[--mint-tt-cw:20px] desktop:[--mint-tt-ch:6.875px] desktop:[--mint-tt-kw:10px] desktop:[--mint-tt-kh:7.75px]",
    lg: "desktop:text-body-4-medium desktop:[--mint-tt-px:14px] desktop:[--mint-tt-py:10px] desktop:[--mint-tt-r:14px] desktop:[--mint-tt-t:10px] desktop:[--mint-tt-cw:24px] desktop:[--mint-tt-ch:8.25px] desktop:[--mint-tt-kw:12px] desktop:[--mint-tt-kh:9.3px]",
  },
};

const placementStart: ResponsiveClassTable<TooltipPosition> = {
  base: {
    top: "top-auto bottom-full pt-0 pb-1 pl-0 pr-0 translate-y-0 left-1/2 right-auto translate-x-0",
    bottom:
      "top-full bottom-auto pt-1 pb-0 pl-0 pr-0 translate-y-0 left-1/2 right-auto translate-x-0",
    left: "left-auto right-full pt-0 pb-0 pl-0 pr-1 translate-x-0 top-1/2 bottom-auto translate-y-0",
    right:
      "left-full right-auto pt-0 pb-0 pl-1 pr-0 translate-x-0 top-1/2 bottom-auto translate-y-0",
  },
  tablet: {
    top: "tablet:top-auto tablet:bottom-full tablet:pt-0 tablet:pb-1 tablet:pl-0 tablet:pr-0 tablet:translate-y-0 tablet:left-1/2 tablet:right-auto tablet:translate-x-0",
    bottom:
      "tablet:top-full tablet:bottom-auto tablet:pt-1 tablet:pb-0 tablet:pl-0 tablet:pr-0 tablet:translate-y-0 tablet:left-1/2 tablet:right-auto tablet:translate-x-0",
    left: "tablet:left-auto tablet:right-full tablet:pt-0 tablet:pb-0 tablet:pl-0 tablet:pr-1 tablet:translate-x-0 tablet:top-1/2 tablet:bottom-auto tablet:translate-y-0",
    right:
      "tablet:left-full tablet:right-auto tablet:pt-0 tablet:pb-0 tablet:pl-1 tablet:pr-0 tablet:translate-x-0 tablet:top-1/2 tablet:bottom-auto tablet:translate-y-0",
  },
  desktop: {
    top: "desktop:top-auto desktop:bottom-full desktop:pt-0 desktop:pb-1 desktop:pl-0 desktop:pr-0 desktop:translate-y-0 desktop:left-1/2 desktop:right-auto desktop:translate-x-0",
    bottom:
      "desktop:top-full desktop:bottom-auto desktop:pt-1 desktop:pb-0 desktop:pl-0 desktop:pr-0 desktop:translate-y-0 desktop:left-1/2 desktop:right-auto desktop:translate-x-0",
    left: "desktop:left-auto desktop:right-full desktop:pt-0 desktop:pb-0 desktop:pl-0 desktop:pr-1 desktop:translate-x-0 desktop:top-1/2 desktop:bottom-auto desktop:translate-y-0",
    right:
      "desktop:left-full desktop:right-auto desktop:pt-0 desktop:pb-0 desktop:pl-1 desktop:pr-0 desktop:translate-x-0 desktop:top-1/2 desktop:bottom-auto desktop:translate-y-0",
  },
};

const placementCenter: ResponsiveClassTable<TooltipPosition> = {
  base: {
    top: "top-auto bottom-full pt-0 pb-1 pl-0 pr-0 translate-y-0 left-1/2 right-auto -translate-x-1/2",
    bottom:
      "top-full bottom-auto pt-1 pb-0 pl-0 pr-0 translate-y-0 left-1/2 right-auto -translate-x-1/2",
    left: "left-auto right-full pt-0 pb-0 pl-0 pr-1 translate-x-0 top-1/2 bottom-auto -translate-y-1/2",
    right:
      "left-full right-auto pt-0 pb-0 pl-1 pr-0 translate-x-0 top-1/2 bottom-auto -translate-y-1/2",
  },
  tablet: {
    top: "tablet:top-auto tablet:bottom-full tablet:pt-0 tablet:pb-1 tablet:pl-0 tablet:pr-0 tablet:translate-y-0 tablet:left-1/2 tablet:right-auto tablet:-translate-x-1/2",
    bottom:
      "tablet:top-full tablet:bottom-auto tablet:pt-1 tablet:pb-0 tablet:pl-0 tablet:pr-0 tablet:translate-y-0 tablet:left-1/2 tablet:right-auto tablet:-translate-x-1/2",
    left: "tablet:left-auto tablet:right-full tablet:pt-0 tablet:pb-0 tablet:pl-0 tablet:pr-1 tablet:translate-x-0 tablet:top-1/2 tablet:bottom-auto tablet:-translate-y-1/2",
    right:
      "tablet:left-full tablet:right-auto tablet:pt-0 tablet:pb-0 tablet:pl-1 tablet:pr-0 tablet:translate-x-0 tablet:top-1/2 tablet:bottom-auto tablet:-translate-y-1/2",
  },
  desktop: {
    top: "desktop:top-auto desktop:bottom-full desktop:pt-0 desktop:pb-1 desktop:pl-0 desktop:pr-0 desktop:translate-y-0 desktop:left-1/2 desktop:right-auto desktop:-translate-x-1/2",
    bottom:
      "desktop:top-full desktop:bottom-auto desktop:pt-1 desktop:pb-0 desktop:pl-0 desktop:pr-0 desktop:translate-y-0 desktop:left-1/2 desktop:right-auto desktop:-translate-x-1/2",
    left: "desktop:left-auto desktop:right-full desktop:pt-0 desktop:pb-0 desktop:pl-0 desktop:pr-1 desktop:translate-x-0 desktop:top-1/2 desktop:bottom-auto desktop:-translate-y-1/2",
    right:
      "desktop:left-full desktop:right-auto desktop:pt-0 desktop:pb-0 desktop:pl-1 desktop:pr-0 desktop:translate-x-0 desktop:top-1/2 desktop:bottom-auto desktop:-translate-y-1/2",
  },
};

const placementEnd: ResponsiveClassTable<TooltipPosition> = {
  base: {
    top: "top-auto bottom-full pt-0 pb-1 pl-0 pr-0 translate-y-0 left-auto right-1/2 translate-x-0",
    bottom:
      "top-full bottom-auto pt-1 pb-0 pl-0 pr-0 translate-y-0 left-auto right-1/2 translate-x-0",
    left: "left-auto right-full pt-0 pb-0 pl-0 pr-1 translate-x-0 top-auto bottom-1/2 translate-y-0",
    right:
      "left-full right-auto pt-0 pb-0 pl-1 pr-0 translate-x-0 top-auto bottom-1/2 translate-y-0",
  },
  tablet: {
    top: "tablet:top-auto tablet:bottom-full tablet:pt-0 tablet:pb-1 tablet:pl-0 tablet:pr-0 tablet:translate-y-0 tablet:left-auto tablet:right-1/2 tablet:translate-x-0",
    bottom:
      "tablet:top-full tablet:bottom-auto tablet:pt-1 tablet:pb-0 tablet:pl-0 tablet:pr-0 tablet:translate-y-0 tablet:left-auto tablet:right-1/2 tablet:translate-x-0",
    left: "tablet:left-auto tablet:right-full tablet:pt-0 tablet:pb-0 tablet:pl-0 tablet:pr-1 tablet:translate-x-0 tablet:top-auto tablet:bottom-1/2 tablet:translate-y-0",
    right:
      "tablet:left-full tablet:right-auto tablet:pt-0 tablet:pb-0 tablet:pl-1 tablet:pr-0 tablet:translate-x-0 tablet:top-auto tablet:bottom-1/2 tablet:translate-y-0",
  },
  desktop: {
    top: "desktop:top-auto desktop:bottom-full desktop:pt-0 desktop:pb-1 desktop:pl-0 desktop:pr-0 desktop:translate-y-0 desktop:left-auto desktop:right-1/2 desktop:translate-x-0",
    bottom:
      "desktop:top-full desktop:bottom-auto desktop:pt-1 desktop:pb-0 desktop:pl-0 desktop:pr-0 desktop:translate-y-0 desktop:left-auto desktop:right-1/2 desktop:translate-x-0",
    left: "desktop:left-auto desktop:right-full desktop:pt-0 desktop:pb-0 desktop:pl-0 desktop:pr-1 desktop:translate-x-0 desktop:top-auto desktop:bottom-1/2 desktop:translate-y-0",
    right:
      "desktop:left-full desktop:right-auto desktop:pt-0 desktop:pb-0 desktop:pl-1 desktop:pr-0 desktop:translate-x-0 desktop:top-auto desktop:bottom-1/2 desktop:translate-y-0",
  },
};

// 말풍선과 화살표의 순서(bottom·right는 화살표가 앞)
const directionClasses: ResponsiveClassTable<TooltipPosition> = {
  base: {
    top: "flex-col",
    bottom: "flex-col-reverse",
    left: "flex-row",
    right: "flex-row-reverse",
  },
  tablet: {
    top: "tablet:flex-col",
    bottom: "tablet:flex-col-reverse",
    left: "tablet:flex-row",
    right: "tablet:flex-row-reverse",
  },
  desktop: {
    top: "desktop:flex-col",
    bottom: "desktop:flex-col-reverse",
    left: "desktop:flex-row",
    right: "desktop:flex-row-reverse",
  },
};

// 화살표가 모서리(start·end)에 붙으면 그 모서리만 각지게 한다. 구간마다 위치가 바뀌므로 네 모서리를 모두 적는다
const cornerStartClasses: ResponsiveClassTable<TooltipPosition> = {
  base: {
    top: "rounded-tl-[var(--mint-tt-r)] rounded-tr-[var(--mint-tt-r)] rounded-br-[var(--mint-tt-r)] rounded-bl-none",
    bottom:
      "rounded-tl-none rounded-tr-[var(--mint-tt-r)] rounded-br-[var(--mint-tt-r)] rounded-bl-[var(--mint-tt-r)]",
    left: "rounded-tl-[var(--mint-tt-r)] rounded-tr-none rounded-br-[var(--mint-tt-r)] rounded-bl-[var(--mint-tt-r)]",
    right:
      "rounded-tl-none rounded-tr-[var(--mint-tt-r)] rounded-br-[var(--mint-tt-r)] rounded-bl-[var(--mint-tt-r)]",
  },
  tablet: {
    top: "tablet:rounded-tl-[var(--mint-tt-r)] tablet:rounded-tr-[var(--mint-tt-r)] tablet:rounded-br-[var(--mint-tt-r)] tablet:rounded-bl-none",
    bottom:
      "tablet:rounded-tl-none tablet:rounded-tr-[var(--mint-tt-r)] tablet:rounded-br-[var(--mint-tt-r)] tablet:rounded-bl-[var(--mint-tt-r)]",
    left: "tablet:rounded-tl-[var(--mint-tt-r)] tablet:rounded-tr-none tablet:rounded-br-[var(--mint-tt-r)] tablet:rounded-bl-[var(--mint-tt-r)]",
    right:
      "tablet:rounded-tl-none tablet:rounded-tr-[var(--mint-tt-r)] tablet:rounded-br-[var(--mint-tt-r)] tablet:rounded-bl-[var(--mint-tt-r)]",
  },
  desktop: {
    top: "desktop:rounded-tl-[var(--mint-tt-r)] desktop:rounded-tr-[var(--mint-tt-r)] desktop:rounded-br-[var(--mint-tt-r)] desktop:rounded-bl-none",
    bottom:
      "desktop:rounded-tl-none desktop:rounded-tr-[var(--mint-tt-r)] desktop:rounded-br-[var(--mint-tt-r)] desktop:rounded-bl-[var(--mint-tt-r)]",
    left: "desktop:rounded-tl-[var(--mint-tt-r)] desktop:rounded-tr-none desktop:rounded-br-[var(--mint-tt-r)] desktop:rounded-bl-[var(--mint-tt-r)]",
    right:
      "desktop:rounded-tl-none desktop:rounded-tr-[var(--mint-tt-r)] desktop:rounded-br-[var(--mint-tt-r)] desktop:rounded-bl-[var(--mint-tt-r)]",
  },
};

const cornerEndClasses: ResponsiveClassTable<TooltipPosition> = {
  base: {
    top: "rounded-tl-[var(--mint-tt-r)] rounded-tr-[var(--mint-tt-r)] rounded-br-none rounded-bl-[var(--mint-tt-r)]",
    bottom:
      "rounded-tl-[var(--mint-tt-r)] rounded-tr-none rounded-br-[var(--mint-tt-r)] rounded-bl-[var(--mint-tt-r)]",
    left: "rounded-tl-[var(--mint-tt-r)] rounded-tr-[var(--mint-tt-r)] rounded-br-none rounded-bl-[var(--mint-tt-r)]",
    right:
      "rounded-tl-[var(--mint-tt-r)] rounded-tr-[var(--mint-tt-r)] rounded-br-[var(--mint-tt-r)] rounded-bl-none",
  },
  tablet: {
    top: "tablet:rounded-tl-[var(--mint-tt-r)] tablet:rounded-tr-[var(--mint-tt-r)] tablet:rounded-br-none tablet:rounded-bl-[var(--mint-tt-r)]",
    bottom:
      "tablet:rounded-tl-[var(--mint-tt-r)] tablet:rounded-tr-none tablet:rounded-br-[var(--mint-tt-r)] tablet:rounded-bl-[var(--mint-tt-r)]",
    left: "tablet:rounded-tl-[var(--mint-tt-r)] tablet:rounded-tr-[var(--mint-tt-r)] tablet:rounded-br-none tablet:rounded-bl-[var(--mint-tt-r)]",
    right:
      "tablet:rounded-tl-[var(--mint-tt-r)] tablet:rounded-tr-[var(--mint-tt-r)] tablet:rounded-br-[var(--mint-tt-r)] tablet:rounded-bl-none",
  },
  desktop: {
    top: "desktop:rounded-tl-[var(--mint-tt-r)] desktop:rounded-tr-[var(--mint-tt-r)] desktop:rounded-br-none desktop:rounded-bl-[var(--mint-tt-r)]",
    bottom:
      "desktop:rounded-tl-[var(--mint-tt-r)] desktop:rounded-tr-none desktop:rounded-br-[var(--mint-tt-r)] desktop:rounded-bl-[var(--mint-tt-r)]",
    left: "desktop:rounded-tl-[var(--mint-tt-r)] desktop:rounded-tr-[var(--mint-tt-r)] desktop:rounded-br-none desktop:rounded-bl-[var(--mint-tt-r)]",
    right:
      "desktop:rounded-tl-[var(--mint-tt-r)] desktop:rounded-tr-[var(--mint-tt-r)] desktop:rounded-br-[var(--mint-tt-r)] desktop:rounded-bl-none",
  },
};

const showTop: ResponsiveClassTable<TooltipPosition> = {
  base: {
    top: "flex",
    bottom: "hidden",
    left: "hidden",
    right: "hidden",
  },
  tablet: {
    top: "tablet:flex",
    bottom: "tablet:hidden",
    left: "tablet:hidden",
    right: "tablet:hidden",
  },
  desktop: {
    top: "desktop:flex",
    bottom: "desktop:hidden",
    left: "desktop:hidden",
    right: "desktop:hidden",
  },
};

const showBottom: ResponsiveClassTable<TooltipPosition> = {
  base: {
    top: "hidden",
    bottom: "flex",
    left: "hidden",
    right: "hidden",
  },
  tablet: {
    top: "tablet:hidden",
    bottom: "tablet:flex",
    left: "tablet:hidden",
    right: "tablet:hidden",
  },
  desktop: {
    top: "desktop:hidden",
    bottom: "desktop:flex",
    left: "desktop:hidden",
    right: "desktop:hidden",
  },
};

const showLeft: ResponsiveClassTable<TooltipPosition> = {
  base: {
    top: "hidden",
    bottom: "hidden",
    left: "flex",
    right: "hidden",
  },
  tablet: {
    top: "tablet:hidden",
    bottom: "tablet:hidden",
    left: "tablet:flex",
    right: "tablet:hidden",
  },
  desktop: {
    top: "desktop:hidden",
    bottom: "desktop:hidden",
    left: "desktop:flex",
    right: "desktop:hidden",
  },
};

const showRight: ResponsiveClassTable<TooltipPosition> = {
  base: {
    top: "hidden",
    bottom: "hidden",
    left: "hidden",
    right: "flex",
  },
  tablet: {
    top: "tablet:hidden",
    bottom: "tablet:hidden",
    left: "tablet:hidden",
    right: "tablet:flex",
  },
  desktop: {
    top: "desktop:hidden",
    bottom: "desktop:hidden",
    left: "desktop:hidden",
    right: "desktop:flex",
  },
};

// 대상 기준 위치. 화살표 끝이 대상의 가운데를 가리키도록 start·end는 대상 가운데(50%)에 말풍선 모서리를 맞춘다.
// 대상과 4px 떨어지는 간격은 margin이 아니라 padding으로 둬서, 말풍선으로 마우스를 옮기는 동안 닫히지 않게 한다.
// 구간마다 위치가 바뀌어도 앞 구간 값이 남지 않게 top·bottom·left·right·translate·padding을 모두 적는다.
const placementClasses: Record<TooltipArrowAlign, ResponsiveClassTable<TooltipPosition>> = {
  start: placementStart,
  center: placementCenter,
  end: placementEnd,
};

const showClasses: Record<TooltipPosition, ResponsiveClassTable<TooltipPosition>> = {
  top: showTop,
  bottom: showBottom,
  left: showLeft,
  right: showRight,
};

// 화살표가 붙는 쪽 정렬: 위·아래면 가로 정렬, 왼쪽·오른쪽이면 세로 정렬
const crossAlign: Record<TooltipArrowAlign, string> = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
};

// 화살표 모양(아래를 가리키는 기준). center는 둥근 삼각형, 모서리(start·end)는 한쪽이 곧은 쐐기
const CENTER_PATH =
  "M0 0C2 0 3.5 0.6 5 2L8.3 5.9C9.1 7.2 10.9 7.2 11.7 5.9L15 2C16.5 0.6 18 0 20 0H0Z";
const CENTER_BOX = [20, 6.875] as const;
const CORNER_PATH = "M0 0V5.28C0 6.16 0.8 6.48 1.36 5.92L6.4 1.2C6.88 0.8 7.36 0.4 8 0H0Z";
const CORNER_BOX = [8, 6.1986] as const;

/**
 * 한 위치(`at`)용 화살표. 네 위치의 화살표를 모두 그려 두고, 구간별 `position`에 맞는 것만 보인다(`show`).
 * 기준 모양은 아래를 가리키고 곧은 면이 왼쪽(start)이다. 위치·정렬에 맞게 SVG 안에서 돌리고 뒤집는다.
 * 크기는 CSS 변수(--mint-tt-*)를 읽어서 `size`의 구간별 값을 따른다.
 */
function Arrow({
  at,
  align,
  show,
}: {
  at: TooltipPosition;
  align: TooltipArrowAlign;
  show: string;
}) {
  const corner = align !== "center";
  const [boxWidth, boxHeight] = corner ? CORNER_BOX : CENTER_BOX;
  const side = at === "left" || at === "right";

  const flipX =
    corner &&
    ((at === "top" && align === "end") ||
      (at === "bottom" && align === "end") ||
      (at === "left" && align === "start") ||
      (at === "right" && align === "end"));
  const transforms: string[] = [];
  // 오른쪽에 붙은 화살표(position left)는 반시계 90°, 왼쪽(position right)은 시계 90°로 돌린다
  if (at === "left") transforms.push(`matrix(0 -1 1 0 0 ${boxWidth})`);
  if (at === "right") transforms.push(`matrix(0 1 -1 0 ${boxHeight} 0)`);
  if (at === "bottom") transforms.push(`translate(0 ${boxHeight}) scale(1 -1)`);
  if (flipX) transforms.push(`translate(${boxWidth} 0) scale(-1 1)`);

  const svgSize = corner
    ? side
      ? "h-[var(--mint-tt-kw)] w-[var(--mint-tt-kh)]"
      : "h-[var(--mint-tt-kh)] w-[var(--mint-tt-kw)]"
    : side
      ? "h-[var(--mint-tt-cw)] w-[var(--mint-tt-ch)]"
      : "h-[var(--mint-tt-ch)] w-[var(--mint-tt-cw)]";

  return (
    <span
      aria-hidden="true"
      className={cn(
        "shrink-0",
        show,
        side ? "w-[var(--mint-tt-t)] flex-col" : "h-[var(--mint-tt-t)] flex-row",
        // 화살표는 말풍선 쪽 가장자리에 붙인다(bottom·right는 말풍선이 뒤에 온다)
        at === "top" || at === "left" ? "items-start" : "items-end",
        // 소수 크기(9.3px 등)에서 말풍선과 화살표 사이에 안티에일리어싱 선이 보이지 않게 1px 겹친다
        at === "top" && "-mt-px",
        at === "bottom" && "-mb-px",
        at === "left" && "-ml-px",
        at === "right" && "-mr-px",
      )}
    >
      <svg
        viewBox={side ? `0 0 ${boxHeight} ${boxWidth}` : `0 0 ${boxWidth} ${boxHeight}`}
        preserveAspectRatio="none"
        className={cn("block shrink-0 overflow-visible", svgSize)}
      >
        <path
          d={corner ? CORNER_PATH : CENTER_PATH}
          fill="currentColor"
          transform={transforms.length ? transforms.join(" ") : undefined}
        />
      </svg>
    </span>
  );
}

export interface TooltipProps extends Omit<ComponentProps<"span">, "children"> {
  /** 말풍선 글자. 이름이나 단축키(`⌘C`)처럼 한 줄로 짧게 쓴다 */
  label: ReactNode;
  /** 대상(버튼 등) 요소 하나. 마우스를 올리거나 포커스하면 말풍선이 열린다 */
  children: ReactElement;
  /** 대상 기준 위치. 기본 `top`. 구간별로 바꾸려면 `{ base: "bottom", desktop: "right" }` */
  position?: Responsive<TooltipPosition>;
  /** 화살표 위치. 위·아래면 왼쪽·가운데·오른쪽, 왼쪽·오른쪽이면 위·가운데·아래. 기본 `center` */
  arrowAlign?: TooltipArrowAlign;
  /** 높이 `sm` 30 · `md` 36 · `lg` 42px. 기본 `md`. 구간별로 바꾸려면 `{ base: "sm", desktop: "md" }` */
  size?: Responsive<TooltipSize>;
  /** 열림 여부를 직접 정할 때(제어). 생략하면 hover·포커스로 열리고 닫힌다 */
  open?: boolean;
  /** 열림이 바뀔 때(hover·포커스·Esc) */
  onOpenChange?: (open: boolean) => void;
}

/**
 * 대상을 감싸서 보조 정보를 말풍선으로 보여 준다.
 * 말풍선은 대상의 `aria-describedby`로 연결되어 스크린리더가 함께 읽는다.
 * 안에 링크·버튼을 넣지 않고, 꼭 읽어야 하는 안내를 Tooltip에만 두지 않는다(터치 화면에서는 hover가 없다).
 */
export function Tooltip({
  label,
  children,
  position,
  arrowAlign = "center",
  size,
  open: openProp,
  onOpenChange,
  className,
  onPointerEnter,
  onPointerLeave,
  onFocus,
  onBlur,
  ...props
}: TooltipProps) {
  const id = useId();
  const [openState, setOpenState] = useState(false);
  const open = openProp ?? openState;

  const setOpen = (next: boolean) => {
    if (openProp === undefined) setOpenState(next);
    onOpenChange?.(next);
  };

  // 열려 있는 동안 Esc로 닫는다(WCAG 1.4.13: 포인터를 옮기지 않고도 닫을 수 있어야 함)
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (openProp === undefined) setOpenState(false);
        onOpenChange?.(false);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, openProp, onOpenChange]);

  const trigger = isValidElement<{ "aria-describedby"?: string }>(children)
    ? cloneElement(children, {
        "aria-describedby": [children.props["aria-describedby"], id].filter(Boolean).join(" "),
      })
    : children;

  const byPosition = (table: ResponsiveClassTable<TooltipPosition>) =>
    responsiveClasses<TooltipPosition>(position, "top", table);

  return (
    <span
      className={cn("relative inline-flex", className)}
      onPointerEnter={(event) => {
        onPointerEnter?.(event);
        if (event.pointerType === "mouse") setOpen(true);
      }}
      onPointerLeave={(event) => {
        onPointerLeave?.(event);
        if (event.pointerType === "mouse") setOpen(false);
      }}
      onFocus={(event) => {
        onFocus?.(event);
        setOpen(true);
      }}
      onBlur={(event) => {
        onBlur?.(event);
        setOpen(false);
      }}
      {...props}
    >
      {trigger}
      <span
        id={id}
        role="tooltip"
        className={cn(
          // 말풍선 색은 Figma가 아토믹 gray-700을 직접 쓴다(시맨틱 면 색에 없음). 화살표도 같은 색(currentColor)
          "absolute z-50 flex w-max text-[color:var(--color-atomic-gray-700)] transition-opacity duration-150",
          responsiveClasses<TooltipSize>(size, "md", sizeClasses),
          byPosition(placementClasses[arrowAlign]),
          byPosition(directionClasses),
          crossAlign[arrowAlign],
          open ? "visible opacity-100" : "pointer-events-none invisible opacity-0",
        )}
      >
        <span
          className={cn(
            // 떠 있는 요소라 그림자는 shadow-floating(토큰)
            "block max-w-[240px] bg-current px-[var(--mint-tt-px)] py-[var(--mint-tt-py)] shadow-floating",
            arrowAlign === "center"
              ? "rounded-[var(--mint-tt-r)]"
              : byPosition(arrowAlign === "start" ? cornerStartClasses : cornerEndClasses),
          )}
        >
          <span className="block text-text-on-fill">{label}</span>
        </span>
        {(["top", "bottom", "left", "right"] as const).map((at) => (
          <Arrow key={at} at={at} align={arrowAlign} show={byPosition(showClasses[at])} />
        ))}
      </span>
    </span>
  );
}
