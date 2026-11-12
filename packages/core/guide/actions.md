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

- **`TextButton`** — 글자만 있는 가장 약한 행동(Figma `Text Button`). 평소에는 글자만, 누르는 동안(hover 포함)만 연한 박스. 서버 컴포넌트에서도 쓸 수 있습니다(`onClick`을 넘길 때만 클라이언트 컴포넌트 안에서). 상세 규칙은 `components/text-button/AGENTS.md`
  - 이동이면 `href`(`<a>`로 그림, Next.js는 `linkComponent={Link}`), 동작이면 `onClick`(`<button>`)
  - `color`: `primary`(기본, 브랜드 글자) · `neutral`(회색 글자)
  - `size`: `xs` 20 · `sm` 24 · `md` 28(기본) · `lg` 28px(글자 12 · 12 · 14 · 16). 본문 글자에 맞추고 `xs`는 표·목록 안. 구간별 객체도 받음(`{ base: "sm", desktop: "md" }`)
  - `underline`(밑줄) · `inline`(문장 속 링크: 패딩·박스 없이 밑줄 항상, 높이 16 · 16 · 20 · 20)
  - `leftAddon`(글자 앞 아이콘, 동작의 의미 보조: `<PlusIcon />` 추가 등)·`rightAddon`(글자 뒤 아이콘, 이동을 암시할 때 `<CaretRightIcon />`). 둘 중 하나만, `loading`(폭 유지·진행 원), `disabled`
  - 화면의 주된 행동(CTA)에는 쓰지 않고 `Button`을 씁니다. 독립된 약한 행동(취소·닫기)은 `Button variant="ghost"`. 두 개 이상을 한 줄에 붙이지 않습니다

- **`ToggleIcon`** — 눌러서 켜고 끄는 아이콘(관심 코인, 좋아요, 북마크). 켜짐 상태를 가질 수 있어서 `"use client"`가 붙은 클라이언트 컴포넌트지만, 서버 컴포넌트에서 `defaultActive`만 넘겨 바로 써도 됩니다(`onActiveChange`를 넘길 때만 클라이언트 컴포넌트 안에서 씁니다).
  - `icon`(필수): 선 모양 아이콘 요소(`<StarIcon />`). 켜지면 같은 아이콘을 `variant="fill"`로 바꿔 그립니다. 크기·색은 컴포넌트가 맞춥니다
  - `activeIcon`: 켜졌을 때 따로 보여 줄 아이콘(MINT 아이콘이 아닐 때만)
  - `aria-label`(필수): 상태와 관계없이 같은 이름("관심 코인"). 켜짐은 `aria-pressed`로 읽힙니다
  - `active`·`onActiveChange`: 제어 방식. 생략하면 `defaultActive`(기본 false)로 컴포넌트가 상태를 가집니다
  - `size`: `xs` 28 · `sm` 32 · `md` 40(기본) · `lg` 48(IconButton과 같음). 값 하나 또는 구간별 객체(`{ base: "sm", desktop: "md" }`). 카드 위 `md`, 목록 `sm`. `xs`·`sm`은 터치 눌림 영역 44px
  - 색: 꺼짐 `icon-default`, 켜짐 `icon-brand`, hover·누름 원형 `fill-neutral-weak` 바탕, 비활성 `icon-disabled`
  - 금지: 한 번 누르면 끝나는 동작(닫기·공유)은 `IconButton`. 켜고 끌 때 다른 아이콘으로 바꾸지 않음. 상세 규칙은 `components/toggle-icon/AGENTS.md`
