// 상태·이벤트가 없어서 "use client"를 붙이지 않는다. 서버 컴포넌트에서도 그대로 쓸 수 있다.
// 로드 시간이 짧은 일반적인 상황에서 쓰는 원형 로딩이다. 회전은 CSS 애니메이션이라 JS가 필요 없다.
import type { ComponentProps } from "react";
import { cn } from "../../utils/cn";

export type CircularColor = "default" | "brand" | "on-fill";

// 색은 아이콘 색 토큰을 쓴다. 트랙(옅은 원)은 같은 색을 20% 투명도로 깐다.
const colors: Record<CircularColor, string> = {
  default: "text-icon-secondary",
  brand: "text-icon-brand",
  "on-fill": "text-icon-on-fill",
};

export interface CircularProps extends Omit<ComponentProps<"svg">, "children" | "color"> {
  /** 지름(px). 기본 28. 버튼 안에서는 버튼 크기에 맞춰 20 · 16 · 12로 쓴다 */
  size?: number;
  /** `default` 회색 · `brand` 브랜드색 · `on-fill` 진한 배경 위의 흰색. 기본 `default` */
  color?: CircularColor;
  /** 스크린리더가 읽을 이름. 기본 `로딩 중`. 장식용이면 `aria-hidden`을 준다 */
  label?: string;
}

export function Circular({
  size = 28,
  color = "default",
  label = "로딩 중",
  className,
  "aria-hidden": ariaHidden,
  ...props
}: CircularProps) {
  const decorative = ariaHidden === true || ariaHidden === "true";
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 28 28"
      fill="none"
      role={decorative ? undefined : "status"}
      aria-label={decorative ? undefined : label}
      aria-hidden={ariaHidden}
      className={cn(
        "shrink-0 animate-[mint-spin_0.8s_linear_infinite] motion-reduce:animate-none",
        colors[color],
        className,
      )}
      {...props}
    >
      <path
        opacity="0.2"
        fill="currentColor"
        d="M28 14C28 21.732 21.732 28 14 28C6.26801 28 0 21.732 0 14C0 6.26801 6.26801 0 14 0C21.732 0 28 6.26801 28 14ZM3 14C3 20.0751 7.92487 25 14 25C20.0751 25 25 20.0751 25 14C25 7.92487 20.0751 3 14 3C7.92487 3 3 7.92487 3 14Z"
      />
      <path
        fill="currentColor"
        d="M14 1.5C14 0.671573 14.6735 -0.00831598 15.4972 0.0802742C17.7367 0.321143 19.8929 1.09986 21.778 2.35943C24.0803 3.89776 25.8747 6.08427 26.9343 8.64243C27.9939 11.2006 28.2712 14.0155 27.731 16.7313C27.1908 19.447 25.8574 21.9416 23.8995 23.8995C21.9416 25.8574 19.447 27.1908 16.7313 27.731C14.0155 28.2712 11.2006 27.9939 8.64243 26.9343C6.08427 25.8747 3.89776 24.0803 2.35942 21.778C1.09986 19.8929 0.321143 17.7367 0.0802741 15.4972C-0.00831604 14.6735 0.671573 14 1.5 14V14C2.32843 14 2.98949 14.6747 3.10211 15.4954C3.32785 17.1404 3.92413 18.7199 4.85383 20.1113C6.06253 21.9202 7.78049 23.3301 9.79048 24.1627C11.8005 24.9952 14.0122 25.2131 16.146 24.7886C18.2798 24.3642 20.2398 23.3166 21.7782 21.7782C23.3166 20.2398 24.3642 18.2798 24.7886 16.146C25.2131 14.0122 24.9952 11.8005 24.1627 9.79048C23.3301 7.78049 21.9202 6.06253 20.1113 4.85383C18.7199 3.92413 17.1404 3.32785 15.4954 3.10211C14.6747 2.98949 14 2.32843 14 1.5V1.5Z"
      />
    </svg>
  );
}
