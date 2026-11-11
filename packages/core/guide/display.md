# 표시

> 색인: [`../AGENTS.md`](../AGENTS.md)

- **`Avatar`** — 사용자·대상을 나타내는 프로필 칸. 서버 컴포넌트에서도 쓸 수 있습니다(`onClick`을 넘길 때만 클라이언트 컴포넌트 안에서 씁니다).
  - `size`: `24` · `32` · `40`(기본) · `48` · `64`(px)
  - `variant`: `person`(기본, 원형) · `brand`(둥근 사각형, 서비스·코인·조직 등 사람이 아닌 대상)
  - `src` → 이미지, 없으면 `name`의 첫 글자, 둘 다 없으면 `icon`(기본은 사용자 아이콘). 이미지가 오기 전·실패하면 회색 바탕만 보입니다(자리표시 아이콘 없음)
  - `name`: 스크린리더에 읽힐 이름이기도 합니다. 이미지·아이콘만 쓸 때도 `name`이나 `aria-label`을 붙입니다
  - `badge`: `"dot"` 또는 숫자(99 초과는 `99+`, 0 이하는 숨김). `badgeSize`(`xs`~`xl`)로 배지 크기를 따로 고를 수 있고, 생략하면 아바타 크기에 맞춥니다(24 `xs` · 32 `sm` · 40 `md` · 48 `lg` · 64 `xl`). 위치는 아바타 크기를 따릅니다
  - `disabled`, `onClick`(주면 눌리는 `<button>`이 됨, hover·pressed 같은 색)
- **`AvatarGroup`** — 아바타를 흰 테두리로 겹쳐 놓는 묶음. 서버 컴포넌트에서도 쓸 수 있습니다.
  - `items`(필수): `{ src?, name?, icon? }[]`
  - `size`(기본 40), `max`(기본 3, 넘치면 `+N`), `count`(넘친 칸 글자를 직접 정함)
  - `aria-label`로 몇 명인지 알려 줍니다
- **`Badge`** — 상태·종류를 짧게 알리는 표시 전용 라벨(눌러도 동작 없음, 선택은 Chip). 서버 컴포넌트에서도 쓸 수 있습니다. 문구는 `children`으로 넣습니다.
  - `variant`: `fill`(기본, 진한 배경, 화면당 한두 개) · `weak`(연한 배경, 목록·카드 안에 여러 개)
  - `color`: `brand`(기본, 강조) · `neutral`(일반) · `danger`(오류·임박) · `success`(완료) · `warning`(주의). 의미대로 고릅니다
  - `size`: `sm` 20 · `md` 24(기본) · `lg` 28px. 같은 화면에서는 하나로 맞춥니다
  - 문구는 1~4자로 짧게. 색만으로 뜻을 전하지 않고, 화살표·아이콘을 붙이지 않습니다
- **`Text`** — 토큰 텍스트 스타일로 글자를 그리는 컴포넌트(Figma Typography 59개 스타일만). 서버 컴포넌트에서도 쓸 수 있습니다.
  - `variant`(필수): `title-1-bold`, `body-2-regular`처럼 역할-번호-웨이트. 크기는 값 하나만(구간별 값은 아직 열지 않음)
  - `as`: 태그(`span` 기본, `p`·`h1`~`h6`·`label` 등). 모양과 따로 고릅니다
  - `color`: `strong` · `primary` · `secondary` · `tertiary` · `subtle` · `disabled` · `brand` · `danger` · `success` · `warning` · `on-fill`(생략하면 부모 색)
  - `lines`: 1~4줄 넘으면 말줄임. 클래스(`text-body-2-regular`)를 직접 써도 됩니다. 상세 규칙은 `components/text/AGENTS.md`
