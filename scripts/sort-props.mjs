import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import ts from "typescript";
import { compareProps } from "./prop-order.mjs";

const write = process.argv.includes("--write");
const roots = [
  "packages/core/src/components",
  "packages/docs/src/components/site",
  "packages/docs/src/examples",
  "packages/storybook/stories",
  "packages/docs/content/components",
  "packages/docs/content/foundations",
];
const changed = [];

function nameOf(node, source) {
  const name = node.propertyName ?? node.name;
  return name && (ts.isIdentifier(name) || ts.isStringLiteral(name))
    ? name.text
    : name?.getText(source);
}

function sortSource(text, filename) {
  const source = ts.createSourceFile(
    filename,
    text,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );
  const edits = [];
  const mintComponents = new Set();
  const initializers = new Map();
  function collectInitializers(node) {
    if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name) && node.initializer) {
      initializers.set(node.name.text, node.initializer);
    }
    ts.forEachChild(node, collectInitializers);
  }
  collectInitializers(source);
  for (const statement of source.statements) {
    if (
      !ts.isImportDeclaration(statement) ||
      statement.moduleSpecifier.text !== "@futurewiz-rms/mint"
    )
      continue;
    const bindings = statement.importClause?.namedBindings;
    if (bindings && ts.isNamedImports(bindings)) {
      for (const binding of bindings.elements) mintComponents.add(binding.name.text);
    }
  }
  function reorder(
    nodes,
    separator,
    getName = (node) => nameOf(node, source),
    component = filename,
  ) {
    if (nodes.length < 2) return;
    const entries = nodes.map((node) => ({ node, name: getName(node) }));
    if (entries.some((entry) => !entry.name)) return;
    if (new Set(entries.map((entry) => entry.name)).size !== entries.length) return;
    // 평가 순서를 바꿀 수 있는 spread와 주석의 소속이 모호한 줄 끝 주석은 유지합니다.
    if (nodes.some((node) => node.dotDotDotToken || ts.isSpreadAssignment(node))) return;
    if (
      nodes.some((node) =>
        text.slice(node.pos, node.getStart(source)).split("\n")[0].includes("//"),
      )
    )
      return;
    // 앞 prop을 참조하는 기본값은 참조 대상 뒤에 둡니다.
    const pending = [...entries];
    const sorted = [];
    const bindings = new Map(
      entries.map((entry) => [entry.node.name?.getText(source), entry.name]),
    );
    while (pending.length) {
      const available = pending.filter((entry) => {
        if (!ts.isBindingElement(entry.node) || !entry.node.initializer) return true;
        let blocked = false;
        function dependencies(node) {
          if (ts.isIdentifier(node) && bindings.has(node.text)) {
            if (
              pending.some((other) => other !== entry && other.name === bindings.get(node.text))
            ) {
              blocked = true;
            }
          }
          ts.forEachChild(node, dependencies);
        }
        dependencies(entry.node.initializer);
        return !blocked;
      });
      available.sort((first, second) => compareProps(first.name, second.name, component));
      if (!available.length) return;
      const next = available[0];
      sorted.push(next);
      pending.splice(pending.indexOf(next), 1);
    }
    if (sorted.every((entry, index) => entry === entries[index])) return;
    const start = nodes[0].pos;
    const end = nodes.at(-1).end;
    // 내부 JSX는 다음 순회에서 정리하고 겹치는 편집은 적용하지 않습니다.
    if (edits.some((edit) => edit.start < end && edit.end > start)) return;
    edits.push({
      start,
      end,
      replacement: sorted.map(({ node }) => text.slice(node.pos, node.end).trim()).join(separator),
    });
  }
  const core = filename.startsWith("packages/core/");
  function visit(node) {
    ts.forEachChild(node, visit);
    if (core) {
      if (ts.isInterfaceDeclaration(node) && /Props$/.test(node.name.text)) {
        if (node.members.every(ts.isPropertySignature)) reorder(node.members, "\n");
      }
      if (ts.isTypeLiteralNode(node)) {
        let parent = node.parent;
        while (parent && !ts.isTypeAliasDeclaration(parent)) parent = parent.parent;
        if (
          parent &&
          /Props$/.test(parent.name.text) &&
          node.members.every(ts.isPropertySignature)
        ) {
          reorder(node.members, "\n");
        }
      }
      if (
        ts.isParameter(node) &&
        ts.isObjectBindingPattern(node.name) &&
        node.type &&
        /Props/.test(node.type.getText(source))
      ) {
        const entries = node.name.elements;
        reorder(
          entries.filter((entry) => !entry.dotDotDotToken),
          ",\n",
        );
      }
      return;
    }
    if (ts.isArrayLiteralExpression(node) && node.elements.length) {
      const controlName = (element) => {
        if (ts.isIdentifier(element)) element = initializers.get(element.text) ?? element;
        if (!ts.isObjectLiteralExpression(element)) return undefined;
        const prop = element.properties.find((property) => nameOf(property, source) === "prop");
        return prop && ts.isPropertyAssignment(prop) && ts.isStringLiteral(prop.initializer)
          ? prop.initializer.text
          : undefined;
      };
      // Text의 role → number → weight는 variant를 만드는 종속된 선택기입니다.
      if (!filename.endsWith("TextDocs.tsx")) reorder(node.elements, ",\n", controlName);
    }
    if (ts.isObjectLiteralExpression(node)) {
      const parent = node.parent;
      const storyProps =
        ts.isPropertyAssignment(parent) && ["args", "argTypes"].includes(nameOf(parent, source));
      const codeProps =
        ts.isCallExpression(parent) &&
        parent.expression.getText(source) === "jsx" &&
        parent.arguments[1] === node;
      const sharedProps =
        filename.endsWith("Docs.tsx") &&
        ((ts.isVariableDeclaration(parent) && parent.name.getText(source) === "common") ||
          (ts.isReturnStatement(parent) &&
            ts.isBlock(parent.parent) &&
            ts.isFunctionDeclaration(parent.parent.parent) &&
            /Props$/.test(parent.parent.parent.name?.text ?? "")));
      if (storyProps || codeProps || sharedProps) {
        reorder(node.properties, ",\n", undefined, codeProps ? parent.arguments[0].text : filename);
      }
    }
    if (
      ts.isJsxAttributes(node) &&
      mintComponents.has(node.parent.tagName.getText(source).split(".")[0])
    ) {
      // spread를 넘어서 이동하면 덮어쓰기 순서가 바뀌므로 각 구간 안에서만 정리합니다.
      let segment = [];
      for (const attribute of node.properties) {
        if (ts.isJsxSpreadAttribute(attribute)) {
          reorder(segment, " ", undefined, node.parent.tagName.getText(source));
          segment = [];
        } else segment.push(attribute);
      }
      reorder(segment, " ", undefined, node.parent.tagName.getText(source));
    }
  }
  visit(source);
  for (const edit of edits.sort((first, second) => second.start - first.start)) {
    const prefix = /\s/.test(text[edit.start]) ? text[edit.start] : "";
    text = text.slice(0, edit.start) + prefix + edit.replacement + text.slice(edit.end);
  }
  return text;
}

function sortTables(text, filename) {
  // 이름·타입·기본값·설명 표만 정리합니다. 예시·구성 표는 그대로 둡니다.
  return text.replace(/(^\| 이름[^\n]*\n\|[ -:|]+\n)((?:\|[^\n]*\n)+)/gm, (table, header, body) => {
    const rows = body.trimEnd().split("\n");
    const name = (row) => /^\|\s*`([^`]+)`/.exec(row)?.[1];
    if (rows.some((row) => !name(row))) return table;
    return (
      header +
      rows.sort((first, second) => compareProps(name(first), name(second), filename)).join("\n") +
      "\n"
    );
  });
}

for (const root of roots) {
  for (const entry of readdirSync(root, { recursive: true }).sort()) {
    if (!/\.(tsx?|mdx)$/.test(entry) || /generated|_internal|\.test\./.test(entry)) continue;
    const filename = `${root}/${entry}`;
    const original = readFileSync(filename, "utf8");
    let result = original;
    if (filename.endsWith(".mdx")) result = sortTables(result, filename);
    else {
      for (let pass = 0; pass < 20; pass++) {
        const next = sortSource(result, filename);
        if (next === result) break;
        result = next;
      }
    }
    if (result !== original) {
      changed.push(filename);
      if (write) writeFileSync(filename, result);
    }
  }
}
if (changed.length) console.log(changed.join("\n"));
console.log(
  `${changed.length}개 파일의 props 순서${write ? "를 정리했습니다." : "를 확인해야 합니다."}`,
);
if (!write && changed.length) process.exitCode = 1;
