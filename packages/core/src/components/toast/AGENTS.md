# Toast 사용 규칙

`Toast`·`ToastProvider`·`useToast`를 쓰거나 고칠 때 **이 문서대로 쓰는 것을 권장**합니다. 출처는 Figma `Toast`(node `2314:38145`)와 `Toast Guidelines`(node `2314:38233`)입니다. Figma와 이 문서가 다르면 Figma가 맞습니다.

- **사용자 행동의 결과를 짧게 알리는 메시지**입니다. 화면 가장자리에 나타났다가 일정 시간 뒤 사라집니다.
- 띄우는 방법은 `useToast` 하나입니다. 앱 최상단(`app/layout.tsx`)을 `ToastProvider`로 한 번 감쌉니다(FDS `ToastProvider`·`useToast`와 같은 구조).
- `Toast`는 모양만 그리는 표시 컴포넌트(`"use client"` 없음)이고, `ToastProvider`·`useToast`는 클라이언트 전용입니다.

## Snackbar·Alert와 차이

|        | Toast              | Snackbar             | Alert               |
| ------ | ------------------ | -------------------- | ------------------- |
| 목적   | 행동 결과를 알려요 | 다음 행동을 제안해요 | 꼭 확인해야 하는 일 |
| 버튼   | 없음               | 1개(선택)            | Text Button 1~2개   |
| 사라짐 | 자동으로 사라져요  | 자동으로 사라져요    | 직접 닫아야 해요    |

스낵바도 같은 `ToastProvider`가 그립니다. `useSnackbar()`로 띄우면 토스트와 같은 자리에 띄운 순서대로 섞여 쌓이고 `limit`도 함께 셉니다.

## 구성

| 구성            | 선택지                                            | 설명                                                  |
| --------------- | ------------------------------------------------- | ----------------------------------------------------- |
| 종류(`variant`) | `normal` · `positive` · `cautionary` · `negative` | 완료는 positive, 주의는 cautionary, 오류는 negative   |
| 모양(`shape`)   | `default` · `pill`                                | default는 모서리 12, pill은 알약 모양                 |
| 아이콘          | 항상 표시                                         | 종류에 맞는 아이콘이 앞에 붙어요(켜고 끄는 prop 없음) |
| 표시 시간       | 2~4초(기본 3000ms)                                | 글이 길면 조금 더 길게 둬요                           |
| 위치            | `top` · `bottom`(가운데)                          | `ToastProvider`의 `position`·`offset`으로 정해요      |

- **모양**: 높이 54 이상, 패딩 세로 14 · 가로 16(pill 20), 간격 8, 글자 Body 4 Medium(14/22) `text-on-fill`. 배경 `fill-alpha-500` + 블러 6, 그림자 `shadow-floating`(떠 있는 요소).
- **아이콘**(Phosphor Fill 20): normal `info`(흰색) · positive `check-circle`(`icon-success`) · cautionary `warning`(아토믹 orange-500) · negative `warning-circle`(`icon-danger`). 색이 있는 아이콘은 안쪽 기호가 흰색으로 보이게 뒤에 흰 원을 깝니다.
- **폭**: 최소 300(좁은 화면은 화면 폭 − 40), 내용에 맞춰 늘고 최대 화면 폭 − 40.
- **쌓기**: 새 토스트가 화면 가장자리 쪽에 붙습니다. `limit`(기본 3)을 넘으면 가장 오래된 것부터 사라집니다. 같은 `id`면 새로 쌓지 않고 내용과 시간을 새로 고칩니다.
- **움직임**: 새 토스트는 화면 가장자리에서 밀고 들어오고(300ms), 나머지 토스트는 자리를 비켜 부드럽게 밀립니다. 사라질 때는 먼저 투명해지고 칸이 접힙니다(200ms). 같은 `id`로 새로 고치면 다시 나타나지 않고 내용만 바뀝니다. 움직임 줄이기 설정이면 전환 없이 바로 바뀝니다.
- **멈춤**: 마우스를 올리거나 포커스가 있는 동안 시간이 멈춥니다.
- **접근성**: negative는 `role="alert"`(바로 읽음), 나머지는 `role="status"`. 토스트 영역은 `role="region"` `aria-label="알림"`.

```tsx
// app/layout.tsx
<ToastProvider position="bottom" offset={20}>
  {children}
</ToastProvider>;

// 클라이언트 컴포넌트
const toast = useToast();
toast.positive("저장했어요.");
toast.negative("저장하지 못했어요.", { id: "save" });
```

## 사용 규칙

| 구분 | 내용                                                      |
| ---- | --------------------------------------------------------- |
| 권장 | "저장했어요"처럼 결과만 한 문장으로 써요                  |
| 권장 | 하단 고정 요소를 가리지 않게 위치를 잡아요(`offset`)      |
| 금지 | 버튼이 필요한 안내는 Toast에 넣지 않고 Snackbar를 써요    |
| 금지 | 꼭 읽어야 하는 안내를 Toast로 알리지 않아요. Alert를 써요 |

## Props 요약

- `Toast`: `variant` · `shape` · `children`(메시지)와 나머지 `<div>` 속성
- `ToastProvider`: `position`(`top`·`bottom`, 기본 bottom) · `offset`(기본 20) · `limit`(기본 3) · `duration`(기본 3000) · `snackbarDuration`(스낵바, 기본 5000) · `shape`(기본 default)
- `useToast()`: `toast(message, options?)` · `toast.normal` · `toast.positive` · `toast.cautionary` · `toast.negative` · `toast.dismiss(id?)`. options: `id` · `variant` · `shape` · `duration`(`null`이면 닫을 때까지) · `onClose`
