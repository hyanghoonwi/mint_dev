# Toast 사용 규칙

`Toast`·`ToasterProvider`·`useToaster`를 쓰거나 고칠 때 **이 문서대로 쓰는 것을 권장**합니다. 출처는 Figma `Toast`(node `2504:126500`: Variant 4 × Shape 2 × Action 3, Leading icon, Customize message·icon)와 `Toast Guidelines`(node `2314:38233`)입니다. Figma와 이 문서가 다르면 Figma가 맞습니다.

- **사용자 행동의 결과를 짧게 알리는 메시지**입니다. 화면 가장자리에 나타났다가 일정 시간 뒤 사라집니다. 예전의 Toast와 Snackbar를 **하나로 합쳤습니다**(2026-11): 버튼이 필요하면 `action`으로 더합니다.
- 띄우는 방법은 `useToaster` 하나입니다. 앱 최상단(`app/layout.tsx`)을 `ToasterProvider`로 한 번 감쌉니다(함수 호출로 띄우고 id로 닫습니다).
- `Toast`는 모양만 그리는 표시 컴포넌트(`"use client"` 없음)이고, `ToasterProvider`·`useToaster`는 클라이언트 전용입니다.

## Alert와 차이

|        | Toast                   | Alert               |
| ------ | ----------------------- | ------------------- |
| 목적   | 행동 결과를 알려요      | 꼭 확인해야 하는 일 |
| 버튼   | 없음 또는 1개(`action`) | Text Button 1~2개   |
| 사라짐 | 자동으로 사라져요       | 직접 닫아야 해요    |

## 구성

| 구성            | 선택지                                            | 설명                                                              |
| --------------- | ------------------------------------------------- | ----------------------------------------------------------------- |
| 종류(`variant`) | `normal` · `positive` · `cautionary` · `negative` | 완료는 positive, 주의는 cautionary, 오류는 negative               |
| 모양(`shape`)   | `default` · `pill`                                | default는 모서리 12, pill은 알약 모양                             |
| 버튼(`action`)  | `none` · `ghost` · `button`                       | 오른쪽 버튼 하나. ghost는 글자만, button은 배경(`fill-neutral`)   |
| 아이콘(`icon`)  | `true` · `false` · 노드                           | 종류별 아이콘이 기본. 끄거나 다른 아이콘으로 바꿈(Customize icon) |
| 메시지          | `children`                                        | 한 문장으로 짧게(Customize message)                               |
| 표시 시간       | 2~4초(기본 3000ms), 버튼이 있으면 5000ms          | 글이 길면 조금 더 길게 둬요                                       |
| 위치            | `top` · `bottom`(가운데)                          | `ToasterProvider`의 `position`·`offset`으로 정해요                |

- **모양**: 높이 54 이상, 간격 8, 글자 Body 4 Medium(14/22) `text-on-fill`. 배경 `fill-alpha-500` + 블러 6(Figma 블러 12). **시안에 그림자가 없어** 그림자를 주지 않습니다.
- **패딩**: 버튼이 없으면 세로 14 · 가로 16(pill 20), 버튼이 있으면 세로 13 · 왼쪽 16(pill 20) · 오른쪽 12(버튼 높이 28 + 13 · 13 = 54). 13은 간격 스케일 밖이라 임의 값입니다.
- **버튼**: 높이 28 · 가로 패딩 8 · 모서리 8, 글자 Label 3 Medium(12/16) `text-on-fill`. `ghost`는 배경 없이 올리면 연한 흰 막(`fill-white/12`), `button`은 `fill-neutral`(올리면 `fill-neutral-pressed`). 글자는 2~4자로 짧게 씁니다.
- **아이콘**(Phosphor Fill 20): normal `info`(흰색) · positive `check-circle`(`icon-success`) · cautionary `warning`(아토믹 orange-500) · negative `warning-circle`(`icon-danger`). 색이 있는 아이콘은 안쪽 기호가 흰색으로 보이게 뒤에 흰 원을 깝니다. 아이콘을 넘기면 20px 칸 가운데에 `icon-on-fill` 색으로 보입니다.
- **폭**: 최소 300(좁은 화면은 화면 폭 − 40), 내용에 맞춰 늘고 최대 화면 폭 − 40.
- **쌓기**: 새 토스트가 화면 가장자리 쪽에 붙습니다. `limit`(기본 3)을 넘으면 가장 오래된 것부터 사라집니다. 같은 `id`면 새로 쌓지 않고 내용과 시간을 새로 고칩니다.
- **움직임**: 새 토스트는 화면 가장자리에서 밀고 들어오고(300ms), 나머지 토스트는 자리를 비켜 부드럽게 밀립니다. 사라질 때는 먼저 투명해지고 칸이 접힙니다(200ms). 움직임 줄이기 설정이면 전환 없이 바로 바뀝니다.
- **멈춤**: 마우스를 올리거나 포커스가 있는 동안 시간이 멈춥니다.
- **버튼을 누르면** `onAction`이 불린 뒤 토스트가 자동으로 닫힙니다(예전 Snackbar는 사용하는 쪽이 따로 닫아야 했음).

## 접근성

- negative는 `role="alert"`(바로 읽음), 나머지는 `role="status"`. 토스트 영역은 `role="region"` `aria-label="알림"`.
- 버튼은 `<button>`이라 키보드로 누를 수 있고(포커스는 흰 윤곽선), 포커스가 있는 동안 토스트가 사라지지 않습니다.
- 색만으로 종류를 알리지 않습니다. 종류별 아이콘이 함께 붙습니다(`icon={false}`로 끄면 메시지 글에 결과가 드러나야 합니다).

```tsx
// app/layout.tsx
<ToasterProvider position="bottom" offset={20}>
  {children}
</ToasterProvider>;

// 클라이언트 컴포넌트
const toaster = useToaster();
toaster.positive("저장했어요.");
toaster.negative("저장하지 못했어요.", { id: "save" });
toaster.normal("삭제했어요.", {
  action: "ghost",
  actionLabel: "되돌리기",
  onAction: undo,
});
```

## 사용 규칙

| 구분 | 내용                                                                   |
| ---- | ---------------------------------------------------------------------- |
| 권장 | "저장했어요"처럼 결과만 한 문장으로 써요                               |
| 권장 | 하단 고정 요소를 가리지 않게 위치를 잡아요(`offset`)                   |
| 금지 | 꼭 읽어야 하는 안내를 Toast로 알리지 않아요. Alert를 써요              |
| 금지 | 버튼을 둘 이상 두거나, 되돌릴 수 없는 일의 확인을 버튼으로 받지 않아요 |

## Props 요약

- `Toast`: `variant` · `shape` · `children`(메시지) · `icon` · `action` · `actionLabel` · `onAction`과 나머지 `<div>` 속성
- `ToasterProvider`: `position`(`top`·`bottom`, 기본 bottom) · `offset`(기본 20) · `limit`(기본 3) · `duration`(기본 3000) · `actionDuration`(버튼이 있는 토스트, 기본 5000) · `shape`(기본 default)
- `useToaster()`: `toaster(message, options?)` · `toaster.normal` · `toaster.positive` · `toaster.cautionary` · `toaster.negative` · `toaster.dismiss(id?)`. options: `id` · `variant` · `shape` · `icon` · `action` · `actionLabel` · `onAction` · `duration`(`null`이면 닫을 때까지) · `onClose`

## 개발 메모(Figma와 다른 점, 2026-11)

- Figma 가이드 표는 배경을 "투명도 80% · 블러 12, 배경색 fill/neutral"이라고 적었지만, 실제 시안 레이어는 `fill/alpha-500`(약 48%)과 블러 12(CSS 6px)입니다. 코드는 **시안 레이어**를 따릅니다. 가이드 문구와 레이어가 어긋나 있어 디자인 확인이 필요합니다(글자 대비가 낮아지는 점 포함).
- Figma `action`은 `none · ghost · button` 세 가지이고, 코드의 `useToaster` 옵션에서는 `none`을 빼고 생략으로 표현합니다.
- 버튼을 누르면 자동으로 닫히는 것, 버튼이 있을 때의 기본 시간(5초), `icon`의 노드 교체, `role` 구분은 Figma에 없어 코드에서 더했습니다.
