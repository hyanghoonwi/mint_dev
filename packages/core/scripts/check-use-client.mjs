// 빌드 결과(dist)에 "use client"가 살아 있는지 검사한다.
// 소스(src/**/*.tsx|ts) 맨 위에 "use client"가 있으면, 대응하는 dist/**/*.js 맨 위에도 있어야 한다.
// 번들러가 지시어를 지우면 Next.js(App Router)에서 서버 컴포넌트로 취급되어 이벤트 핸들러·훅에서 오류가 난다.
// `npm run build`가 마지막에 자동으로 실행한다.
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join, relative, resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const src = join(root, "src");
const dist = join(root, "dist");
const DIRECTIVE = /^\s*(?:\/\/[^\n]*\n|\/\*[\s\S]*?\*\/\s*)*["']use client["']/;

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) =>
    entry.isDirectory() ? walk(join(dir, entry.name)) : [join(dir, entry.name)],
  );
}

const sources = walk(src).filter((file) => /\.tsx?$/.test(file) && !file.endsWith(".d.ts"));
const clientSources = sources.filter((file) => DIRECTIVE.test(readFileSync(file, "utf8")));

const problems = [];
for (const file of clientSources) {
  const out = join(dist, relative(src, file).replace(/\.tsx?$/, ".js"));
  if (!existsSync(out)) {
    problems.push(`${relative(root, out)}이(가) 없습니다. (원본: ${relative(root, file)})`);
  } else if (!DIRECTIVE.test(readFileSync(out, "utf8"))) {
    problems.push(`${relative(root, out)} 맨 위에 "use client"가 없습니다.`);
  }
}

if (problems.length > 0) {
  console.error(`"use client" 검사 실패 (${problems.length}건)\n- ${problems.join("\n- ")}`);
  process.exit(1);
}
console.log(`"use client" 검사 통과: 클라이언트 컴포넌트 ${clientSources.length}개`);
