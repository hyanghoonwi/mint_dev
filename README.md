# MINT Design System

> Mint to Coin, Coin to CryptoLab

크립토랩 서비스의 Next.js(App Router) 반응형 사이트를 위한 디자인 시스템입니다.
React 19, TypeScript, Tailwind CSS 4를 사용하며, npm workspaces로 라이브러리·Storybook·문서 사이트를 함께 관리합니다.

이 문서는 프로젝트를 인수인계받는 개발자가 **폴더의 역할과 작업 시작 위치**를 빠르게 찾기 위한 안내입니다.
코드를 수정하기 전에는 [저장소 작업 규칙](./AGENTS.md)을 먼저 읽습니다.

## 1. 프로젝트 구성과 패키지 관계

| 위치                                         | 패키지                | 역할                                                 | core를 참조하는 방식               |
| -------------------------------------------- | --------------------- | ---------------------------------------------------- | ---------------------------------- |
| [`packages/core`](./packages/core)           | `@futurewiz-rms/mint` | 서비스에 배포하는 컴포넌트·훅·디자인 토큰            | 라이브러리 원본                    |
| [`packages/storybook`](./packages/storybook) | `@mint/storybook`     | 컴포넌트 개발, 상태별 미리보기, 접근성·상호작용 검증 | Vite alias로 core 소스를 직접 참조 |
| [`packages/docs`](./packages/docs)           | `@mint/docs`          | 라이브러리 사용자를 위한 Nextra 문서 사이트          | core의 `dist/` 빌드 결과 참조      |

Storybook은 core를 미리 빌드하지 않아도 소스 변경을 확인할 수 있습니다.
docs는 개발 서버 시작과 빌드 전에 core를 자동으로 빌드합니다. docs 서버를 켠 상태에서 core를 수정했다면 core를 다시 빌드해야 합니다.

## 2. 루트 디렉토리

아래 트리는 유지보수에 필요한 폴더와 주요 파일을 중심으로 정리했습니다.
반복되는 컴포넌트·예시 파일은 일부만 표시하고, 빌드 결과는 별도 항목에서 설명합니다.

```text
MINT/
├── packages/                    # npm workspace 패키지와 문서 참고 자료
│   ├── core/                    # 실제 배포하는 MINT 라이브러리
│   ├── storybook/               # 개발자가 컴포넌트를 확인하는 샌드박스
│   ├── docs/                    # 라이브러리 사용자를 위한 문서 웹사이트
│   └── docs_ref/                # 로컬 문서 시안 참고 자료(아래 참고 사항 확인)
│       └── montage-screenshots/ # Montage 화면 참고 이미지
├── scripts/                     # 저장소 공통 관리 스크립트
│   └── format-docs-snippets.mjs # docs 코드 예시 포맷 정리
├── AGENTS.md                    # 저장소 수정 규칙·검증·배포 절차
├── CLAUDE.md                    # AGENTS.md를 불러오는 에이전트 안내
├── DOCS_SITE_REFERENCE.md       # 문서 사이트 디자인·구성 참고 문서
├── README.md                    # 프로젝트 구조와 인수인계 안내(현재 문서)
├── package.json                 # workspace 선언과 공통 실행 명령어
├── package-lock.json            # 의존성 버전을 고정하는 npm 잠금 파일
├── tsconfig.base.json           # 패키지에서 공유하는 TypeScript 기본 설정
├── .oxlintrc.json               # oxlint 코드 검사 설정
├── .prettierrc                  # Prettier 포맷 설정
├── .prettierignore              # 포맷 검사·수정에서 제외할 경로
└── .gitignore                  # Git 관리에서 제외할 경로
```

`packages/docs_ref/`는 작성 시점의 로컬 작업 폴더에 있지만 Git에는 추적되지 않은 참고 자료입니다.
`package.json`을 가진 실행 패키지가 아니며, 새로 clone한 환경에는 없을 수 있습니다.

## 3. core — 배포 라이브러리

컴포넌트의 실제 동작·스타일·공개 API를 수정하는 위치입니다.

```text
packages/core/
├── src/                         # 라이브러리 소스
│   ├── components/              # 컴포넌트별 구현 폴더
│   │   ├── _internal/           # 외부로 공개하지 않는 공통 구현·내부 훅
│   │   ├── button/              # Button 구현(새 컴포넌트 작성 시 참고)
│   │   ├── grid/                # Container·Grid 레이아웃 구현
│   │   ├── icon/                # 아이콘 기반 구현과 자동 생성 아이콘
│   │   ├── overlay/             # 오버레이 Provider·Context·훅
│   │   ├── toast/               # Toast와 관련 Provider·훅
│   │   └── …                    # text, checkbox, calendar 등 컴포넌트별 폴더
│   ├── hooks/                   # useClipboard·useDebounceValue·useInView
│   ├── styles/                  # 색·글자·간격·반응형·모서리·스크롤바 토큰과 CSS
│   ├── utils/                   # 클래스 병합(cn), 반응형 타입·클래스 처리
│   ├── index.ts                 # 사용하는 쪽에 공개하는 컴포넌트·타입·훅 export
│   ├── index.css                # 기본 스타일 빌드 진입점
│   └── index.no-reset.css       # reset을 제외한 스타일 빌드 진입점
├── guide/                       # 배포 패키지에 포함되는 상세 사용 가이드
│   ├── setup.md                 # 설치·스타일·토큰·반응형 설정
│   ├── actions.md               # 버튼 등 액션 컴포넌트 사용법
│   ├── display.md               # 표시 컴포넌트 사용법
│   ├── selection.md             # 선택·입력 관련 컴포넌트 사용법
│   ├── navigation.md            # 탭·페이지 이동 관련 사용법
│   ├── overlay.md               # 오버레이·토스트·스낵바와 관련 훅 사용법
│   ├── layout.md                # Container·Grid 레이아웃 사용법
│   ├── loading.md               # 로딩 표시 컴포넌트 사용법
│   ├── hooks.md                 # 공용 훅 사용법
│   └── icons.md                 # 아이콘 사용법과 이름 목록
├── scripts/                     # 라이브러리 생성·빌드·검증 도구
│   ├── icons.json               # 생성할 아이콘 목록의 원본
│   ├── generate-icons.mjs       # 아이콘 컴포넌트·카탈로그 생성
│   ├── generate-token-utilities.mjs # 토큰에서 유틸리티 CSS 생성
│   ├── build-theme.mjs          # 배포용 theme.css 생성
│   ├── check-use-client.mjs     # 빌드 결과의 "use client" 지시어 검사
│   └── check-guide-index.mjs    # 공개 API와 사용 가이드의 누락 검사
├── AGENTS.md                    # 라이브러리를 사용하는 쪽 AI를 위한 가이드 색인
├── CHANGELOG.md                 # 배포 변경 이력 원본
├── THIRD_PARTY_LICENSES.md      # 포함된 외부 자산의 라이선스 안내
├── package.json                 # 공개 경로·배포 파일·빌드 명령어·패키지 버전
├── vite.config.ts              # 라이브러리 빌드와 타입 선언 생성 설정
└── tsconfig.json               # core TypeScript 설정
```

일부 컴포넌트 폴더에는 해당 컴포넌트의 세부 규칙을 담은 `AGENTS.md`도 있습니다.
수정할 폴더에 이 파일이 있으면 함께 확인합니다.

## 4. Storybook — 개발·검증 화면

컴포넌트별 크기·변형·상태·반응형 동작을 확인하는 위치입니다.

```text
packages/storybook/
├── .storybook/                  # Storybook 공통 환경 설정
│   ├── main.ts                  # 스토리 탐색 경로와 애드온 설정
│   ├── preview.tsx              # 전역 미리보기·뷰포트·스토리 정렬·코드 패널 설정
│   ├── vite.shared.ts           # core 소스 alias 등 공유 Vite 설정
│   ├── manager.ts               # Storybook 관리 화면 설정
│   ├── manager-head.html        # 관리 화면의 HTML head 추가 설정
│   └── raw.d.ts                 # raw 파일 import 타입 선언
├── stories/                     # 카테고리/컴포넌트/Name.stories.tsx 형태의 스토리
│   ├── actions/                 # 버튼·아이콘 버튼 등 액션
│   ├── display/                 # 텍스트·아바타 등 표시 요소
│   ├── form/                    # 체크박스·라디오 등 폼 요소
│   ├── foundations/             # 색·타이포·간격 등 디자인 토큰 견본
│   ├── hooks/                   # 공개 훅 사용 예시
│   ├── layout/                  # Container·Grid 등 레이아웃
│   ├── loading/                 # 로딩 상태 표시
│   ├── navigation/              # 탭·페이지 이동 등 탐색 요소
│   └── overlay/                 # 알림·툴팁·토스트 등 오버레이
├── vitest.config.ts             # Storybook 기반 브라우저 테스트 설정
├── vitest.shims.d.ts            # 테스트 환경 타입 보조 선언
├── package.json                 # 개발 서버·정적 빌드·테스트 명령어
└── tsconfig.json                # 스토리 TypeScript 설정
```

## 5. docs — 사용자 문서 사이트

문서 본문은 `content/`, 사이트 UI는 `src/components/`, 실행되는 사용 예시는 `src/examples/`에서 관리합니다.

```text
packages/docs/
├── content/                     # URL에 대응하는 MDX 문서 본문
│   ├── index.mdx                # 첫 화면(/) 진입 문서
│   ├── _meta.js                 # 상단 탭과 페이지 구성
│   ├── getting-started/         # 소개·설치·변경 이력
│   ├── foundations/             # 색·타이포·간격·그리드·아이콘 등 기초 요소
│   ├── components/              # 컴포넌트별 사용법·Playground·예시·Props
│   └── utilities/               # 공개 훅 등 유틸리티 사용법
├── src/
│   ├── app/                     # Next.js App Router 진입점과 전역 스타일
│   │   ├── layout.tsx           # 앱 루트 레이아웃
│   │   ├── not-found.tsx        # 존재하지 않는 경로 화면
│   │   ├── docs.css             # 문서 사이트 전용 스타일
│   │   └── (docs)/              # URL에 이름이 붙지 않는 문서 라우트 그룹
│   │       ├── layout.tsx       # Nextra 문서 레이아웃·헤더 구성
│   │       └── [[...mdxPath]]/  # /를 포함한 MDX 문서 경로 렌더링
│   ├── components/              # 문서 사이트 공용 UI
│   │   ├── site/                # Home·Catalog·Foundations·Playground 등 화면 조각
│   │   ├── Example.tsx          # 예시 실행 화면과 같은 파일의 코드 표시
│   │   ├── NavParts.tsx         # 문서 내비게이션 UI
│   │   └── SearchModal.tsx      # Pagefind 검색 모달
│   ├── examples/                # 페이지 슬러그별 실행 가능한 TSX 예시
│   └── prismTheme.ts            # 코드 표시용 구문 강조 테마
├── public/                      # 사이트에서 제공하는 정적 파일
│   ├── brand/                   # 브랜드 이미지 자산
│   └── img/                     # 문서용 이미지 자산
├── scripts/                     # 문서 빌드 전후 처리
│   ├── sync-changelog.mjs       # core 변경 이력을 MDX 문서로 동기화
│   ├── check-sidebar-order.mjs  # 컴포넌트 사이드바의 알파벳 정렬 검사
│   └── build-search.mjs         # 빌드된 페이지에서 Pagefind 검색 색인 생성
├── AGENTS.md                    # docs 작업 시 추가로 읽을 규칙
├── mdx-components.tsx           # MDX에서 사용하는 컴포넌트 등록
├── next.config.mjs              # Nextra·Next.js·정적 내보내기 설정
├── mint-code-theme.mjs          # MDX 코드 블록의 구문 강조 테마
├── package.json                 # core 선행 빌드·문서 서버·검색 색인 명령어
└── tsconfig.json                # docs TypeScript 설정
```

각 `content/` 하위 문서 폴더의 `_meta.js`는 해당 탭의 사이드바 항목·그룹·순서를 정합니다.
예시를 수정할 때는 `src/examples/<페이지슬러그>/<이름>.tsx`를 고치면 미리보기와 표시 코드가 함께 바뀝니다.

## 6. 자동 생성 파일과 로컬 폴더

다음 경로는 설치·빌드·생성 명령으로 만들어집니다. 변경이 필요하면 원본 소스나 생성 설정을 수정합니다.

| 경로                                                  | 역할 / 생성 방법                                                    |
| ----------------------------------------------------- | ------------------------------------------------------------------- |
| `node_modules/`                                       | `npm install`로 설치되는 의존성                                     |
| `packages/core/dist/`                                 | `npm run build`로 생성되는 배포용 JS·타입 선언·CSS                  |
| `packages/core/src/components/icon/*.generated.ts`    | `icons.json`을 바탕으로 `icons:generate`가 생성하는 아이콘·카탈로그 |
| `packages/core/src/styles/token-utilities.css`        | `tokens:utilities` 또는 core 빌드에서 생성하는 토큰 유틸리티        |
| `packages/storybook/storybook-static/`                | `npm run build-storybook`의 정적 사이트 결과                        |
| `packages/docs/.next/`                                | Next.js 개발 캐시와 일반 빌드 결과                                  |
| `packages/docs/out/`                                  | `DOCS_EXPORT=1`로 docs를 빌드할 때 생성되는 정적 사이트             |
| `packages/docs/public/_pagefind/`                     | 일반 docs 빌드 후 생성되는 검색 색인                                |
| `packages/docs/out/_pagefind/`                        | 정적 docs 빌드 후 생성되는 검색 색인                                |
| `packages/docs/content/getting-started/changelog.mdx` | `core/CHANGELOG.md`에서 동기화되는 변경 이력 페이지                 |

`.git/`는 Git 이력, `.idea/`는 로컬 IDE 설정입니다. 애플리케이션 소스와 구분해서 봅니다.

## 7. 처음 실행하는 순서

명령어는 모두 저장소 루트에서 실행합니다.

```bash
npm install
npm run storybook   # 컴포넌트 개발 화면: http://localhost:6006
```

문서 사이트는 별도 터미널에서 실행합니다.

```bash
npm run docs        # 문서 개발 화면: http://localhost:3000
```

검색까지 확인하려면 개발 서버 대신 `npm run docs:preview`를 실행합니다.
문서 빌드와 검색 색인 생성을 마친 뒤 3000번 포트에서 서버를 시작하므로, 기존 docs 서버는 먼저 종료합니다.

| 목적                                          | 명령어                                       |
| --------------------------------------------- | -------------------------------------------- |
| core 빌드                                     | `npm run build`                              |
| Storybook 정적 빌드                           | `npm run build-storybook`                    |
| docs 빌드(선행 core 빌드·검색 색인 생성 포함) | `npm run build -w @mint/docs`                |
| docs 정적 내보내기                            | `DOCS_EXPORT=1 npm run build -w @mint/docs`  |
| 코드 검사                                     | `npm run lint`                               |
| 코드 포맷 검사                                | `npm run format:check`                       |
| README 포맷 검사                              | `npx prettier --check README.md`             |
| 사용 가이드 누락 검사                         | `npm run guide:check -w @futurewiz-rms/mint` |
| 문서 사이드바 정렬 검사                       | `npm run sidebar:check -w @mint/docs`        |
| Storybook 테스트                              | `npm run test -w @mint/storybook`            |

`npm run format:check`의 대상에는 루트 README가 포함되지 않으므로 README는 별도로 검사합니다.
전체 변경 유형별 검증 기준은 [AGENTS.md](./AGENTS.md)를 따릅니다.

## 8. 작업별로 찾아갈 위치

| 하고 싶은 작업                | 먼저 볼 위치                           | 함께 확인할 위치                                   |
| ----------------------------- | -------------------------------------- | -------------------------------------------------- |
| 컴포넌트 동작·스타일 수정     | `packages/core/src/components/<이름>/` | 해당 스토리·문서 페이지·사용 가이드                |
| 새 컴포넌트 공개              | `packages/core/src/index.ts`           | Storybook 정렬, docs 사이드바·Catalog, 가이드 색인 |
| 색·글자·간격·반응형 토큰 수정 | `packages/core/src/styles/`            | Foundations 스토리·문서, `guide/setup.md`          |
| 아이콘 추가·삭제              | `packages/core/scripts/icons.json`     | 생성 명령어, 아이콘 갤러리·문서·`guide/icons.md`   |
| 문서 설명·Props 표 수정       | `packages/docs/content/`               | 실제 core API와 해당 예시                          |
| 문서 예시 수정                | `packages/docs/src/examples/`          | 해당 MDX의 Example·ExampleTabs 연결                |
| 문서 첫 화면·Playground 수정  | `packages/docs/src/components/site/`   | `mdx-components.tsx`, `src/app/docs.css`           |
| 문서 메뉴 순서 수정           | `packages/docs/content/**/_meta.js`    | Components 분류 내 알파벳 정렬                     |
| 빌드·패키지 공개 범위 수정    | 각 패키지의 `package.json`과 빌드 설정 | `dist/` 결과, 타입 선언, `"use client"` 보존       |

예를 들어 Button을 수정하면 `core/src/components/button/`에서 구현을 변경하고,
`storybook/stories/actions/`의 해당 스토리, `docs/content/components/button.mdx`와 예시,
`core/guide/actions.md`를 같은 작업에서 확인·갱신합니다.

## 9. 인수인계 시 꼭 확인할 사항

- **core 변경은 Storybook·docs·사용 가이드까지 같은 작업에서 반영합니다.** 자세한 체크리스트는 루트 `AGENTS.md`에 있습니다.
- 루트 `AGENTS.md`는 저장소 개발 규칙이고, `core/AGENTS.md`와 `core/guide/`는 라이브러리를 사용하는 쪽을 위한 문서입니다.
- core는 Next.js 서버·클라이언트 양쪽에서 사용합니다. `"use client"` 기준과 빌드 결과 보존 검사를 확인합니다.
- 반응형은 CSS로 처리하고 `tablet:`·`desktop:` 구간과 MINT 토큰을 사용합니다.
- 아이콘·토큰 유틸리티·docs 변경 이력은 생성물을 직접 고치지 않고 원본을 수정합니다.
- 배포 대상은 `@futurewiz-rms/mint`이며 GitHub Packages를 사용합니다. 현재 배포는 수동이며, 절차와 버전·CHANGELOG 정책은 루트 `AGENTS.md`를 확인합니다.
