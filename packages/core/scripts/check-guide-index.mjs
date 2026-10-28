// 사용 가이드(AGENTS.md 색인 + guide/*.md)가 공개 API와 어긋나지 않았는지 검사한다.
//  1) src/index.ts가 내보내는 컴포넌트·훅(PascalCase, use*)이 AGENTS.md 색인과 guide/ 어딘가에 모두 있는가
//  2) AGENTS.md와 guide/*.md 안의 상대 경로 링크가 실제 파일을 가리키는가
// 새 컴포넌트·훅을 추가했는데 가이드를 빠뜨리면 실패한다. `npm run guide:check -w @futurewiz-rms/mint`
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const read = (path) => readFileSync(path, "utf8");

const entry = read(join(root, "src/index.ts"));
// 아이콘 컴포넌트는 183개라서 이름마다 색인 한 줄을 요구하지 않는다. 대신 아래에서 icons.json의 모든 이름이 guide/icons.md에 있는지 본다.
const modules = [...entry.matchAll(/export \* from "\.\/(.+?)"/g)]
  .map((match) => match[1])
  .filter((path) => !path.startsWith("components/icon/"));

const publicNames = new Set();
for (const modulePath of modules) {
  for (const ext of [".tsx", ".ts"]) {
    const file = join(root, "src", modulePath + ext);
    if (existsSync(file)) {
      for (const match of read(file).matchAll(
        /^export (?:function|const|class) ([A-Za-z0-9_]+)/gm,
      )) {
        // 컴포넌트(PascalCase)와 훅(use…)만 검사한다. 유틸 함수·상수는 제외
        if (/^[A-Z][a-z]/.test(match[1]) || /^use[A-Z]/.test(match[1])) {
          publicNames.add(match[1]);
        }
      }
      break;
    }
  }
}

const index = read(join(root, "AGENTS.md"));
const guideDir = join(root, "guide");
const guideFiles = readdirSync(guideDir).filter((name) => name.endsWith(".md"));
const guideText = guideFiles.map((name) => read(join(guideDir, name))).join("\n");

const problems = [];
for (const name of [...publicNames].sort()) {
  if (!index.includes(`\`${name}`) && !index.includes(`${name}\``)) {
    problems.push(`AGENTS.md 색인에 \`${name}\`이(가) 없습니다.`);
  }
  if (!guideText.includes(name)) {
    problems.push(`guide/*.md에 \`${name}\` 설명이 없습니다.`);
  }
}

// 아이콘: scripts/icons.json의 모든 이름(kebab-case)이 guide/icons.md 목록에 있어야 한다
const iconGuide = read(join(guideDir, "icons.md"));
const iconGroups = JSON.parse(read(join(root, "scripts/icons.json")));
const iconNames = iconGroups.flatMap((group) => group.icons);
for (const name of iconNames) {
  if (!iconGuide.includes(`\`${name}\``)) {
    problems.push(`guide/icons.md 목록에 아이콘 \`${name}\`이(가) 없습니다.`);
  }
}

const docs = [
  ["AGENTS.md", index],
  ...guideFiles.map((name) => [`guide/${name}`, read(join(guideDir, name))]),
];
for (const [file, text] of docs) {
  for (const match of text.matchAll(/\]\((?!https?:|#|mailto:)([^)#\s]+)(#[^)]*)?\)/g)) {
    const target = resolve(dirname(join(root, file)), match[1]);
    if (!existsSync(target)) {
      problems.push(`${file}: 링크 대상이 없습니다 → ${match[1]}`);
    }
  }
}

if (problems.length > 0) {
  console.error(`가이드 검사 실패 (${problems.length}건)\n- ${problems.join("\n- ")}`);
  process.exit(1);
}
console.log(
  `가이드 검사 통과: 공개 컴포넌트·훅 ${publicNames.size}개, 아이콘 ${iconNames.length}개, 문서 ${docs.length}개`,
);
