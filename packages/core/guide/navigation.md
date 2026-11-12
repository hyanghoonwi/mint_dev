# 내비게이션

> 색인: [`../AGENTS.md`](../AGENTS.md)

- **`Category`** — 같은 목록을 거르거나 분류를 고르는 칩 목록. 한 번에 하나만 선택하고, 넘치면 가로로 스크롤합니다(터치·트랙패드는 밀어서, 마우스는 끌어서. 끈 뒤에는 칩이 선택되지 않고, 놓으면 관성으로 조금 더 미끄러짐). 클라이언트 컴포넌트입니다(`"use client"`가 달려 있어 서버 컴포넌트에서 import해도 됩니다. 단 `onChange`는 클라이언트 컴포넌트에서 넘깁니다).
  - `items`(필수): `{ value, label, icon?, badge?, disabled? }[]`. 3~7개 권장. `icon`은 글자 앞 16px 아이콘, `badge`는 글자 오른쪽 위 빨간 점(새 소식)
  - `value`·`onChange`(제어) 또는 `defaultValue`(비제어). 항상 하나가 선택되어 있습니다
  - `all`: 맨 앞 "전체" 칩(기본 `true`, 값 `"all"` = `CATEGORY_ALL`, 처음 선택). 글자는 `allLabel`
  - `variant`: `solid`(흰 화면, 기본) · `outline`(회색 배경 위)
  - `size`: `lg`(40, 기본, 모바일웹 기본) · `md`(32, 촘촘한 영역. 터치 눌림 영역은 44). Figma Large·Medium, `Chip`과 같은 이름. 구간별 객체도 받음(`{ base: "lg", desktop: "md" }`)
  - `shape`: `square`(기본) · `pill`
  - `fade`: 넘칠 때 스크롤할 쪽 가장자리 그라데이션(기본 `true`, 자동으로 나타남)
  - `aria-label`을 꼭 줍니다(`radiogroup`의 이름). 키보드는 ←·→·Home·End로 선택
  - 금지: 두 줄 줄바꿈, 복수 선택(Checkbox를 씀), 화면 섹션 전환(Tab을 씀). 상세 규칙은 `components/category/AGENTS.md`
- **`SegmentedControl`** — 같은 영역의 보기 방식(목록/격자, 일/주/월)을 바로 바꾸는 토글형 선택 컨트롤. 회색 트랙 위에 선택된 항목이 흰 칩으로 보입니다. 클라이언트 컴포넌트입니다(`"use client"`가 달려 있어 서버 컴포넌트에서 import해도 됩니다. 단 `onChange`는 클라이언트 컴포넌트에서 넘깁니다).
  - `items`(필수): `{ value, label, icon?, disabled? }[]`. 2~6개. 이름은 1~4자. `icon`은 글자 앞 아이콘(lg 20 · md·sm 16, 크기는 자동)
  - `value`·`onChange`(제어) 또는 `defaultValue`(비제어, 기본 첫 항목). 항상 하나가 선택되어 있습니다(선택 없음 상태 없음)
  - `size`: `sm`(트랙 32) · `md`(40, 기본) · `lg`(48). 글자 label-3 · label-2 · label-1. `md`·`sm`은 터치 눌림 영역 44. 구간별 객체도 받음(`{ base: "lg", desktop: "md" }`)
  - `fullWidth`: 부모 폭을 꽉 채움(기본 `false`, 가장 긴 항목 폭으로 같은 폭). 구간별 객체도 받음(`{ base: true, tablet: false }`)
  - 선택이 바뀌면 흰 칩이 옆 칸으로 미끄러짐(CSS, 움직임 줄이기 설정이면 멈춤)
  - `aria-label`을 꼭 줍니다(`radiogroup`의 이름). 키보드는 ←·→·Home·End로 선택
  - 금지: 화면 섹션 전환(Tab을 씀), 7개 이상(Select·Tab), 선택 없음 상태. 상세 규칙은 `components/segmented-control/AGENTS.md`
- **`PageCounter`** · **`PageDots`** — 배너·캐러셀·이미지 갤러리의 현재 위치 표시(표시 전용, 누를 수 없음). 서버 컴포넌트에서도 쓸 수 있습니다.
  - 공통: `current`(현재 위치, 1부터)·`total`(전체 개수) 필수, `size`(`md` 기본 · `sm`). 스크린리더는 "10개 중 1번째"로 읽음
  - `PageCounter`: "1 / 10" 숫자. `variant`: `normal`(진한 바탕·흰 글자, 기본) · `alternative`(연한 바탕·회색 글자). 개수 제한 없음(이미지가 많은 갤러리)
  - `PageDots`: 점. 2~7개만(8개 이상이면 `PageCounter`). `variant`: `normal`(밝은 바탕, 기본) · `white`(이미지 위, 나머지 점 흰색 40%)
  - 금지: 점으로 클릭 이동 만들기, 현재 위치가 아닌 점 강조. 상세 규칙은 `components/page-indicator/AGENTS.md`
- **`Pagination`** — 많은 데이터를 페이지로 나눠 보여 줄 때의 페이지 이동(3~4화면 이내 분량이면 쓰지 않음). 서버 컴포넌트에서 쓸 수 있습니다(`"use client"` 없음).
  - `page`(현재, 1부터)·`total`(전체 페이지 수) 필수. `total <= 1`이면 그리지 않음
  - 링크: `getHref={(p) => "?page=" + p}` + Next.js는 `linkComponent={Link}`(서버 컴포넌트 그대로). 버튼: `onChange={setPage}`(클라이언트 컴포넌트)
  - `variant`: `extended`(9칸) · `compact`(7칸). 값 하나 또는 구간별 객체(`{ base: "compact", desktop: "extended" }`). 기본 `{ base: "compact", tablet: "extended" }`(768px 미만 compact). Figma는 480px 기준이지만 MINT 구간은 `tablet:`(768)·`desktop:`(1024)뿐
  - 번호 배치는 자동(처음·끝 + 현재 주변, 칸 수 고정). 현재 페이지 `aria-current="page"`, 첫·마지막의 이전·다음은 자동 비활성
  - 금지: 모바일에서 extended 고정. 상세 규칙은 `components/pagination/AGENTS.md`
