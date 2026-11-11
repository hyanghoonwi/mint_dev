"use client";

// 글자를 클립보드에 복사하고, 복사했는지(copied)를 잠시 동안 알려 준다. 지갑 주소·거래 ID 복사에 쓴다.
// 복사는 누름 같은 사용자 동작 안에서만 된다(브라우저 규칙). navigator.clipboard가 없는 환경(http 주소 등)에서는
// 숨긴 textarea + execCommand("copy")로 한 번 더 시도한다. 브라우저 API는 copy() 안에서만 쓴다(렌더 중 접근 금지).
import { useCallback, useEffect, useRef, useState } from "react";

export interface UseClipboardOptions {
  /** `copied`가 `true`로 남아 있는 시간(ms). 기본 `2000`. `0`이면 `reset()`을 부를 때까지 남는다 */
  timeout?: number;
  /** 복사에 성공하면 복사한 글자로 불린다 */
  onSuccess?: (text: string) => void;
  /** 복사에 실패하면 오류로 불린다 */
  onError?: (error: Error) => void;
}

export interface UseClipboardResult {
  /** 글자를 복사한다. 성공하면 `true` */
  copy: (text: string) => Promise<boolean>;
  /** 방금 복사했는지. `timeout`이 지나면 `false`로 돌아간다 */
  copied: boolean;
  /** 마지막 복사의 오류. 성공하면 `null` */
  error: Error | null;
  /** `copied`와 `error`를 처음 상태로 되돌린다 */
  reset: () => void;
}

/** execCommand로 복사한다(Clipboard API가 없을 때) */
function copyWithTextarea(text: string) {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  try {
    return document.execCommand("copy");
  } finally {
    document.body.removeChild(textarea);
  }
}

/** 글자를 클립보드에 복사하고 복사 상태를 알려 준다 */
export function useClipboard({
  timeout = 2000,
  onSuccess,
  onError,
}: UseClipboardOptions = {}): UseClipboardResult {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const callbacks = useRef({ onSuccess, onError });
  useEffect(() => {
    callbacks.current = { onSuccess, onError };
  });

  // 화면에서 빠지면 남은 타이머를 지운다
  useEffect(() => () => clearTimeout(timer.current), []);

  const reset = useCallback(() => {
    clearTimeout(timer.current);
    setCopied(false);
    setError(null);
  }, []);

  const copy = useCallback(
    async (text: string) => {
      clearTimeout(timer.current);
      try {
        if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(text);
        } else if (!copyWithTextarea(text)) {
          throw new Error("이 브라우저에서는 복사할 수 없어요");
        }
        setError(null);
        setCopied(true);
        if (timeout > 0) timer.current = setTimeout(() => setCopied(false), timeout);
        callbacks.current.onSuccess?.(text);
        return true;
      } catch (cause) {
        const next = cause instanceof Error ? cause : new Error(String(cause));
        setCopied(false);
        setError(next);
        callbacks.current.onError?.(next);
        return false;
      }
    },
    [timeout],
  );

  return { copy, copied, error, reset };
}
