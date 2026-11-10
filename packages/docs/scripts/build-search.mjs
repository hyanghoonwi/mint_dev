// 빌드가 끝난 뒤 검색 색인(Pagefind)을 만든다. 한국어 부분 단어 검색도 된다.
//  - 정적 내보내기(DOCS_EXPORT=1): out/ 을 읽어 out/_pagefind 에 만든다
//  - 일반 빌드: .next/server/app 을 읽어 public/_pagefind 에 만든다(`next start`가 public/ 을 제공한다)
import { execFileSync } from "node:child_process";

const exported = Boolean(process.env.DOCS_EXPORT);
const [site, output] = exported
  ? ["out", "out/_pagefind"]
  : [".next/server/app", "public/_pagefind"];

execFileSync("npx", ["pagefind", "--site", site, "--output-path", output], { stdio: "inherit" });
