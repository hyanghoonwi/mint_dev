# Framed 사용 규칙

`Framed`·`FramedCheckbox`·`FramedRadio`를 쓰거나 고칠 때 **이 문서대로 쓰는 것을 권장**합니다. 출처는 Figma `Framed Style`(node `2200:9900`)과 `Framed Style Guidelines`(node `2200:10166`)입니다. Figma와 이 문서가 다르면 Figma가 맞습니다.

- **여러 요소를 하나의 틀로 묶어서 관련 정보를 한 덩어리로 보여 주는 컴포넌트**입니다. 선택된 묶음은 테두리로 강조합니다. 안쪽에는 Checkbox, Radio, Select Item 같은 내용을 넣습니다.
- 클라이언트 컴포넌트(`"use client"`)입니다. 서버 컴포넌트에서 import해도 되지만 `onChange`는 클라이언트 컴포넌트에서 넘깁니다.
- 반응형 웹(모바일웹 ~ PC)에서 같은 컴포넌트를 씁니다. 폭은 부모를 꽉 채웁니다.

| 컴포넌트         | Figma Type  | 쓰임                                                                 |
| ---------------- | ----------- | -------------------------------------------------------------------- |
| `FramedCheckbox` | Checkbox    | 체크박스를 담은 틀. 여러 개를 고를 때                                |
| `FramedRadio`    | Radio       | 라디오를 담은 틀. `RadioGroup` 안에서 하나만 고를 때                 |
| `Framed`         | Placeholder | 다른 내용(Select Item 등)을 담는 틀만. 선택 표시는 `selected`로 넘김 |

- `FramedCheckbox`·`FramedRadio`는 **틀 전체가 `<label>`**이라 틀 어디를 눌러도 안의 컨트롤이 선택되고, 선택되면 테두리가 자동으로 브랜드 색이 됩니다(입력의 `:checked`를 읽음). 진짜 `<input>`이라 폼 제출·키보드가 그대로 동작합니다.
- 키보드 포커스 링은 틀 전체에 그립니다.

## 언제 쓰나요

틀 안에 다른 컴포넌트를 담아 한 덩어리로 보여 줘요.

|      | Framed Style                          | List Cell                 |
| ---- | ------------------------------------- | ------------------------- |
| 목적 | 관련 요소를 한 덩어리로 묶어 선택해요 | 목록의 한 줄을 보여 줘요  |
| 내용 | Checkbox, Radio, Select Item을 담아요 | 아이콘, 라벨, 값을 담아요 |
| 선택 | 선택된 틀이 테두리로 강조돼요         | 선택은 체크로 표시해요    |

List Cell은 MINT에 아직 없습니다.

## 구성

틀의 크기와 상태를 골라요.

| 구성            | 선택지                           | 설명                                                       |
| --------------- | -------------------------------- | ---------------------------------------------------------- |
| 내용(Type)      | Checkbox · Radio · Placeholder   | 틀 안에 담을 컴포넌트예요                                  |
| 크기            | Small · Medium · Large           | 내용 양에 맞춰 골라요                                      |
| 선택(Selected)  | False · True                     | True이면 테두리가 진해져요                                 |
| 상태            | Normal · Pressed · Disabled      | Hover는 Pressed와 같아요                                   |
| Status · Shadow | Normal · Negative / False · True | 오류는 Negative(`error`), 띄워 보이게 하려면 Shadow를 켜요 |

- **크기(`size`)**: `sm` 여백 12·모서리 8 · `md` 16·12(기본) · `lg` 20·16.
- **색**: 기본은 흰 바탕·옅은 회색 테두리(`border-default`), 선택은 브랜드 테두리 1px(`border-brand`), 누름(hover 포함)은 흰 바탕 위에 `fill-pressed`를 덮은 회색, 오류(`error`)는 빨간 테두리 1px(`fill-danger`, 선택돼도 빨강)이고 안의 컨트롤에 `aria-invalid`가 붙습니다, 비활성은 회색 바탕(`fill-disabled`)·회색 테두리(`border-disabled`).
- **그림자(`shadow`)**: 0 2 4 rgba(0,0,0,0.08).
- **내용**: 컨트롤(20px)과 글 사이 12. 레이블 Body 2(`text-primary`), 설명 Body 5(`text-tertiary`), 레이블과 설명 사이 2. 글은 줄바꿈됩니다.
- Figma customize의 `content`는 `label`·`description`(또는 `Framed`의 `children`), `radius`·`padding`은 `size`, `shadow`는 `shadow`입니다.

```tsx
// 하나만 고르기
<RadioGroup aria-label="요금제" defaultValue="basic" className="gap-2">
  <FramedRadio value="basic" label="베이직" description="월 9,900원 · 시세 알림 10개" />
  <FramedRadio value="pro" label="프로" description="월 19,900원 · 시세 알림 무제한" />
</RadioGroup>

// 여러 개 고르기
<FramedCheckbox label="이메일" description="주 1회 요약을 받아요" defaultChecked />
<FramedCheckbox label="푸시 알림" description="가격 도달 시 바로 알려요" />

// 다른 내용을 담는 틀
<Framed selected size="lg">…</Framed>
```

## 사용 규칙

틀은 선택지를 묶을 때만 써요.

| 구분 | 내용                                                  |
| ---- | ----------------------------------------------------- |
| 권장 | 설명이 긴 선택지를 카드처럼 나란히 보여 줄 때 써요    |
| 권장 | 같은 그룹에서는 크기와 내용을 통일해요                |
| 금지 | 틀 안에 틀을 중첩하지 않아요                          |
| 금지 | 장식용 박스로 쓰지 않아요. 선택 의미가 있을 때만 써요 |

- 틀 사이 간격은 8을 둡니다(`RadioGroup`에 `className="gap-2"`).
- 같은 그룹의 틀은 `size`와 내용 구성(설명 유무)을 맞춥니다.
- 오류(`error`)는 그룹의 틀 전체에 주고, 무엇이 잘못됐는지 그룹 아래에 글로 알립니다(`aria-describedby`로 연결). Figma의 `status` Negative가 `error`입니다. Input 등 다른 입력 컴포넌트도 같은 이름을 씁니다.

## 접근성

- 안의 컨트롤이 진짜 체크박스·라디오라서 스크린리더가 레이블과 함께 선택 여부를 읽습니다. 설명도 같은 레이블 안이라 함께 읽힙니다.
- 키보드: 체크박스는 <kbd>Tab</kbd>·<kbd>Space</kbd>, 라디오는 그룹에 <kbd>Tab</kbd>으로 들어와 방향키로 옮깁니다. 포커스 링은 틀 전체에 보입니다.
- `RadioGroup`에 `aria-label`로 그룹 이름을 줍니다.
- 선택 여부를 테두리 색만으로 알리지 않도록, 안의 체크박스·라디오 표시가 함께 바뀝니다.

## Props 요약

- `FramedCheckbox`: `label`(필수) · `description` · `size` · `error` · `shadow` · `checked` · `defaultChecked` · `indeterminate` · `disabled` · `onChange`와 나머지 `<input>` 속성
- `FramedRadio`: `label`(필수) · `description` · `value` · `size` · `error` · `shadow` · `disabled`와 나머지 `<input>` 속성(`RadioGroup` 안에서 씀)
- `Framed`: `selected` · `size` · `error` · `shadow` · `disabled` · `children`과 나머지 `<div>` 속성

자세한 표는 docs의 Framed 페이지를 봅니다.
