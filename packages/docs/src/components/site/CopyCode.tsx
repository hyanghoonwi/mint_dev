"use client";

import { useRef, type ReactNode } from "react";
import { CheckIcon, CopyIcon, useClipboard } from "@futurewiz-rms/mint";

/**
 * 화면에 보이는 코드 그대로의 글자. innerText는 줄(블록 요소)마다 줄바꿈을 넣어 준다.
 * 하이라이터가 빈 줄에 넣는 공백은 지운다(붙여 넣었을 때 빈 줄 끝에 공백이 남지 않게)
 */
function codeText(container: HTMLElement | null) {
  const code = container?.querySelector<HTMLElement>("pre code");
  if (!code) return "";
  return code.innerText
    .split("\n")
    .map((line) => (line.trim() === "" ? "" : line))
    .join("\n")
    .trimEnd();
}

/**
 * 코드 블록에 복사 버튼을 붙인다. 안쪽 `pre code`의 글자를 그대로 복사한다.
 * MDX의 코드 블록(```tsx), <Example>의 코드, 플레이그라운드 코드 모두 이 틀로 감싼다.
 * 버튼은 항상 보인다(마우스를 올려야 보이면 터치 화면에서 찾을 수 없다).
 */
export function CopyCode({
  children,
  text,
}: {
  children: ReactNode;
  /** 복사할 글자. 생략하면 안쪽 코드 블록에서 읽는다(코드 문자열이 따로 있으면 넘긴다) */
  text?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { copy, copied } = useClipboard();

  return (
    <div ref={ref} className="docs-copy-code">
      {children}
      <button
        type="button"
        className="docs-copy-code__button"
        aria-label={copied ? "복사했어요" : "코드 복사"}
        data-copied={copied || undefined}
        onClick={() => copy(text ?? codeText(ref.current))}
      >
        {copied ? <CheckIcon size={16} /> : <CopyIcon size={16} />}
        <span className="docs-copy-code__label" aria-hidden="true">
          {copied ? "복사했어요" : "복사"}
        </span>
      </button>
    </div>
  );
}
