"use client";

// RadioGroup이 이름·선택 값을 Radio·FramedRadio에 내려 주는 Context. 공개하지 않는 내부 구현이다.
import { createContext } from "react";
import type { Responsive } from "../../utils/responsive";

/** Radio 크기(Radio.tsx의 RadioSize와 같음). 순환 import를 피하려고 여기 둔다 */
export type RadioGroupSize = "xs" | "sm" | "md" | "lg";

export interface RadioGroupContextValue {
  name: string;
  value: string | undefined;
  disabled: boolean;
  select: (value: string) => void;
  /** 그룹 안 라디오의 기본 크기. 라디오마다 `size`를 주면 그 값이 우선 */
  size?: Responsive<RadioGroupSize>;
}

export const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);
