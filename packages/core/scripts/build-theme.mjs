// 앱이 자체 Tailwind(v4)를 쓸 때 MINT 토큰만 가져다 쓰도록 `dist/theme.css`를 만든다. (@futurewiz-rms/mint/theme.css)
// 유틸리티 클래스·리셋·폰트 import는 포함하지 않고, 토큰(색·글자·반경·브레이크포인트)과 다크 값만 담는다.
//  - Tailwind 앱: `@import "tailwindcss"; @import "@futurewiz-rms/mint/theme.css";` → bg-fill-brand, text-body-2-regular, rounded-8 …
//  - Tailwind 없는 앱: `@theme`·`@custom-variant`는 브라우저가 무시하고, :root / [data-theme="dark"] 변수(--mint-*)만 적용된다.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const read = (file) =>
  readFileSync(fileURLToPath(new URL(`../src/styles/${file}`, import.meta.url)), "utf8");
const outputFile = fileURLToPath(new URL("../dist/theme.css", import.meta.url));

const header = `/*
 * @futurewiz-rms/mint 테마 토큰 (색 · 글자 · 반경 · 브레이크포인트) — 자동 생성, 직접 고치지 않는다.
 * 컴포넌트용 전체 스타일은 style.css, 리셋 없는 버전은 style.no-reset.css를 쓰고,
 * 이 파일은 앱의 자체 Tailwind v4에서 MINT 토큰만 쓰고 싶을 때 import한다.
 */

/* [data-theme="dark"] 속성 기반으로 dark: variant가 동작하도록 설정 */
@custom-variant dark (&:where([data-theme="dark"], [data-theme="dark"] *));
`;

mkdirSync(fileURLToPath(new URL("../dist", import.meta.url)), { recursive: true });
writeFileSync(
  outputFile,
  [
    header,
    read("atomic.css"),
    read("colors.css"),
    read("typography.css"),
    read("shape.css"),
    read("layout.css"),
  ].join("\n"),
);
console.log("dist/theme.css 생성");
