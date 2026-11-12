"use client";

// 컴포넌트 문서의 샌드박스: 왼쪽에 컴포넌트를 그리고, 오른쪽에서 props를 바꾸고, 아래에 그대로 복사해 쓸 코드가 나온다.
// 컴포넌트마다 controls(바꿀 수 있는 값)와 render(그리기), code(코드 만들기)만 정하면 된다(예: ButtonDocs.tsx).
import { useState, type ReactNode } from "react";
import { HighlightedCode } from "./CodeBlock";
import { CopyCode } from "./CopyCode";

export type Values = Record<string, string | number | boolean>;

export type Control =
  | {
      prop: string;
      type: "select";
      /** 고를 수 있는 값. 다른 값에 따라 달라지면 함수로 준다(예: variant에 따라 고를 수 있는 color) */
      options: readonly (string | number)[] | ((values: Values) => readonly (string | number)[]);
      default: string | number;
    }
  | { prop: string; type: "boolean"; default: boolean }
  | { prop: string; type: "text"; default: string };

function optionsOf(control: Extract<Control, { type: "select" }>, values: Values) {
  return typeof control.options === "function" ? control.options(values) : control.options;
}

/** 다른 값이 바뀌어 지금 값이 고를 수 없게 되면 첫 번째 값으로 되돌린다 */
function normalize(controls: Control[], values: Values) {
  const next = { ...values };
  for (const control of controls) {
    if (control.type !== "select") continue;
    const options = optionsOf(control, next);
    if (!options.includes(next[control.prop] as string | number)) next[control.prop] = options[0];
  }
  return next;
}

export function Playground({
  controls,
  render,
  code,
  stageMinHeight = 280,
}: {
  controls: Control[];
  render: (values: Values) => ReactNode;
  code: (values: Values) => string;
  stageMinHeight?: number;
}) {
  const [values, setValues] = useState<Values>(() =>
    Object.fromEntries(controls.map((control) => [control.prop, control.default])),
  );
  const set = (prop: string, value: string | number | boolean) =>
    setValues((current) => normalize(controls, { ...current, [prop]: value }));

  return (
    <div className="docs-sandbox">
      <div className="docs-sandbox__body">
        <div
          className="docs-sandbox__stage"
          style={{ minHeight: stageMinHeight }}
          data-pagefind-ignore
        >
          {render(values)}
        </div>
        <div className="docs-sandbox__controls" data-pagefind-ignore>
          {controls.map((control) => (
            <div key={control.prop} className="docs-sandbox__control">
              <span className="docs-sandbox__prop">{control.prop}</span>
              {control.type === "select" && (
                <div className="docs-sandbox__options" role="group" aria-label={control.prop}>
                  {optionsOf(control, values).map((option) => (
                    <button
                      key={option}
                      type="button"
                      className="docs-sandbox__option"
                      aria-pressed={values[control.prop] === option}
                      onClick={() => set(control.prop, option)}
                    >
                      {String(option)}
                    </button>
                  ))}
                </div>
              )}
              {control.type === "boolean" && (
                <button
                  type="button"
                  role="switch"
                  aria-checked={Boolean(values[control.prop])}
                  aria-label={control.prop}
                  className="docs-sandbox__switch"
                  onClick={() => set(control.prop, !values[control.prop])}
                >
                  <span />
                </button>
              )}
              {control.type === "text" && (
                <input
                  className="docs-sandbox__input"
                  value={String(values[control.prop])}
                  aria-label={control.prop}
                  onChange={(event) => set(control.prop, event.target.value)}
                />
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="docs-sandbox__code">
        <CopyCode text={code(values)}>
          <HighlightedCode code={code(values)} />
        </CopyCode>
      </div>
    </div>
  );
}

type Attr = string | number | boolean | { expr: string } | undefined;

/**
 * 사용하는 쪽이 그대로 복사해 쓸 JSX 코드를 만든다.
 * 문자열은 `prop="값"`, 숫자는 `prop={값}`, true는 `prop`, `{ expr }`는 `prop={식}`이고 undefined·false는 뺀다.
 */
export function jsx(
  name: string,
  attributes: Record<string, Attr>,
  children?: string,
  imports?: string[],
) {
  const parts = Object.entries(attributes).flatMap(([key, value]) => {
    if (value === undefined || value === false) return [];
    if (value === true) return [key];
    if (typeof value === "number") return [`${key}={${value}}`];
    if (typeof value === "object") return [`${key}={${value.expr}}`];
    return [`${key}="${value}"`];
  });
  const open = [name, ...parts].join(" ");
  const oneLine = children ? `<${open}>${children}</${name}>` : `<${open} />`;
  const element =
    oneLine.length <= 80
      ? oneLine
      : children
        ? `<${name}\n${parts.map((part) => `  ${part}`).join("\n")}\n>\n  ${children}\n</${name}>`
        : `<${name}\n${parts.map((part) => `  ${part}`).join("\n")}\n/>`;
  const names = [...new Set([name, ...(imports ?? [])])].sort();
  return `import { ${names.join(", ")} } from "@futurewiz-rms/mint";\n\n${element}`;
}
