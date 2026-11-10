// core의 CHANGELOG.md를 docs 페이지(content/getting-started/changelog.mdx)로 복사한다.
// 변경 이력 페이지의 원본은 packages/core/CHANGELOG.md 하나이고, content/getting-started/changelog.mdx는 생성물이라 커밋하지 않는다.
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const source = fileURLToPath(new URL("../../core/CHANGELOG.md", import.meta.url));
const target = fileURLToPath(new URL("../content/getting-started/changelog.mdx", import.meta.url));

const body = readFileSync(source, "utf8").replace(/^# .*\n+/, "");

writeFileSync(
  target,
  `# 변경 이력\n\n{/* 자동 생성: packages/core/CHANGELOG.md를 고치세요. 이 파일은 직접 고치지 않습니다. */}\n\n${body}`,
);
