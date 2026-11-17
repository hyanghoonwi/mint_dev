# Select 사용 규칙

`Select`를 쓰거나 고칠 때 **이 문서대로 쓰는 것을 권장**합니다. 출처는 Figma `Select`(node `2363:58113`)와 `Select Guidelines`(node `2362:50975`)입니다. Figma와 이 문서가 다르면 Figma가 맞습니다.

- **영역을 누르면 목록이 펼쳐지고 하나 또는 여러 개를 고르는 컨트롤**입니다. Select = Label + Select Trigger + Select Menu 세 부분입니다.
- 클라이언트 컴포넌트입니다(`"use client"`). 열림·선택 값·방향키 이동·바깥 누름 닫기를 가집니다.
- 라벨은 `Label` 컴포넌트가 **내장**되어 있으므로 `label` prop만 주고 `Label`을 따로 붙이지 않습니다(`required`·`helpIcon`·`disabled`가 `Label`과 같음). 글자는 Large·Medium이 Label `md`(14), Small이 `sm`(12)입니다.
- 목록은 `Menu`를 재사용하지 않습니다. 항목 폭(좌우 16)·간격(12)·높이(48·40·32)·글자·역할(`listbox`·`option`)이 달라서 따로 만들었습니다. 다중 선택도 Menu처럼 앞에 상자가 붙지 않고 오른쪽 체크입니다.

## 언제 쓰나요

| 구분 | Select             | RadioGroup             | Menu                     |
| ---- | ------------------ | ---------------------- | ------------------------ |
| 목적 | 값을 골라 입력해요 | 2~4개 중 하나를 골라요 | 옵션이나 액션을 펼쳐요   |
| 보임 | 눌러야 펼쳐져요    | 선택지가 늘 보여요     | 버튼이나 아이콘을 눌러요 |

## 구성

| 구성                       | 선택지                          | 설명                                                                                             |
| -------------------------- | ------------------------------- | ------------------------------------------------------------------------------------------------ |
| 라벨 위치(`labelPosition`) | Top · Left                      | Top은 칸 위, Left는 왼쪽(칸 높이에 가운데 맞춤)                                                  |
| 크기(`size`)               | Large 48 · Medium 40 · Small 32 | 칸·목록 항목이 함께 바뀜. 기본 Medium                                                            |
| 렌더(`render`)             | Text · Chip                     | 여러 개일 때 칸에는 쉼표 글자, Chip이면 칸 아래에 지울 수 있는 칩도 나옴                         |
| 상태(`status`)             | Normal · Negative · Positive    | 오류는 Negative, 확인 완료는 Positive(TextField와 같은 이름). Open · Disabled · Read only는 따로 |
| 선택(`multiple`)           | Single · Multi                  | Multi는 값이 배열                                                                                |

- **칸(Figma Select Trigger)**: Large 높이 48 · 모서리 12 · 좌우 16 · Body 2 / Medium 40 · 10 · 16 · Body 3 / Small 32 · 8 · 12 · Body 4. 테두리 `border-strong`, 열림은 `border-focus`+위쪽 화살표, 오류(`negative`)는 `fill-danger` 테두리+경고 아이콘(20, 채움)+`text-danger` 도움말, 확인 완료(`positive`)는 `fill-success` 테두리+`text-success` 도움말(Figma Select에는 Negative까지만 있어서 Positive는 TextField에 맞춘 추가이고 아이콘은 없습니다). 열려 있어도 상태 색을 유지합니다(TextField와 같음). 읽기 전용은 `fill-disabled`·`border-disabled`에 값은 `text-strong`·화살표 없음, 비활성은 글자·아이콘·라벨·도움말이 모두 `disabled` 색입니다. 값은 `text-strong`, 안내 글자는 `text-tertiary`, 도움말은 Body 5 `text-secondary`입니다.
- **칩**: 칸 안에 쌓는 경우는 만들지 않고(2026-11 결정) 칸 아래에만 나옵니다. 디자인 시스템 `Chip`(solid, `fill-neutral-medium` · `text-secondary`)을 그대로 쓰고 크기는 `size`와 이름을 맞춥니다(Select `lg` → Chip `lg` 40 · `md` → 32 · `sm` → 28). 칩을 누르면 지워지고(`aria-label="○○ 삭제"`, 토글이 아니라서 `aria-pressed` 없음) 많으면 줄바꿈됩니다. 비활성·읽기 전용에서는 칩이 눌리지 않습니다. Figma의 Chip Position=Inside·Overflow(Ellipsis·Wrap)는 만들지 않았습니다.
- **목록(Select Menu)**: 바탕 `background-floated`, 모서리 12, 안쪽 8, 그림자 `shadow-floating`, 칸 폭과 같고 칸 아래 4px에서 시작합니다. 최대 높이 기본 320에서 스크롤(MINT 기본 스크롤바).
- **항목(Select Item)**: 모서리 8, 좌우 16, 앞뒤 간격 12. 높이 Large 최소 48(위아래 12) · Medium 40(8) · Small 32(4), 글자 Body 2 · 3 · 4. 안 고른 항목은 Regular `text-strong`, 고른 항목은 `fill-brand-weak` 바탕 + Medium `text-brand` + 오른쪽 체크(`SelectedCheckIcon`, 20, 선 2, `icon-brand`)입니다. 설명은 Body 5 `text-secondary`이고, 설명이 있으면 앞·뒤 요소가 위쪽에 맞춰집니다(Figma Align Top). 안 고른 항목의 hover·누름 색은 Figma에 없어서 `fill-neutral-weak`입니다. 그룹 이름은 좌우 16 · 위 8 · 아래 4 Body 5 Medium `text-tertiary`, 그룹 사이 가로선은 좌우 16 · 위아래 4입니다.

## 접근성

- 칸은 실제 `<button role="combobox">`이고 `aria-expanded`·`aria-controls`·`aria-activedescendant`를 갖습니다. 라벨은 `<label htmlFor>`로 이어져서 라벨을 눌러도 칸에 포커스가 옵니다. 라벨 없이 쓰면 `aria-label`을 꼭 줍니다.
- 목록은 `role="listbox"`(`multiple`이면 `aria-multiselectable`), 항목은 `role="option"`(`aria-selected`·`aria-disabled`)입니다. 포커스는 칸에 두고 방향키로 옮긴 항목을 `aria-activedescendant`로 알립니다.
- 키보드: ↑·↓(열기·이동, 끝에서 반대쪽, 비활성 건너뜀), Home·End, Enter·Space(열기·고르기), Esc(닫기). 바깥을 누르거나 포커스가 나가면 닫힙니다.
- 칩은 `Chip`(`<button>`)이고 `aria-label="○○ 삭제"`로 읽힙니다. 터치 화면에서는 `Chip`처럼 눌림 영역이 넓어집니다.
- 오류는 색만으로 알리지 않습니다(경고 아이콘 + 도움말 글자, `aria-invalid`). 도움말은 `aria-describedby`로 이어집니다.
- 터치 화면에서 누르는 칸은 `md`(40) 이상을 권합니다.

## 사용 규칙

| 구분 | 내용                                                             |
| ---- | ---------------------------------------------------------------- |
| 권장 | 라벨은 명사로 짧게 한 줄, 설명은 `helper`에 써요                 |
| 권장 | 오류일 때 `status="negative"`와 함께 도움말에 해결 방법을 알려요 |
| 금지 | 2~4개 중 하나 고르기에 쓰지 않아요(RadioGroup을 써요)            |
| 금지 | 목록 안에 목록을 겹쳐 펼치지 않아요                              |

## 알아 둘 점

- 목록은 포털 없이 칸 아래에 겹쳐 그리므로 `overflow: hidden` 조상 안에서는 잘릴 수 있습니다. 화면 가장자리에서 위로 뒤집히지 않습니다.
- **반응형**: `size`와 `labelPosition`은 값 하나 또는 구간별 객체를 받습니다(`size={{ base: "lg", desktop: "md" }}`, `labelPosition={{ base: "top", desktop: "left" }}`). 구간마다 클래스를 통째로 적은 표로 CSS만 써서 처리하므로 서버·클라이언트 결과가 같습니다. 칸·목록 항목·칩(`Chip`의 `size`)·라벨(`Label`의 `size`)이 함께 바뀌고, 왼쪽 라벨은 칸 높이(`--mint-select-field`)에 맞춰 세로 가운데에 놓입니다. 모바일은 `top`, 넓은 화면은 `left`로 쓰는 것을 권합니다.

## Props 요약

`options` · `label` · `labelPosition` · `required` · `helpIcon` · `size` · `placeholder` · `helper` · `status` · `leadingIcon` · `multiple` · `render` · `value` · `defaultValue` · `onChange` · `disabled` · `readOnly` · `name` · `open` · `onOpenChange` · `menuMaxHeight`. 자세한 표는 docs의 Select 페이지를 봅니다.
