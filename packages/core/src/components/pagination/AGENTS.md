# Pagination 사용 규칙

`Pagination`을 쓰거나 고칠 때 **이 문서대로 쓰는 것을 권장**합니다. 출처는 Figma `Pagination`(node `2204:17614`)과 `Pagination Guidelines`(node `2204:17744`)입니다. Figma와 이 문서가 다르면 Figma가 맞습니다.

- **많은 데이터를 여러 페이지로 나누어 보여 주는 페이지 이동 컨트롤**입니다. 3~4화면 이내 분량이면 쓰지 않습니다.
- 서버 컴포넌트에서 쓸 수 있습니다(`"use client"` 없음).
  - **링크로 쓰기(`getHref`)**: 주소(`?page=2`)로 페이지를 바꾸는 목록. 서버 컴포넌트에서 그대로 씁니다. Next.js는 `linkComponent={Link}`를 넘깁니다(core는 `next/link`를 import하지 않음).
  - **버튼으로 쓰기(`onChange`)**: 화면 안에서 페이지 상태를 바꾸는 목록. 클라이언트 컴포넌트 안에서 씁니다.
- 반응형 웹(모바일웹 ~ PC)에서 같은 컴포넌트를 씁니다.

## 언제 쓰나요

분량이 적으면 쓰지 않아요.

|           | Pagination                             | 더 보기 / 무한 스크롤 |
| --------- | -------------------------------------- | --------------------- |
| 쓰는 곳   | 게시글, 목록처럼 양이 많은 데이터      | 짧은 목록, 피드       |
| 분량      | 4화면 넘는 분량                        | 3~4화면 이내          |
| 위치 파악 | 현재 페이지가 몇 번째인지 알 수 있어요 | 알기 어려워요         |

## 구성

화면 폭에 맞춰 두 가지 중에서 골라요.

|             | Extended                         | Compact                         |
| ----------- | -------------------------------- | ------------------------------- |
| 칸 수       | 9칸                              | 7칸                             |
| 쓰는 곳     | 웹, 태블릿                       | 모바일(480px 미만)              |
| 페이지 번호 | 처음과 끝, 현재 주변을 보여 줘요 | 현재 주변 위주로 줄여 보여 줘요 |
| 상태        | Normal · Pressed · Disabled      | Hover는 Pressed와 같아요        |

- **`variant`**: `extended`(9칸 = 이전·다음 + 번호 7칸) · `compact`(7칸 = 이전·다음 + 번호 5칸). 다른 컴포넌트의 `size`처럼 **값 하나 또는 구간별 객체**를 받습니다.
  - 기본값은 `{ base: "compact", tablet: "extended" }`(모바일 7칸, 태블릿부터 9칸)입니다. 객체에서 `base`를 빼면 `compact`, 빈 구간은 앞 구간 값을 이어받습니다.
  - 예: 데스크톱에서만 9칸 → `variant={{ base: "compact", desktop: "extended" }}`. 어디서나 9칸 → `variant="extended"`.
  - **MINT 구간과의 차이**: Figma는 480px에서 나누지만 MINT 브레이크포인트는 `tablet:`(768px)·`desktop:`(1024px)뿐입니다(임의 미디어 쿼리 금지). 기본값은 768px 미만에서 compact입니다.
  - 화면 폭은 CSS로만 나눕니다(두 목록 중 하나만 보임). 서버 렌더에서도 깜빡이지 않습니다.
- **번호 배치(자동)**: 처음(1)과 끝은 항상 보이고, 가운데는 현재 주변을 보여 줍니다. 말줄임(…)이 한 페이지만 가리게 되면 번호를 그대로 보여 줍니다. 칸 수가 늘 같아서 폭이 흔들리지 않습니다.
  - extended 6/99: `← 1 … 5 6 7 … 99 →` · compact 6/99: `← 1 … 6 … 99 →`
- **모양**: 칸은 40px 정사각형, 모서리 8, 글자 Label 2 Bold. 현재 페이지는 진한 바탕(`fill-neutral`)·흰 글자, 나머지는 `text-strong`, 말줄임은 `text-tertiary`. hover·누름은 `fill-pressed`(현재 페이지는 `fill-neutral-pressed`). 이전·다음은 16px 화살표(`ArrowLeftIcon`·`ArrowRightIcon`)이고 끝에서는 `icon-disabled`.
- **1페이지뿐이면 아무것도 그리지 않습니다**(`total <= 1`).

```tsx
// 링크(서버 컴포넌트, Next.js)
import Link from "next/link";
<Pagination
  page={page}
  total={99}
  getHref={(p) => `?page=${p}`}
  linkComponent={Link}
/>;

// 버튼(클라이언트 컴포넌트)
const [page, setPage] = useState(1);
<Pagination page={page} total={20} onChange={setPage} />;
```

## 사용 규칙

현재 페이지를 분명하게 알려요.

| 구분 | 내용                                                             |
| ---- | ---------------------------------------------------------------- |
| 권장 | 현재 페이지는 진한 배경으로 표시해요                             |
| 권장 | 첫 페이지에서는 이전, 마지막 페이지에서는 다음을 Disabled로 둬요 |
| 금지 | 모바일에서 Extended를 쓰지 않아요. 번호가 작아져 누르기 어려워요 |
| 금지 | 페이지가 1개뿐이면 보여 주지 않아요                              |

- 첫·마지막 페이지의 이전·다음 비활성은 자동입니다.
- 모바일 화면에서 `variant="extended"`를 고정하지 않습니다. 기본값을 쓰거나 `base`를 `compact`로 둡니다.

## 접근성

- `<nav aria-label="페이지">`로 감싸고, 현재 페이지에 `aria-current="page"`가 붙습니다.
- 번호는 "6페이지", 화살표는 "이전 페이지"·"다음 페이지"로 읽힙니다. 말줄임은 읽지 않습니다.
- 칸은 40px이고 간격 없이 붙어 있어 누를 영역이 이어집니다. 키보드 포커스 링은 항상 보입니다.

## Props 요약

`page`(필수) · `total`(필수) · `variant` · `onChange` · `getHref` · `linkComponent` · `aria-label`과 나머지 `<nav>` 속성. 자세한 표는 docs의 Pagination 페이지를 봅니다.
