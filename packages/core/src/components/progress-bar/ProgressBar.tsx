// 상태·이벤트가 없어서 "use client"를 붙이지 않는다. 서버 컴포넌트에서도 그대로 쓸 수 있다.
// 진행 정도를 가로 막대로 보여 주는 표시 전용 부품이다. Figma `Progress Bar`(node 2501:125255)·`Progress Bar Guidelines`(2493:124257).
// 끝이 있는 작업(파일 업로드, 단계 진행)에 쓰고, 끝을 알 수 없을 때는 `Circular`(로딩)를 쓴다.
import type { ComponentProps } from "react";
import { cn } from "../../utils/cn";

/** `default`는 왼쪽에서부터 채우는 막대, `diverging`은 가운데 기준선에서 양쪽으로 뻗는 막대(증감) */
export type ProgressBarType = "default" | "diverging";
/** `normal` 진행 중(brand) · `negative` 실패(danger) · `positive` 완료(success). `default`에서만 쓴다 */
export type ProgressBarStatus = "normal" | "negative" | "positive";

// 채움 색(default): Figma Status. diverging은 값의 부호로 정해진다(양수 fill-up 빨강, 음수 fill-down 파랑: 시세 색 규칙)
const statusColors: Record<ProgressBarStatus, string> = {
  normal: "bg-fill-brand",
  negative: "bg-fill-danger",
  positive: "bg-fill-success",
};

export interface ProgressBarProps extends Omit<ComponentProps<"div">, "children"> {
  /** 진행 값. `default`는 0~100(%), `diverging`은 −100~100(양수는 오른쪽 빨강, 음수는 왼쪽 파랑, 0은 가운데 점). 범위를 넘으면 잘라 쓴다 */
  value: number;
  /** `normal` 진행 중(brand, 기본) · `negative` 실패(danger) · `positive` 완료(success). `diverging`에서는 쓰지 않는다 */
  status?: ProgressBarStatus;
  /** `default` 0 → 100%를 왼쪽에서 채움(기본) · `diverging` 가운데에서 양쪽으로(−100 ~ 100) */
  type?: ProgressBarType;
}

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(Number.isFinite(value) ? value : 0, min), max);

/**
 * 진행 정도 막대. 폭은 부모를 채우고 높이는 6px 고정이다. 이름은 `aria-label`로 꼭 준다(예: "업로드 진행").
 * 값이 바뀌면 채움이 부드럽게 움직인다(움직임 줄이기 설정에서는 바로 바뀜).
 */
export function ProgressBar({
  value,
  status = "normal",
  type = "default",
  className,
  ...props
}: ProgressBarProps) {
  const diverging = type === "diverging";
  const current = diverging ? clamp(value, -100, 100) : clamp(value, 0, 100);
  const motion = "transition-[width] duration-300 ease-out motion-reduce:transition-none";

  return (
    <div
      role="progressbar"
      aria-valuemin={diverging ? -100 : 0}
      aria-valuemax={100}
      aria-valuenow={current}
      aria-valuetext={`${current}%`}
      className={cn(
        // 높이 6은 Figma `spacing-6`이고 간격 스케일(4·8·12…)에 없어 임의 값이다. default는 채움이 트랙 밖으로 나가지 않게 자른다
        "relative h-[6px] w-full rounded-full bg-fill-neutral-weak",
        !diverging && "overflow-hidden",
        className,
      )}
      {...props}
    >
      {!diverging && (
        <span
          aria-hidden="true"
          className={cn("block h-full rounded-full", motion, statusColors[status])}
          style={{ width: `${current}%` }}
        />
      )}

      {diverging &&
        (current === 0 ? (
          // 0: 가운데 점만
          <span
            aria-hidden="true"
            className="absolute top-0 left-1/2 size-[6px] -translate-x-1/2 rounded-full bg-text-subtle"
          />
        ) : (
          <>
            {/* 가운데 기준선: 막대 위아래로 3px씩 나온다(높이 12) */}
            <span
              aria-hidden="true"
              className="absolute top-[-3px] left-1/2 h-3 w-px -translate-x-1/2 bg-border-strong"
            />
            <span
              aria-hidden="true"
              className={cn(
                "absolute top-0 h-full rounded-full",
                motion,
                current > 0 ? "bg-fill-up" : "bg-fill-down",
              )}
              style={
                current > 0
                  ? { left: "50%", width: `${current / 2}%` }
                  : { right: "50%", width: `${-current / 2}%` }
              }
            />
          </>
        ))}
    </div>
  );
}
