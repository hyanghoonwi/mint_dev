"use client";

// FileUploader가 쓰는 파일 입력 도우미. 공개하지 않는 내부 구현이다.
// 화면에 보이지 않는 진짜 <input type="file">을 두고, 버튼·끌어다 놓기로 고른 파일을 그 입력에 넣어 폼 제출(name)도 그대로 되게 한다.
import { useRef, type ChangeEvent } from "react";

/** 도움말 색(Figma: 보통은 tertiary, 오류는 danger). FileUploader가 쓴다 */
export const fileHelperClasses = {
  normal: "text-text-tertiary",
  negative: "text-text-danger",
} as const;

/** `accept`("image/*, .pdf, application/zip")에 맞는 파일인지. 비어 있으면 모두 허용 */
export function matchesAccept(file: File, accept: string | undefined) {
  if (!accept) return true;
  const name = file.name.toLowerCase();
  const type = file.type.toLowerCase();
  return accept
    .split(",")
    .map((token) => token.trim().toLowerCase())
    .filter(Boolean)
    .some((token) => {
      if (token.startsWith(".")) return name.endsWith(token);
      if (token.endsWith("/*")) return type.startsWith(token.slice(0, -1));
      return type === token;
    });
}

export interface FileInputOptions {
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
  onFilesSelect?: (files: File[]) => void;
  onFilesReject?: (files: File[]) => void;
}

/** 숨긴 파일 입력과 열기·고르기·끌어다 놓기 처리 */
export function useFileInput({
  accept,
  multiple = false,
  disabled = false,
  onFilesSelect,
  onFilesReject,
}: FileInputOptions) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const open = () => {
    if (!disabled) inputRef.current?.click();
  };

  // 고른 파일을 형식(accept)으로 나누고, 한 개만 받는 칸이면 첫 파일만 남긴다
  const deliver = (files: File[]) => {
    const accepted = files.filter((file) => matchesAccept(file, accept));
    const rejected = files.filter((file) => !matchesAccept(file, accept));
    const kept = multiple ? accepted : accepted.slice(0, 1);
    if (kept.length > 0) onFilesSelect?.(kept);
    if (rejected.length > 0) onFilesReject?.(rejected);
    return kept;
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    deliver(Array.from(event.target.files ?? []));
  };

  // 끌어다 놓은 파일도 입력에 넣어서 폼으로 제출되게 한다
  const handleDropFiles = (files: File[]) => {
    if (disabled) return;
    const kept = deliver(files);
    const input = inputRef.current;
    if (input && kept.length > 0 && typeof DataTransfer !== "undefined") {
      const transfer = new DataTransfer();
      kept.forEach((file) => transfer.items.add(file));
      input.files = transfer.files;
    }
  };

  return { inputRef, open, handleChange, handleDropFiles };
}
