"use client";

// 열림 상태·위치 계산·바깥 누르기·Esc를 다뤄서 클라이언트 컴포넌트다.
// 디자인 문서(Figma)에는 없고 개발상 편의를 위해 제작한 컴포넌트다(2026-11). 상자는 Box(`elevation="floating"` · 모서리 12 · 여백 16)로 만든다. Select 목록과 같은 떠 있는 모양이다.
// 기준 요소(트리거) 아래에 붙는 화면을 막지 않는 상자다. 화면을 막는 대화 상자는 Modal(`useOverlay`)이다.
// 브라우저 Popover API(`popover="manual"`, top layer)로 띄운다. DOM 위치는 그대로라 테마 토큰(data-theme)을 그대로 받고,
// 부모의 overflow(Table·Modal 본문·스크롤 영역)에 잘리지 않는다. 위치는 기준 요소를 재서 fixed 좌표로 둔다(아래 공간이 모자라면 위로).
import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type ComponentProps,
  type CSSProperties,
  type MouseEvent,
  type ReactNode,
  type RefObject,
} from "react";
import { cn } from "../../utils/cn";
import { useControllableState } from "../_internal/useControllableState";
import { Box, type BoxPadding } from "../box/Box";

/** 기준 요소 기준 위치. `start`는 왼쪽 끝, `end`는 오른쪽 끝을 맞춘다. 아래 공간이 모자라면 위로 뒤집힌다 */
export type PopoverPlacement = "bottom-start" | "bottom-end";

/** `trigger` 함수가 받는 속성. 트리거 요소(버튼·입력)에 그대로 넘긴다 */
export interface PopoverTriggerProps {
  "aria-controls": string;
  "aria-expanded": boolean;
  "aria-haspopup": "dialog";
  onClick: (event: MouseEvent<HTMLElement>) => void;
}

export interface PopoverProps extends Omit<ComponentProps<"div">, "children" | "role"> {
  /** 상자 안 내용 */
  children: ReactNode;
  /** 트리거를 그리는 함수. 받은 속성(`onClick`·`aria-expanded` 등)을 버튼이나 입력에 넘긴다 */
  trigger: (props: PopoverTriggerProps) => ReactNode;
  /** 열림(제어). 주지 않으면 안에서 들고 있다 */
  open?: boolean;
  /** 처음 열림(비제어). 기본 `false` */
  defaultOpen?: boolean;
  /** 상자 폭을 기준 요소 폭과 같게 한다(입력 칸 아래 목록 등). 기본 `false` */
  matchWidth?: boolean;
  /** 기준 요소 기준 위치. 기본 `bottom-start` */
  placement?: PopoverPlacement;
  /** 상자 안쪽 여백 0 · 8 · 16 · 20 · 24px(Box `padding`). 목록(Menu)을 넣을 때는 `0`. 기본 `16` */
  padding?: BoxPadding;
  /** 열릴 때 상자 안 첫 포커스 요소(또는 `initialFocus` 선택자)로 포커스를 옮긴다. 마우스로 여는 입력 칸은 `false`. 기본 `true` */
  autoFocus?: boolean;
  /** 열릴 때 포커스를 줄 요소의 CSS 선택자(상자 안에서 찾는다). 없으면 첫 포커스 요소 */
  initialFocus?: string;
  /** 위치를 맞출 요소. 생략하면 트리거를 감싼 요소. 입력 칸처럼 라벨·도움말이 함께 있는 트리거는 칸 자체를 준다 */
  anchorRef?: RefObject<HTMLElement | null>;
  /** 열림이 바뀔 때(트리거 누르기·바깥 누르기·Esc·포커스가 밖으로 나감) */
  onOpenChange?: (open: boolean) => void;
}

const GAP = 4;
const VIEWPORT_MARGIN = 8;
const FOCUSABLE =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/** 기준 요소 아래(공간이 모자라면 위)에 놓을 fixed 좌표를 계산한다 */
function computePosition(
  anchor: HTMLElement,
  box: HTMLElement,
  placement: PopoverPlacement,
  matchWidth: boolean,
): CSSProperties {
  const rect = anchor.getBoundingClientRect();
  const width = matchWidth ? rect.width : box.offsetWidth;
  const height = box.offsetHeight;
  const below = window.innerHeight - rect.bottom - GAP;
  const above = rect.top - GAP;
  const top =
    below < height && above > below
      ? Math.max(VIEWPORT_MARGIN, rect.top - GAP - height)
      : rect.bottom + GAP;
  const preferred = placement === "bottom-end" ? rect.right - width : rect.left;
  const left = Math.min(
    Math.max(VIEWPORT_MARGIN, preferred),
    window.innerWidth - width - VIEWPORT_MARGIN,
  );
  return { top, left, ...(matchWidth && { width: rect.width }) };
}

/**
 * 기준 요소(트리거) 아래에 붙어 뜨는 상자. 날짜 고르기·목록·필터 패널처럼 입력을 돕는 내용을 띄운다.
 * 바깥을 누르거나 Esc를 누르면 닫히고, Esc로 닫으면 포커스가 트리거로 돌아간다.
 * 자주 쓰는 조합은 완성 컴포넌트(`DatePicker`)를 먼저 쓴다.
 */
export function Popover({
  children,
  trigger,
  open: openProp,
  defaultOpen = false,
  matchWidth = false,
  placement = "bottom-start",
  padding = 16,
  autoFocus = true,
  initialFocus,
  anchorRef,
  onOpenChange,
  className,
  style,
  ...props
}: PopoverProps) {
  const id = useId();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const [position, setPosition] = useState<CSSProperties>({ top: 0, left: 0 });
  const [open, setOpen] = useControllableState(openProp, defaultOpen, onOpenChange);

  const anchor = useCallback(() => anchorRef?.current ?? wrapperRef.current, [anchorRef]);

  const close = useCallback(
    (restoreFocus: boolean) => {
      setOpen(false);
      if (restoreFocus) returnFocusRef.current?.focus();
    },
    [setOpen],
  );

  // 열리면 top layer에 올리고 위치를 잡는다. 스크롤·창 크기·내용 크기가 바뀌면 다시 잰다
  useLayoutEffect(() => {
    const box = boxRef.current;
    const target = anchor();
    if (!open || !box || !target) return;
    if (typeof box.showPopover === "function" && !box.matches(":popover-open")) box.showPopover();
    const update = () => setPosition(computePosition(target, box, placement, matchWidth));
    update();
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    const observer = new ResizeObserver(update);
    observer.observe(box);
    observer.observe(target);
    return () => {
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
      observer.disconnect();
      if (typeof box.hidePopover === "function" && box.matches(":popover-open")) box.hidePopover();
    };
  }, [open, anchor, placement, matchWidth]);

  // 열릴 때 포커스를 상자 안으로 옮긴다(키보드로 열었을 때). 닫히면 돌아갈 곳을 기억해 둔다
  useEffect(() => {
    if (!open) return;
    returnFocusRef.current ??= document.activeElement as HTMLElement | null;
    if (!autoFocus) return;
    const box = boxRef.current;
    const target =
      (initialFocus && box?.querySelector<HTMLElement>(initialFocus)) ||
      box?.querySelector<HTMLElement>(FOCUSABLE);
    target?.focus();
  }, [open, autoFocus, initialFocus]);

  useEffect(() => {
    if (!open) returnFocusRef.current = null;
  }, [open]);

  // 바깥 누르기·Esc로 닫는다. 트리거를 누르는 것은 트리거의 onClick이 처리한다
  useEffect(() => {
    if (!open) return;
    const inside = (node: EventTarget | null) =>
      node instanceof Node &&
      (boxRef.current?.contains(node) ||
        wrapperRef.current?.contains(node) ||
        anchor()?.contains(node));
    const handlePointerDown = (event: PointerEvent) => {
      if (!inside(event.target)) close(false);
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close(true);
      }
    };
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, close, anchor]);

  return (
    <div ref={wrapperRef} className="relative">
      {trigger({
        onClick: () => setOpen(!open),
        "aria-expanded": open,
        "aria-controls": id,
        "aria-haspopup": "dialog",
      })}
      {open && (
        <Box
          ref={boxRef}
          id={id}
          role="dialog"
          popover="manual"
          // 상자는 Box: 떠 있는 바탕·그림자(floating) · 모서리 12. 자식은 원래 폭대로 위아래로 쌓는다(align="start")
          elevation="floating"
          radius={12}
          padding={padding}
          align="start"
          // 포커스가 상자와 트리거 밖으로 나가면(Tab) 닫는다
          onBlur={(event) => {
            const next = event.relatedTarget;
            if (
              next instanceof Node &&
              !boxRef.current?.contains(next) &&
              !wrapperRef.current?.contains(next)
            ) {
              close(false);
            }
          }}
          style={{ ...position, ...style }}
          className={cn(
            // 브라우저 popover 기본 모양(가운데 정렬·테두리·여백)을 지우고 fixed 좌표로 둔다
            "fixed m-0 overflow-visible border-0 text-text-primary [inset:unset]",
            className,
          )}
          {...props}
        >
          {children}
        </Box>
      )}
    </div>
  );
}
