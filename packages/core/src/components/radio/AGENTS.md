# Radio 사용 규칙

`Radio`·`RadioGroup`을 쓰거나 고칠 때 **이 문서대로 쓰는 것을 권장**합니다. 출처는 Figma `Radio`(node `2204:17914`)와 `Radio Guidelines`(node `2204:18059`)입니다. Figma와 이 문서가 다르면 Figma가 맞습니다.

- **여러 선택지 중에서 하나만 고르는 컨트롤**입니다. 선택지가 많으면 Select를, 켜고 끄는 설정이면 Switch를 씁니다(Select·Switch는 MINT에 아직 없음). 여러 개를 고르면 `Checkbox`입니다.
- 클라이언트 컴포넌트(`"use client"`)입니다. 서버 컴포넌트에서 import해도 되지만 `onChange`는 클라이언트 컴포넌트에서 넘깁니다. `name`·`defaultValue`만 쓰는 폼(서버 액션 등)은 `onChange` 없이도 됩니다.
- 진짜 `<input type="radio">`를 `<label>`로 감쌌습니다. 레이블을 눌러도 선택되고, 방향키·Space·폼 제출이 브라우저 기본 동작 그대로입니다.
- **`RadioGroup`으로 묶어서 씁니다.** 그룹이 이름(`name`)과 선택 값(`value`·`defaultValue`·`onChange`)을 가지고, 선택지를 세로로 나열합니다(`role="radiogroup"`).
- 반응형 웹(모바일웹 ~ PC)에서 같은 컴포넌트를 씁니다.

## 언제 쓰나요

하나만 고를 때 써요.

|             | Radio                     | Select             | Chip              |
| ----------- | ------------------------- | ------------------ | ----------------- |
| 선택지 수   | 2~4개                     | 5개 이상           | 2~4개 짧은 옵션   |
| 설명        | 설명이 긴 선택지도 담아요 | 한 줄 레이블이에요 | 짧은 레이블이에요 |
| 보이는 방식 | 항상 모두 보여요          | 눌러야 펼쳐져요    | 항상 모두 보여요  |

## 구성

상태와 레이블을 골라요.

| 구성          | 선택지                          | 설명                                   |
| ------------- | ------------------------------- | -------------------------------------- |
| 체크(Checked) | False · True                    | 같은 그룹에서는 항상 하나만 True예요   |
| 상태          | Normal · Pressed · Disabled     | Hover는 Pressed와 같아요               |
| 레이블        | 켜고 끌 수 있어요               | 레이블 없이 쓰면 `aria-label`을 붙여요 |
| 크기(`size`)  | XSmall · Small · Medium · Large | 기본은 Small. 구간별 값도 받아요       |
| Tight         | False · True                    | 촘촘한 목록에서만 써요                 |

- **색**: 안 고름은 흰 원·회색 테두리(`border-strong`), 고름은 브랜드 원(`fill-brand`) 가운데 흰 점(8px)입니다. 누르는 동안과 hover는 한 단계 진해지고(`fill-neutral-weak` · `fill-brand-pressed`), `disabled`는 회색 원(`fill-disabled`·`border-disabled`) 또는 연한 파랑 원(`fill-brand-weak-pressed`)에 회색 글자(`text-disabled`)입니다.
- **크기(`size`)**: Figma Radio(2280:32059, 2026-11-11 추가)와 같습니다. 사이 간격 8, 기본 모양의 좌우 여백 8입니다.

  | `size`     | 원 · 가운데 흰 점 | 레이블                  | 높이(기본 · `tight`) |
  | ---------- | ----------------- | ----------------------- | -------------------- |
  | `xs`       | 16 · 6            | Body 4 Regular(14/22)   | 40 · 20              |
  | `sm`(기본) | 20 · 8            | Body 2 Regular(16/24)   | 40 · 24              |
  | `md`       | 24 · 10           | Body 1 Regular(17/28)   | 40 · 28              |
  | `lg`       | 32 · 12           | Heading 2 Medium(20/30) | 48 · 32              |
  - `RadioGroup`에 `size`를 주면 그룹 안 라디오가 모두 그 크기예요. 라디오마다 `size`를 주면 그 값이 우선입니다. 같은 그룹은 크기를 하나로 맞춥니다.
  - 구간별 값도 받습니다(`size={{ base: "md", desktop: "sm" }}`). `FramedRadio`의 원은 지금처럼 Small(20) 하나입니다.

- `RadioGroup`: `value`(제어) 또는 `defaultValue`(비제어), `onChange(value)`, `name`(생략하면 자동), `disabled`(그룹 전체), `size`(그룹 안 라디오 크기). 나머지 `<div>` 속성(`aria-label` 등)을 받습니다.
- `Radio`: `value`(그룹 안에서 필수), `children`(레이블), `size`, `tight`, `disabled`. 나머지 `<input>` 속성은 입력에, `className`·`style`은 바깥 `<label>`에 붙습니다. 그룹 밖에서는 `name`·`checked`·`defaultChecked`로 직접 묶을 수 있습니다.

```tsx
<RadioGroup aria-label="정렬 기준" defaultValue="latest" name="sort">
  <Radio value="latest">최신순</Radio>
  <Radio value="popular">인기순</Radio>
  <Radio value="price">가격순</Radio>
</RadioGroup>;

// 제어
const [method, setMethod] = useState("card");
<RadioGroup aria-label="결제 수단" value={method} onChange={setMethod}>
  <Radio value="card">카드</Radio>
  <Radio value="bank">계좌이체</Radio>
</RadioGroup>;
```

## 사용 규칙

그룹 안에서는 항상 하나가 선택돼 있어요.

| 구분 | 내용                                                     |
| ---- | -------------------------------------------------------- |
| 권장 | 처음부터 기본값 하나를 선택해 두어요                     |
| 권장 | 선택지는 세로로 나열해서 비교하기 쉽게 해요              |
| 금지 | 같은 그룹에서 선택을 해제할 수 있게 하지 않아요          |
| 금지 | 선택지가 5개 이상이면 Radio를 쓰지 않아요. Select를 써요 |

- `RadioGroup`에 `defaultValue`(또는 `value`)를 꼭 줍니다. 아무것도 고르지 않은 상태로 시작하지 않습니다.
- `RadioGroup`은 세로 나열이 기본입니다. `className`으로 가로로 바꾸지 않습니다.
- "선택 안 함"이 필요하면 해제 기능을 만들지 말고 "선택 안 함" 선택지를 하나 더 둡니다.

## 접근성

누구나 쓸 수 있도록 다음을 지켜 주세요.

- **키보드로 이동해요:** 방향키로 선택을 옮기고 Space로 선택해요. 그룹에는 Tab으로 한 번 들어오고(선택된 라디오), 안에서는 방향키로 옮깁니다. 브라우저 기본 동작이라 따로 만들지 않습니다.
- `RadioGroup`에 `aria-label`(또는 `aria-labelledby`)로 그룹 이름을 줍니다.
- 레이블 없이 쓰면 `Radio`에 `aria-label`을 붙입니다.
- 원이 20px이라도 레이블을 포함한 `<label>` 전체가 눌림 영역이고, 터치 화면에서는 44px 이상으로 넓어집니다. 포커스 링은 원에 보입니다(`focus-visible`).

## Props 요약

- `RadioGroup`: `value` · `defaultValue` · `onChange` · `name` · `disabled` · `size` · `children`과 나머지 `<div>` 속성
- `Radio`: `value` · `children`(레이블) · `size` · `tight` · `disabled`와 나머지 `<input>` 속성

자세한 표는 docs의 Radio 페이지를 봅니다.
