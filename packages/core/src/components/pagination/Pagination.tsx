// 상태를 직접 갖지 않아서 "use client"를 붙이지 않는다(Button과 같은 방식).
//  - 링크로 쓰면(getHref) 서버 컴포넌트에서 그대로 쓸 수 있다. 주소의 ?page=로 페이지를 바꾸는 목록에 맞다.
//  - 버튼으로 쓰면(onChange) 클라이언트 컴포넌트 안에서 쓴다.
// Figma `Pagination`(2204:17614) · `Pagination Guidelines`(2204:17744).
// core는 next/link를 import하지 않는다. Next.js 링크가 필요하면 linkComponent={Link}로 넘긴다.
import type { ComponentProps, ElementType, ReactNode } from "react";
import { cn } from "../../utils/cn";
import { ArrowLeftIcon, ArrowRightIcon } from "../icon/icons.generated";

export type PaginationVariant = "extended" | "compact" | "responsive";

type Slot = number | "ellipsis";

/**
 * 보여 줄 칸을 계산한다. 페이지 번호 칸 수는 extended 7(이전·다음을 합쳐 9칸) · compact 5(합쳐 7칸).
 * 처음과 끝은 항상 보이고, 가운데는 현재 주변(extended는 앞뒤 1개, compact는 현재만)을 보여 준다.
 */
function getPaginationSlots(page: number, total: number, slots: 7 | 5): Slot[] {
  if (total <= slots) return Array.from({ length: total }, (_, i) => i + 1);
  const side = (slots - 5) / 2; // 현재 페이지 앞뒤로 보여 줄 수: extended 1 · compact 0
  const run = slots - 2; // 한쪽 끝에 붙여 보여 줄 번호 수: extended 5 · compact 3
  // 말줄임이 한 페이지만 가리게 되면 말줄임 대신 번호를 그대로 보여 준다
  if (page <= run - side) {
    return [...Array.from({ length: run }, (_, i) => i + 1), "ellipsis", total];
  }
  if (page >= total - run + 1 + side) {
    return [1, "ellipsis", ...Array.from({ length: run }, (_, i) => total - run + 1 + i)];
  }
  const middle = Array.from({ length: side * 2 + 1 }, (_, i) => page - side + i);
  return [1, "ellipsis", ...middle, "ellipsis", total];
}

const itemBase =
  "relative inline-flex size-10 shrink-0 items-center justify-center rounded-8 text-label-2-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus";

const itemStyles = {
  page: "cursor-pointer text-text-strong hover:bg-fill-pressed active:bg-fill-pressed",
  current:
    "cursor-pointer bg-fill-neutral text-text-on-fill hover:bg-fill-neutral-pressed active:bg-fill-neutral-pressed",
  arrow:
    "cursor-pointer text-icon-strong hover:bg-fill-pressed active:bg-fill-pressed [&_svg]:size-4",
  arrowDisabled: "cursor-not-allowed text-icon-disabled [&_svg]:size-4",
};

export interface PaginationProps extends Omit<ComponentProps<"nav">, "onChange" | "children"> {
  /** 현재 페이지(1부터) */
  page: number;
  /** 전체 페이지 수. 1 이하면 아무것도 그리지 않는다(Figma 규칙: 1개뿐이면 보여 주지 않는다) */
  total: number;
  /**
   * `extended` 9칸(웹·태블릿) · `compact` 7칸(모바일) · `responsive` 모바일은 compact, 태블릿(768px~)부터 extended.
   * 기본 `responsive`
   */
  variant?: PaginationVariant;
  /** 버튼으로 쓸 때: 다른 페이지를 누르면 그 번호로 불린다 */
  onChange?: (page: number) => void;
  /** 링크로 쓸 때: 페이지 번호로 주소를 만든다(예: `(p) => "?page=" + p`). 주면 버튼 대신 링크가 된다 */
  getHref?: (page: number) => string;
  /** 링크로 쓸 때의 링크 컴포넌트. Next.js는 `Link`를 넘긴다. 기본 `<a>` */
  linkComponent?: ElementType;
  /** 묶음 이름. 기본 "페이지" */
  "aria-label"?: string;
}

/** 많은 데이터를 여러 페이지로 나눠 보여 줄 때의 페이지 이동 */
export function Pagination({
  page,
  total,
  variant = "responsive",
  onChange,
  getHref,
  linkComponent: Link = "a",
  className,
  "aria-label": ariaLabel = "페이지",
  ...props
}: PaginationProps) {
  if (total <= 1) return null;
  const current = Math.min(Math.max(page, 1), total);

  /** 페이지로 가는 칸 하나(번호·이전·다음). 링크 모드면 링크, 아니면 버튼 */
  const item = (
    target: number,
    content: ReactNode,
    opts: { className: string; label: string; disabled?: boolean; current?: boolean },
  ) => {
    const common = {
      className: cn(itemBase, opts.className),
      "aria-label": opts.label,
      "aria-current": opts.current ? ("page" as const) : undefined,
    };
    if (opts.disabled) {
      // 첫·마지막 페이지의 이전·다음: 누를 수 없음(Figma Disabled)
      return getHref ? (
        <span {...common} aria-disabled="true" role="link">
          {content}
        </span>
      ) : (
        <button type="button" {...common} disabled>
          {content}
        </button>
      );
    }
    return getHref ? (
      <Link {...common} href={getHref(target)}>
        {content}
      </Link>
    ) : (
      <button
        type="button"
        {...common}
        // 클릭 함수는 onChange가 있을 때만 만든다. 서버 컴포넌트에서(onChange 없이) 그릴 때 함수가 생기면
        // Next.js가 "Event handlers cannot be passed to Client Component props" 오류를 낸다
        onClick={onChange ? () => target !== current && onChange(target) : undefined}
      >
        {content}
      </button>
    );
  };

  const list = (slots: 7 | 5, listClassName?: string) => (
    <ul className={cn("flex items-center", listClassName)}>
      <li>
        {item(current - 1, <ArrowLeftIcon size={16} />, {
          className: current === 1 ? itemStyles.arrowDisabled : itemStyles.arrow,
          label: "이전 페이지",
          disabled: current === 1,
        })}
      </li>
      {getPaginationSlots(current, total, slots).map((slot, index) =>
        slot === "ellipsis" ? (
          <li
            key={`ellipsis-${index}`}
            aria-hidden="true"
            className="inline-flex size-10 items-center justify-center text-label-2-bold text-text-tertiary"
          >
            …
          </li>
        ) : (
          <li key={slot}>
            {item(slot, slot, {
              className: slot === current ? itemStyles.current : itemStyles.page,
              label: `${slot}페이지`,
              current: slot === current,
            })}
          </li>
        ),
      )}
      <li>
        {item(current + 1, <ArrowRightIcon size={16} />, {
          className: current === total ? itemStyles.arrowDisabled : itemStyles.arrow,
          label: "다음 페이지",
          disabled: current === total,
        })}
      </li>
    </ul>
  );

  return (
    <nav aria-label={ariaLabel} className={cn("inline-flex", className)} {...props}>
      {variant === "extended" && list(7)}
      {variant === "compact" && list(5)}
      {variant === "responsive" && (
        <>
          {/* 화면 폭은 CSS로만 나눈다(서버·클라이언트 결과가 같다). 숨긴 쪽은 스크린리더도 읽지 않는다 */}
          {list(5, "tablet:hidden")}
          {list(7, "hidden tablet:flex")}
        </>
      )}
    </nav>
  );
}
