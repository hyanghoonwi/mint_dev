# Checkbox 사용 규칙

`Checkbox`를 쓰거나 고칠 때 **이 문서대로 쓰는 것을 권장**합니다. 출처는 Figma `Checkbox`(node `2200:8114`)와 `Checkbox Guidelines`(node `2200:8359`)입니다. Figma와 이 문서가 다르면 Figma가 맞습니다.

- **여러 개를 고르거나 한 항목을 켜고 끄는 작은 컨트롤**입니다. 하나만 고르면 `Radio`, 즉시 켜고 끄면 Switch, 목록에서 선택 표시만 필요하면 `CheckMark`를 씁니다(Switch는 MINT에 아직 없음).
- 클라이언트 컴포넌트(`"use client"`)입니다. 서버 컴포넌트에서 import해도 되지만 `onChange`는 클라이언트 컴포넌트에서 넘깁니다. `name`·`defaultChecked`만 쓰는 폼(서버 액션 등)은 `onChange` 없이도 됩니다.
- 진짜 `<input type="checkbox">`를 `<label>`로 감쌌습니다. 레이블을 눌러도 선택되고, 폼 제출(`name`·`value`)·키보드(<kbd>Space</kbd>)·스크린리더가 그대로 동작합니다.
- 반응형 웹(모바일웹 ~ PC)에서 같은 컴포넌트를 씁니다.

## 언제 쓰나요

선택 방식에 따라 컨트롤을 골라요.

|      | Checkbox                 | Radio                 | Switch                  |
| ---- | ------------------------ | --------------------- | ----------------------- |
| 선택 | 여러 개를 고를 수 있어요 | 하나만 고를 수 있어요 | 켜짐과 꺼짐 두 가지예요 |
| 반영 | 제출할 때 적용돼요       | 제출할 때 적용돼요    | 누르면 바로 적용돼요    |
| 예시 | 관심 분야, 약관 동의     | 결제 수단, 정렬 기준  | 알림 켜기               |

## 구성

상태와 모양을 골라요.

| 구성          | 선택지                              | 설명                                              |
| ------------- | ----------------------------------- | ------------------------------------------------- |
| 체크(Checked) | Unchecked · Checked · Indeterminate | Indeterminate는 하위 항목 일부만 선택됐을 때 써요 |
| 상태          | Normal · Pressed · Disabled         | Hover는 Pressed와 같아요                          |
| 레이블        | 켜고 끌 수 있어요                   | 레이블 없이 쓰면 `aria-label`을 꼭 붙여요         |
| 크기(`size`)  | XSmall · Small · Medium · Large     | 기본은 Small. 구간별 값도 받아요                  |
| Tight · Bold  | False · True                        | Tight는 촘촘한 목록, Bold는 강조 레이블이에요     |

- **체크**: `checked`(제어) 또는 `defaultChecked`(비제어). 일부 선택은 `indeterminate`이고, 체크 대신 가로 막대가 보입니다.
- **색**: 체크 안 됨은 흰 상자·회색 테두리(`border-strong`), 체크·일부 선택은 브랜드 상자에 흰 체크·막대입니다. 누르는 동안과 hover는 한 단계 진해지고(`fill-neutral-weak` · `fill-brand-pressed`), `disabled`는 회색 상자(`fill-disabled`) 또는 연한 파랑 상자(`fill-brand-weak-pressed`)에 회색 글자(`text-disabled`)입니다.
- **크기(`size`)**: Figma Size(2026-11-11 추가)와 같습니다. 모서리는 모두 4, 사이 간격 8, 기본 모양의 좌우 여백 8입니다.

  | `size`     | 상자 · 체크 · 막대 | 레이블(`bold`면 SemiBold)              | 높이(기본 · `tight`) |
  | ---------- | ------------------ | -------------------------------------- | -------------------- |
  | `xs`       | 16 · 12 · 8×1.5    | Body 4(14/22, Figma 14/20)             | 40 · 22              |
  | `sm`(기본) | 20 · 16 · 10×2     | Body 2(16/24)                          | 40 · 24              |
  | `md`       | 24 · 20 · 12×2.5   | Body 1(17/28, Figma 18/28)             | 40 · 28              |
  | `lg`       | 32 · 26 · 16×3     | Heading 2 Medium(20/30, Figma Regular) | 48 · 32              |
  - 레이블 글자는 `CheckMark`와 같은 대응입니다(Figma의 14/20·18/28·20/30 Regular는 MINT 글자 표에 없음).
  - 구간별 값도 받습니다(`size={{ base: "md", desktop: "sm" }}`). 같은 목록에서는 크기를 하나로 맞춥니다.
  - `FramedCheckbox`의 상자는 지금처럼 Small(20) 하나입니다.

- 나머지 `<input>` 속성(`name`, `value`, `required`, `onChange` 등)은 입력에 그대로 넘어가고, `className`·`style`은 바깥 `<label>`에 붙습니다. `ref`는 입력을 가리킵니다.

```tsx
// 전체 선택: 일부만 고르면 indeterminate, 전체를 누르면 모두 켜거나 끈다
const all = agreed.length === terms.length;
<Checkbox
  bold
  checked={all}
  indeterminate={agreed.length > 0 && !all}
  onChange={(e) => setAgreed(e.target.checked ? terms.map((t) => t.id) : [])}
>
  전체 동의
</Checkbox>;
{
  terms.map((t) => (
    <Checkbox
      key={t.id}
      checked={agreed.includes(t.id)}
      onChange={() => toggle(t.id)}
    >
      {t.label}
    </Checkbox>
  ));
}
```

## 사용 규칙

레이블은 선택했을 때 어떻게 되는지 알려 줘요.

| 구분 | 내용                                                             |
| ---- | ---------------------------------------------------------------- |
| 권장 | 레이블은 선택하면 어떻게 되는지 한 문장으로 써요                 |
| 권장 | 전체 선택과 하위 선택은 Indeterminate로 연결해요                 |
| 금지 | 하나만 고르는 경우에 Checkbox를 쓰지 않아요. Radio를 써요        |
| 금지 | 눌렀을 때 바로 동작이 일어나는 설정에 쓰지 않아요. Switch를 써요 |

- 전체 선택 칸은 `bold`로 강조하고, 하위 항목이 일부만 선택되면 `indeterminate`를 켭니다. 전체 선택 칸을 누르면 하위를 모두 켜거나 끕니다.
- 체크박스는 고른 값이 **제출할 때** 적용됩니다. 누르자마자 저장·적용되는 설정에는 쓰지 않습니다.

## 접근성

누구나 쓸 수 있도록 다음을 지켜 주세요.

- **레이블과 함께 눌러져요:** 체크 박스 칸뿐 아니라 레이블을 눌러도 선택돼요. `<label>`로 감싸서 자동으로 됩니다.
- **터치 영역은 44px 이상이에요:** 박스가 20px이라도 레이블을 포함해 영역을 넓혀요. 보이는 높이(기본 40 · `tight` 24)와 상관없이 터치 화면에서는 눌림 영역이 44px로 넓어집니다.
- 레이블 없이 쓰면 `aria-label`을 꼭 붙입니다.
- `indeterminate`는 스크린리더에 "일부 선택(mixed)"으로 읽힙니다.
- 키보드: <kbd>Tab</kbd>으로 옮기고 <kbd>Space</kbd>로 켜고 끕니다. 포커스 링은 상자에 보입니다(`focus-visible`).

## Props 요약

`checked` · `defaultChecked` · `indeterminate` · `children`(레이블) · `size` · `bold` · `tight` · `disabled` · `onChange`와 나머지 `<input>` 속성. 자세한 표는 docs의 Checkbox 페이지를 봅니다.
