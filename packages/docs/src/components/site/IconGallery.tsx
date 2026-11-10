"use client";

import { useState } from "react";
import * as mint from "@futurewiz-rms/mint";
import { iconCatalog, type IconComponent } from "@futurewiz-rms/mint";

const icons = mint as unknown as Record<string, IconComponent>;

// arrow-left → ArrowLeftIcon
const componentName = (name: string) =>
  `${name
    .split("-")
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join("")}Icon`;

/** 아이콘 전체 목록. 선·채움을 바꿔 보고, 이름을 누르면 컴포넌트 이름을 복사한다 */
export function IconGallery() {
  const [variant, setVariant] = useState<"line" | "fill">("line");
  const [query, setQuery] = useState("");
  const [copied, setCopied] = useState("");
  const keyword = query.trim().toLowerCase();

  return (
    <div className="docs-icons">
      <div className="docs-icons__toolbar">
        <input
          className="docs-input"
          placeholder="아이콘 이름 검색 (예: arrow, chart)"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <div className="docs-playground__options">
          {(["line", "fill"] as const).map((option) => (
            <button
              key={option}
              type="button"
              className="docs-pill"
              aria-pressed={variant === option}
              onClick={() => setVariant(option)}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
      {iconCatalog.map((group) => {
        const names = group.icons.filter((name) => name.includes(keyword));
        if (names.length === 0) return null;
        return (
          <section key={group.category}>
            <p className="docs-scales__name">{group.category}</p>
            <div className="docs-icons__grid">
              {names.map((name) => {
                const Icon = icons[componentName(name)];
                return (
                  <button
                    key={name}
                    type="button"
                    className="docs-icon-tile"
                    title={`${componentName(name)} 복사`}
                    onClick={() => {
                      void navigator.clipboard?.writeText(componentName(name));
                      setCopied(name);
                    }}
                  >
                    <Icon variant={variant} />
                    <span>{copied === name ? "복사됨" : name}</span>
                  </button>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
