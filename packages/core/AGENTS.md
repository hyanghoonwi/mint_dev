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
6. **색은 토큰 클래스**(`bg-brand-primary`, `text-text-primary` 등)로 씁니다. hex 값과 `dark:` 클래스를 쓰지 않습니다.
7. **시세 색은 `text-price-up`(상승, 빨강)·`text-price-down`(하락, 파랑)·`text-price-flat`** 입니다. 브랜드 민트를 상승·하락 표시에 쓰지 않습니다.

---

## 무엇을 쓸까

- 사용자의 동작을 받는 버튼 → `Button`
- 페이지 틀·반응형 컬럼 배치 → `Container` + `Grid`(`Grid.Item`). `div`에 그리드 클래스를 직접 쓰지 않습니다
- 아이콘 → 이름에 맞는 아이콘 컴포넌트(`ArrowLeftIcon` 등). `<svg>`를 직접 그리지 않습니다

---

## 파일별 컴포넌트 색인

### [설치·스타일·토큰](guide/setup.md)

- 설치(GitHub Packages), `style.css`, 토큰 클래스(색·글자·반경·간격), 반응형 그리드 토큰

### [액션](guide/actions.md)

- `Button` — 텍스트 버튼

### [레이아웃](guide/layout.md)

- `Container` — 페이지 틀(좌우 여백, 최대 폭 1440px, 가운데 정렬)
- `Grid` — 반응형 컬럼 그리드(모바일 4 · 태블릿 8 · 데스크톱 12). `Grid.Item`의 `span`으로 구간별 컬럼 수를 정합니다

### [아이콘](guide/icons.md)

- 아이콘 183개 — 아이콘마다 컴포넌트 하나(`ArrowLeftIcon`, `HouseIcon`…). `size`(16·20·24), `variant`(line·fill). 전체 이름은 가이드의 분류별 목록에 있습니다
