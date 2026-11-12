// Toast·Snackbar가 함께 쓰는 종류별 앞 아이콘(Phosphor Fill 20). 공개하지 않는 내부 구현이다.
// positive·cautionary·negative는 아이콘 안쪽 기호가 흰색으로 보이도록 뒤에 흰 원을 깐다(Figma Glyph Backing).
import type { ReactNode } from "react";
import { cn } from "../../utils/cn";
import { CheckCircleIcon, InfoIcon, WarningCircleIcon, WarningIcon } from "../icon/icons.generated";

export type StatusVariant = "normal" | "positive" | "cautionary" | "negative";

const icons: Record<StatusVariant, { icon: ReactNode; color: string; backing?: string }> = {
  normal: { icon: <InfoIcon variant="fill" size={20} />, color: "text-icon-on-fill" },
  positive: {
    icon: <CheckCircleIcon variant="fill" size={20} />,
    color: "text-icon-success",
    backing: "left-1 top-1 size-3",
  },
  cautionary: {
    icon: <WarningIcon variant="fill" size={20} />,
    // Figma가 아토믹 orange-500(#FD9A13)을 직접 쓴다(icon-warning은 orange-700)
    color: "text-[var(--color-atomic-orange-500)]",
    backing: "left-[6px] top-[7px] h-[9px] w-2",
  },
  negative: {
    icon: <WarningCircleIcon variant="fill" size={20} />,
    color: "text-icon-danger",
    backing: "left-1 top-1 size-3",
  },
};

export function StatusIcon({ variant }: { variant: StatusVariant }) {
  const icon = icons[variant];
  return (
    <span aria-hidden="true" className={cn("relative flex size-5 shrink-0", icon.color)}>
      {icon.backing && <span className={cn("absolute rounded-full bg-fill-white", icon.backing)} />}
      <span className="relative flex">{icon.icon}</span>
    </span>
  );
}
