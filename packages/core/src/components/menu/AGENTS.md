# Menu 사용 규칙

`Menu`를 쓰거나 고칠 때 **이 문서대로 쓰는 것을 권장**합니다. 출처는 Figma `Menu`(node `2370:70094`)와 `Menu Guidelines`(node `2370:71511`)입니다. Figma와 이 문서가 다르면 Figma가 맞습니다.

- **옵션이나 액션을 쌓아 보여 주는 목록 상자**입니다. 열고 닫는 것과 위치(드롭다운·팝업)는 만들지 않고 사용하는 쪽이 정합니다. 떠 있게 하려면 `className="shadow-floating"`을 더합니다.
- 클라이언트 컴포넌트입니다(`"use client"`). 선택 값을 Context로 내려 주고 방향키 이동을 처리합니다. 서버 컴포넌트에서 import해도 되고, `onChange`·`onClick`만 클라이언트 컴포넌트에서 넘깁니다.
- `Menu` · `MenuItem` · `MenuGroup` · `MenuDivider`를 각각 import합니다. 클라이언트 컴포넌트는 서버 컴포넌트에서 `Menu.Item`처럼 점으로 접근할 수 없어서 이름을 나눴습니다.

## 언제 쓰나요

| 구분 | Menu                           | Select                  | Tooltip            |
| ---- | ------------------------------ | ----------------------- | ------------------ |
| 목적 | 옵션이나 액션을 펼쳐 보여 줘요 | 값을 골라 입력해요      | 보조 정보를 알려요 |
| 열기 | 버튼이나 아이콘을 눌러요       | Select Trigger를 눌러요 | Hover나 포커스     |
| 내용 | Menu Item을 쌓아요             | Select Item을 쌓아요    | 짧은 글            |

## 구성

| 구성                    | 선택지                    | 설명                                            |
| ----------------------- | ------------------------- | ----------------------------------------------- |
| 종류(`variant`)         | Normal · Radio · Checkbox | Radio는 하나만, Checkbox는 여러 개를 골라요     |
| 크기(`size`)            | Small · Medium · Large    | 항목 높이 36 · 44 · 52, 기본 폭 200 · 240 · 280 |
| 셀 여백(`cellPadding`)  | 8px · 12px                | 촘촘한 목록은 8, 일반 목록은 12                 |
| 상태                    | Normal · Hovered          | Hover는 항목이 눌린 상태와 같아요               |
| 하단 액션(`actionArea`) | 켜고 끌 수 있어요         | 선택을 적용하거나 초기화하는 버튼을 둬요        |
| 스크롤바(`maxHeight`)   | 켜고 끌 수 있어요         | 항목이 넘칠 때 최대 높이에서 스크롤돼요         |

- **항목(Figma Menu Item)**: 모서리 8, 선택은 `fill-brand-weak` 바탕(hover·누름은 `fill-brand-weak-pressed`). 일반 모양은 선택된 항목에 굵은 글자(Small body-5 · Medium label-2 · Large body-2 SemiBold)와 오른쪽 20px 체크(`SelectedCheckIcon`, 선 2px, `icon-brand`. Select·CheckMark와 같은 체크)가 붙고, Radio·Checkbox는 글자가 브랜드 색(Medium 굵기)입니다. 안 고른 항목의 hover 색은 Figma에 없어서 `fill-neutral-weak`를 씁니다.
- **크기**: 항목은 Small `min-h 36`(위아래 6, 좌우 12) · Medium `44`(8, 12) · Large `52`(12, 16)이고 항목 사이 간격은 없습니다. Radio·Checkbox의 원·상자는 모든 크기에서 20px(Radio 안쪽 테두리 6)입니다.
- **상자**: 모서리 12, 테두리 `border-default`, 흰 바탕, 최소 폭 160. 안쪽 여백이 `cellPadding`(8 · 12)입니다. 그림자는 없습니다.
- **Box로 만듦**: 겉 상자(`tone="outline"` · `radius={12}` · `overflow="hidden"` + `bg-fill-white`), 항목 영역(`padding={8}`, 셀 여백 12는 Box 단계에 없어서 `className="p-3"` · `overflow="scroll"`), 하단 액션 줄(`direction="horizontal"` · `align="center"` · `justify="between"`), 그룹이 모두 `Box`입니다. 모양을 바꿀 때는 Box의 prop·토큰 클래스로 바꿉니다.
- **그룹 이름**: 위 8 · 아래 4 · 좌우 12, body-5 Medium, `text-tertiary`. 구분선은 좌우 8 · 위아래 4 여백의 1px입니다.
- **하단 액션**: 높이 52, 위 테두리, 좌우 12 · 위아래 8, 양끝 정렬입니다. 왼쪽은 글자만 있는 `ghost` 버튼, 오른쪽은 브랜드 버튼(`Button size="sm"`, 높이 32 · label-3)을 씁니다.
- **스크롤**: MINT 기본 스크롤바를 그대로 씁니다(스크롤바를 따로 꾸미지 않습니다). 항목 영역에만 `maxHeight`가 걸려서 하단 액션은 스크롤되지 않습니다.
- **반응형**: `size`·`cellPadding`은 구간별 값을 받지 않습니다(화면 폭에 따라 자동으로 바뀌지 않는 컨트롤 밀도). 모바일에서는 `size="lg"`와 `className="w-full"`로 폭을 채웁니다.

## 접근성

- 항목 영역이 `role="menu"`이고 항목은 `menuitem`(Normal) · `menuitemradio`·`menuitemcheckbox`(`aria-checked`)입니다. 일반 모양에서 고른 항목은 `aria-current="true"`입니다. `aria-label`을 꼭 줍니다.
- 항목은 `<button>`이라 Tab·Enter·Space가 그대로 되고, ↑·↓로 항목을 옮기며(끝에서 반대쪽으로) Home·End는 처음·끝입니다. 비활성 항목은 건너뜁니다.
- 선택은 색만으로 알리지 않습니다. 체크 표시·원·상자와 굵은 글자가 함께 보입니다. 포커스 링은 항상 보입니다(`focus-visible`, 상자 안쪽으로 그려 잘리지 않음).
- 터치 화면에서 누르는 메뉴는 `md`(44) 이상을 씁니다.

## 사용 규칙

| 구분 | 내용                                                     |
| ---- | -------------------------------------------------------- |
| 권장 | 자주 쓰는 항목을 위쪽에 두고 위험한 동작은 아래쪽에 둬요 |
| 권장 | 항목 이름은 동사로 짧게 써요 (복사, 삭제)                |
| 금지 | Menu 안에 Menu를 겹쳐 펼치지 않아요                      |

## Props 요약

`Menu`: `variant` · `size` · `cellPadding` · `maxHeight` · `actionArea` · `value` · `defaultValue` · `onChange` · `aria-label`. `MenuItem`: `value` · `leadingImage` · `disabled` · `onClick`과 나머지 `<button>` 속성. `MenuGroup`: `label`. 자세한 표는 docs의 Menu 페이지를 봅니다.
