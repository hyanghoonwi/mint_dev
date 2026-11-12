// 사이드바 정렬 검사: content/components/_meta.js의 각 분류(`---` 구분선) 안 항목이 알파벳 순인지 본다.
// 분류의 순서와 맨 앞 Overview는 그대로 두고, 분류 안에서만 비교한다(대소문자·띄어쓰기 무시).
// 어긋나면 올바른 순서를 알려 주고 실패한다. docs의 predev·prebuild에서 돌아서 순서가 틀린 채로 빌드되지 않는다.
// Overview 카드(src/components/site/Catalog.tsx)는 화면에서 이름순으로 정렬하므로 따로 검사하지 않는다.
import { pathToFileURL } from "node:url";
import { fileURLToPath } from "node:url";

const metaPath = fileURLToPath(new URL("../content/components/_meta.js", import.meta.url));
const { default: meta } = await import(pathToFileURL(metaPath).href);

const titleOf = (value) => (typeof value === "string" ? value : (value?.title ?? ""));
const groups = [];
let current = null;
for (const [key, value] of Object.entries(meta)) {
  if (key.startsWith("---")) {
    current = { name: titleOf(value), items: [] };
    groups.push(current);
  } else if (current) {
    current.items.push({ key, title: titleOf(value) });
  }
}

const compare = (first, second) =>
  first.title.localeCompare(second.title, "en", { sensitivity: "base" });
const problems = [];
for (const group of groups) {
  const sorted = [...group.items].sort(compare);
  if (sorted.some((item, index) => item.key !== group.items[index].key)) {
    problems.push(
      `[${group.name}] 지금: ${group.items.map((item) => item.title).join(", ")}\n` +
        `       맞는 순서: ${sorted.map((item) => item.title).join(", ")}`,
    );
  }
}

if (problems.length > 0) {
  console.error(
    `사이드바 정렬 검사 실패: content/components/_meta.js의 분류 안 항목을 알파벳 순으로 두세요.\n- ${problems.join("\n- ")}`,
  );
  process.exit(1);
}
console.log(`사이드바 정렬 검사 통과: Components 분류 ${groups.length}개`);
