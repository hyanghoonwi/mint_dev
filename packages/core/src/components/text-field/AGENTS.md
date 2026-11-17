# Text Field 사용 규칙

`TextField`를 쓰거나 고칠 때 **이 문서대로 쓰는 것을 권장**합니다. 출처는 Figma `Text Input`(node `2402:100565`)의 `Text Field`와 `Text Input Guidelines`(node `2402:101712`)입니다. Figma와 이 문서가 다르면 Figma가 맞습니다.

- **한 줄 텍스트 입력**입니다. 라벨 + 입력 칸 + 도움말이 한 묶음이고(Select와 같은 틀), 라벨은 `Label` 컴포넌트가 **내장**되어 있으므로 `label` prop만 주고 `Label`을 따로 붙이지 않습니다. 여러 줄은 Textarea(아직 없음), 목록에서 고르기는 `Select`입니다.
- 클라이언트 컴포넌트입니다(`"use client"`). 값이 있는지(지우기 버튼)를 알아야 해서입니다. 서버 컴포넌트에서 import해도 되고 `onChange`만 클라이언트 컴포넌트에서 넘깁니다.
- 진짜 `<input>`입니다. `name`·`type`·`autoComplete`·`maxLength` 등 나머지 `<input>` 속성은 입력에 전달되고, `className`·`style`은 바깥 요소에 붙습니다. `ref`는 `<input>`에 붙습니다.

## 언제 쓰나요

| 구분    | Text Input(TextField) | Textarea        | Select          |
| ------- | --------------------- | --------------- | --------------- |
| 입력    | 한 줄 텍스트          | 여러 줄 긴 글   | 목록에서 고르기 |
| 예시    | 이름, 이메일, 검색    | 문의 내용, 후기 | 국가, 정렬 기준 |
| 글자 수 | 짧아요                | 길어요          | 입력하지 않아요 |

## 구성

| 구성                       | 선택지                                                                           | 설명                                                                      |
| -------------------------- | -------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| 라벨 위치(`labelPosition`) | Top · Left                                                                       | Left는 폭이 넓은 폼에(라벨 폭은 글자에 맞추고 간격 8). 구간별 값도 받아요 |
| 크기(`size`)               | Large 48 · Medium 40 · Small 32                                                  | 기본 Medium. 구간별 값도 받아요                                           |
| 상태(`status`)             | Normal · Negative · Positive                                                     | 오류는 Negative, 확인 완료는 Positive                                     |
| 상호작용                   | Normal · Focused · Disabled · Read only                                          | Focused는 테두리가 진해져요(2px)                                          |
| 위 구성                    | Heading · Required · Helper                                                      | `label` · `required` · `helper`                                           |
| 앞뒤 구성                  | Left Addon(Leading Icon) · Clear · Right Addon(Trailing Content · Icon · Button) | Clear는 값이 있을 때만 보여요                                             |

- **칸**: Large 높이 48 · 모서리 12 · Body 2 / Medium 40 · 10 · Body 3 / Small 32 · 8 · Body 4. 좌우 여백은 왼쪽 16(Small 12) · 오른쪽 12, 안 요소 사이 간격 8입니다. 10은 반경 토큰에 없어 임의 값입니다.
- **색**: 바탕 `fill-white`, 테두리 `border-strong`, 입력 글자 `text-strong`, 안내 글자(placeholder) `text-tertiary`, 앞뒤 아이콘 `icon-secondary`. 포커스는 `border-focus` 테두리 + 안쪽 1px(`outline-1 -outline-offset-1`)를 더해 2px로 보이게 합니다. Negative는 `fill-danger`, Positive는 `fill-success` 테두리(포커스 때도 같은 색 2px)이고 도움말은 `text-danger` · `text-success`, 보통은 Body 5 `text-secondary`입니다.
- **비활성**: 바탕 `fill-disabled` · 테두리 `border-disabled` · 글자·아이콘·라벨·도움말이 모두 `disabled` 색, 입력할 수 없습니다.
- **지우기 버튼(Clear)**: 값이 있고 입력 중(포커스가 칸 안)일 때만 보이는 × 아이콘(`XCircleIcon` 채움 20, `icon-secondary`)입니다. 누르면 값을 비우고 `onChange`를 빈 값으로 호출한 뒤 입력에 포커스를 돌려줍니다(제어·비제어 모두). `clearButton={false}`로 끕니다. 터치 화면에서는 눌림 영역이 넓어집니다.
- **앞뒤 구성(`leftAddon`·`rightAddon`)**: 둘 다 `ReactNode`이고 `Button`의 `leftAddon`·`rightAddon`과 같은 이름입니다(2026-11 결정, 이전 `leadingIcon`·`trailingContent`·`trailingIcon`·`trailingButton`을 합침). 아이콘은 20px(`[&>svg]:size-5`)·`icon-secondary`로 맞춰지고, 글자(타이머 "03:00")는 `<Text variant="body-4-medium" color="secondary">`, 버튼은 `<Button size="sm" color="secondary">`를 직접 넘깁니다(Figma Trailing Content·Trailing Button 모양). 여러 개는 `<>…</>`로 넘기면 간격 8로 놓이고, 순서는 입력 → 지우기 → `rightAddon`입니다. 비활성일 때 글자·버튼은 직접 `disabled` 모양으로 맞춥니다(아이콘만 자동).
- **라벨**: Large·Medium은 Label `md`(14), Small은 `sm`(12). 왼쪽 라벨은 칸 높이(`--mint-field-height`)에 맞춰 세로 가운데에 놓입니다.
- **반응형**: `size`와 `labelPosition`은 구간별 객체도 받습니다(`{ base: "top", desktop: "left" }`). 구간마다 클래스를 통째로 적은 표로 CSS만 써서 처리하고, Select와 같은 표(`_internal/fieldLayout.ts`)를 공유합니다.
- **읽기 전용(`readOnly`)**: Select의 Read only(`State=ReadOnly`)에 맞춘 모양이고, Figma Text Field에도 추가하기로 했습니다(2026-11 결정, 시안이 나오면 시안에 맞춥니다). 칸은 `fill-disabled`·`border-disabled`, 값은 `text-strong` 그대로, 지우기 버튼은 없고, 포커스되면 `border-focus` 안쪽 1px로 보입니다. `disabled`와 달리 포커스·선택·복사가 되고 폼으로 제출됩니다. 상태(`status`)를 함께 주면 도움말 색만 따라갑니다.
- Figma에 없는 것: 글자 수 표시(`maxLength` 카운터)도 없습니다.

## 접근성

- 라벨은 `<label htmlFor>`로 입력과 이어져서 라벨을 눌러도 입력에 포커스가 갑니다. 라벨 없이 쓰면 `aria-label`을 꼭 줍니다. 입력칸에는 항상 이름을 붙입니다.
- 도움말은 `aria-describedby`로 입력과 이어져 함께 읽히고, 오류(`status="negative"`)는 `aria-invalid`로도 알립니다. 색만으로 알리지 않고 도움말 글로도 알립니다.
- 지우기 버튼은 `aria-label="입력 지우기"`입니다. 칸의 빈 곳을 눌러도 입력에 포커스가 갑니다.

## 사용 규칙

| 구분 | 내용                                                               |
| ---- | ------------------------------------------------------------------ |
| 권장 | 오류는 Negative와 함께 Helper에 이유와 해결 방법을 적어요          |
| 금지 | 오류 문구에 "잘못된 입력이에요"만 쓰지 않고 무엇이 문제인지 말해요 |
| 금지 | 라벨 없이 쓰지 않아요(입력칸에는 항상 이름을 붙여요)               |

## Props 요약

`label` · `labelPosition` · `required` · `helpIcon` · `size` · `status` · `helper` · `leftAddon` · `clearButton` · `rightAddon`과 나머지 `<input>` 속성(`value` · `defaultValue` · `onChange` · `type` · `placeholder` · `disabled` 등). 자세한 표는 docs의 Text field 페이지를 봅니다.
