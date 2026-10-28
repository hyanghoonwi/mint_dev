# 문서 사이트 참고 자료: Toss TDS Mobile은 무엇으로 만들었나

> 조사일: 2026-10-28
> 목적: MINT의 docs를 Docusaurus 밖으로 옮길지 판단할 때 쓰는 참고 자료입니다. **docs 이전은 현재 보류 중**입니다.

MINT docs는 지금 Docusaurus입니다(`packages/docs`). SEED(당근)나 TDS(토스)처럼 직접 만든 문서 사이트를 쓰려면 "SSG + MDX 위에 무엇을 얹는가"를 정해야 해서, 두 사례를 실제 소스로 확인했습니다.

## 한눈에 보기

| 사이트          | 문서 엔진                         | 프레임워크                        | 확인 방법                                  |
| --------------- | --------------------------------- | --------------------------------- | ------------------------------------------ |
| Toss TDS Mobile | **Nextra 2** + 직접 만든 컴포넌트 | Next.js Pages Router, 정적 사이트 | 배포된 페이지의 HTML과 JS 번들을 직접 분석 |
| 당근 SEED       | **Fumadocs**                      | Next.js 16 (App Router)           | 공개 저장소 `docs/package.json`의 의존성   |
| MINT (현재)     | Docusaurus 3                      | React (Next.js 아님)              | 이 저장소                                  |

## Toss TDS Mobile

대상 페이지: <https://tossmini-docs.toss.im/tds-mobile/components/bubble/>

### 기반은 Nextra 2 (Next.js Pages Router)

| 확인한 것           | 근거                                                                                                               |
| ------------------- | ------------------------------------------------------------------------------------------------------------------ |
| Nextra              | HTML에 `nextra-content`, `nextra-sidebar-container`, `nextra-toc`와 `nx-` 접두어 클래스. 번들에 `__nextra_pageMap` |
| MDX 파일            | 번들 안에 `filePath: "pages/components/bubble.mdx"`와 `MDXContent`                                                 |
| Next.js 정적 사이트 | `/_next/static/...`, `chunks/pages/_app-*.js`, `__N_SSG: true`. 서버는 S3 + CloudFront                             |
| MDX 런타임          | `@mdx-js/react`의 컴포넌트 매핑 훅                                                                                 |
| 목차                | MDX 컴파일 때 제목에서 뽑은 `__toc` 배열                                                                           |

### 직접 커스텀한 부분

**1. 테마 설정** (표준 옵션을 바꾼 것)

`logo: "TDS Mobile"`, 다크 모드 끔(`forcedTheme: "light"`), 피드백·편집 링크·푸터 제거, 사이드바 접힘 단계 1.

**2. MDX에서 쓰는 컴포넌트를 직접 만들어 테마 설정의 `components`에 등록**

| 컴포넌트            | 하는 일                                                                |
| ------------------- | ---------------------------------------------------------------------- |
| `PreviewBox`        | 컴포넌트 미리보기 상자                                                 |
| `SSGReactLiveBlock` | 예시 코드를 그리고 **편집해 볼 수 있게** 하는 블록("Editable Example") |
| `SSGPropTables`     | props 표(속성, 타입, 기본값, 필수 여부, 설명)                          |
| `SSGMDXRenderer`    | 설명 문장을 MDX로 한 번 더 렌더링                                      |

**3. 데이터를 빌드 때 만들어 주입**

각 MDX 페이지가 `getStaticProps`로 `ssg` 데이터를 내려줍니다.

- `tsDoc`: TypeScript 타입에서 뽑은 props 정보(`name`, `type`, `defaultValue`, `required`, `description`)
- `Basic`, `ColorVariantBubble` 같은 키: **예시 코드가 문자열**로 들어 있음

그래서 MDX 본문에는 키 이름만 적고, 코드와 표는 데이터에서 채워집니다.

```mdx
<SSGReactLiveBlock of="ColorVariantBubble" />

<SSGPropTables of="tsDoc" />
```

### 확인하지 못한 것

- 예시를 실행하는 라이브러리 이름. `react-live`로 보이는 구조(Provider + Editor + Preview + Error 조합)이지만 번들이 압축되어 이름 문자열은 찾지 못했습니다.
- `tsDoc`을 만드는 도구. 빌드 때만 도는 코드라 번들에 없습니다.
- Nextra의 정확한 버전(2.x로 보이지만 번들에 표기가 없음).

### 이 분석을 다시 하는 방법

번들은 `view-source`로 받을 수 있는 공개 파일입니다. 받은 파일은 읽기만 하고 실행하지 않습니다.

1. 페이지 HTML을 받아 `<script id="__NEXT_DATA__">`의 JSON을 본다. `pageProps.ssg`에 예시 코드와 `tsDoc`이 있다.
2. HTML의 `src="/_next/static/chunks/..."` 목록에서 `pages/components/<이름>-*.js`를 받는다. Prettier로 정리하면 컴파일된 MDX를 읽을 수 있다.
3. 번들에서 `pageOpts`(`filePath`, `pageMap`), `nextra`, `SSG*` 같은 이름을 찾는다.

## 당근 SEED

공개 저장소 `daangn/seed-design`의 `docs/package.json` 의존성 기준입니다.

| 역할               | 사용 기술                                 |
| ------------------ | ----------------------------------------- |
| 프레임워크         | Next.js 16 (App Router)                   |
| 문서 엔진          | Fumadocs (`fumadocs-core`, `fumadocs-ui`) |
| props 표 자동 생성 | `fumadocs-typescript`, `fumadocs-docgen`  |
| 코드 하이라이트    | `shiki`                                   |
| 일부 콘텐츠        | Sanity(헤드리스 CMS)                      |
| 컴포넌트 확인      | Storybook (`@storybook/nextjs-vite`)      |

SEED 이름의 의미는 [디자인컴퍼스 기사](https://designcompass.org/2026/07/27/daangn-seed-design-system-rebranding/)에 있습니다. 슬로건은 "Seed to Root, Root to Daangn"입니다.

## 두 사례의 공통점

- **문서 엔진 위에 얹고 화면은 직접 만든다.** MDX를 처음부터 처리하는 곳은 없습니다(Nextra, Fumadocs).
- **props 표를 TypeScript 타입에서 자동으로 만든다.** 표가 소스와 어긋나는 문제가 없습니다. MINT는 지금 표를 손으로 씁니다.
- **예시 코드를 파일 하나에서 가져온다.** MINT가 이미 `<Example name="…" />`로 하는 방식과 같습니다.
- 문서 사이트가 컴포넌트 라이브러리의 **실제 사용처**가 됩니다. 라이브러리를 Next.js에서 쓸 때 서버 컴포넌트 문제가 문서 빌드에서 바로 드러납니다.

## MINT에 주는 시사점

| 선택지                         | 장점                                                                   | 단점                                                                              |
| ------------------------------ | ---------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| Docusaurus 유지 (현재)         | 사이드바, 검색, 다크 모드, 깨진 링크 검사가 들어 있음. 이전 비용 없음  | 디자인을 바꾸기 어렵고 Infima CSS가 컴포넌트에 새어 들어옴                        |
| Next.js + Fumadocs (SEED 방식) | 디자인 자유, props 표 자동화, App Router, MINT를 Next.js에서 실제 검증 | 처음 옮기는 작업이 있음                                                           |
| Next.js + Nextra               | 토스가 쓰는 검증된 구성                                                | 토스 사이트는 Nextra 2(Pages Router)라 새로 시작하면 최신 버전을 따로 확인해야 함 |

옮기게 되면 먼저 챙길 것은 두 가지입니다.

1. `<Example>`을 만드는 remark 플러그인(`packages/docs/plugins/remark-example.ts`)은 remark 기반이라 그대로 옮길 수 있다.
2. props 표는 TypeScript 타입에서 만드는 방식(`fumadocs-typescript` 등)으로 바꾸면 손으로 쓰는 `## Props` 표를 없앨 수 있다.

문서가 적을수록 옮기는 비용이 쌉니다.
