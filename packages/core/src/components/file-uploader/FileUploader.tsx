"use client";

// 끌어다 놓기 상태·파일 입력을 다뤄서 클라이언트 컴포넌트다.
// Figma `File Uploader`(2433:116406) · `File Uploader Guidelines`(2432:115888)의 Dropzone과 File Upload Button을 한 컴포넌트로 묶었다.
// 모양(`layout`)은 끌어다 놓는 칸(dropzone) · 버튼(button)이고 구간별 값을 받는다(넓은 화면은 칸, 모바일 웹은 버튼).
// 두 모양을 함께 그려 두고 CSS로 구간마다 하나만 보이게 한다(화면 폭을 JS로 읽지 않음). 파일 입력·라벨·도움말은 하나라서 모양이 바뀌어도 상태가 그대로다.
// 올린 파일은 `FileItem`, 목록·업로드 상태는 `useFileUpload`가 맡는다.
// 라벨·도움말·상태·크기는 TextField와 같은 이름을 쓴다(입력 칸 계열). 라벨은 Label 내장이다.
import { useId, useState, type ComponentProps, type DragEvent, type ReactNode } from "react";
import { cn } from "../../utils/cn";
import {
  mapResponsive,
  responsiveClasses,
  type Responsive,
  type ResponsiveClassTable,
} from "../../utils/responsive";
import { fileHelperClasses, useFileInput } from "../_internal/fileInput";
import { Button } from "../button/Button";
import { CloudArrowUpIcon, UploadSimpleIcon } from "../icon/icons.generated";
import { Label } from "../label/Label";

/** 크기: 안쪽 여백 `lg` 32 · `md` 24 · `sm` 16 */
export type FileUploaderSize = "sm" | "md" | "lg";
/** 상태. `negative`는 빨간 점선과 빨간 도움말로 형식·용량 오류를 알린다 */
export type FileUploaderStatus = "normal" | "negative";
/** 모양: `dropzone` 끌어다 놓는 칸(넓은 화면) · `button` 버튼 하나(모바일 웹·좁은 자리) */
export type FileUploaderLayout = "dropzone" | "button";

// 모양별로 구간마다 하나만 보인다(칸은 flex, 버튼 줄은 flex, 나머지는 hidden)
const zoneVisibleClasses: ResponsiveClassTable<FileUploaderLayout> = {
  base: { dropzone: "flex", button: "hidden" },
  tablet: { dropzone: "tablet:flex", button: "tablet:hidden" },
  desktop: { dropzone: "desktop:flex", button: "desktop:hidden" },
};
const buttonVisibleClasses: ResponsiveClassTable<FileUploaderLayout> = {
  base: { dropzone: "hidden", button: "flex" },
  tablet: { dropzone: "tablet:hidden", button: "tablet:flex" },
  desktop: { dropzone: "desktop:hidden", button: "desktop:flex" },
};

// 칸(Zone): 여백·모서리(Figma Large 32·12 · Medium 24·10 · Small 16·8). 10은 반경 토큰에 없어 임의 값이다(TextField와 같음)
const zoneClasses: ResponsiveClassTable<FileUploaderSize> = {
  base: { lg: "p-8 rounded-12", md: "p-6 rounded-[10px]", sm: "p-4 rounded-8" },
  tablet: {
    lg: "tablet:p-8 tablet:rounded-12",
    md: "tablet:p-6 tablet:rounded-[10px]",
    sm: "tablet:p-4 tablet:rounded-8",
  },
  desktop: {
    lg: "desktop:p-8 desktop:rounded-12",
    md: "desktop:p-6 desktop:rounded-[10px]",
    sm: "desktop:p-4 desktop:rounded-8",
  },
};

// 안내 문구(Body 2·3·4 Medium)와 아이콘(24·24·20)
const titleClasses: ResponsiveClassTable<FileUploaderSize> = {
  base: { lg: "text-body-2-medium", md: "text-body-3-medium", sm: "text-body-4-medium" },
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

// 허용 형식 줄(Body 4 · 5 · 5)
const descriptionClasses: ResponsiveClassTable<FileUploaderSize> = {
  base: { lg: "text-body-4-regular", md: "text-body-5-regular", sm: "text-body-5-regular" },
  tablet: {
    lg: "tablet:text-body-4-regular",
    md: "tablet:text-body-5-regular",
    sm: "tablet:text-body-5-regular",
  },
  desktop: {
    lg: "desktop:text-body-4-regular",
    md: "desktop:text-body-5-regular",
    sm: "desktop:text-body-5-regular",
  },
};

const iconClasses: ResponsiveClassTable<FileUploaderSize> = {
  base: { lg: "[&_svg]:size-6", md: "[&_svg]:size-6", sm: "[&_svg]:size-5" },
  tablet: { lg: "tablet:[&_svg]:size-6", md: "tablet:[&_svg]:size-6", sm: "tablet:[&_svg]:size-5" },
  desktop: {
    lg: "desktop:[&_svg]:size-6",
    md: "desktop:[&_svg]:size-6",
    sm: "desktop:[&_svg]:size-5",
  },
};

export interface FileUploaderProps extends Omit<
  ComponentProps<"input">,
  "size" | "type" | "value" | "defaultValue" | "onChange" | "children" | "title"
> {
  /**
   * 크기. 칸은 여백 `lg` 32 · `md` 24(기본) · `sm` 16(글자·아이콘·버튼도 함께), 버튼 모양은 높이 48 · 40 · 32.
   * 구간별로 바꾸려면 객체를 준다: `{ base: "sm", desktop: "lg" }`
   */
  size?: Responsive<FileUploaderSize>;
  /** 입력 이름. `Label` 컴포넌트로 그려진다. 없으면 `aria-label`을 꼭 준다 */
  label?: ReactNode;
  /** 칸 안의 안내 문구. 기본 "파일을 끌어다 놓거나 선택해 주세요" */
  title?: ReactNode;
  /** 칸 안의 허용 형식·최대 용량(예: "JPG / PNG · 최대 10MB"). 미리 알린다 */
  description?: ReactNode;
  /** 칸 아래 도움말. 오류에는 이유와 해결 방법을 적는다 */
  helper?: ReactNode;
  /** 라벨 오른쪽 도움말 아이콘(`Label`의 `helpIcon`) */
  helpIcon?: boolean | ReactNode;
  /** 파일 선택 버튼 글자. 기본 "파일 선택" */
  buttonLabel?: ReactNode;
  /** 상태. `normal`(기본) · `negative` 형식·용량 오류(빨간 점선·도움말) */
  status?: FileUploaderStatus;
  /**
   * 모양. `dropzone` 끌어다 놓는 칸(기본) · `button` 버튼 하나. 모바일 웹은 버튼을 쓰도록
   * 구간별로 준다: `{ base: "button", tablet: "dropzone" }`
   */
  layout?: Responsive<FileUploaderLayout>;
  /** 고르거나 끌어다 놓은 파일. `accept`에 맞는 파일만, `multiple`이 아니면 첫 파일만 넘긴다 */
  onFilesSelect?: (files: File[]) => void;
  /** 끌어다 놓은 파일 중 `accept`에 맞지 않는 파일. 여기서 `status="negative"`와 도움말로 알린다 */
  onFilesReject?: (files: File[]) => void;
}

/**
 * 파일을 끌어다 놓거나 버튼으로 고르는 입력. `layout`으로 칸(Dropzone)과 버튼 모양을 구간마다 고른다. 칸의 빈 곳을 눌러도 파일을 고를 수 있다.
 * 고른 파일은 `onFilesSelect`로 받고, 올린 목록은 `FileItem`으로 보여 준다. `name`을 주면 폼으로 제출된다.
 */
export function FileUploader({
  size = "md",
  label,
  title = "파일을 끌어다 놓거나 선택해 주세요",
  description,
  helper,
  helpIcon,
  buttonLabel = "파일 선택",
  status = "normal",
  disabled = false,
  required,
  accept,
  multiple,
  layout = "dropzone",
  id,
  "aria-describedby": ariaDescribedby,
  onFilesSelect,
  onFilesReject,
  className,
  style,
  ...props
}: FileUploaderProps) {
  const generatedId = useId();
  const inputId = id ?? `${generatedId}-input`;
  const helperId = `${generatedId}-helper`;
  const [dragging, setDragging] = useState(false);
  const { inputRef, open, handleChange, handleDropFiles } = useFileInput({
    accept,
    multiple,
    disabled,
    onFilesSelect,
    onFilesReject,
  });
  const describedBy =
    [helper != null ? helperId : undefined, ariaDescribedby].filter(Boolean).join(" ") || undefined;

  // 파일을 끌어 올리면 파란 점선·옅은 파란 바탕(Figma Pressed). 칸 밖으로 나가면 되돌린다
  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    if (disabled) return;
    event.preventDefault();
    setDragging(true);
  };
  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setDragging(false);
  };
  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(false);
    handleDropFiles(Array.from(event.dataTransfer.files));
  };

  return (
    <div className={cn("flex w-full min-w-0 flex-col gap-2", className)} style={style}>
      {label != null && (
        <Label
          size={mapResponsive(size, (uploaderSize) => (uploaderSize === "sm" ? "sm" : "md"))}
          helpIcon={helpIcon}
          disabled={disabled}
          required={required}
          htmlFor={inputId}
        >
          {label}
        </Label>
      )}
      <div
        data-dragging={dragging || undefined}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        // 칸의 빈 곳을 눌러도 파일을 고른다(버튼은 자기 동작으로 연다)
        onClick={(event) => {
          if (event.target instanceof Element && event.target.closest("button")) return;
          open();
        }}
        className={cn(
          "group/zone w-full flex-col items-center justify-center gap-5 border border-dashed text-center transition-colors",
          responsiveClasses<FileUploaderLayout>(layout, "dropzone", zoneVisibleClasses),
          responsiveClasses<FileUploaderSize>(size, "md", zoneClasses),
          disabled
            ? "cursor-not-allowed border-border-disabled bg-fill-disabled"
            : cn(
                "cursor-pointer hover:border-border-brand hover:bg-fill-brand-weak data-dragging:border-border-brand data-dragging:bg-fill-brand-weak",
                status === "negative"
                  ? "border-fill-danger bg-background-default"
                  : "border-border-strong bg-background-default",
              ),
        )}
      >
        <div className="flex flex-col items-center gap-5">
          <span
            className={cn(
              "flex items-center justify-center",
              responsiveClasses<FileUploaderSize>(size, "md", iconClasses),
              disabled
                ? "text-icon-disabled"
                : "text-icon-secondary group-hover/zone:text-icon-brand group-data-dragging/zone:text-icon-brand",
            )}
          >
            <CloudArrowUpIcon />
          </span>
          <div className="flex flex-col items-center gap-1">
            <span
              className={cn(
                responsiveClasses<FileUploaderSize>(size, "md", titleClasses),
                disabled
                  ? "text-text-disabled"
                  : "text-text-primary group-hover/zone:text-text-brand group-data-dragging/zone:text-text-brand",
              )}
            >
              {title}
            </span>
            {description != null && (
              <span
                className={cn(
                  responsiveClasses<FileUploaderSize>(size, "md", descriptionClasses),
                  disabled ? "text-text-disabled" : "text-text-tertiary",
                )}
              >
                {description}
              </span>
            )}
          </div>
        </div>
        <Button
          type="button"
          variant="outline"
          color="neutral"
          size={mapResponsive(size, (uploaderSize) => (uploaderSize === "sm" ? "sm" : "md"))}
          disabled={disabled}
          aria-describedby={describedBy}
          onClick={open}
        >
          {buttonLabel}
        </Button>
      </div>
      {/* 버튼 모양(layout="button"): 모바일 웹·좁은 자리. 버튼 높이는 size(32·40·48)를 따른다 */}
      <div
        className={responsiveClasses<FileUploaderLayout>(layout, "dropzone", buttonVisibleClasses)}
      >
        <Button
          type="button"
          variant="outline"
          color="neutral"
          size={size}
          leftAddon={<UploadSimpleIcon />}
          disabled={disabled}
          aria-describedby={describedBy}
          onClick={open}
        >
          {buttonLabel}
        </Button>
      </div>
      {helper != null && (
        <p
          id={helperId}
          className={cn(
            "text-body-5-regular",
            disabled ? "text-text-disabled" : fileHelperClasses[status],
          )}
        >
          {helper}
        </p>
      )}
      {/* 진짜 파일 입력은 보이지 않게 두고 폼 제출·필수 검사에 쓴다 */}
      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        required={required}
        tabIndex={-1}
        aria-invalid={status === "negative" || undefined}
        aria-describedby={describedBy}
        onChange={handleChange}
        className="sr-only"
        {...props}
      />
    </div>
  );
}
