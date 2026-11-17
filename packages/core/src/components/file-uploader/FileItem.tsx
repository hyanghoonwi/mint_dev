// 상태를 갖지 않아서 "use client"를 붙이지 않는다. 서버 컴포넌트에서도 쓸 수 있다(삭제·다시 시도 버튼을 쓰면 클라이언트 컴포넌트 안에서).
// Figma `File Uploader`(2433:116406)의 File Item. 올린(올리는) 파일 한 줄이다.
// 상태: 대기(waiting) · 올리는 중(uploading, 진행 막대와 %) · 완료(complete, 체크) · 실패(negative, 빨간 글자와 다시 시도).
import type { ComponentProps } from "react";
import { cn } from "../../utils/cn";
import {
  mapResponsive,
  responsiveClasses,
  type Responsive,
  type ResponsiveClassTable,
} from "../../utils/responsive";
import { CheckCircleIcon, FileTextIcon, TrashIcon, XIcon } from "../icon/icons.generated";
import { IconButton } from "../icon-button/IconButton";
import { TextButton } from "../text-button/TextButton";

/** 크기: `lg` 여백 16 · 앞 상자 48 / `md` 12 · 40 / `sm` 8·12 · 32 */
export type FileItemSize = "sm" | "md" | "lg";
/** 상태: 대기 · 올리는 중 · 완료 · 실패 */
export type FileItemStatus = "waiting" | "uploading" | "complete" | "negative";

const containerClasses: ResponsiveClassTable<FileItemSize> = {
  base: { lg: "gap-4 p-4 rounded-12", md: "gap-3 p-3 rounded-12", sm: "gap-2 px-3 py-2 rounded-8" },
  tablet: {
    lg: "tablet:gap-4 tablet:p-4 tablet:rounded-12",
    md: "tablet:gap-3 tablet:p-3 tablet:rounded-12",
    sm: "tablet:gap-2 tablet:px-3 tablet:py-2 tablet:rounded-8",
  },
  desktop: {
    lg: "desktop:gap-4 desktop:p-4 desktop:rounded-12",
    md: "desktop:gap-3 desktop:p-3 desktop:rounded-12",
    sm: "desktop:gap-2 desktop:px-3 desktop:py-2 desktop:rounded-8",
  },
};

// 앞 상자(파일 아이콘·썸네일) 48·40·32, 아이콘 24·20·16
const leadingClasses: ResponsiveClassTable<FileItemSize> = {
  base: { lg: "size-12 [&_svg]:size-6", md: "size-10 [&_svg]:size-5", sm: "size-8 [&_svg]:size-4" },
  tablet: {
    lg: "tablet:size-12 tablet:[&_svg]:size-6",
    md: "tablet:size-10 tablet:[&_svg]:size-5",
    sm: "tablet:size-8 tablet:[&_svg]:size-4",
  },
  desktop: {
    lg: "desktop:size-12 desktop:[&_svg]:size-6",
    md: "desktop:size-10 desktop:[&_svg]:size-5",
    sm: "desktop:size-8 desktop:[&_svg]:size-4",
  },
};

// 파일 이름 Body 2 · 3 · 4 Medium
const nameClasses: ResponsiveClassTable<FileItemSize> = {
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

// 정보 줄 Body 4 · 5 · 5(확장자는 Medium, 나머지는 Regular)
const metaClasses: ResponsiveClassTable<FileItemSize> = {
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
const extensionClasses: ResponsiveClassTable<FileItemSize> = {
  base: { lg: "text-body-4-medium", md: "text-body-5-medium", sm: "text-body-5-medium" },
  tablet: {
    lg: "tablet:text-body-4-medium",
    md: "tablet:text-body-5-medium",
    sm: "tablet:text-body-5-medium",
  },
  desktop: {
    lg: "desktop:text-body-4-medium",
    md: "desktop:text-body-5-medium",
    sm: "desktop:text-body-5-medium",
  },
};

export interface FileItemProps extends Omit<ComponentProps<"div">, "children"> {
  /**
   * 크기. `lg` · `md`(기본) · `sm`. 여백·앞 상자·글자·버튼이 함께 바뀐다.
   * 구간별로 바꾸려면 객체를 준다: `{ base: "sm", desktop: "md" }`
   */
  size?: Responsive<FileItemSize>;
  /** 파일 이름(확장자 포함). 길면 한 줄에서 말줄임하고, 확장자는 정보 줄 앞에 대문자로 보인다 */
  name: string;
  /** 파일 용량(예: "2.4MB") */
  fileSize?: string;
  /** 이미지 파일의 썸네일 주소. 주면 파일 아이콘 대신 40×40 썸네일이 보인다 */
  image?: string;
  /** 상태. `waiting` 대기 · `uploading` 올리는 중 · `complete` 완료(기본) · `negative` 실패 */
  status?: FileItemStatus;
  /** 올린 정도(0~100). `uploading`일 때 진행 막대와 %로 보인다 */
  progress?: number;
  /** 실패 이유. `negative`일 때 빨간 글자로 보인다. 기본 "업로드에 실패했어요" */
  message?: string;
  /** 누를 수 없는 상태(회색 바탕·흐린 글자·버튼 비활성) */
  disabled?: boolean;
  /** 지우기·취소 버튼을 눌렀을 때. 대기·올리는 중은 ×(취소), 완료·실패는 휴지통(삭제) 아이콘이다 */
  onRemove?: () => void;
  /** 다시 시도 버튼을 눌렀을 때. `negative`일 때만 보인다 */
  onRetry?: () => void;
}

/** 확장자(대문자). 없으면 빈 글자 */
function extensionOf(name: string) {
  const dot = name.lastIndexOf(".");
  return dot > 0 ? name.slice(dot + 1).toUpperCase() : "";
}

/** 올린(올리는) 파일 한 줄. 이름·확장자·용량과 상태(대기·진행률·완료·실패)를 보여 주고, 지우기·다시 시도를 둔다 */
export function FileItem({
  size = "md",
  name,
  fileSize,
  image,
  status = "complete",
  progress = 0,
  message = "업로드에 실패했어요",
  disabled = false,
  onRemove,
  onRetry,
  className,
  ...props
}: FileItemProps) {
  const extension = extensionOf(name);
  const percent = Math.min(100, Math.max(0, Math.round(progress)));
  const negative = status === "negative";
  const detail = negative
    ? message
    : [fileSize, status === "uploading" && `${percent}%`, status === "waiting" && "대기 중"]
        .filter(Boolean)
        .join(" · ");
  const cancelable = status === "waiting" || status === "uploading";
  const buttonSize = mapResponsive(size, (itemSize) =>
    itemSize === "lg" ? "md" : itemSize === "md" ? "sm" : "xs",
  );

  return (
    <div
      className={cn(
        "flex w-full min-w-0 items-center border",
        responsiveClasses<FileItemSize>(size, "md", containerClasses),
        disabled
          ? "border-border-disabled bg-fill-disabled"
          : "border-border-default bg-background-default",
        className,
      )}
      {...props}
    >
      <span
        className={cn(
          "relative flex shrink-0 items-center justify-center overflow-hidden rounded-8 bg-fill-alpha-50",
          responsiveClasses<FileItemSize>(size, "md", leadingClasses),
          disabled ? "text-icon-disabled" : "text-icon-secondary",
        )}
      >
        <FileTextIcon />
        {image && <img src={image} alt="" className="absolute inset-0 size-full object-cover" />}
      </span>

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <span
          className={cn(
            "truncate",
            responsiveClasses<FileItemSize>(size, "md", nameClasses),
            disabled ? "text-text-disabled" : "text-text-primary",
          )}
        >
          {name}
        </span>
        <span
          className={cn(
            "flex min-w-0 items-center gap-1",
            disabled ? "text-text-disabled" : negative ? "text-text-danger" : "text-text-tertiary",
          )}
        >
          {extension && (
            <span
              className={cn(
                "shrink-0",
                responsiveClasses<FileItemSize>(size, "md", extensionClasses),
              )}
            >
              {extension} ·
            </span>
          )}
          <span
            className={cn("truncate", responsiveClasses<FileItemSize>(size, "md", metaClasses))}
          >
            {detail}
          </span>
          {status === "complete" && (
            <CheckCircleIcon
              size={16}
              aria-label="완료"
              className={cn("shrink-0", disabled ? "text-icon-disabled" : "text-icon-success")}
            />
          )}
        </span>
        {status === "uploading" && (
          <span
            role="progressbar"
            aria-label={`${name} 올리는 중`}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={percent}
            className="h-1.5 w-full overflow-hidden rounded-full bg-fill-neutral-weak"
          >
            <span
              className={cn(
                "block h-full rounded-full transition-[width]",
                disabled ? "bg-icon-disabled" : "bg-fill-brand",
              )}
              style={{ width: `${percent}%` }}
            />
          </span>
        )}
      </div>

      {(onRetry || onRemove) && (
        <div className="flex shrink-0 items-center gap-1">
          {negative && onRetry && (
            <TextButton size="sm" disabled={disabled} onClick={onRetry}>
              다시 시도
            </TextButton>
          )}
          {onRemove && (
            <IconButton
              size={buttonSize}
              icon={cancelable ? <XIcon /> : <TrashIcon />}
              aria-label={`${name} ${cancelable ? "올리기 취소" : "삭제"}`}
              disabled={disabled}
              onClick={onRemove}
            />
          )}
        </div>
      )}
    </div>
  );
}
