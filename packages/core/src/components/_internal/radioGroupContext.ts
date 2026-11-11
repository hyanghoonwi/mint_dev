"use client";

// RadioGroup이 이름·선택 값을 Radio·FramedRadio에 내려 주는 Context. 공개하지 않는 내부 구현이다.
import { createContext } from "react";

export interface RadioGroupContextValue {
  name: string;
  value: string | undefined;
  disabled: boolean;
  select: (value: string) => void;
}

export const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);
