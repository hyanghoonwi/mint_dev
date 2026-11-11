// 상태·이벤트가 없어서 "use client"를 붙이지 않는다. 서버 컴포넌트에서 그대로 쓸 수 있다.
// 글자 컴포넌트. Figma "Typography"(Specimen 32:61)의 59개 텍스트 스타일만 고를 수 있어서 토큰 밖의 크기(text-[36px])를 막는다.
// 모양(variant)과 태그(as)를 따로 고른다: 제목처럼 보여도 문서 구조상 p일 수 있고, 그 반대도 있다.
// 크기는 지금은 값 하나만 받는다(Figma 규칙 해석이 정해지면 utils/responsive.ts로 구간별 값을 열 수 있다).
import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";
import { cn } from "../../utils/cn";

/** Figma 텍스트 스타일 이름(역할-번호-웨이트). 예: `title-1-bold`, `body-2-regular` */
export type TextVariant =
  | "display-1-semibold"
  | "display-1-bold"
  | "display-2-semibold"
  | "display-2-bold"
  | "display-3-semibold"
  | "display-3-bold"
  | "title-1-medium"
  | "title-1-semibold"
  | "title-1-bold"
  | "title-2-medium"
  | "title-2-semibold"
  | "title-2-bold"
  | "title-3-medium"
  | "title-3-semibold"
  | "title-3-bold"
  | "heading-1-medium"
  | "heading-1-semibold"
  | "heading-1-bold"
  | "heading-2-medium"
  | "heading-2-semibold"
  | "heading-2-bold"
  | "heading-3-medium"
  | "heading-3-semibold"
  | "heading-3-bold"
  | "body-1-regular"
  | "body-1-medium"
  | "body-1-semibold"
  | "body-1-bold"
  | "body-2-regular"
  | "body-2-medium"
  | "body-2-semibold"
  | "body-2-bold"
  | "body-3-regular"
  | "body-3-medium"
  | "body-3-semibold"
  | "body-3-bold"
  | "body-4-regular"
  | "body-4-medium"
  | "body-4-semibold"
  | "body-4-bold"
  | "body-5-regular"
  | "body-5-medium"
  | "body-5-semibold"
  | "body-5-bold"
  | "label-1-medium"
  | "label-1-semibold"
  | "label-1-bold"
  | "label-2-medium"
  | "label-2-semibold"
  | "label-2-bold"
  | "label-3-medium"
  | "label-3-semibold"
  | "label-3-bold"
  | "caption-1-regular"
  | "caption-1-medium"
  | "caption-1-semibold"
  | "caption-2-regular"
  | "caption-2-medium"
  | "caption-2-semibold";

// 클래스 이름을 조립하지 않고 통째로 적는다(Tailwind가 정적으로 찾는다)
const variants: Record<TextVariant, string> = {
  "display-1-semibold": "text-display-1-semibold",
  "display-1-bold": "text-display-1-bold",
  "display-2-semibold": "text-display-2-semibold",
  "display-2-bold": "text-display-2-bold",
  "display-3-semibold": "text-display-3-semibold",
  "display-3-bold": "text-display-3-bold",
  "title-1-medium": "text-title-1-medium",
  "title-1-semibold": "text-title-1-semibold",
  "title-1-bold": "text-title-1-bold",
  "title-2-medium": "text-title-2-medium",
  "title-2-semibold": "text-title-2-semibold",
  "title-2-bold": "text-title-2-bold",
  "title-3-medium": "text-title-3-medium",
  "title-3-semibold": "text-title-3-semibold",
  "title-3-bold": "text-title-3-bold",
  "heading-1-medium": "text-heading-1-medium",
  "heading-1-semibold": "text-heading-1-semibold",
  "heading-1-bold": "text-heading-1-bold",
  "heading-2-medium": "text-heading-2-medium",
  "heading-2-semibold": "text-heading-2-semibold",
  "heading-2-bold": "text-heading-2-bold",
  "heading-3-medium": "text-heading-3-medium",
  "heading-3-semibold": "text-heading-3-semibold",
  "heading-3-bold": "text-heading-3-bold",
  "body-1-regular": "text-body-1-regular",
  "body-1-medium": "text-body-1-medium",
  "body-1-semibold": "text-body-1-semibold",
  "body-1-bold": "text-body-1-bold",
  "body-2-regular": "text-body-2-regular",
  "body-2-medium": "text-body-2-medium",
  "body-2-semibold": "text-body-2-semibold",
  "body-2-bold": "text-body-2-bold",
  "body-3-regular": "text-body-3-regular",
  "body-3-medium": "text-body-3-medium",
  "body-3-semibold": "text-body-3-semibold",
  "body-3-bold": "text-body-3-bold",
  "body-4-regular": "text-body-4-regular",
  "body-4-medium": "text-body-4-medium",
  "body-4-semibold": "text-body-4-semibold",
  "body-4-bold": "text-body-4-bold",
  "body-5-regular": "text-body-5-regular",
  "body-5-medium": "text-body-5-medium",
  "body-5-semibold": "text-body-5-semibold",
  "body-5-bold": "text-body-5-bold",
  "label-1-medium": "text-label-1-medium",
  "label-1-semibold": "text-label-1-semibold",
  "label-1-bold": "text-label-1-bold",
  "label-2-medium": "text-label-2-medium",
  "label-2-semibold": "text-label-2-semibold",
  "label-2-bold": "text-label-2-bold",
  "label-3-medium": "text-label-3-medium",
  "label-3-semibold": "text-label-3-semibold",
  "label-3-bold": "text-label-3-bold",
  "caption-1-regular": "text-caption-1-regular",
  "caption-1-medium": "text-caption-1-medium",
  "caption-1-semibold": "text-caption-1-semibold",
  "caption-2-regular": "text-caption-2-regular",
  "caption-2-medium": "text-caption-2-medium",
  "caption-2-semibold": "text-caption-2-semibold",
};

/** 시맨틱 글자색(text-*) */
export type TextColor =
  | "strong"
  | "primary"
  | "secondary"
  | "tertiary"
  | "subtle"
  | "disabled"
  | "brand"
  | "danger"
  | "success"
  | "warning"
  | "on-fill";

const colorClasses: Record<TextColor, string> = {
  strong: "text-text-strong",
  primary: "text-text-primary",
  secondary: "text-text-secondary",
  tertiary: "text-text-tertiary",
  subtle: "text-text-subtle",
  disabled: "text-text-disabled",
  brand: "text-text-brand",
  danger: "text-text-danger",
  success: "text-text-success",
  warning: "text-text-warning",
  "on-fill": "text-text-on-fill",
};

// 말줄임: 1줄은 truncate, 여러 줄은 line-clamp
const lineClasses = {
  1: "truncate",
  2: "line-clamp-2",
  3: "line-clamp-3",
  4: "line-clamp-4",
} as const;

type TextOwnProps<E extends ElementType> = {
  /** 텍스트 스타일(필수). 예: `"title-1-bold"`, `"body-2-regular"` */
  variant: TextVariant;
  /** 그릴 태그. 기본 `span`. 문서 구조에 맞춰 `h1`~`h6`·`p`·`label` 등을 고른다 */
  as?: E;
  /** 글자색. 생략하면 부모 색을 이어받는다 */
  color?: TextColor;
  /** 이 줄 수를 넘으면 말줄임(…)으로 자른다. 1~4 */
  lines?: keyof typeof lineClasses;
  children?: ReactNode;
};

export type TextProps<E extends ElementType = "span"> = TextOwnProps<E> &
  Omit<ComponentPropsWithoutRef<E>, keyof TextOwnProps<E> | "color">;

/** 토큰 텍스트 스타일로 글자를 그린다 */
export function Text<E extends ElementType = "span">({
  variant,
  as,
  color,
  lines,
  className,
  ...props
}: TextProps<E> & { className?: string }) {
  const Component: ElementType = as ?? "span";
  return (
    <Component
      className={cn(
        variants[variant],
        color && colorClasses[color],
        lines && lineClasses[lines],
        className,
      )}
      {...props}
    />
  );
}
