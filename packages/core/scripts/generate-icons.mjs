// Figma "Icon / Components"(node 60:195)의 아이콘 183개를 컴포넌트로 만든다.
// Figma 아이콘은 Phosphor Icons의 Regular(Line)와 Fill이라서, 같은 이름의 SVG를 @phosphor-icons/core에서 읽는다(MIT).
//
// 입력: scripts/icons.json (Figma 가이드의 분류와 아이콘 이름. 아이콘을 더하고 빼는 곳은 여기 하나다)
//       node_modules/@phosphor-icons/core/assets/{regular,fill}/<이름>.svg
// 출력: src/components/icon/icons.generated.ts (아이콘 컴포넌트, 이름 하나당 export 하나)
//       src/components/icon/iconCatalog.generated.ts (분류별 이름 목록. 갤러리·문서가 쓴다)
//
// 아이콘을 더하거나 뺀 뒤에는 `npm run icons:generate`를 실행한다. 직접 고치지 않는다.
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const here = (path) => fileURLToPath(new URL(path, import.meta.url));

const catalog = JSON.parse(readFileSync(here("./icons.json"), "utf8"));
const names = catalog.flatMap((group) => group.icons);

const duplicated = names.filter((name, index) => names.indexOf(name) !== index);
if (duplicated.length > 0) {
  throw new Error(`icons.json에 중복된 아이콘이 있습니다: ${duplicated.join(", ")}`);
}

// arrow-left → ArrowLeftIcon
const componentName = (name) =>
  `${name
    .split("-")
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join("")}Icon`;

// SVG 파일에서 path의 d 값만 꺼낸다. 요소가 path 하나가 아니면 형식이 바뀐 것이라 멈춘다.
function pathData(file) {
  // 패키지가 공개한 경로(`@phosphor-icons/core/assets/regular/*.svg` 등)로 파일을 찾는다
  const svg = readFileSync(require.resolve(`@phosphor-icons/core/assets/${file}`), "utf8");
  const paths = [...svg.matchAll(/<path\b[^>]*\sd="([^"]+)"[^>]*\/?>/g)];
  const otherElements = [...svg.matchAll(/<(?!svg\b|path\b|\/)([a-z]+)/g)];
  if (paths.length !== 1 || otherElements.length > 0) {
    throw new Error(`${file}: path 하나가 아닙니다. 생성 방식을 다시 정해야 합니다.`);
  }
  return paths[0][1];
}

const lines = [
  "// 자동 생성: node scripts/generate-icons.mjs — 직접 고치지 않는다.",
  "// 원본: Phosphor Icons (MIT, Copyright (c) 2023 Phosphor Icons). 라이선스는 THIRD_PARTY_LICENSES.md에 있다.",
  "// `/* @__PURE__ */`는 쓰지 않는 아이콘이 앱 번들에서 빠지도록 하는 표시다. 지우지 않는다.",
  'import { createIcon } from "./Icon";',
  "",
];
for (const name of names) {
  const line = pathData(`regular/${name}.svg`);
  const fill = pathData(`fill/${name}-fill.svg`);
  lines.push(
    `export const ${componentName(name)} = /* @__PURE__ */ createIcon("${componentName(name)}", "${line}", "${fill}");`,
  );
}
writeFileSync(here("../src/components/icon/icons.generated.ts"), `${lines.join("\n")}\n`);

const catalogLines = [
  "// 자동 생성: node scripts/generate-icons.mjs — 직접 고치지 않는다.",
  "// Figma 가이드의 분류와 아이콘 이름. 이름은 kebab-case이고, 컴포넌트 이름은 `<PascalCase>Icon`이다(arrow-left → ArrowLeftIcon).",
  `export const iconCatalog = ${JSON.stringify(catalog, null, 2)} as const;`,
  "",
  'export type IconName = (typeof iconCatalog)[number]["icons"][number];',
  "",
];
writeFileSync(here("../src/components/icon/iconCatalog.generated.ts"), catalogLines.join("\n"));

console.log(`icons.generated.ts: 아이콘 ${names.length}개 (분류 ${catalog.length}개)`);
