# 설치·스타일·토큰

> 색인: [`../AGENTS.md`](../AGENTS.md)

## 1. 설치

private 패키지(GitHub Packages)입니다. 프로젝트 루트의 `.npmrc`에 아래를 넣습니다.

```
@futurewiz-rms:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_PACKAGES_TOKEN}
```

```bash
npm install @futurewiz-rms/mint
```

> `GITHUB_PACKAGES_TOKEN`은 npm 사이트 토큰이 아니라 **GitHub 개인 액세스 토큰(classic)**이고, 권한은 `read:packages`만 있으면 됩니다. 토큰 값을 파일에 직접 쓰거나 커밋하지 않습니다.
> 요구 사항: React 19 (`react`, `react-dom` ^19.2.8). Next.js는 App Router 기준입니다.

## 2. 스타일 불러오기

```tsx
// app/layout.tsx
import "@futurewiz-rms/mint/style.css";
```

- 컴포넌트 스타일, 디자인 토큰(`--mint-*` 변수), 토큰 유틸리티 클래스(글자·색·반경), Pretendard 폰트가 들어 있어서 **사용하는 프로젝트에 Tailwind 설정이 없어도 됩니다.**
- 자체 리셋 CSS가 있는 앱은 리셋이 빠진 `@futurewiz-rms/mint/style.no-reset.css`를 대신 씁니다.
- 둘 중 **하나만** import합니다.
- **스크롤바**도 MINT 모양으로 바뀝니다(Figma `Scroll Bar`: 폭 8px, 바탕 없음, 4px 둥근 손잡이 `border-strong`). 손잡이는 늘 보이고 8px 자리를 차지합니다(macOS도 같음). 페이지와 모든 스크롤 영역(목록·Select·Textarea·Modal 본문)에 저절로 적용되니 **스크롤바를 따로 꾸미지 않습니다.** 숨겨야 하는 곳만 `[scrollbar-width:none] [&::-webkit-scrollbar]:hidden`을 씁니다. 바꿔야 하면 앱 CSS에서 `::-webkit-scrollbar-thumb` 등을 덮어씁니다(MINT 스타일은 base 레이어).
  - Chrome·Edge·Safari·Whale: Figma와 같은 모양 · Firefox: 얇은 굵기와 색만(손잡이 모양은 바꿀 수 없음) · iOS·Android: OS 기본(바꿀 수 없음)
- **지원 브라우저**: Chrome·Edge 111+, Safari 16.4+, Firefox 128+(Tailwind v4 기준). 이 범위에서는 같은 모양으로 보입니다.
- 앱이 Tailwind v4를 쓰면 `@import "@futurewiz-rms/mint/theme.css";`로 토큰만 가져와 `bg-fill-brand` 같은 클래스를 앱에서 만들 수 있습니다.

## 3. 토큰 클래스

| 종류   | 클래스 예                                                                       |
| ------ | ------------------------------------------------------------------------------- |
| 글자   | `text-title-1-bold` `text-body-2-regular` `text-label-2-semibold`               |
| 배경   | `bg-background-default` `bg-background-lower` `bg-background-floated`           |
| 면     | `bg-fill-brand` `bg-fill-brand-weak` `bg-fill-neutral-weak` `bg-fill-danger`    |
| 글자색 | `text-text-primary` `text-text-secondary` `text-text-brand` `text-text-on-fill` |
| 아이콘 | `text-icon-default` `text-icon-brand` `text-icon-danger`                        |
| 테두리 | `border-border-default` `border-border-strong`                                  |
| 반경   | `rounded-4` `rounded-8` `rounded-12` `rounded-16` `rounded-full`                |

### 글자 스타일

- 이름은 `text-<역할>-<번호>-<웨이트>`입니다. 크기·줄 간격·자간·웨이트가 클래스 하나로 정해지므로 `font-bold`, `text-[15px]`를 따로 붙이지 않습니다.
- 역할(번호): `display`(1~3) · `title`(1~3) · `heading`(1~3) · `body`(1~5) · `label`(1~3) · `caption`(1~2). 숫자가 작을수록 큽니다.
- 웨이트는 역할마다 허용된 것만 있습니다. `display`: `semibold` `bold` / `title` `heading` `label`: `medium` `semibold` `bold` / `body`: `regular` `medium` `semibold` `bold` / `caption`: `regular` `medium` `semibold`. 없는 조합(예: `text-display-1-regular`)은 클래스가 없습니다.
- 용도: `display` 랜딩·히어로(한 화면에 하나) · `title` 페이지·큰 섹션 제목 · `heading` 섹션·카드·모달 제목 · `body-2` 기본 본문 · `body-1` 아티클 긴 글 · `body-4` 밀도 높은 UI·표 · `label` 버튼·탭·칩·입력 라벨(한 줄 전제) · `caption` 날짜·도움말·각주.
- **글자 크기는 화면 폭에 따라 바뀌지 않습니다.** 반응형은 레이아웃(그리드·여백·열 수)으로 처리합니다.
- 폰트는 Pretendard이고, 불러오지 못하면 기기 기본 폰트로 대체됩니다(영문 `system-ui`, 한글 Apple SD Gothic Neo → Noto Sans KR → Malgun Gothic). 글자 클래스는 크기·웨이트만 정하고 폰트는 페이지 기본 폰트를 따릅니다. `style.css`는 `html`의 기본 폰트를 이 순서로 정해 두었습니다. `style.no-reset.css`는 전역 폰트를 정하지 않으니 앱 최상단 요소에 `font-mint` 클래스를 답니다.

색은 위의 시맨틱 클래스를 씁니다. 시맨틱 컬러는 Figma `Color - Semantic` 57개이고, 아토믹 색을 가리키는 별칭입니다.

### 시맨틱 컬러

이름은 `<분류>-<이름>`이고 클래스 접두어는 분류가 정합니다: 배경·면은 `bg-`, 글자·아이콘은 `text-`, 테두리는 `border-`. (`bg-background-*` `bg-fill-*` `text-text-*` `text-icon-*` `border-border-*`)

- **background**(5): `default` 기본 화면 · `lower` 한 단계 낮은 영역(섹션 구분) · `upper` 카드 위 약한 배경 · `floated` 모달·시트 · `dim` 모달 뒤 막
- **border**(7): `default` 기본 구분선 · `strong` 입력창·Outline 버튼 · `thick` 두꺼운 구분 · `focus` 포커스 링 · `disabled` · `brand` · `selected`
- **text**(13): `strong` 제목 · `primary` 본문 · `secondary` 보조 · `tertiary` 부가 정보 · `subtle` 플레이스홀더 · `disabled` · `brand` · `brand-pressed` · `danger` · `success` · `warning` · `on-fill`(채움 위 글자) · `on-fill-warning`
- **fill**(21): `brand` `neutral` `danger` `success` `warning`(채움)과 변형 `brand-pressed` `brand-weak` `brand-weak-pressed` `neutral-pressed` `neutral-weak` `neutral-weak-pressed` `neutral-medium` `neutral-medium-pressed` `danger-pressed` `danger-weak` `success-weak` `warning-weak` · `pressed` 누름 오버레이 · `disabled` · `inverse` · `white`
- **icon**(11): `default` `strong` `secondary` `tertiary` `disabled` `brand` `brand-pressed` `danger` `success` `warning` `on-fill`

사용 규칙:

- 본문 글자에는 `text-text-tertiary`(gray-600) 이상만 씁니다. `subtle`·`disabled`는 대비가 낮아 힌트·비활성용입니다.
- 채움(`fill-*`) 배경 위 글자·아이콘은 `text-text-on-fill`·`text-icon-on-fill`, 경고 채움(`fill-warning`) 위는 `text-text-on-fill-warning`입니다.
- 브랜드(`brand`)는 지금 임시로 파랑(`blue-600`)입니다. 이름은 그대로고 값만 바뀝니다.
- **Light 모드만 정의**되어 있습니다. 다크 테마에서도 같은 색이 나옵니다.

### 아토믹 컬러

- Figma `Atomic` 변수와 같은 원시 색입니다. CSS 변수 `--color-atomic-<이름>`으로만 들어 있고 클래스는 없습니다: `style={{ color: "var(--color-atomic-blue-500)" }}`.
- 이름: `white` · `black` · `gray-50`~`gray-950` · `grayAlpha-50`~`900`(같은 색에 투명도만 다름) · `blue` `red` `orange` `yellow` `green` `lime` `teal` `violet` `purple` `pink`의 `50`~`900`.
- 값이 고정입니다. 시맨틱 컬러가 정해 둔 역할에는 시맨틱 색을 씁니다.
- 시맨틱 색으로 표현할 수 있으면 시맨틱 색을 씁니다.

## 4. 반응형 그리드·간격

페이지는 `div`에 클래스를 직접 쓰지 않고 [`Container`·`Grid`](layout.md) 컴포넌트로 짭니다. 컬럼 수·거터·여백·최대 폭은 구간에 맞게 알아서 바뀝니다.

| 구간    | 화면 폭      | 컬럼 | 거터 | 좌우 여백 |
| ------- | ------------ | ---- | ---- | --------- |
| Mobile  | 0 ~ 767px    | 4    | 20   | 20        |
| Tablet  | 768 ~ 1023px | 8    | 20   | 20        |
| Desktop | 1024px ~     | 12   | 20   | 20        |

- **글자 크기는 구간과 상관없이 고정**입니다. 반응형은 컬럼 수·거터·여백(레이아웃)에서만 처리합니다.
- 콘텐츠 최대 폭은 1440px(안쪽 여백 포함)이고, 더 넓은 화면에서는 콘텐츠를 가운데에 고정하고 바깥 여백만 늘어납니다. 폰 가로 화면(약 800~900px)은 태블릿(8컬럼)입니다.
- 컴포넌트로 만들 수 없는 레이아웃에서만 CSS 변수를 직접 읽습니다: `--mint-grid-columns`(4 → 8 → 12), `--mint-grid-gutter`(20px), `--mint-grid-margin`(20px, 화면 좌우 여백), `--mint-content-max`(모바일·태블릿 `none`, 1024px부터 `1440px`).
- 브레이크포인트 접두어는 `tablet:`과 `desktop:`만 있습니다. Tailwind 기본(`sm:` `md:` `lg:` `xl:` `2xl:`)은 없습니다.

### 간격 스케일

4px 단위의 12단계이고 이 밖의 값은 쓰지 않습니다. Figma의 `spacing-N`(N은 px)과 이름·값이 같습니다.

| 쓰는 곳              | 방법                                                                                  |
| -------------------- | ------------------------------------------------------------------------------------- |
| CSS                  | `padding: var(--mint-spacing-20)`                                                     |
| 클래스 (`style.css`) | `p-5` `px-5` `m-5` `gap-5` … 번호는 px ÷ 4입니다. `p-` `m-` `gap-` 계열 모두 같습니다 |

`spacing-4` = `p-1` · `spacing-8` = `p-2` · `spacing-12` = `p-3` · `spacing-16` = `p-4` · `spacing-20` = `p-5` · `spacing-24` = `p-6` · `spacing-32` = `p-8` · `spacing-40` = `p-10` · `spacing-48` = `p-12` · `spacing-64` = `p-16` · `spacing-80` = `p-20` · `spacing-96` = `p-24`. 이 밖의 값(`p-7`, `p-9`, `p-0.5`)은 쓰지 않습니다.

- 앱이 Tailwind v4를 쓰고 `theme.css`를 불러오면 Tailwind 기본 브레이크포인트가 `tablet`·`desktop` 두 개로 **바뀝니다.**

## 5. 다크 모드

시맨틱 컬러는 지금 Light 값만 있습니다. `<html data-theme="dark">`로 바꿔도 색이 달라지지 않습니다(Figma에 Dark가 생기면 추가). 테마를 바꾸는 Provider는 아직 없습니다.

## Provider

- **`OverlayProvider`**: `useOverlay`(Alert 열기)를 쓰려면 `app/layout.tsx`에서 앱을 한 번 감쌉니다. 다른 컴포넌트는 Provider가 필요 없습니다.

```tsx filename="app/layout.tsx"
import { OverlayProvider } from "@futurewiz-rms/mint";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        <OverlayProvider>{children}</OverlayProvider>
      </body>
    </html>
  );
}
```
