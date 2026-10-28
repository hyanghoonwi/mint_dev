# MINT 저장소 작업 가이드 (AI 에이전트·개발자용)

이 저장소(MINT Design System)에서 코드를 고치기 **전에 이 파일을 먼저 읽습니다.**
(`CLAUDE.md`는 이 파일을 불러오므로 내용이 같습니다.)

> 이 문서는 **저장소를 수정하는 사람**을 위한 것입니다. 라이브러리를 **가져다 쓰는 사람**을 위한 가이드는 [`packages/core/AGENTS.md`](./packages/core/AGENTS.md)(색인)와 `packages/core/guide/`(상세)이고, 패키지에 함께 배포됩니다.

MINT는 크립토랩 서비스의 **Next.js(App Router) 반응형 사이트**에서 쓰는 디자인 시스템입니다. 슬로건은 _Mint to Coin, Coin to CryptoLab_ 입니다. 디자인 시스템은 같은 틀로 코인을 찍어 내는 조폐소이고, 컴포넌트는 그 코인입니다.

**목차** — [대원칙](#대원칙) · [저장소 구조](#저장소-구조) · [변경 유형별 체크리스트](#변경-유형별-체크리스트) · [Next.js·SSR 규칙](#nextjsssr-규칙) · [반응형 규칙](#반응형-규칙) · [컴포넌트 작성 규칙](#컴포넌트-작성-규칙) · [스토리 규칙](#storybook-규칙) · [사용 가이드](#사용-가이드-작성-규칙) · [문서 규칙](#문서-규칙) · [검증](#검증-끝내기-전에-반드시) · [Version과 CHANGELOG](#version과-changelog) · [배포](#배포) · [Git](#git) · [주의할 함정](#주의할-함정)

---

## 대원칙

> # core를 고치면 Storybook·docs·사용 가이드도 **같은 작업에서** 고친다
>
> `packages/core`의 컴포넌트·props·동작·토큰을 **추가하거나 수정하거나 삭제하면**, 아래 세 곳을 같은 변경에서 반드시 함께 갱신합니다. "나중에 한꺼번에"는 허용하지 않습니다.
>
> 1. **Storybook** — `packages/storybook/stories/` 의 해당 스토리
> 2. **docs** — `packages/docs/docs/` 의 해당 문서 페이지
> 3. **사용 가이드** — `packages/core/AGENTS.md`(색인)와 `packages/core/guide/*.md`(상세). 배포 패키지에 포함되어 사용하는 쪽 AI가 읽는 문서입니다.
>
> 그리고 core를 고칠 때마다 `packages/core/CHANGELOG.md`의 `## 미배포`에 변경을 적습니다(docs의 "Version" 페이지는 이 파일에서 자동으로 만들어집니다).
>
> 셋 중 하나라도 빠지면 작업이 끝난 것이 아닙니다. 작업을 마칠 때 최종 보고에 **세 곳을 각각 어떻게 갱신했는지** 적습니다. 갱신할 것이 없다고 판단했다면 그 이유를 적습니다.

왜 이렇게 하나요?

- docs는 사용자가 읽는 유일한 설명서이고, `packages/core/AGENTS.md`는 사용하는 쪽 AI가 읽는 유일한 설명서입니다. 코드와 어긋나면 사용자와 AI가 **틀린 코드를 씁니다.**
- Storybook은 우리가 컴포넌트를 확인하는 기준입니다. 스토리가 없으면 변경이 눈에 보이지 않아 회귀를 놓칩니다.

---

## 저장소 구조

npm workspaces 모노레포입니다.

| 위치                 | 이름                  | 역할                                       | core를 읽는 방식                              |
| -------------------- | --------------------- | ------------------------------------------ | --------------------------------------------- |
| `packages/core`      | `@futurewiz-rms/mint` | 컴포넌트·토큰. **배포되는 라이브러리**     | —                                             |
| `packages/storybook` | `@mint/storybook`     | 개발용 샌드박스, a11y·vitest, 화면 폭 확인 | vite alias로 **소스** 직접 참조 (빌드 불필요) |
| `packages/docs`      | `@mint/docs`          | Docusaurus 문서 사이트                     | core의 **빌드 결과(`dist`)** 사용             |

- `packages/docs`의 `dev`/`build`는 실행 전에 core를 먼저 빌드합니다(`predev`/`prebuild`).

### 명령어 (저장소 루트에서)

```bash
npm install
npm run storybook          # Storybook 개발 서버 (6006)
npm run build              # core 빌드 (토큰 → tsc → vite → css → theme → "use client" 검사)
npm run build-storybook    # Storybook 정적 빌드
npm run lint               # oxlint
npm run format:check       # 포맷 검사
npm run guide:check -w @futurewiz-rms/mint  # 사용 가이드가 공개 컴포넌트·훅과 맞는지 검사
npm run format:docs        # docs의 md/mdx와 코드 예시 포맷
npm run docs               # docs 개발 서버 (3000, 검색 안 됨)
npm run docs:preview       # docs 빌드 후 서버 (3000, 검색 됨)
npm run build -w @mint/docs # docs 빌드 (깨진 링크는 오류)
```

---

## 변경 유형별 체크리스트

변경한 것에 해당하는 줄의 **모든 칸**을 확인합니다.

| 변경                | core                                                                                                                                                    | Storybook                                                                 | docs                                                                          | 사용 가이드 (`core/AGENTS.md`·`guide/`)                                |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- | ----------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| **새 컴포넌트**     | 컴포넌트 작성, `src/index.ts`에 export, `"use client"` 필요 여부 판단([기준](#nextjsssr-규칙))                                                          | 스토리 파일 추가, `.storybook/preview.tsx`의 `storySort` 순서에 이름 추가 | `docs/components/common/<name>.mdx` 추가(`sidebar_position`), `intro.md` 목록 | 색인에 한 줄 + `guide/` 해당 파일에 props 상세                         |
| **props 추가·변경** | 구현                                                                                                                                                    | `argTypes`와 해당 prop을 보여 주는 스토리 추가·수정                       | 해당 페이지의 예시, `## Props` 표 수정                                        | `guide/` 해당 컴포넌트 항목 수정                                       |
| **props 삭제·개명** | 구현                                                                                                                                                    | 모든 스토리에서 제거·치환                                                 | 모든 예시와 Props 표, 다른 문서에서 쓰던 곳                                   | `guide/`의 표·예시 수정                                                |
| **동작·스타일**     | 구현                                                                                                                                                    | 변경이 보이는 스토리 추가·수정                                            | 설명 문장과 예시가 여전히 맞는지 확인                                         | 관련 규칙이 바뀌면 수정                                                |
| **반응형 동작**     | CSS(브레이크포인트 접두어·CSS 변수)로만 구현                                                                                                            | 뷰포트(360 · 768 · 1024 · 1440)를 바꿔 확인하는 스토리                    | 모바일·데스크톱 차이를 설명                                                   | 반응형 동작 설명                                                       |
| **토큰**            | `src/styles/*.css`. 추가·삭제하면 `npm run tokens:utilities -w @futurewiz-rms/mint`(build도 자동 실행). 텍스트 스타일 토큰은 `src/utils/cn.ts`에도 등록 | Foundations 스토리 확인                                                   | `docs/foundations/*.mdx`                                                      | `guide/setup.md`의 토큰 표                                             |
| **아이콘**          | `scripts/icons.json`에 이름 추가·삭제 후 `npm run icons:generate -w @futurewiz-rms/mint`. Figma `Icon / Components`에 먼저 있어야 함                    | `Gallery` 스토리가 목록을 자동 반영하는지 확인                            | `docs/components/common/icon.mdx`의 설명·개수 확인(갤러리는 자동)             | `guide/icons.md`의 분류별 목록에 이름 추가(`guide:check`가 검사), 개수 |
| **컴포넌트 삭제**   | 파일·export 삭제                                                                                                                                        | 스토리 삭제, `storySort` 정리                                             | 문서 페이지 삭제, 다른 문서의 링크 제거, `intro.md`                           | 색인과 `guide/`에서 삭제                                               |
| **훅·Provider**     | 구현(`"use client"`), export                                                                                                                            | `Hooks/<name>` 스토리                                                     | `docs/hooks/<name>.mdx`, `sidebars.ts`에 Hooks 카테고리                       | 색인 + `guide/setup.md`(Provider 필요 여부)                            |

---

## Next.js·SSR 규칙

MINT는 Next.js App Router에서 **서버 컴포넌트와 클라이언트 컴포넌트 양쪽에서** import됩니다. 아래를 어기면 타입체크와 Storybook은 통과해도 사용하는 앱에서 깨집니다.

### `"use client"` 기준

- 컴포넌트 파일이 **`useState`·`useEffect`·`useRef` 등 훅, 이벤트 핸들러 정의, 브라우저 API, Context** 중 하나라도 쓰면 파일 맨 위에 `"use client";`를 씁니다.
- 위에 해당하지 않는 순수 표시 컴포넌트(`Button`처럼 받은 props를 그대로 DOM에 넘기는 것)에는 **붙이지 않습니다.** 서버 컴포넌트로 남아야 사용하는 쪽의 JS가 줄어듭니다.
- `"use client"`는 React가 아니라 Next.js 같은 RSC 번들러가 읽는 지시어입니다. Vite 등 일반 React 앱에서는 무시되므로 붙여도 해가 없습니다.
- **빌드 결과에 지시어가 남아야 합니다.** core는 파일 단위로 빌드(`preserveModules`)하고, `npm run build` 마지막에 `scripts/check-use-client.mjs`가 소스와 `dist`를 대조합니다. 이 검사가 실패하면 배포하지 않습니다. 빌드를 파일 하나로 합치는 설정으로 바꾸지 않습니다.

### 금지 사항

- **렌더 중 브라우저 API 접근 금지**: `window`, `document`, `localStorage`, `matchMedia`, `navigator`는 `useEffect`나 이벤트 핸들러 안에서만 씁니다.
- **ID는 `useId()`만** 씁니다. `Math.random()`, 전역 카운터, `Date.now()`로 만든 값을 렌더에 쓰면 hydration 불일치가 납니다.
- **현재 시각에 의존하는 렌더 금지**: "오늘", 상대 시간("3분 전")처럼 서버와 클라이언트 값이 달라지는 것은 사용하는 쪽이 값으로 넘기게 합니다.
- **`next/*` import 금지**: `next/link`, `next/image`, `next/navigation`을 core에서 쓰지 않습니다. 링크가 필요한 컴포넌트는 링크 컴포넌트를 prop으로 주입받습니다(예: `linkComponent`). core는 Next.js 없이도 동작해야 합니다.
- **JS에서 CSS import 금지**: `src/index.ts`나 컴포넌트에서 `.css`를 import하지 않습니다. 스타일은 사용하는 쪽이 `app/layout.tsx`에서 `style.css`를 한 번 불러옵니다.
- **포털은 마운트 이후에만**: 오버레이가 `document.body`를 참조하는 것은 `useEffect` 이후입니다.

---

## 반응형 규칙

- **모바일 우선**: 클래스의 기본값이 모바일이고, 넓은 화면 값은 `tablet:`, `desktop:`처럼 덧붙입니다.
- **구간은 Figma 가이드의 3단계뿐**입니다(`src/styles/layout.css`): 모바일(0~767, 컬럼 4) · 태블릿(768~1023, 컬럼 8, `tablet:`) · 데스크톱(1024~, 컬럼 12, `desktop:`). Tailwind 기본 브레이크포인트(`sm:` `md:` `lg:` `xl:` `2xl:`)는 지워져 있으니 쓰지 않습니다. 임의 값(`min-[900px]:`)이나 컴포넌트 안의 별도 미디어 쿼리도 쓰지 않습니다. 폰 가로 화면(약 800~900px)은 태블릿으로 보는 것이 의도입니다.
- **CSS로만 반응형 처리**: `useMediaQuery`, `window.innerWidth`로 렌더를 나누지 않습니다. 서버는 화면 폭을 모르므로 결과가 달라지고 깜빡입니다.
- **반응형 prop**(`columns={{ base: 1, tablet: 2 }}` 같은 것)은 **CSS 변수 방식**으로 구현합니다. 값을 `style`의 CSS 변수(`--mint-cols`, `--mint-cols-tablet`)로 넘기고, 고정 클래스가 그 변수를 읽습니다. `` `tablet:grid-cols-${n}` ``처럼 클래스 이름을 문자열로 조립하지 않습니다(Tailwind가 스캔하지 못해 클래스가 빠집니다).
- **크기(`size`)와 반응형은 다른 축**입니다. `size`는 컨트롤 밀도이고 화면 폭에 따라 자동으로 바뀌지 않습니다.
- **터치 타깃 44px 안팎**: 누르는 요소는 모바일에서 `md`(40px) 이상을 기본으로 안내합니다. hover에만 의존하는 동작(hover로만 열리는 메뉴)을 만들지 않습니다.
- **오버레이는 `Modal` 하나**입니다. 바텀시트는 만들지 않고, 모바일에서는 `Modal`이 화면 폭에 맞게 줄어듭니다.
- **레이아웃은 `Container`·`Grid` 컴포넌트로 합니다.** 사용하는 쪽이 `div`에 그리드 클래스를 일일이 쓰게 하지 않습니다. 이 컴포넌트가 읽는 값은 토큰 변수입니다: `--mint-grid-columns`(4 → 8 → 12), `--mint-grid-gutter`(20), `--mint-grid-margin`(좌우 여백 20), `--mint-content-max`(모바일·태블릿 `none`, 데스크톱 1440). 거터와 여백은 모든 구간에서 20으로 통일이고, 구간마다 바뀌는 것은 컬럼 수뿐입니다. 콘텐츠는 1440px(안쪽 여백 포함)에서 가운데에 고정되고 더 넓은 화면은 바깥 여백만 늘어납니다. 구간별 값은 `Grid.Item`의 `span={{ base, tablet, desktop }}`로 받아 CSS 변수로 전달합니다.
- **간격은 Figma 스케일 12단계만**: 4·8·12·16·20·24·32·40·48·64·80·96px. `src/styles/spacing.css`의 `--mint-spacing-<px>`가 원본이고(Figma `spacing-N`과 같은 이름), `token-utilities.css`가 `p-` `m-` `gap-` 계열 클래스(`p-1`=4px … `p-24`=96px, 번호=px÷4)를 자동으로 만듭니다. 이 밖의 값(`p-7`, `p-9`, `p-0.5`, `p-[13px]`)은 쓰지 않습니다. 컴포넌트의 `h-*` 높이는 간격이 아니라 크기라서 이 스케일과 별개입니다.
- **글자 크기는 반응형으로 바뀌지 않습니다**(Figma 타이포그래피 가이드). 크기·줄 간격은 화면 폭과 상관없이 하나의 체계이고, 반응형은 레이아웃(그리드·여백·열 수)에서 처리합니다. `lg:text-[36px]`처럼 화면 폭에 따라 글자를 키우지 않습니다.

---

## 컴포넌트 작성 규칙

기존 컴포넌트(`Button`)를 먼저 읽고 같은 방식으로 씁니다.

- **React 19**: `forwardRef` 없이 `ref`를 일반 prop으로 받습니다.
- **변형은 `cva`**, 클래스 병합은 `cn()`(`src/utils/cn.ts`)으로 합니다. `className`을 받고 마지막에 병합합니다.
- **색·모서리·타이포는 토큰만**: `bg-brand-primary`, `text-text-primary`, `rounded-8`, `text-label-2-semibold` 등. hex 색을 직접 쓰지 않습니다. 다크 모드는 `--mint-*` 변수 값이 `[data-theme="dark"]`에서 바뀌므로 컴포넌트에 `dark:` 클래스를 쓰지 않습니다.
- **색은 두 단계**: 아토믹(`src/styles/atomic.css`, `--color-atomic-*`, Figma `Atomic` 변수와 이름·값이 같은 고정값) → 시맨틱(`src/styles/colors.css`, `--mint-*`, 라이트·다크 값). **컴포넌트는 시맨틱만 씁니다.** 아토믹 값은 Figma에서만 바꾸고 코드는 그대로 옮깁니다. 시맨틱이 Figma에 정의되면 시맨틱 값은 `var(--color-atomic-*)` 참조로 씁니다(지금 시맨틱은 임시 hex 값).
- **시세 색**: 상승 `price-up`(빨강), 하락 `price-down`(파랑), 보합 `price-flat`. 브랜드 민트를 상승·하락에 쓰지 않습니다.
- **크기**: `size`는 `"sm" | "md" | "lg" | "xl"`, 기본 `md`.
- **레이아웃·변형은 prop으로 캡슐화**합니다. 사용하는 쪽이 조각을 직접 조립해야 하는 API를 피합니다.
- **날짜·시간은 문자열**(`YYYY-MM-DD`, `HH:mm`)입니다. `Date`를 prop으로 받지 않습니다.
- **접근성**: 역할·`aria-*`·키보드 조작·포커스(`focus-visible`)를 함께 구현합니다(Storybook a11y 애드온이 검사합니다).
- **새 export**는 `src/index.ts`에 추가하고, 공개하지 않을 내부 구현은 `src/components/_internal/`에 둡니다.
- **아이콘은 `scripts/icons.json`이 원본이고 컴포넌트는 생성물입니다.** `icons.generated.ts`·`iconCatalog.generated.ts`는 손으로 고치지 않고 `npm run icons:generate -w @futurewiz-rms/mint`로 만듭니다(`@phosphor-icons/core` 버전은 고정). **아이콘 하나에 컴포넌트 하나**(`ArrowLeftIcon`)로 내보냅니다. `Icon.ArrowLeft`처럼 객체에 모으거나 `<Icon name="…" />`로 이름을 넘기는 방식은 쓰지 않습니다 — 쓰지 않는 아이콘이 번들에서 빠지지 않아서, 아이콘 1개를 써도 183개(gzip 약 39KB)가 들어갑니다(개별 export는 1개에 약 1KB). 생성 파일의 `/* @__PURE__ */` 표시를 지우지 않습니다.
- **Prettier 서식**은 루트 `.prettierrc`(printWidth 100, 큰따옴표)를 따릅니다.

---

## Storybook 규칙

위치: `packages/storybook/stories/<카테고리>/<컴포넌트>/<Name>.stories.tsx`

- 카테고리 폴더: `actions` · `form` · `navigation` · `overlay` · `display` · `layout`. 제목은 `Components/<Category>/<Name>` 형식이고, 훅은 `Hooks/<name>`입니다.
- **새 컴포넌트는 `.storybook/preview.tsx`의 `storySort`에 이름을 추가합니다.**
- 모든 스토리는 `@futurewiz-rms/mint`에서 import합니다(상대 경로 금지).
- `meta`에 `tags: ["autodocs"]`, 컨트롤이 필요한 prop은 `argTypes`(`size`는 `inline-radio`)를 정의합니다.
- 크기가 있으면 `Sizes` 스토리, 변형이 있으면 변형별 스토리, 오류·비활성·로딩 같은 **상태별 스토리**를 둡니다.
- **반응형 동작이 있는 컴포넌트**는 툴바의 뷰포트(Mobile 360 · Mobile 320 · Tablet 768 · Desktop 1024 · Desktop 1440)로 확인하고, 필요하면 스토리에 `globals: { viewport: { value: "mobile" } }`를 지정한 모바일 스토리를 둡니다.
- 훅이 필요한 스토리는 `render: function Render() { ... }`처럼 **이름 있는 함수**로 씁니다.
- **컴포넌트처럼 보이는 PascalCase 헬퍼를 만들지 않습니다.** 순수 HTML은 스토리 안에 인라인으로 씁니다.
- 코드 패널은 `.storybook/preview.tsx`가 `docs.source.type: "dynamic"`으로 통일합니다. 개별 스토리에 `source: { type: "code" }`를 넣지 않습니다.
- **코드 패널에는 사용하는 쪽이 쓰는 코드만 보여 줍니다.** 컴포넌트가 캡슐화한 내부(CSS 변수, 내부 클래스, 갤러리를 그리는 구현)는 보여 주지 않습니다. 갤러리·시각화 스토리는 `parameters.docs.source.code`에 사용 코드 한두 줄을 직접 적습니다(docs 예시를 `?raw`로 가져오지 않습니다).

---

## 사용 가이드 작성 규칙

`packages/core/AGENTS.md`는 **색인**이고, 상세는 `packages/core/guide/*.md`에 있습니다. 사용하는 쪽 AI가 **필요한 파일만** 읽게 하려는 구조입니다.

| 파일               | 담는 것                                                                                              |
| ------------------ | ---------------------------------------------------------------------------------------------------- |
| `AGENTS.md`        | 핵심 규칙, "무엇을 쓸까", **파일별 컴포넌트 색인**                                                   |
| `guide/setup.md`   | 설치, 스타일, 토큰 클래스, 반응형 토큰, 다크 모드                                                    |
| `guide/actions.md` | 액션 컴포넌트 props·주의점 (카테고리가 늘면 파일 추가)                                               |
| `guide/layout.md`  | `Container`·`Grid` 사용법, 구간별 `span`, 레이아웃 규칙                                              |
| `guide/icons.md`   | 아이콘 사용법과 183개 전체 이름(분류별 목록). `guide:check`가 `icons.json`의 모든 이름이 있는지 검사 |

- **새 컴포넌트·훅**: 색인의 해당 묶음에 **한 줄**을 추가하고, `guide/` 파일에 props 상세를 씁니다.
- **색인은 짧게 유지**합니다. props와 예시는 `guide/`로 보냅니다.
- **`guide/`의 컴포넌트 항목은 `- **`이름`** — 설명` 형식을 지킵니다.** 사용하는 쪽 AI가 이름으로 찾아 읽습니다(`grep -A`).
- 각 컴포넌트 항목에 **서버 컴포넌트에서 쓸 수 있는지**(`"use client"` 여부)를 적습니다.
- 끝내기 전에 `npm run guide:check -w @futurewiz-rms/mint`를 실행합니다.

---

## 문서 규칙

위치: `packages/docs/docs/` — `foundations/`(토큰), `components/common/`(컴포넌트), `hooks/`(훅), `intro.md`

- 페이지 구조는 `button.mdx`를 기준으로 합니다: front matter(`sidebar_position`) → `# 제목` → 한두 문장 설명(서버 컴포넌트 사용 가능 여부 포함) → `## Usage` → 변형·상태·`## Sizes` → `## Props` 표.
- **예시는 파일 하나로 관리합니다.** `packages/docs/src/examples/<페이지슬러그>/<이름>.tsx`에 **실행되는 완결된 컴포넌트**로 쓰고, MDX에서는 `<Example name="<페이지슬러그>/<이름>" />` 한 줄로 부릅니다. MDX에 미리보기와 ` ```tsx ` 코드 블록을 따로 쓰지 않습니다.
- **예시 코드는 사용하는 쪽이 쓰는 코드만 보여 줍니다.** 컴포넌트가 캡슐화한 내부 동작(CSS 변수 읽기, `grid-template-columns` 같은 직접 스타일, 사용하는 쪽이 일일이 쓰게 되는 클래스 나열)을 예시로 보여 주지 않습니다. 예: 그리드는 `<div class="grid tablet:grid-cols-2">`가 아니라 `<Grid><Grid.Item span={…}>`로 보여 줍니다.
- **토큰·아이콘 갤러리처럼 "시각 확인용" 예시**는 `<Example name="…" hideCode />`로 코드를 숨깁니다. 그 코드는 화면을 그리는 구현이라 사용법이 아닙니다. 사용법은 MDX에 짧은 코드 블록으로 따로 적습니다.
- **예시 파일 규칙**: 기본 export 컴포넌트 하나(파일 이름과 같은 함수 이름), 쓰는 것만 `@futurewiz-rms/mint`에서 import, 정의되지 않은 변수 금지. 레이아웃 배치용 `div`/`style`은 파일 밖으로 빼서 `<Example name="..." style={{ maxWidth: 375 }} />`로 넘깁니다.
- **docs에서 쓸 수 있는 클래스는 core가 만든 것뿐**입니다. 토큰 클래스(색·글자·반경·**간격**: `text-body-2-regular`, `bg-bg-surface`, `p-5`)와 컴포넌트가 쓰는 클래스는 들어 있지만, Tailwind의 일반 유틸리티(`flex`, `grid`, `gap-*`의 스케일 밖 값, `tablet:…`)는 없을 수 있습니다. 그래서 예시의 배치는 가능하면 `Container`·`Grid` 같은 MINT 컴포넌트로 하고, 그래도 필요한 미리보기용 배치는 `style`로 씁니다.
- Props 표는 **소스의 실제 props와 대조**해서 씁니다.
- "Version" 페이지(`docs/changelog.md`)는 `packages/core/CHANGELOG.md`에서 만들어지는 **생성물**입니다. 직접 고치지 않습니다.
- 포맷은 **저장소 루트에서** `npm run format:docs` 또는 `npx prettier --write <파일>`로 합니다.
- 문서 안에서 다른 페이지로 링크할 때 경로가 틀리면 `npm run build -w @mint/docs`가 실패합니다(`onBrokenLinks: "throw"`).

---

## 검증 (끝내기 전에 반드시)

변경 범위에 맞춰 실행하고, **결과를 확인한 뒤** 끝났다고 말합니다. 실행하지 못한 것은 "확인하지 못함"이라고 적습니다.

```bash
# 1) 타입
(cd packages/core && npx tsc --noEmit)
(cd packages/storybook && npx tsc --noEmit)

# 2) 포맷 (루트에서!)
npm run format:check

# 3) 사용 가이드 색인
npm run guide:check -w @futurewiz-rms/mint

# 4) 빌드 ("use client" 검사 포함)
npm run build              # core
npm run build-storybook    # Storybook
npm run build -w @mint/docs # docs: MDX 컴파일·깨진 링크·SSR 렌더 오류 검출
```

- core를 고쳤으면 `docs` 빌드까지 돌립니다. docs 빌드는 서버 렌더(SSR)를 하므로 렌더 중 `window` 접근 같은 SSR 위반도 여기서 드러납니다.
- 화면 변경은 **브라우저에서 눈으로**, **모바일(375)과 데스크톱(1280) 두 폭에서** 확인합니다. 라이트·다크 둘 다 봅니다.
- `npm run lint`는 **내가 건드린 파일에 새 오류가 생기지 않았는지** 확인합니다.

---

## Version과 CHANGELOG

**원본은 `packages/core/CHANGELOG.md` 하나**입니다. docs의 "Version" 페이지는 `packages/docs/scripts/sync-changelog.mjs`가 이 파일을 복사해서 만듭니다.

**core를 고칠 때마다 맨 위 `## 미배포` 섹션에 변경을 바로 적습니다.** 버전을 올리는 날 그 제목을 버전과 날짜로 바꿉니다(`## 미배포` → `## 0.2.0 (YYYY-MM-DD)`).

### 작성 규칙

결과는 **한국어 "~했어요" 체의 짧은 공지**로 씁니다.

- **한 항목은 한 줄, 한두 문장.** 무엇이 생겼고 언제 쓰는지만 적어요.
- **어투는 "~했어요 / ~할 수 있어요 / ~로 바뀌었어요".** 굵은 글씨는 항목 맨 앞의 이름에만 써요.
- **이름은 코드 서식으로 정확히.** `Button`, `fullWidth`처럼 백틱으로 적어요.
- **사용하는 쪽이 코드를 바꾸거나 새로 쓸 수 있는 변화만** 적어요. 내부 리팩터링, 스토리·문서 변경은 적지 않아요.
- **브레이킹 변경**은 `### 삭제 (브레이킹)` 또는 `### 변경`에 쓰고, 바로 아래 `업그레이드:` 한 줄을 꼭 붙여요.
- 섹션 순서는 `추가` → `변경` → `삭제 (브레이킹)` → `수정`이고, 내용 없는 섹션은 만들지 않아요.

---

## 배포

**배포 파이프라인(GitHub Actions)은 아직 없습니다.** 배포는 수동으로 합니다.

- 레지스트리: **GitHub Packages**(`https://npm.pkg.github.com`), 스코프 `@futurewiz-rms`, `access: restricted`(`packages/core/package.json`의 `publishConfig`).
- 배포하려면 `packages/core/package.json`의 `version`을 올리고 `CHANGELOG.md`의 `## 미배포`를 버전과 날짜로 바꿉니다. **`package-lock.json`의 `packages/core` 항목 버전도 같이** 올립니다.
- 버전은 SemVer를 따릅니다. 1.0.0 전(`0.x`)에는 새 기능과 브레이킹 변경을 모두 minor로 올립니다.
- 사용하는 쪽 가이드(`packages/core/AGENTS.md`와 `guide/`)는 패키지에 포함되므로, 가이드를 고쳤다면 새 버전을 배포해야 반영됩니다.

---

## Git

- 사용자가 요청할 때만 커밋·push합니다.
- 커밋은 **기능 단위로 나눕니다.** 메시지는 한국어, `feat:` / `fix:` / `docs:` / `chore:` / `ci:` 접두어를 씁니다.
- 토큰·비밀번호 같은 값을 파일에 쓰거나 커밋하지 않습니다.

---

## 주의할 함정

1. **Prettier는 루트에서 실행**합니다. `packages/` 안에서 돌리면 `.prettierignore`가 적용되지 않습니다.
2. **docs는 core의 `dist`를 씁니다.** core를 고친 뒤 docs 화면이 그대로면 빌드가 안 된 것입니다.
3. **번들러는 `"use client"`를 지웁니다.** core 빌드를 파일 하나로 합치거나 `preserveModules`를 끄면 지시어가 사라집니다. `check-use-client.mjs`가 잡아 줍니다.
4. **Tailwind는 클래스 이름을 정적으로 스캔합니다.** 문자열 조립(`` `tablet:grid-cols-${n}` ``)은 빌드에 빠집니다. 반응형 prop은 CSS 변수로 구현합니다.
5. **Docusaurus(Infima) CSS가 컴포넌트에 새어 들어옵니다.** Infima는 `@layer` 밖이라 Tailwind 유틸리티보다 우선합니다. docs 화면에서 이상하면 브라우저에서 계산된 스타일을 확인합니다(`packages/docs/src/css/custom.css`에 되돌림 규칙이 있음).
6. **docs 검색은 `npm run docs`(dev)에서는 동작하지 않습니다.** 검색을 확인하려면 `npm run docs:preview`를 씁니다.
7. **docs를 `npx docusaurus build`로 직접 돌리지 않습니다.** "Version" 페이지가 생성되지 않아 실패합니다. `npm run build -w @mint/docs`를 씁니다.
8. **MDX 변환 결과는 캐시됩니다.** `plugins/*`나 `<Example>` 경로를 바꾼 뒤 이전 경로로 빌드가 실패하면 `npx docusaurus clear` 후 다시 빌드합니다.
9. **MDX는 JSX 안의 줄바꿈된 텍스트를 `<p>`로 감쌉니다.** `packages/docs/plugins/remark-unwrap-jsx-paragraph.ts`가 불필요한 `<p>`를 풀어 줍니다.

---

## 작업을 마칠 때 보고할 것

1. 무엇을 바꿨는지 (core), `"use client"`를 붙였는지와 그 이유
2. **Storybook·docs·사용 가이드를 각각 어떻게 갱신했는지** (대원칙), `CHANGELOG.md`의 `## 미배포` 항목
3. 실행한 검증과 결과, 실행하지 못한 검증 (모바일·데스크톱 눈 확인 포함)
4. 버전을 올렸는지, 올려야 하는지
5. 사용자가 판단해야 하는 사항
