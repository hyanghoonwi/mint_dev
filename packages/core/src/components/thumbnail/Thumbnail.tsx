// 상태·이벤트가 없어서 "use client"를 붙이지 않는다. 서버 컴포넌트에서도 그대로 쓸 수 있다.
// 이미지를 항상 같은 비율로 보여 주는 틀. Figma `Thumbnail`(node 2304:35534) · `Thumbnail Guidelines`(2304:35671).
// 콘텐츠 이미지(뉴스·카드·상품)에 쓴다. 사람이나 대상(프로필·거래소)은 Avatar가 맡는다.
import type { ComponentProps, ReactNode } from "react";
import { cn } from "../../utils/cn";
import {
  responsiveClasses,
  type Responsive,
  type ResponsiveClassTable,
} from "../../utils/responsive";
import { ImageIcon } from "../icon/icons.generated";

/** 가로:세로 비율. 가로형 9개(1:1 ~ 21:9), 세로형 8개(4:5 ~ 9:21) */
export type ThumbnailAspectRatio =
  | "1:1"
  | "5:4"
  | "4:3"
  | "3:2"
  | "16:10"
  | "1.618:1"
  | "16:9"
  | "2:1"
  | "21:9"
  | "4:5"
  | "3:4"
  | "2:3"
  | "10:16"
  | "1:1.618"
  | "9:16"
  | "1:2"
  | "9:21";

// 비율은 CSS aspect-ratio로 정한다. 폭은 부모를 따르고 높이가 비율대로 정해진다.
// 구간별 값도 받는다(utils/responsive.ts)
const aspectClasses: ResponsiveClassTable<ThumbnailAspectRatio> = {
  base: {
    "1:1": "aspect-[1/1]",
    "5:4": "aspect-[5/4]",
    "4:3": "aspect-[4/3]",
    "3:2": "aspect-[3/2]",
    "16:10": "aspect-[16/10]",
    "1.618:1": "aspect-[1.618/1]",
    "16:9": "aspect-[16/9]",
    "2:1": "aspect-[2/1]",
    "21:9": "aspect-[21/9]",
    "4:5": "aspect-[4/5]",
    "3:4": "aspect-[3/4]",
    "2:3": "aspect-[2/3]",
    "10:16": "aspect-[10/16]",
    "1:1.618": "aspect-[1/1.618]",
    "9:16": "aspect-[9/16]",
    "1:2": "aspect-[1/2]",
    "9:21": "aspect-[9/21]",
  },
  tablet: {
    "1:1": "tablet:aspect-[1/1]",
    "5:4": "tablet:aspect-[5/4]",
    "4:3": "tablet:aspect-[4/3]",
    "3:2": "tablet:aspect-[3/2]",
    "16:10": "tablet:aspect-[16/10]",
    "1.618:1": "tablet:aspect-[1.618/1]",
    "16:9": "tablet:aspect-[16/9]",
    "2:1": "tablet:aspect-[2/1]",
    "21:9": "tablet:aspect-[21/9]",
    "4:5": "tablet:aspect-[4/5]",
    "3:4": "tablet:aspect-[3/4]",
    "2:3": "tablet:aspect-[2/3]",
    "10:16": "tablet:aspect-[10/16]",
    "1:1.618": "tablet:aspect-[1/1.618]",
    "9:16": "tablet:aspect-[9/16]",
    "1:2": "tablet:aspect-[1/2]",
    "9:21": "tablet:aspect-[9/21]",
  },
  desktop: {
    "1:1": "desktop:aspect-[1/1]",
    "5:4": "desktop:aspect-[5/4]",
    "4:3": "desktop:aspect-[4/3]",
    "3:2": "desktop:aspect-[3/2]",
    "16:10": "desktop:aspect-[16/10]",
    "1.618:1": "desktop:aspect-[1.618/1]",
    "16:9": "desktop:aspect-[16/9]",
    "2:1": "desktop:aspect-[2/1]",
    "21:9": "desktop:aspect-[21/9]",
    "4:5": "desktop:aspect-[4/5]",
    "3:4": "desktop:aspect-[3/4]",
    "2:3": "desktop:aspect-[2/3]",
    "10:16": "desktop:aspect-[10/16]",
    "1:1.618": "desktop:aspect-[1/1.618]",
    "9:16": "desktop:aspect-[9/16]",
    "1:2": "desktop:aspect-[1/2]",
    "9:21": "desktop:aspect-[9/21]",
  },
};

export interface ThumbnailProps extends Omit<ComponentProps<"div">, "children"> {
  /** 이미지 주소. `image`를 넘기면 쓰지 않는다 */
  src?: string;
  /** 이미지 설명(스크린리더). 꾸밈용 이미지면 `""` */
  alt?: string;
  /** `<img>` 대신 그릴 이미지 요소(예: Next.js `<Image fill />`). 틀을 가득 채우게 넘긴다 */
  image?: ReactNode;
  /** 가로:세로 비율. 기본 `"1:1"`. 구간별로 바꾸려면 `{ base: "1:1", tablet: "16:9" }` */
  aspectRatio?: Responsive<ThumbnailAspectRatio>;
  /** 이미지를 채우는 방식. `cover`는 잘라서 채우고, `contain`은 이미지 전체를 보인다. 기본 `cover` */
  fit?: "cover" | "contain";
  /** 모서리 8px. 카드 위에서는 켜고, 전체 폭 이미지는 끈다. 기본 `false` */
  radius?: boolean;
  /** 1px 테두리(`border-default`). 흰 배경에 흰 이미지가 올 때 켠다. 기본 `false` */
  border?: boolean;
  /** 이미지 위 어두운 막. 위에 글자를 올릴 때 켠다. 기본 `false` */
  overlay?: boolean;
  /** 오버레이 색(CSS 색). 기본은 `fill-pressed`(옅은 막). 글자 대비가 더 필요하면 진하게 바꾼다 */
  overlayColor?: string;
  /** 이미지·오버레이 위에 올릴 내용(제목·배지 등) */
  children?: ReactNode;
  /** `<img>`의 loading. 첫 화면 위쪽 이미지는 `"eager"`로. 기본 `"lazy"` */
  loading?: "lazy" | "eager";
}

/** 폭은 부모(또는 `className`의 `w-*`)를 따르고 높이는 비율로 정해진다. 이미지가 없으면 회색 바탕에 이미지 아이콘을 보인다 */
export function Thumbnail({
  src,
  alt = "",
  image,
  aspectRatio,
  fit = "cover",
  radius = false,
  border = false,
  overlay = false,
  overlayColor,
  children,
  loading = "lazy",
  className,
  ...props
}: ThumbnailProps) {
  const hasImage = image !== undefined || Boolean(src);
  return (
    <div
      className={cn(
        "relative w-full shrink-0 overflow-hidden bg-fill-neutral-weak",
        responsiveClasses<ThumbnailAspectRatio>(aspectRatio, "1:1", aspectClasses),
        radius && "rounded-8",
        className,
      )}
      {...props}
    >
      {image ??
        (src ? (
          <img
            src={src}
            alt={alt}
            loading={loading}
            decoding="async"
            draggable={false}
            className={cn(
              "absolute inset-0 size-full",
              fit === "cover" ? "object-cover" : "object-contain",
            )}
          />
        ) : null)}
      {!hasImage && (
        <span
          aria-hidden="true"
          className="absolute inset-0 flex items-center justify-center text-icon-disabled"
        >
          <ImageIcon size={24} />
        </span>
      )}
      {overlay && (
        <span
          aria-hidden="true"
          className="absolute inset-0 bg-fill-pressed"
          style={overlayColor ? { background: overlayColor } : undefined}
        />
      )}
      {children && <div className="absolute inset-0">{children}</div>}
      {/* 테두리는 이미지 위에 덮어 그려서 이미지 가장자리에 가려지지 않게 한다 */}
      {border && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 border border-border-default"
          style={{ borderRadius: "inherit" }}
        />
      )}
    </div>
  );
}
