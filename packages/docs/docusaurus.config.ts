import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";
import corePkg from "../core/package.json";
import remarkUnwrapJsxParagraph from "./plugins/remark-unwrap-jsx-paragraph";
import remarkExample from "./plugins/remark-example";

// 같은 서버의 경로(/storybook/)는 문서가 아니라서 `pathname://`로 써야 깨진 링크 검사를 통과한다
const storybookUrl = process.env.STORYBOOK_URL ?? "http://localhost:6006";
const storybookHref = storybookUrl.startsWith("/") ? `pathname://${storybookUrl}` : storybookUrl;

const config: Config = {
  title: "MINT",
  tagline: "Mint to Coin, Coin to CryptoLab",
  favicon: "img/mint-symbol.svg",
  // TODO: 배포 주소가 정해지면 바꾼다
  url: "http://localhost:3000",
  baseUrl: "/",
  onBrokenLinks: "throw",
  // 홈 배지 등에서 라이브러리 버전을 쓴다 (core/package.json이 기준)
  customFields: { version: corePkg.version },
  i18n: { defaultLocale: "ko", locales: ["ko"] },

  // 검색: 빌드할 때 색인을 만들어 사이트에 포함하는 로컬 검색(외부 서비스 없음). 사내용이라 Algolia 대신 쓴다.
  themes: [
    [
      "@easyops-cn/docusaurus-search-local",
      {
        // 색인 파일 이름에 해시를 붙여 배포 후에도 옛 색인이 캐시되지 않게 한다
        hashed: true,
        // 한국어와 영어(컴포넌트·prop 이름)를 함께 검색한다
        language: ["en", "ko"],
        docsRouteBasePath: "/docs",
        indexBlog: false,
        highlightSearchTermsOnTargetPage: true,
        searchResultLimits: 10,
        searchBarShortcutHint: true,
      },
    ],
  ],

  presets: [
    [
      "classic",
      {
        docs: {
          sidebarPath: "./sidebars.ts",
          routeBasePath: "docs",
          remarkPlugins: [remarkExample, remarkUnwrapJsxParagraph],
        },
        blog: false,
        theme: { customCss: "./src/css/custom.css" },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    navbar: {
      // 심볼 + 워드마크 가로형 로고. 원본은 디자인 export(mint_horizontal_*.ai)를 SVG로 옮기고 여백만 잘라 냈다.
      // 라이트: white 버전(어두운 글자), 다크: ink 버전(밝은 글자)
      logo: {
        alt: "MINT",
        src: "img/mint-logo-light.svg",
        srcDark: "img/mint-logo-dark.svg",
        height: 28,
      },
      items: [
        { type: "docSidebar", sidebarId: "main", label: "Docs", position: "left" },
        { type: "doc", docId: "changelog", label: "Version", position: "left" },
        // Storybook 주소. 로컬 개발은 6006이고, 배포 이미지에서는 STORYBOOK_URL로 정한다
        { href: storybookHref, label: "Storybook", position: "right" },
        { href: "https://github.com/futurewiz-rms/MINT", label: "GitHub", position: "right" },
      ],
    },
    colorMode: { defaultMode: "light", respectPrefersColorScheme: true },
    footer: {
      style: "dark",
      links: [
        {
          title: "링크",
          items: [
            { label: "Storybook", href: storybookHref },
            { label: "GitHub", href: "https://github.com/futurewiz-rms/MINT" },
          ],
        },
      ],
      copyright: `© ${new Date().getFullYear()} Futurewiz. All rights reserved.`,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
