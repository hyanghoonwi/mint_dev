# 선택

> 색인: [`../AGENTS.md`](../AGENTS.md)

- **`CheckMark`** — 목록에서 선택된 항목을 표시하는 체크 표시(체크 아이콘 + 레이블). 서버 컴포넌트에서도 쓸 수 있습니다(`onClick`을 넘길 때만 클라이언트 컴포넌트 안에서 씁니다). 값을 고르는 폼 컨트롤은 `Checkbox`입니다.
  - `checked`: 선택 여부(기본 `false`). 체크 안 됨은 회색 체크, 체크됨은 브랜드 색 체크. hover·누름은 한 단계 진하게
  - `children`: 레이블. 없으면 체크만 보이므로 `aria-label`을 줍니다
  - `size`: `xs`(체크 16, Body 4) · `sm`(20, Body 2, 기본) · `md`(24, Body 1) · `lg`(32, Heading 2 Medium, 높이 48). 구간별 객체도 받음(`{ base: "md", desktop: "sm" }`)
  - `tight`: 바깥 여백 8 → 0(높이 40 → 20·24·28·32). 촘촘한 목록에서만 씁니다. 터치 화면에서는 두 크기 모두 눌림 영역이 44px로 넓어집니다
  - `disabled`: 연한 회색 체크·회색 글자, 누를 수 없음
  - `onClick`을 주면 항목 전체가 눌리는 `<button>`이 됩니다(없으면 표시용 `<span>`). 항목 폭으로 넓히려면 `className="w-full"`
  - `role`(눌릴 때): `checkbox`(기본, `aria-checked`) · `radio` · `option`(`aria-selected`, listbox 안) · `menuitemcheckbox` · `menuitemradio`(메뉴 안)
  - 금지: 폼 입력용으로 쓰기(Checkbox를 씀), 체크 색만으로 선택 알리기. 상세 규칙은 `components/check-mark/AGENTS.md`
- **`Checkbox`** — 여러 개를 고르거나 한 항목을 켜고 끄는 체크박스. 클라이언트 컴포넌트입니다(`"use client"`가 달려 있어 서버 컴포넌트에서 import해도 됩니다. 단 `onChange`는 클라이언트 컴포넌트에서 넘깁니다). 진짜 `<input type="checkbox">`를 `<label>`로 감싸서 레이블을 눌러도 선택되고 폼 제출(`name`·`value`)이 그대로 됩니다.
  - `checked`·`onChange`(제어) 또는 `defaultChecked`(비제어). 나머지 `<input>` 속성은 입력에, `className`·`style`은 바깥 `<label>`에 붙습니다
  - `indeterminate`: 하위 항목 일부만 선택된 전체 선택 칸(가로 막대, 스크린리더 "mixed")
  - `children`: 레이블(크기에 따라 Body 4~Heading 2). 없으면 `aria-label`을 꼭 줍니다. `bold`: SemiBold 강조 레이블(전체 선택 등. `xs` Label 2 · `sm` Body 2 · `md` Heading 3 · `lg` Heading 2 SemiBold)
  - `size`: `xs`(상자 16, Body 4) · `sm`(20, Body 2, 기본) · `md`(24, Body 1) · `lg`(32, Heading 2, 높이 48). 구간별 객체도 받음(`{ base: "md", desktop: "sm" }`)
  - `tight`: 바깥 여백 8 → 0(높이 40 → 20·24·28·32), 촘촘한 목록에서만. `disabled`
  - 색: 체크 안 됨은 흰 상자·회색 테두리, 체크·일부 선택은 브랜드 상자. hover·누름은 한 단계 진하게. 터치 화면 눌림 영역은 44px 이상
  - 금지: 하나만 고르기(Radio), 누르자마자 적용되는 설정(Switch). 목록의 선택 표시는 `CheckMark`. 상세 규칙은 `components/checkbox/AGENTS.md`
- **`Chip`** — 필터·카테고리처럼 선택 상태(`active`)가 있는 칩 하나. 서버 컴포넌트에서도 쓸 수 있습니다(`onClick`을 넘길 때만 클라이언트 컴포넌트 안에서 씁니다). `<button>`이고 선택은 `aria-pressed`로 읽힙니다. 한 줄에서 하나만 고르는 칩 목록은 `Category`를 씁니다.
  - `variant`: `solid`(흰 화면, 기본) · `outline`(회색 배경 위). `size`: `lg` 40 · `md` 32(기본) · `sm` 28(촘촘한 목록), 구간별 객체도 받음(`{ base: "sm", tablet: "md" }`). `shape`: `square`(기본) · `pill`(서비스 전체에서 하나로 통일)
  - `active`: 고름 여부(상태는 사용하는 쪽이 가짐). `disabled`
  - 앞뒤 구성(한 칩에 하나만): `leftAddon` · `rightAddon` · `leadingImage`(16px 원, `<img>`) · `count`(개수). `badge`: 빨간 점
  - 규칙: 레이블 8자 이내 한 줄, 개수는 `count`로, 하나만 고르는 필터는 active 하나만. 이동·제출 같은 행동에 쓰지 않음(Button). 상세 규칙은 `components/chip/AGENTS.md`
- **`RadioGroup`** — 라디오 묶음. 선택지를 세로로 나열하고 그 안에서 하나만 선택되게 합니다(`role="radiogroup"`). 클라이언트 컴포넌트입니다(`"use client"`가 달려 있어 서버 컴포넌트에서 import해도 됩니다. 단 `onChange`는 클라이언트 컴포넌트에서 넘깁니다).
  - `value`·`onChange(value)`(제어) 또는 `defaultValue`(비제어, 처음부터 하나를 선택해 둡니다). `name`(생략하면 자동, 폼 제출 이름), `disabled`(그룹 전체), `aria-label`
- **`Radio`** — 여러 선택지 중 하나만 고르는 라디오(2\~4개). 진짜 `<input type="radio">`를 `<label>`로 감싸서 레이블을 눌러도 선택되고, 방향키로 옮기고 Space로 고르는 것과 폼 제출이 브라우저 기본 동작 그대로입니다.
  - `value`(그룹 안에서 필수), `children`(레이블, 없으면 `aria-label`), `tight`(여백 8 → 0, 높이 40 → 24), `disabled`. 나머지 `<input>` 속성은 입력에, `className`·`style`은 바깥 `<label>`에
  - 색: 안 고름은 흰 원·회색 테두리, 고름은 브랜드 원 + 흰 점. hover·누름은 한 단계 진하게. 터치 화면 눌림 영역 44px 이상
  - 금지: 선택 해제 기능, 5개 이상 선택지(Select), 여러 개 고르기(`Checkbox`). 상세 규칙은 `components/radio/AGENTS.md`
- **`FramedCheckbox`** · **`FramedRadio`** · **`Framed`** — 선택지를 틀로 묶어 한 덩어리로 보여 주고, 선택된 틀을 테두리로 강조합니다(Figma Framed Style). 클라이언트 컴포넌트입니다.
  - `FramedCheckbox`: 체크박스를 담은 틀. `label`(필수)·`description`, `checked`·`defaultChecked`·`indeterminate`·`onChange`·`disabled`. 틀 전체가 `<label>`이라 어디를 눌러도 체크가 바뀝니다
  - `FramedRadio`: 라디오를 담은 틀. `RadioGroup` 안에서 `value`·`label`·`description`. 틀 사이 간격은 `RadioGroup`에 `className="gap-2"`
  - `Framed`: 다른 내용을 담는 틀만(`children`). 선택 표시는 `selected`
  - 공통: `size`(`sm` 여백12·모서리8 · `md` 16·12 기본 · `lg` 20·16), `error`(오류: 빨간 테두리 + `aria-invalid`), `shadow`. 선택되면 브랜드 테두리, 누름은 회색, 비활성은 회색 바탕
  - 금지: 틀 안에 틀 중첩, 선택 의미 없는 장식용 박스. 상세 규칙은 `components/framed/AGENTS.md`
