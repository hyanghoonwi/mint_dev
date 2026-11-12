// 디자인 토큰(색·글자·반경·간격)을 일반 HTML에서도 클래스로 쓸 수 있도록, 토큰마다 유틸리티 클래스를 style.css에 포함시키는 목록을 만든다.
// style.css는 Tailwind가 "컴포넌트가 쓰는 클래스만" 만들기 때문에, 이 목록이 없으면 앱의 <div className="text-body-2-regular bg-background-default">가
// 적용되지 않는다. 토큰을 추가·삭제하면 이 스크립트를 다시 돌린다(`npm run tokens:utilities`, build에서도 자동 실행).
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const styles = (file) =>
  readFileSync(fileURLToPath(new URL(`../src/styles/${file}`, import.meta.url)), "utf8");
const target = fileURLToPath(new URL("../src/styles/token-utilities.css", import.meta.url));

// colors.css의 `@theme inline` 안 --color-* 이름
const colors = styles("colors.css");
const colorBlock = colors.slice(colors.indexOf("@theme inline"));
const colorNames = [...colorBlock.matchAll(/^\s*--color-([a-z0-9-]+):/gm)].map((m) => m[1]);

// typography.css의 --text-*(서브 속성 --text-*--line-height 등은 제외)
const textNames = [...styles("typography.css").matchAll(/^\s*--text-([a-z0-9-]+):/gm)]
  .map((m) => m[1])
  .filter((name) => !name.includes("--"));

// shape.css의 --radius-*
const radiusNames = [...styles("shape.css").matchAll(/^\s*--radius-([a-z0-9-]+):/gm)].map(
  (m) => m[1],
);

// shape.css의 --shadow-*
const shadowNames = [...styles("shape.css").matchAll(/^\s*--shadow-([a-z0-9-]+):/gm)].map(
  (m) => m[1],
);

// spacing.css의 --mint-spacing-<px>. Tailwind 클래스 번호는 px ÷ 4 (spacing-20 → 5)
const spacingSteps = [...styles("spacing.css").matchAll(/^\s*--mint-spacing-(\d+):/gm)].map((m) =>
  String(Number(m[1]) / 4),
);
const spacingPrefixes = [
  "p",
  "px",
  "py",
  "pt",
  "pr",
  "pb",
  "pl",
  "m",
  "mx",
  "my",
  "mt",
  "mr",
  "mb",
  "ml",
  "gap",
  "gap-x",
  "gap-y",
];

if (
  colorNames.length === 0 ||
  textNames.length === 0 ||
  radiusNames.length === 0 ||
  spacingSteps.length === 0
) {
  throw new Error(
    "토큰을 읽지 못했습니다. colors.css / typography.css / shape.css / spacing.css 형식을 확인하세요.",
  );
}

const group = (prefix, names) => `@source inline("${prefix}-{${names.join(",")}}");`;

const lines = [
  "/*",
  " * 자동 생성: node scripts/generate-token-utilities.mjs — 직접 고치지 않는다.",
  " * 토큰마다 유틸리티 클래스를 style.css에 포함시킨다. 앱의 일반 HTML에서도 Tailwind 없이 다음처럼 쓸 수 있다.",
  ` *   색: bg-/text-/border-/ring-<토큰>  (${colorNames.length}개)  예) bg-background-default text-text-primary border-border-default`,
  ` *   글자: text-<스타일>  (${textNames.length}개)  예) text-body-2-regular text-title-1-bold text-label-2-semibold`,
  ` *   반경: rounded-<값>  (${radiusNames.length}개)  예) rounded-8 rounded-12 rounded-full`,
  ` *   그림자: shadow-<이름>  (${shadowNames.length}개)  예) shadow-floating shadow-drawer`,
  ` *   간격: p-/m-/gap- 계열 <번호>  (${spacingSteps.length}단계)  예) p-5 gap-3 mt-8  (번호 = px ÷ 4, spacing-20 = p-5)`,
  " */",
  group("bg", colorNames),
  group("text", colorNames),
  group("border", colorNames),
  group("ring", colorNames),
  group("text", textNames),
  group("rounded", radiusNames),
  group("shadow", shadowNames),
  ...spacingPrefixes.map((prefix) => group(prefix, spacingSteps)),
  "",
];
writeFileSync(target, lines.join("\n"));
console.log(
  `token-utilities.css: 색 ${colorNames.length} · 글자 ${textNames.length} · 반경 ${radiusNames.length} · 그림자 ${shadowNames.length} · 간격 ${spacingSteps.length}`,
);
