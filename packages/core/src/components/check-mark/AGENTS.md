# CheckMark 사용 규칙

`CheckMark`를 쓰거나 고칠 때 **이 문서대로 쓰는 것을 권장**합니다. 출처는 Figma `Check Mark`(node `2200:7795`)와 `Check Mark Guidelines`(node `2200:7940`)입니다. Figma와 이 문서가 다르면 Figma가 맞습니다.

- **목록에서 선택된 항목을 표시하는 체크 표시**입니다. 선택 표시만 필요할 때 쓰고, 값을 고르는 폼 컨트롤은 `Checkbox`를 씁니다.
- 서버 컴포넌트에서 그대로 쓸 수 있습니다(`"use client"` 없음). `onClick`을 넘길 때만 클라이언트 컴포넌트 안에서 씁니다.
- 반응형 웹(모바일웹 ~ PC)에서 같은 컴포넌트를 씁니다.

## 언제 쓰나요

체크 표시만 필요한 목록에 써요.

|         | CheckMark                                       | Checkbox                      |
| ------- | ----------------------------------------------- | ----------------------------- |
| 모양    | 체크 아이콘만 보여요                            | 체크 박스예요                 |
| 쓰는 곳 | 선택된 항목을 표시하는 목록 (Menu, Select Item) | 여러 개를 고르는 폼           |
| 선택    | 항목 전체를 눌러 선택해요                       | 박스나 레이블을 눌러 선택해요 |

## 구성

상태와 레이블을 골라요.

| 구성               | 선택지                          | 설명                                |
| ------------------ | ------------------------------- | ----------------------------------- |
| 체크(`checked`)    | False · True                    | True일 때 브랜드 색으로 표시해요    |
| 상태               | Normal · Pressed · Disabled     | Hover는 Pressed와 같아요            |
| 레이블(`children`) | 켜고 끌 수 있어요               | 단독으로 쓰면 `aria-label`을 붙여요 |
| 크기(`size`)       | XSmall · Small · Medium · Large | 기본은 Small. 구간별 값도 받아요    |
| Tight(`tight`)     | False · True                    | 촘촘한 목록에서만 써요              |

- **색**: 체크 안 됨은 회색 체크(`icon-secondary`), 체크됨은 브랜드 체크(`icon-brand`)입니다. 누르는 동안과 hover는 한 단계 진해지고(`icon-default` · `icon-brand-pressed`), `disabled`는 연한 회색 체크와 회색 글자(`text-disabled`)입니다.
- **크기(`size`)**: Figma Size(2026-11-11 추가)와 같습니다. 사이 간격은 모두 8, 기본 모양의 좌우 여백 8입니다.

  | `size`     | 체크 | 레이블                  | 높이(기본 · `tight`) |
  | ---------- | ---- | ----------------------- | -------------------- |
  | `xs`       | 16   | Body 4 Regular(14/22)   | 40 · 20              |
  | `sm`(기본) | 20   | Body 2 Regular(16/24)   | 40 · 24              |
  | `md`       | 24   | Body 1 Regular(17/28)   | 40 · 28              |
  | `lg`       | 32   | Heading 2 Medium(20/30) | 48 · 32              |
  - 레이블은 Figma(2278:31457)가 글자 토큰에 맞춘 그대로입니다(2026-11-11).
  - 구간별 값도 받습니다(`size={{ base: "md", desktop: "sm" }}`). 같은 목록에서는 크기를 하나로 맞춥니다.
  - 터치 화면에서는 모든 크기의 눌림 영역이 44px로 넓어집니다.

- **두 가지 쓰임**: `onClick`이 없으면 표시용 `<span>`, 있으면 항목 전체가 눌리는 `<button>`입니다.
- **역할(`role`)**: 눌리는 CheckMark는 기본 `checkbox`(`aria-checked`)로 읽힙니다. 목록(`listbox`) 안이면 `role="option"`(`aria-selected`), 메뉴 안이면 `menuitemcheckbox`·`menuitemradio`, 하나만 고르면 `radio`를 줍니다.

```tsx
// 하나만 고르는 목록: 항목 전체를 누르고, 선택 여부는 aria로도 알린다
<div role="radiogroup" aria-label="정렬">
  {["최신순", "인기순", "가격순"].map((label) => (
    <CheckMark
      key={label}
      role="radio"
      checked={sort === label}
      onClick={() => setSort(label)}
      className="w-full"
    >
      {label}
    </CheckMark>
  ))}
</div>
```

## 사용 규칙

선택된 항목이 한눈에 보여야 해요.

| 구분 | 내용                                                     |
| ---- | -------------------------------------------------------- |
| 권장 | 선택된 항목에만 체크를 보여서 위치를 분명히 해요         |
| 권장 | 항목 전체를 눌러서 선택되게 해요                         |
| 금지 | 폼에서 값을 입력받는 용도로 쓰지 않아요. Checkbox를 써요 |
| 금지 | 체크 색만으로 선택 여부를 알리지 않아요                  |

- 항목 전체를 누르게 하려면 `className="w-full"`처럼 항목 폭으로 넓힙니다. 체크 아이콘만 눌리게 만들지 않습니다.
- 색 말고도 선택을 알립니다. 스크린리더에는 `aria-checked`·`aria-selected`로 알리고, 화면에서는 선택된 항목만 체크하는 배치(권장)나 굵은 글자 등으로 함께 알립니다.

## 접근성

누구나 쓸 수 있도록 다음을 지켜 주세요.

- **상태를 읽어 줘요:** `aria-selected` 또는 `aria-checked`로 선택 여부를 알려요. 눌리는 CheckMark는 `role`에 맞춰 자동으로 붙습니다. 표시용(`onClick` 없음)은 감싸는 항목에 직접 붙입니다.
- **터치 영역은 44px 이상이에요:** 체크 표시가 작아도 항목 전체를 누르게 해요. 버튼 전체(체크 + 레이블 + 여백)가 눌림 영역이고, 보이는 높이(기본 40 · `tight` 24)와 상관없이 터치 화면에서는 눌림 영역이 44px로 넓어집니다. 목록에서는 `className="w-full"`로 항목 폭까지 넓힙니다.
- 레이블 없이 쓰면 `aria-label`을 줍니다.
- 키보드 포커스 링은 항상 보입니다(`focus-visible`).

## Props 요약

`checked` · `children`(레이블) · `size` · `tight` · `disabled` · `role` · `onClick`과 나머지 `<button>` 속성. 자세한 표는 docs의 Check mark 페이지를 봅니다.
