"use client";

import { useId, useState, type ReactNode } from "react";

/** 탭 목록 + 패널. 패널 내용(서버에서 그린 예시)은 children으로 받아 지금 탭만 보여 준다 */
export function TabsClient({ labels, children }: { labels: string[]; children: ReactNode[] }) {
  const [active, setActive] = useState(0);
  const id = useId();
  return (
    <div className="docs-tabs">
      <div className="docs-tabs__list" role="tablist">
        {labels.map((label, index) => (
          <button
            key={label}
            id={`${id}-tab-${index}`}
            type="button"
            role="tab"
            aria-selected={index === active}
            aria-controls={`${id}-panel-${index}`}
            tabIndex={index === active ? 0 : -1}
            className="docs-tabs__tab"
            onClick={() => setActive(index)}
            onKeyDown={(event) => {
              if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
              const next =
                (index + (event.key === "ArrowRight" ? 1 : -1) + labels.length) % labels.length;
              setActive(next);
              document.getElementById(`${id}-tab-${next}`)?.focus();
            }}
          >
            {label}
          </button>
        ))}
      </div>
      {children.map((panel, index) => (
        <div
          key={index}
          id={`${id}-panel-${index}`}
          role="tabpanel"
          aria-labelledby={`${id}-tab-${index}`}
          hidden={index !== active}
        >
          {panel}
        </div>
      ))}
    </div>
  );
}
