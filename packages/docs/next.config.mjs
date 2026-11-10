import nextra from "nextra";
import { mintCodeTheme } from "./mint-code-theme.mjs";

const withNextra = nextra({
  // 검색: 코드 블록은 색인에서 제외한다(검색 결과에 코드 조각이 섞이지 않게)
  search: { codeblocks: false },
  mdxOptions: {
    // 라이트·다크 모두 같은 어두운 코드 테마를 쓴다
    rehypePrettyCodeOptions: { theme: { light: mintCodeTheme, dark: mintCodeTheme } },
  },
});

// DOCS_EXPORT=1이면 서버 없이 올릴 수 있는 정적 파일(out/)로 내보낸다(nginx 같은 정적 호스팅용).
// 지정하지 않으면 `next start`로 띄우는 일반 빌드다.
const staticExport = Boolean(process.env.DOCS_EXPORT);

export default withNextra({
  reactStrictMode: true,
  ...(staticExport ? { output: "export", images: { unoptimized: true } } : {}),
});
