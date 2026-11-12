"use client";

// FDS ToastProvider와 같은 구조다(useToast로 띄우고, 정해진 시간 뒤 사라지고, hover·포커스 동안 멈춘다).
// 목록은 브라우저에서 띄울 때만 생기므로 서버 렌더 결과에는 영향이 없다.
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { cn } from "../../utils/cn";
import { Toast } from "./Toast";
import type { ToastShape, ToastVariant } from "./Toast";
import { ToastContext } from "./toast-context";
import type { ToastApi, ToastOptions, ToastShortcutOptions } from "./toast-context";

export type ToastPosition = "top" | "bottom";

export interface ToastProviderProps {
  children: ReactNode;
  /** 토스트가 뜨는 위치(가로 가운데). 기본 `bottom`. 새 토스트가 화면 가장자리 쪽에 붙는다 */
  position?: ToastPosition;
  /** 화면 가장자리에서 띄우는 거리(px). 하단 고정 버튼·탭 바를 가리지 않게 늘린다. 기본 20 */
  offset?: number;
  /** 동시에 보이는 최대 개수. 넘치면 가장 오래된 것부터 사라진다. 기본 3 */
  limit?: number;
  /** 토스트가 사라지기까지의 기본 시간(ms). Figma 가이드 2~4초. 기본 3000 */
  duration?: number;
  /** 기본 모양. 기본 `default` */
  shape?: ToastShape;
}

interface Entry {
  message: ReactNode;
  options: ToastOptions;
  id: string;
  /** 같은 id로 내용이 바뀔 때마다 올라간다. 올라가면 시간을 처음부터 다시 잰다 */
  revision: number;
  closing: boolean;
}

// 사라지는 전환 시간(ms, duration-200과 같다). 모션 줄이기 설정에서는 움직임 없이 같은 시간 뒤에 뺀다
const EXIT_MS = 200;
let nextToastNumber = 0;

function Item({
  entry,
  closing,
  position,
  duration,
  defaultShape,
  onDismiss,
  onRemove,
}: {
  entry: Entry;
  closing: boolean;
  position: ToastPosition;
  duration: number | null;
  defaultShape: ToastShape;
  onDismiss: (id: string) => void;
  onRemove: (id: string) => void;
}) {
  const { id, revision } = entry;

  // 마우스를 올리거나 포커스가 있는 동안 시간이 멈추고, 벗어나면 남은 시간만 다시 잰다
  const [paused, setPaused] = useState(false);
  const remaining = useRef<number | null>(duration);
  useEffect(() => {
    remaining.current = duration;
  }, [revision, duration]);
  useEffect(() => {
    if (closing || paused || remaining.current === null) return;
    const startedAt = Date.now();
    const timer = setTimeout(() => onDismiss(id), remaining.current);
    return () => {
      clearTimeout(timer);
      if (remaining.current !== null) {
        remaining.current = Math.max(remaining.current - (Date.now() - startedAt), 0);
      }
    };
  }, [id, revision, closing, paused, onDismiss]);

  // 숨긴 첫 상태가 한 번 그려진 뒤에 보이게 해야 나타나는 전환이 일어난다.
  // 클릭으로 띄우면 effect가 그리기 전에 돌 수 있어서 프레임을 두 번 기다린다
  const [shown, setShown] = useState(false);
  useEffect(() => {
    let second = 0;
    const first = requestAnimationFrame(() => {
      second = requestAnimationFrame(() => setShown(true));
    });
    return () => {
      cancelAnimationFrame(first);
      cancelAnimationFrame(second);
    };
  }, []);

  // 닫히면 사라지는 전환이 끝난 뒤 목록에서 뺀다
  useEffect(() => {
    if (!closing) return;
    const timer = setTimeout(() => onRemove(id), EXIT_MS);
    return () => clearTimeout(timer);
  }, [id, closing, onRemove]);

  const visible = shown && !closing;
  const variant: ToastVariant = entry.options.variant ?? "normal";
  // 오류는 바로 읽히도록 alert, 나머지는 하던 일을 끊지 않는 status
  const role = variant === "negative" ? "alert" : "status";

  return (
    // 칸 높이를 0 ↔ 제 높이로 전환해서(grid-rows 0fr ↔ 1fr), 들어오고 나갈 때 다른 토스트가 부드럽게 밀려난다.
    // 토스트 사이 간격도 칸 안의 여백이라 함께 줄고 는다(바깥 gap을 쓰면 간격만 툭 생기고 사라진다)
    <div
      className={cn(
        "grid w-full justify-items-center",
        "transition-[grid-template-rows,opacity] motion-reduce:transition-none",
        visible
          ? "grid-rows-[1fr] opacity-100 duration-300 ease-[cubic-bezier(0.2,0,0,1)]"
          : // 사라질 때는 글자가 먼저 빠르게 투명해지고(120ms) 칸은 200ms 동안 접힌다. 접히는 동안 옆 토스트와 겹쳐 보이지 않게 한다
            "grid-rows-[0fr] opacity-0 [transition-duration:200ms,120ms] [transition-timing-function:cubic-bezier(0.4,0,1,1),linear]",
      )}
    >
      {/* 칸이 0일 때 내용은 넘쳐 보이지만 투명해서 안 보인다(overflow를 자르면 그림자가 잘린다).
          넘치는 쪽이 다른 토스트와 겹치지 않게 붙이는 끝을 고른다:
          들어올 때(가장자리 쪽 새 토스트)는 화면 가장자리 쪽으로, 나갈 때(대개 가장 오래된 것)는 그 반대쪽으로 넘친다.
          칸이 다 펼쳐진 상태에서 바꾸므로 위치가 튀지 않는다 */}
      <div
        className={cn(
          "min-h-0",
          position === "bottom" ? "pt-2" : "pb-2",
          (position === "bottom") === !closing ? "self-start" : "self-end",
        )}
      >
        <div
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
          className={cn(
            "w-max max-w-[calc(100vw-40px)]",
            "transition-[translate,scale] motion-reduce:transition-none",
            // 나타나는 중에도 바로 누를 수 있게 하고, 사라지는 중에만 막는다
            closing ? "pointer-events-none" : "pointer-events-auto",
            visible
              ? "translate-y-0 scale-100 duration-300 ease-[cubic-bezier(0.2,0,0,1)]"
              : cn(
                  "scale-95 duration-200 ease-[cubic-bezier(0.4,0,1,1)]",
                  // 화면 가장자리 쪽에서 올라오고(내려오고), 같은 쪽으로 사라진다
                  position === "bottom" ? "translate-y-4" : "-translate-y-4",
                ),
          )}
        >
          <Toast
            role={role}
            variant={variant}
            shape={entry.options.shape ?? defaultShape}
            className="min-w-[min(300px,calc(100vw-40px))]"
          >
            {entry.message}
          </Toast>
        </div>
      </div>
    </div>
  );
}

/**
 * 앱 최상단에 한 번 두면 어디서든 `useToast()`로 토스트를 띄울 수 있다.
 * 화면 가운데 위(`top`)나 아래(`bottom`)에 쌓이고, 정해진 시간이 지나면 사라진다.
 * 새 토스트가 화면 가장자리 쪽에 붙고, `limit`을 넘으면 가장 오래된 것부터 사라진다.
 */
export function ToastProvider({
  children,
  position = "bottom",
  offset = 20,
  limit = 3,
  duration = 3000,
  shape = "default",
}: ToastProviderProps) {
  const [entries, setEntries] = useState<Entry[]>([]);

  const { api, remove } = useMemo(() => {
    const closeCallbacks = new Map<string, (() => void) | undefined>();

    const removeEntry = (id: string) => {
      setEntries((prev) => prev.filter((entry) => entry.id !== id));
      const callback = closeCallbacks.get(id);
      closeCallbacks.delete(id);
      callback?.();
    };

    const show = (message: ReactNode, options: ToastOptions = {}): string => {
      const key = options.id ?? `mint-toast-${++nextToastNumber}`;
      closeCallbacks.set(key, options.onClose);
      setEntries((prev) => {
        const existing = prev.find((entry) => entry.id === key);
        const next: Entry = {
          message,
          options: { ...options, id: key },
          id: key,
          revision: (existing?.revision ?? 0) + 1,
          closing: false,
        };
        return existing ? prev.map((entry) => (entry.id === key ? next : entry)) : [...prev, next];
      });
      return key;
    };

    const dismiss = (id?: string) => {
      setEntries((prev) =>
        prev.map((entry) =>
          (id === undefined || entry.id === id) && !entry.closing
            ? { ...entry, closing: true }
            : entry,
        ),
      );
    };

    const shortcut =
      (variant: ToastVariant) => (message: ReactNode, options?: ToastShortcutOptions) =>
        show(message, { ...options, variant });

    const toast: ToastApi = Object.assign(show, {
      normal: shortcut("normal"),
      positive: shortcut("positive"),
      cautionary: shortcut("cautionary"),
      negative: shortcut("negative"),
      dismiss,
    });
    return { api: toast, remove: removeEntry };
  }, []);

  const dismiss = useCallback((id: string) => api.dismiss(id), [api]);

  // 개수 제한: 닫는 중이 아닌 것 중 가장 오래된 것부터 넘치는 만큼 사라진다
  const active = entries.filter((entry) => !entry.closing);
  const evicted = new Set(
    active.slice(0, Math.max(active.length - Math.max(limit, 1), 0)).map((e) => e.id),
  );

  return (
    <ToastContext value={api}>
      {children}
      {entries.length > 0 && (
        <div
          role="region"
          aria-label="알림"
          className={cn(
            // 토스트 사이 간격은 각 칸의 여백(pt-2·pb-2)이다. 화면 가장자리 쪽에는 여백이 없다
            "pointer-events-none fixed inset-x-0 z-[1200] flex items-center px-5 font-mint",
            // 새 토스트(목록 끝)가 화면 가장자리 쪽에 오도록: 아래면 위→아래, 위면 아래→위로 쌓는다
            position === "bottom" ? "flex-col" : "flex-col-reverse",
          )}
          style={
            position === "bottom"
              ? { bottom: `calc(${offset}px + env(safe-area-inset-bottom))` }
              : { top: `calc(${offset}px + env(safe-area-inset-top))` }
          }
        >
          {entries.map((entry) => {
            const own = entry.options.duration;
            return (
              <Item
                // id만 key로 쓴다. 같은 id로 다시 띄우면 다시 마운트하지 않고 내용·시간만 바뀐다(깜빡임 없음)
                key={entry.id}
                entry={entry}
                closing={entry.closing || evicted.has(entry.id)}
                position={position}
                duration={own === undefined ? duration : own}
                defaultShape={shape}
                onDismiss={dismiss}
                onRemove={remove}
              />
            );
          })}
        </div>
      )}
    </ToastContext>
  );
}
