import type { ReactNode } from "react";

/** 사용 가이드: 좋은 예(Do)와 피할 예(Don't)를 나란히 */
export function DoDont({
  good,
  bad,
  goodText,
  badText,
}: {
  good: ReactNode;
  bad: ReactNode;
  goodText: ReactNode;
  badText: ReactNode;
}) {
  return (
    <div className="docs-dodont">
      <figure>
        <div className="docs-dodont__stage" data-pagefind-ignore>
          {good}
        </div>
        <figcaption>
          <strong className="docs-dodont__do">Do</strong> {goodText}
        </figcaption>
      </figure>
      <figure>
        <div className="docs-dodont__stage" data-pagefind-ignore>
          {bad}
        </div>
        <figcaption>
          <strong className="docs-dodont__dont">Don&apos;t</strong> {badText}
        </figcaption>
      </figure>
    </div>
  );
}
