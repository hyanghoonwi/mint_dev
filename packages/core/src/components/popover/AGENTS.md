# Popover 사용 규칙

`Popover`를 쓰거나 고칠 때 **이 문서대로 쓰는 것을 권장**합니다. **디자인 문서(Figma)에는 없고 개발상 편의를 위해 제작한 컴포넌트**입니다(2026-11 추가). 시안이 나오면 모양을 시안에 맞춥니다.

- **기준 요소(버튼·입력 칸) 바로 아래에 붙어 뜨는, 화면을 막지 않는 상자**입니다. 필터·정렬·짧은 설정처럼 입력을 돕는 내용을 띄웁니다. 화면을 막고 꼭 확인할 내용은 Modal(`useOverlay`), 짧은 설명은 Tooltip입니다.
- 떠 있는 상자의 **공통 기반**입니다. 위치 계산·바깥 누르기·Esc·포커스 되돌리기를 컴포넌트마다 다시 짜지 않으려고 만들었습니다. 자주 쓰는 조합은 완성 컴포넌트로 제공합니다(`DatePicker`). 지금 Select 목록은 따로 구현되어 있고 나중에 Popover로 옮길 예정입니다.
- 클라이언트 컴포넌트입니다(`"use client"`). `trigger`가 함수라서 쓰는 쪽도 `"use client"` 컴포넌트여야 합니다.

## 구성

| 구성              | 값                                                                                | 설명                                                                                                                                                 |
| ----------------- | --------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| 모양              | Box `elevation="floating"` · `radius={12}` · `padding`(기본 16) · `align="start"` | Select 목록과 같은 떠 있는 상자. 여백은 `padding`(목록은 `0`). 자식은 원래 폭대로 위아래로 쌓이고, 가로로 두려면 안에 `<Box direction="horizontal">` |
| 위치(`placement`) | `bottom-start` · `bottom-end`                                                     | 기준 요소 아래 4px. 아래 공간이 모자라면 위로, 좌우는 화면 안(여백 8)                                                                                |
| 폭(`matchWidth`)  | 켜기·끄기                                                                         | 켜면 상자 폭 = 기준 요소 폭(입력 칸 아래 목록)                                                                                                       |
| 열림              | `open` · `defaultOpen`                                                            | 트리거·바깥 누르기·Esc·포커스가 밖으로 나가면 닫힘                                                                                                   |

## 구현 메모

- **트리거는 `trigger` 함수**로 받습니다. children을 `cloneElement`로 덮어쓰면 서버 컴포넌트 children에서 hydration 오류가 났던 적이 있어서(Tooltip), 속성을 함수 인자로 넘기는 방식을 씁니다.
- **브라우저 Popover API**(`popover="manual"` + `showPopover()`, top layer)로 띄웁니다. 부모의 `overflow: hidden`(Table·Modal 본문·스크롤 영역)에 잘리지 않고, DOM 위치는 그대로라 `data-theme` 테마 토큰을 그대로 받습니다(`document.body` 포털은 테마 범위 밖으로 나가서 쓰지 않음, OverlayProvider와 같은 이유). 기본 popover 모양(가운데·테두리·여백)은 지우고 `position: fixed` 좌표를 직접 둡니다.
- 위치는 기준 요소(`anchorRef`, 없으면 트리거를 감싼 요소)를 재서 정하고, 스크롤·창 크기·내용 크기가 바뀌면 다시 잽니다.
- **모바일도 같은 Popover**입니다(2026-11 결정, 코드 일관성). 바텀시트나 Modal로 바꾸지 않습니다.

## 접근성

- 상자는 `role="dialog"`이고 `aria-label`로 이름을 줍니다. 트리거에는 `aria-expanded`·`aria-controls`·`aria-haspopup="dialog"`가 붙습니다.
- 열리면 상자 안 첫 포커스 요소(또는 `initialFocus`)로 포커스가 갑니다. 마우스로 여는 입력 칸처럼 입력을 이어 가야 하면 `autoFocus={false}`.
- Esc로 닫으면 포커스가 트리거로 돌아갑니다. Tab으로 상자 밖으로 나가면 닫힙니다.

## 사용 규칙

| 구분 | 내용                                                           |
| ---- | -------------------------------------------------------------- |
| 권장 | 트리거 바로 아래에 짧은 선택·설정을 띄워요                     |
| 권장 | 고른 뒤 닫으려면 `open`·`onOpenChange`로 제어해요              |
| 금지 | 날짜·목록 고르기를 직접 조립하지 않아요(`DatePicker`·`Select`) |
| 금지 | 마우스를 올리기만 해서 열지 않아요(짧은 설명은 Tooltip)        |
| 금지 | 긴 글이나 꼭 확인해야 하는 내용은 넣지 않아요(Modal)           |

## Props 요약

`children` · `trigger` · `open` · `defaultOpen` · `placement` · `padding` · `matchWidth` · `autoFocus` · `initialFocus` · `anchorRef` · `onOpenChange`와 나머지 `<div>` 속성(`aria-label`·`className` 등). 자세한 표는 docs의 Popover 페이지를 봅니다.
