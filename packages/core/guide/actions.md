# 액션

> 색인: [`../AGENTS.md`](../AGENTS.md)

- **`Button`** — 텍스트 버튼. 서버 컴포넌트에서도 쓸 수 있습니다(`onClick`을 넘길 때만 클라이언트 컴포넌트 안에서 씁니다).
  - `size`(`xs` 28 · `sm` 32 · `md` 40 기본 · `lg` 48)·`fullWidth`는 **값 하나 또는 구간별 객체**를 받습니다: `size={{ base: "lg", tablet: "md" }} fullWidth={{ base: true, tablet: false }}`(모바일 하단 CTA → 태블릿부터 기본 크기·내용 폭). 빈 구간은 앞 구간 값을 이어받고, `base`를 빼면 기본값입니다. CSS로만 바뀌어서 서버 렌더에서도 깜빡이지 않습니다
  - `variant`·`color`는 구간별 값을 받지 않습니다

- **`IconButton`** — 아이콘만으로 동작을 실행하는 원형 버튼(닫기, 더보기, 공유). 서버 컴포넌트에서도 쓸 수 있습니다(`onClick`을 넘길 때만 클라이언트 컴포넌트 안에서 씁니다).
  - `icon`(필수): 아이콘 컴포넌트(`<XIcon />`). 크기·색은 버튼이 맞춥니다
  - `aria-label`(필수): 버튼 이름("닫기"). 타입에서 필수입니다
  - `variant`: `normal`(배경 없음, 기본) · `background`(회색 바탕) · `outline`(테두리) · `solid`(브랜드, 가장 강조)
  - `size`: `xs` 28 · `sm` 32 · `md` 40(기본) · `lg` 48(Button과 같음). 값 하나 또는 구간별 객체(`{ base: "sm", tablet: "md" }`). 아이콘 14 · 16 · 20 · 24. `xs`·`sm`은 터치 눌림 영역 44px
  - `badge`: 오른쪽 위 빨간 점(이름에 "(새 소식)"이 붙음). `disabled`
  - 금지: 의미가 모호한 아이콘으로 중요한 동작, 한 줄에 4개 이상(더보기로 묶음). 상세 규칙은 `components/icon-button/AGENTS.md`
