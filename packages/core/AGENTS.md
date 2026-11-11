# @futurewiz-rms/mint 사용 가이드 (AI 에이전트용 색인)

MINT는 크립토랩(Next.js 반응형 사이트)을 위한 React 컴포넌트 라이브러리입니다. 이 파일은 색인이며 `node_modules/@futurewiz-rms/mint/AGENTS.md`에서 읽을 수 있습니다.

**읽는 법**: 아래 핵심 규칙과 "무엇을 쓸까"를 읽고, 쓸 컴포넌트의 상세(props·예시)만 `guide/`에서 찾습니다. **`guide/` 파일은 통째로 읽지 말고 컴포넌트 이름으로 찾습니다.**

```bash
grep -n -A12 '\*\*`Button`\*\*' node_modules/@futurewiz-rms/mint/guide/actions.md
```

없는 prop이나 컴포넌트를 추측하지 말고, 정확한 타입은 `node_modules/@futurewiz-rms/mint/dist/index.d.ts`에서 확인합니다.

---

## 핵심 규칙

1. **먼저 있는 컴포넌트를 씁니다.** `<button>`을 직접 만들지 않습니다.
2. **스타일은 `app/layout.tsx`에서 `@futurewiz-rms/mint/style.css`를 한 번만 import합니다**([설치](guide/setup.md)).
3. **서버 컴포넌트에서 바로 import해도 됩니다.** 상태가 필요한 컴포넌트는 라이브러리가 `"use client"`를 달아 두었습니다. 사용하는 쪽이 감쌀 필요가 없습니다. 단, `onClick` 같은 함수 prop은 서버 컴포넌트에서 넘길 수 없으니 그 부분만 클라이언트 컴포넌트로 뺍니다.
4. **크기는 `size="sm" | "md" | "lg" | "xl"`, 기본 `md`.** 터치 화면에서 누르는 요소는 `md`(40px) 이상을 씁니다. 예외는 아이콘으로, `size`가 `16 | 20 | 24`(기본 24)입니다.
5. **반응형 레이아웃은 `Container`·`Grid`로 합니다.** `div`에 그리드 클래스를 직접 쓰지 않습니다([레이아웃](guide/layout.md)). 구간은 모바일·`tablet:`(768px~)·`desktop:`(1024px~) 3단계뿐입니다(`sm:` `md:` `lg:`는 없음). 글자 크기는 구간과 상관없이 고정이고 컬럼 수·거터·여백만 바뀝니다. `window.innerWidth`나 미디어 쿼리 훅으로 렌더를 나누지 않습니다(서버·클라이언트 결과가 달라짐).
6. **색은 시맨틱 토큰 클래스**(`bg-fill-brand`, `text-text-primary`, `border-border-default`, `text-icon-brand` 등)로 씁니다. hex 값과 `dark:` 클래스를 쓰지 않습니다. 지금은 Light 값만 있고 브랜드색은 임시 파랑입니다([색 상세](guide/setup.md)).

---

## 무엇을 쓸까

- 사용자의 동작을 받는 버튼 → `Button`
- 아이콘만 있는 버튼(닫기·더보기·공유) → `IconButton`(`aria-label` 필수)
- 같은 목록을 거르거나 분류 고르기(칩, 하나만 선택) → `Category`
- 같은 영역의 보기 방식 바꾸기(목록/격자, 일/주/월, 2~6개) → `SegmentedControl`(화면 섹션 전환은 Tab)
- 많은 목록을 페이지로 나눠 이동 → `Pagination`(링크는 `getHref`+`linkComponent`, 버튼은 `onChange`)
- 배너·캐러셀·갤러리의 현재 위치 표시 → 점 `PageDots`(2~7개) · 숫자 `PageCounter`(8개 이상)
- 필터·조건 칩 하나(선택 상태 있음, 여러 개 고르기 등) → `Chip`(행동은 `Button`)
- 목록에서 선택된 항목에 체크 표시(Menu, Select Item) → `CheckMark`
- 여러 개 고르기·한 항목 켜고 끄기(폼, 제출할 때 적용) → `Checkbox`(전체 선택은 `indeterminate`)
- 2~4개 중 하나만 고르기(폼) → `RadioGroup` + `Radio`
- 설명이 긴 선택지를 카드처럼 묶어 고르기 → `FramedRadio`(`RadioGroup` 안) · `FramedCheckbox` · 다른 내용은 `Framed`
- 흐름을 멈추고 확인을 받는 대화상자 → `Alert`(열 때는 `useOverlay`)
- 짧은 로딩 표시 → `Circular`(버튼 로딩은 `Button`의 `loading`)
- 콘텐츠가 들어올 자리 미리 보여 주기 → `SkeletonText` · `SkeletonRectangle` · `SkeletonCircle`
- 사용자·대상의 프로필 칸 → `Avatar`(여러 명은 `AvatarGroup`)
- 상태·종류를 짧게 알리는 라벨(눌리지 않음) → `Badge`
- 토큰 텍스트 스타일로 글자 그리기(태그·색·말줄임) → `Text`(클래스 `text-body-2-regular`를 직접 써도 됨)
- 페이지 틀·반응형 컬럼 배치 → `Container` + `Grid`(`Grid.Item`). `div`에 그리드 클래스를 직접 쓰지 않습니다
- 요소가 화면에 들어왔는지(무한 스크롤·보일 때 불러오기) → `useInView`
- 글자를 클립보드에 복사(주소·ID 복사, 복사 완료 표시) → `useClipboard`
- 빠르게 바뀌는 값(검색어)으로 요청할 때 늦추기 → `useDebounceValue`
- 아이콘 → 이름에 맞는 아이콘 컴포넌트(`ArrowLeftIcon` 등). `<svg>`를 직접 그리지 않습니다

---

## 파일별 컴포넌트 색인

### [설치·스타일·토큰](guide/setup.md)

- 설치(GitHub Packages), `style.css`, 토큰 클래스(색·글자·반경·간격), 반응형 그리드 토큰

### [액션](guide/actions.md)

- `Button` — 텍스트 버튼
- `IconButton` — 아이콘만 있는 원형 버튼(4종류, 4크기, 뱃지)

### [내비게이션](guide/navigation.md)

- `Pagination` — 페이지 이동(extended 9칸 · compact 7칸, 구간별 객체, 링크 또는 버튼)
- `PageCounter` — 현재 위치를 숫자로(1 / 10, 표시 전용)
- `PageDots` — 현재 위치를 점으로(2~7개, 표시 전용)
- `Category` — 목록을 거르는 칩 목록(하나만 선택, 넘치면 가로 스크롤, "전체" 칩)
- `SegmentedControl` — 보기 방식을 바꾸는 토글형 선택(트랙 위 흰 칩, 2~6개, 3크기, 아이콘)

### [선택](guide/selection.md)

- `CheckMark` — 목록의 선택 표시(체크 아이콘 + 레이블, 4크기·구간별 객체, 항목 전체를 누름)
- `Checkbox` — 체크박스(체크·일부 선택, 레이블을 눌러도 선택, 폼 제출, 4크기·구간별 객체)
- `RadioGroup` — 라디오 묶음(세로 나열, 하나만 선택, 값·onChange)
- `Radio` — 라디오(레이블을 눌러도 선택, 방향키 이동, 폼 제출)
- `FramedCheckbox` · `FramedRadio` — 체크박스·라디오를 담은 틀(틀 전체를 눌러 선택, 선택되면 브랜드 테두리)
- `Framed` — 다른 내용을 담는 틀(`selected`·`size`·`error`·`shadow`)
- `Chip` — 선택 상태가 있는 칩(solid·outline, 3크기, square·pill, 아이콘·이미지·카운트)

### [표시](guide/display.md)

- `Avatar` — 프로필 칸(이미지·이름 첫 글자·아이콘, 배지, 눌림)
- `AvatarGroup` — 아바타를 겹쳐 놓는 묶음(넘치면 `+N`)
- `Text` — 토큰 텍스트 스타일 글자(59개 스타일, 태그·색·말줄임)
- `Badge` — 상태·종류를 알리는 표시 전용 라벨(fill·weak, 5색, 3크기)

### [로딩](guide/loading.md)

- `Circular` — 원형 로딩(색 3종, 크기 지정)
- `SkeletonText` — 텍스트 한 줄 자리(길이 4단계, 정렬)
- `SkeletonRectangle` — 네모난 콘텐츠 자리(모서리 둥글게)
- `SkeletonCircle` — 동그란 콘텐츠 자리(Avatar 크기)

### [오버레이](guide/overlay.md)

- `Alert` — 꼭 확인해야 하는 일을 알리는 대화상자(제목·본문·버튼 1~2개). `useOverlay`로 열기를 권장
- `useOverlay` — 오버레이(Alert 등)를 함수 호출로 여는 훅. 앱 최상단에 `OverlayProvider` 필요

### [훅](guide/hooks.md)

- `useInView` — 요소가 화면(스크롤 상자)에 보이는지(무한 스크롤, 한 번만, 미리 불러오기 여백)
- `useClipboard` — 클립보드 복사와 복사 완료 상태(`copy`·`copied`·`error`)
- `useDebounceValue` — 값이 잠시 멈춘 뒤 확정(`debouncedValue`·`isDebouncing`·`flush`·`cancel`, 검색어 요청 줄이기)

### [레이아웃](guide/layout.md)

- `Container` — 페이지 틀(좌우 여백, 최대 폭 1440px, 가운데 정렬)
- `Grid` — 반응형 컬럼 그리드(모바일 4 · 태블릿 8 · 데스크톱 12). `Grid.Item`의 `span`으로 구간별 컬럼 수를 정합니다

### [아이콘](guide/icons.md)

- 아이콘 183개 — 아이콘마다 컴포넌트 하나(`ArrowLeftIcon`, `HouseIcon`…). `size`(16·20·24), `variant`(line·fill). 전체 이름은 가이드의 분류별 목록에 있습니다
