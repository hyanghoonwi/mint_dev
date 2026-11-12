// Checkbox·Radio와 그 틀 버전(FramedCheckbox·FramedRadio)이 함께 쓰는 상자·원 그림. 공개하지 않는 내부 구현이다.
// 감싸는 <label>에 `group/control`이 있어야 hover·누름 색이 바뀐다.
// 상태·이벤트가 없는 표시용이라 "use client"를 붙이지 않는다(불러 쓰는 컴포넌트가 클라이언트 컴포넌트다).
import { cn } from "../../utils/cn";

const focusRing =
  "peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-border-focus";

/** 상자의 기본 크기(Small 20): 상자 · 체크 16 · 일부 선택 막대 10×2. Checkbox는 size 표로 바꿔 넘긴다 */
export const CHECKBOX_MARK_SM = "size-5 [&_svg]:size-4 [&>span]:h-[2px] [&>span]:w-[10px]";

/**
 * 체크박스 상자(기본 20px, 모서리 4). Figma `Checkbox Box`.
 * 체크 안 됨은 흰 상자·회색 테두리, 체크·일부 선택은 브랜드 상자. 누르는 동안(hover 포함) 한 단계 진하게.
 */
export function CheckboxMark({
  checked,
  indeterminate,
  disabled,
  ring = true,
  sizeClassName = CHECKBOX_MARK_SM,
}: {
  checked: boolean;
  indeterminate: boolean;
  disabled: boolean;
  /** 상자에 포커스 링을 그릴지. 틀 버전은 틀 전체에 그린다 */
  ring?: boolean;
  /** 상자·체크·막대 크기 클래스. 기본 Small(20) */
  sizeClassName?: string;
}) {
  const on = indeterminate || checked;
  const box = disabled
    ? on
      ? "bg-fill-brand-weak-pressed"
      : "border border-border-disabled bg-fill-disabled"
    : on
      ? "bg-fill-brand group-hover/control:bg-fill-brand-pressed group-active/control:bg-fill-brand-pressed"
      : "border border-border-strong bg-fill-white group-hover/control:bg-fill-neutral-weak group-active/control:bg-fill-neutral-weak";

  return (
    <span
      aria-hidden="true"
      className={cn(
        "flex shrink-0 items-center justify-center rounded-4 transition-colors",
        sizeClassName,
        ring && focusRing,
        box,
      )}
    >
      {indeterminate ? (
        <span className="rounded-full bg-fill-white" />
      ) : (
        checked && (
          // Figma 체크(Small 16px, 흰 2px 선). 크기는 sizeClassName의 [&_svg]:size-*
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-icon-on-fill">
            <path
              d="M3.33333 8L6.66667 11.3333L12.6667 4.66667"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )
      )}
    </span>
  );
}

/** 라디오 원의 기본 크기(Small 20, 가운데 흰 점 8 = 브랜드 테두리 6). Radio는 size 표로 바꿔 넘긴다 */
export const RADIO_MARK_SM = "size-5 [--mint-radio-ring:6px]";

/**
 * 라디오 원(기본 20px). Figma `Radio Circle`. 고른 상태는 안쪽 그림자(--mint-radio-ring 두께)로 원을 칠하고 가운데만 흰 점으로 남긴다. 바로 앞 형제가 `peer` 클래스를 단 <input type="radio">여야 한다.
 * 같은 그룹의 다른 라디오가 선택되면 이전 라디오에는 이벤트가 오지 않아서, 상태는 입력의 :checked를 CSS로 읽는다.
 */
export function RadioMark({
  ring = true,
  sizeClassName = RADIO_MARK_SM,
}: {
  ring?: boolean;
  /** 원 크기와 안쪽 테두리 두께(`[--mint-radio-ring:6px]`). 기본 Small(20) */
  sizeClassName?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "shrink-0 rounded-full border transition-[background-color,border-color,box-shadow]",
        sizeClassName,
        // 안 고름: 흰 원·회색 테두리 → hover·누름 연한 회색 원
        "border-border-strong bg-fill-white peer-enabled:group-hover/control:bg-fill-neutral-weak peer-enabled:group-active/control:bg-fill-neutral-weak",
        // 고름: 브랜드 원 + 가운데 흰 점. 안쪽 그림자(--mint-radio-ring)로 원을 칠하고 가운데만 흰색으로 남긴다
        "peer-checked:border-0 peer-checked:bg-fill-white peer-checked:shadow-[inset_0_0_0_var(--mint-radio-ring)_var(--mint-fill-brand)]",
        "peer-checked:peer-enabled:group-hover/control:bg-fill-white peer-checked:peer-enabled:group-hover/control:shadow-[inset_0_0_0_var(--mint-radio-ring)_var(--mint-fill-brand-pressed)]",
        "peer-checked:peer-enabled:group-active/control:bg-fill-white peer-checked:peer-enabled:group-active/control:shadow-[inset_0_0_0_var(--mint-radio-ring)_var(--mint-fill-brand-pressed)]",
        // 비활성: 회색 원·연한 테두리 / 고른 비활성은 연한 파랑 원
        "peer-disabled:border-border-disabled peer-disabled:bg-fill-disabled",
        "peer-checked:peer-disabled:bg-fill-white peer-checked:peer-disabled:shadow-[inset_0_0_0_var(--mint-radio-ring)_var(--mint-fill-brand-weak-pressed)]",
        ring && focusRing,
      )}
    />
  );
}
