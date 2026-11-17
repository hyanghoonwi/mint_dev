"use client";

// 파일 올리기 목록을 관리한다: 고른 파일 목록 · 이미지 미리보기 주소 · 용량·개수·형식 검사 · 업로드 진행률·취소·다시 시도.
// FileUploader·FileItem은 모양만 맡고, 화면마다 똑같은 이 코드는 훅이 맡는다.
//   const upload = useFileUpload({ maxSize, maxFiles, upload: (file, { onProgress, signal }) => api(file) });
//   <FileUploader {...upload.uploaderProps} … />  ·  upload.items.map((item) => <FileItem key={item.id} {...upload.itemProps(item)} />)
// 미리보기 주소(URL.createObjectURL)는 지우거나 화면을 떠날 때 돌려준다(메모리). 브라우저 API는 이벤트·effect 안에서만 쓴다.
import { useCallback, useEffect, useRef, useState } from "react";
import type { FileItemProps, FileItemStatus } from "../components/file-uploader/FileItem";
import type { FileUploaderStatus } from "../components/file-uploader/FileUploader";

/** 목록의 파일 하나 */
export interface FileUploadItem {
  /** 목록 안에서 파일을 구분하는 값(React key로 쓴다) */
  id: string;
  /** 원래 파일. 서버로 보낼 때 쓴다 */
  file: File;
  name: string;
  /** 사람이 읽는 용량("2.4MB") */
  sizeLabel: string;
  /** 이미지 파일의 미리보기 주소. 이미지가 아니거나 올릴 수 없는 파일이면 없다 */
  preview?: string;
  status: FileItemStatus;
  /** 올린 정도(0~100) */
  progress: number;
  /** 실패 이유(`status`가 `negative`일 때) */
  error?: string;
}

/** `upload` 함수가 받는 도우미 */
export interface FileUploadHelpers {
  /** 진행률(0~100)을 알린다. 진행률을 알 수 없는 업로드(fetch)는 부르지 않아도 된다 */
  onProgress: (percent: number) => void;
  /** 사용하는 쪽이 ×(취소)를 누르거나 화면을 떠나면 중단 신호가 온다. fetch·axios에 그대로 넘긴다 */
  signal: AbortSignal;
}

export interface UseFileUploadMessages {
  /** `maxSize`보다 큰 파일. 기본 "10MB보다 큰 파일이에요"(용량은 `maxSize`로) */
  tooLarge?: string;
  /** `maxFiles`를 넘었을 때. 기본 "파일은 5개까지 올릴 수 있어요" */
  tooMany?: string;
  /** `accept`에 맞지 않는 파일을 끌어다 놓았을 때. 기본 "올릴 수 없는 형식이 있어요" */
  rejected?: string;
  /** `upload`가 실패했을 때. 기본 "업로드에 실패했어요" */
  failed?: string;
}

export interface UseFileUploadOptions {
  /** 파일 하나의 최대 용량(byte). 넘으면 목록에 실패(`negative`)로 남기고 이유를 붙인다 */
  maxSize?: number;
  /** 목록에 둘 수 있는 최대 개수. 넘는 파일은 받지 않고 `uploaderProps`에 오류를 넣는다 */
  maxFiles?: number;
  /**
   * 파일을 올리는 함수. 주면 고르자마자 올리고 진행률·취소·다시 시도를 연결한다.
   * 주지 않으면 고른 파일은 바로 완료(첨부됨)로 보이고, 폼을 보낼 때 `items`의 `file`을 직접 보낸다
   */
  upload?: (file: File, helpers: FileUploadHelpers) => Promise<unknown>;
  /** 안내 문구를 바꾼다 */
  messages?: UseFileUploadMessages;
}

export interface UseFileUploadResult {
  /** 목록의 파일들(고른 순서) */
  items: FileUploadItem[];
  /** 올리는 중인 파일이 있는지. 제출 버튼을 막을 때 쓴다 */
  uploading: boolean;
  /** 목록 전체에 대한 오류(개수 초과·형식). 없으면 `null` */
  error: string | null;
  /**
   * `FileUploader`에 펼치는 값(`onFilesSelect`·`onFilesReject`, 오류가 있을 때만 `status`·`helper`).
   * 평소 도움말은 이것보다 앞에 적으면 오류가 있을 때만 오류 문구로 바뀐다
   */
  uploaderProps: {
    onFilesSelect: (files: File[]) => void;
    onFilesReject: (files: File[]) => void;
    status?: FileUploaderStatus;
    helper?: string;
  };
  /** `FileItem`에 펼치는 값(이름·용량·썸네일·상태·진행률·실패 이유·지우기·다시 시도) */
  itemProps: (
    item: FileUploadItem,
  ) => Pick<
    FileItemProps,
    "name" | "fileSize" | "image" | "status" | "progress" | "message" | "onRemove" | "onRetry"
  >;
  /** 파일을 목록에 더한다(직접 부를 때) */
  add: (files: File[]) => void;
  /** 파일을 목록에서 지운다. 올리는 중이면 취소한다 */
  remove: (id: string) => void;
  /** 실패한 파일을 다시 올린다(`upload`가 있을 때) */
  retry: (id: string) => void;
  /** 목록을 비운다 */
  clear: () => void;
}

/** 사람이 읽는 용량: 1MB 이상은 소수 한 자리 MB, 그 아래는 KB */
export function formatFileSize(bytes: number) {
  if (bytes >= 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1).replace(/\.0$/, "")}MB`;
  return `${Math.max(1, Math.round(bytes / 1024))}KB`;
}

/** 고른 파일 목록과 업로드 상태를 관리한다. `FileUploader`·`FileItem`에 펼쳐 쓴다 */
export function useFileUpload({
  maxSize,
  maxFiles,
  upload,
  messages,
}: UseFileUploadOptions = {}): UseFileUploadResult {
  const [items, setItems] = useState<FileUploadItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const itemsRef = useRef(items);
  const counter = useRef(0);
  const controllers = useRef(new Map<string, AbortController>());
  const previews = useRef(new Set<string>());
  const mounted = useRef(true);

  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  // 화면을 떠나면 올리던 것을 멈추고 미리보기 주소를 돌려준다
  useEffect(() => {
    mounted.current = true;
    const activeControllers = controllers.current;
    const activePreviews = previews.current;
    return () => {
      mounted.current = false;
      activeControllers.forEach((controller) => controller.abort());
      activePreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  const text = {
    tooLarge:
      messages?.tooLarge ??
      `${maxSize !== undefined ? formatFileSize(maxSize) : ""}보다 큰 파일이에요`,
    tooMany: messages?.tooMany ?? `파일은 ${maxFiles}개까지 올릴 수 있어요`,
    rejected: messages?.rejected ?? "올릴 수 없는 형식이 있어요",
    failed: messages?.failed ?? "업로드에 실패했어요",
  };

  const update = useCallback((id: string, patch: Partial<FileUploadItem>) => {
    if (!mounted.current) return;
    setItems((previous) => previous.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  }, []);

  const start = (item: FileUploadItem) => {
    if (!upload) return;
    controllers.current.get(item.id)?.abort();
    const controller = new AbortController();
    controllers.current.set(item.id, controller);
    update(item.id, { status: "uploading", progress: 0, error: undefined });
    upload(item.file, {
      signal: controller.signal,
      onProgress: (percent) =>
        update(item.id, { progress: Math.min(99, Math.max(0, Math.round(percent))) }),
    })
      .then(() => update(item.id, { status: "complete", progress: 100 }))
      .catch(() => {
        if (!controller.signal.aborted) update(item.id, { status: "negative", error: text.failed });
      })
      .finally(() => {
        if (controllers.current.get(item.id) === controller) controllers.current.delete(item.id);
      });
  };

  const releasePreview = (preview: string | undefined) => {
    if (!preview) return;
    URL.revokeObjectURL(preview);
    previews.current.delete(preview);
  };

  const add = (files: File[]) => {
    const room =
      maxFiles === undefined ? files.length : Math.max(0, maxFiles - itemsRef.current.length);
    const kept = files.slice(0, room);
    setError(kept.length < files.length ? text.tooMany : null);
    const next = kept.map((file): FileUploadItem => {
      counter.current += 1;
      const tooLarge = maxSize !== undefined && file.size > maxSize;
      // 미리보기는 올릴 수 있는 이미지에만 만든다
      const preview =
        !tooLarge && file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined;
      if (preview) previews.current.add(preview);
      return {
        id: `${counter.current}-${file.name}`,
        file,
        name: file.name,
        sizeLabel: formatFileSize(file.size),
        preview,
        status: tooLarge ? "negative" : upload ? "uploading" : "complete",
        progress: tooLarge ? 0 : upload ? 0 : 100,
        error: tooLarge ? text.tooLarge : undefined,
      };
    });
    itemsRef.current = [...itemsRef.current, ...next];
    setItems(itemsRef.current);
    next.filter((item) => item.status === "uploading").forEach(start);
  };

  const remove = (id: string) => {
    controllers.current.get(id)?.abort();
    controllers.current.delete(id);
    const target = itemsRef.current.find((item) => item.id === id);
    releasePreview(target?.preview);
    itemsRef.current = itemsRef.current.filter((item) => item.id !== id);
    setItems(itemsRef.current);
    setError(null);
  };

  const retry = (id: string) => {
    const target = itemsRef.current.find((item) => item.id === id);
    if (target && upload && target.error !== text.tooLarge) start(target);
  };

  const clear = () => {
    controllers.current.forEach((controller) => controller.abort());
    controllers.current.clear();
    itemsRef.current.forEach((item) => releasePreview(item.preview));
    itemsRef.current = [];
    setItems([]);
    setError(null);
  };

  return {
    items,
    uploading: items.some((item) => item.status === "uploading"),
    error,
    uploaderProps: {
      onFilesSelect: add,
      onFilesReject: () => setError(text.rejected),
      // 오류가 있을 때만 status·helper를 넣는다(사용하는 쪽이 앞에 적은 status·helper를 덮어쓰지 않게)
      ...(error ? { status: "negative" as const, helper: error } : {}),
    },
    itemProps: (item) => ({
      name: item.name,
      fileSize: item.sizeLabel,
      image: item.preview,
      status: item.status,
      progress: item.progress,
      message: item.error,
      onRemove: () => remove(item.id),
      // 용량 초과는 다시 올려도 같으니 다시 시도를 두지 않는다
      onRetry:
        upload && item.status === "negative" && item.error !== text.tooLarge
          ? () => retry(item.id)
          : undefined,
    }),
    add,
    remove,
    retry,
    clear,
  };
}
