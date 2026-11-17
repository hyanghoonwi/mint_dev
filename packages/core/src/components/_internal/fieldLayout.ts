// Select·TextField처럼 "라벨 + 입력 칸 + 도움말" 틀을 가진 컴포넌트가 함께 쓰는 크기·라벨 위치 클래스 표. 공개하지 않는 내부 구현이다.
// 크기·라벨 위치는 값 하나 또는 구간별 객체를 받으므로(utils/responsive.ts) 구간마다 클래스를 통째로 적은 표로 둔다.
// 칸 높이는 CSS 변수(--mint-field-height)로 바깥 요소에 두어서, 왼쪽 라벨이 칸 높이에 맞춰 가운데에 놓이게 한다.
import type { ResponsiveClassTable } from "../../utils/responsive";

/** 칸 크기: Large 48 · Medium 40 · Small 32 */
export type FieldSize = "sm" | "md" | "lg";
/** 라벨 위치: `top` 칸 위 · `left` 칸 왼쪽 */
export type FieldLabelPosition = "top" | "left";

// 칸 높이를 CSS 변수로 바깥 요소에 둔다
export const fieldHeightVarClasses: ResponsiveClassTable<FieldSize> = {
  base: {
    lg: "[--mint-field-height:48px]",
    md: "[--mint-field-height:40px]",
    sm: "[--mint-field-height:32px]",
  },
  tablet: {
    lg: "tablet:[--mint-field-height:48px]",
    md: "tablet:[--mint-field-height:40px]",
    sm: "tablet:[--mint-field-height:32px]",
  },
  desktop: {
    lg: "desktop:[--mint-field-height:48px]",
    md: "desktop:[--mint-field-height:40px]",
    sm: "desktop:[--mint-field-height:32px]",
  },
};

// 바깥 요소 배치: top은 세로로 쌓고, left는 라벨과 칸을 가로로 놓는다
export const fieldRootPositionClasses: ResponsiveClassTable<FieldLabelPosition> = {
  base: {
    top: "flex-col",
    left: "flex-row items-start",
  },
  tablet: {
    top: "tablet:flex-col",
    left: "tablet:flex-row tablet:items-start",
  },
  desktop: {
    top: "desktop:flex-col",
    left: "desktop:flex-row desktop:items-start",
  },
};

// 칸·도움말 묶음: left에서는 남은 폭을 채운다
export const fieldBodyPositionClasses: ResponsiveClassTable<FieldLabelPosition> = {
  base: {
    top: "flex-none",
    left: "flex-1",
  },
  tablet: {
    top: "tablet:flex-none",
    left: "tablet:flex-1",
  },
  desktop: {
    top: "desktop:flex-none",
    left: "desktop:flex-1",
  },
};

// 라벨 감싸개: left에서는 칸 높이에 맞춰 세로 가운데에 놓고, top에서는 높이를 따로 정하지 않는다
export const fieldLabelWrapClasses: ResponsiveClassTable<FieldLabelPosition> = {
  base: {
    top: "h-auto",
    left: "h-(--mint-field-height)",
  },
  tablet: {
    top: "tablet:h-auto",
    left: "tablet:h-(--mint-field-height)",
  },
  desktop: {
    top: "desktop:h-auto",
    left: "desktop:h-(--mint-field-height)",
  },
};

/** 상태(Figma Status): `normal` 기본 · `negative` 오류(빨강) · `positive` 확인 완료(초록). TextField·Select가 같은 이름을 쓴다 */
export type FieldStatus = "normal" | "negative" | "positive";

/** 칸 아래 도움말 색: 보통은 보조 글자색, 오류는 빨강, 확인 완료는 초록 */
export const fieldHelperClasses: Record<FieldStatus, string> = {
  normal: "text-text-secondary",
  negative: "text-text-danger",
  positive: "text-text-success",
};
