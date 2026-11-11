# 내비게이션

> 색인: [`../AGENTS.md`](../AGENTS.md)

- **`Category`** — 같은 목록을 거르거나 분류를 고르는 칩 목록. 한 번에 하나만 선택하고, 넘치면 가로로 스크롤합니다. 클라이언트 컴포넌트입니다(`"use client"`가 달려 있어 서버 컴포넌트에서 import해도 됩니다. 단 `onChange`는 클라이언트 컴포넌트에서 넘깁니다).
  - `items`(필수): `{ value, label, icon?, badge?, disabled? }[]`. 3~7개 권장. `icon`은 글자 앞 16px 아이콘, `badge`는 글자 오른쪽 위 빨간 점(새 소식)
  - `value`·`onChange`(제어) 또는 `defaultValue`(비제어). 항상 하나가 선택되어 있습니다
  - `all`: 맨 앞 "전체" 칩(기본 `true`, 값 `"all"` = `CATEGORY_ALL`, 처음 선택). 글자는 `allLabel`
  - `variant`: `solid`(흰 화면, 기본) · `outline`(회색 배경 위)
  - `size`: `lg`(40, 기본, 모바일웹 기본) · `md`(32, 촘촘한 영역. 터치 눌림 영역은 44). Figma Large·Medium, `Chip`과 같은 이름. 구간별 객체도 받음(`{ base: "lg", desktop: "md" }`)
  - `shape`: `square`(기본) · `pill`
  - `fade`: 넘칠 때 스크롤할 쪽 가장자리 그라데이션(기본 `true`, 자동으로 나타남)
  - `aria-label`을 꼭 줍니다(`radiogroup`의 이름). 키보드는 ←·→·Home·End로 선택
  - 금지: 두 줄 줄바꿈, 복수 선택(Checkbox를 씀), 화면 섹션 전환(Tab을 씀). 상세 규칙은 `components/category/AGENTS.md`
- **`PageCounter`** · **`PageDots`** — 배너·캐러셀·이미지 갤러리의 현재 위치 표시(표시 전용, 누를 수 없음). 서버 컴포넌트에서도 쓸 수 있습니다.
  - 공통: `current`(현재 위치, 1부터)·`total`(전체 개수) 필수, `size`(`md` 기본 · `sm`). 스크린리더는 "10개 중 1번째"로 읽음
  - `PageCounter`: "1 / 10" 숫자. `variant`: `normal`(진한 바탕·흰 글자, 기본) · `alternative`(연한 바탕·회색 글자). 개수 제한 없음(이미지가 많은 갤러리)
  - `PageDots`: 점. 2~7개만(8개 이상이면 `PageCounter`). `variant`: `normal`(밝은 바탕, 기본) · `white`(이미지 위, 나머지 점 흰색 40%)
  - 금지: 점으로 클릭 이동 만들기, 현재 위치가 아닌 점 강조. 상세 규칙은 `components/page-indicator/AGENTS.md`
- **`Pagination`** — 많은 데이터를 페이지로 나눠 보여 줄 때의 페이지 이동(3~4화면 이내 분량이면 쓰지 않음). 서버 컴포넌트에서 쓸 수 있습니다(`"use client"` 없음).
  - `page`(현재, 1부터)·`total`(전체 페이지 수) 필수. `total <= 1`이면 그리지 않음
  - 링크: `getHref={(p) => "?page=" + p}` + Next.js는 `linkComponent={Link}`(서버 컴포넌트 그대로). 버튼: `onChange={setPage}`(클라이언트 컴포넌트)
  - `variant`: `responsive`(기본, 768px 미만 compact · 이상 extended) · `extended`(9칸) · `compact`(7칸). Figma는 480px 기준이지만 MINT 구간은 `tablet:`(768)뿐
  - 번호 배치는 자동(처음·끝 + 현재 주변, 칸 수 고정). 현재 페이지 `aria-current="page"`, 첫·마지막의 이전·다음은 자동 비활성
  - 금지: 모바일에서 extended 고정. 상세 규칙은 `components/pagination/AGENTS.md`
