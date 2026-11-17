# Textarea 사용 규칙

`Textarea`를 쓰거나 고칠 때 **이 문서대로 쓰는 것을 권장**합니다. 출처는 Figma `Textarea`(node `2410:110943`)와 `Textarea Guidelines`(node `2410:112415`)입니다. Figma와 이 문서가 다르면 Figma가 맞습니다.

- **여러 줄 텍스트 입력**입니다. 라벨 + 입력 칸 + 도움말이 한 묶음이고(TextField·Select와 같은 틀), 라벨은 `Label` 컴포넌트가 **내장**되어 있으므로 `label` prop만 주고 `Label`을 따로 붙이지 않습니다. 한 줄은 `TextField`, 목록에서 고르기는 `Select`입니다.
- 클라이언트 컴포넌트입니다(`"use client"`). 글자 수·폼 초기화·자동 높이를 관리해서입니다. 서버 컴포넌트에서 import해도 되고 `onChange`·`addon`의 이벤트만 클라이언트 컴포넌트에서 넘깁니다.
- 진짜 `<textarea>`입니다. `name`·`maxLength`·`autoComplete` 등 나머지 속성은 입력에 전달되고, `className`·`style`은 바깥 요소에 붙습니다. `ref`는 `<textarea>`에 붙습니다. `value`·`defaultValue`는 문자열만 받습니다.

## 언제 쓰나요

| 구분    | TextField          | Textarea        | Select          |
| ------- | ------------------ | --------------- | --------------- |
| 입력    | 한 줄 텍스트       | 여러 줄 긴 글   | 목록에서 고르기 |
| 예시    | 이름, 이메일, 검색 | 문의 내용, 후기 | 국가, 정렬 기준 |
| 글자 수 | 짧아요             | 길어요          | 입력하지 않아요 |

## 구성

| 구성                       | 선택지                                  | 설명                                                                                |
| -------------------------- | --------------------------------------- | ----------------------------------------------------------------------------------- |
| 라벨 위치(`labelPosition`) | Top · Left                              | Figma에는 없고 TextField에 맞춘 것(2026-11 결정). 구간별 값도 받아요                |
| 크기(`size`)               | Large · Medium · Small                  | 기본 Medium. 구간별 값도 받아요. 칸 높이와는 별개예요                               |
| 상태(`status`)             | Normal · Negative · Positive            | 오류는 Negative, 확인 완료는 Positive                                               |
| 상호작용                   | Normal · Focused · Disabled · Read only | Read only는 Figma에는 없고 TextField에 맞춘 것이에요                                |
| 높이(`heightMode`)         | Fixed · Auto · Scroll(`resizable`)      | Fixed는 고정+내부 스크롤, Auto는 내용에 맞춰 최대 높이까지, `resizable`은 직접 조절 |
| 위 구성                    | Heading · Required · Helper             | `label` · `required` · `helper`                                                     |
| 아래 구성                  | Counter · Trailing(Content·Icon)        | `counter`(+`maxLength`) · `addon`(글자·아이콘·버튼)                                 |

- **칸**: 좌우 여백은 TextField와 같고(Large·Medium 왼쪽 16 · Small 12, 오른쪽 12), 세로 여백은 8·12·12입니다. 모서리 12·10·8, 글자 Body 2·3·4(입력)와 Body 5(도움말), 카운터는 Caption 1입니다.
- **색**: 바탕 `fill-white`, 테두리 `border-strong`, 입력 글자 `text-strong`, 안내 글자 `text-tertiary`. 포커스는 `border-focus` + 안쪽 1px로 2px처럼 보입니다. Negative는 `fill-danger`, Positive는 `fill-success` 테두리이고 도움말도 같은 색입니다. 비활성·읽기 전용은 `fill-disabled` 바탕·`border-disabled` 테두리입니다.
- **높이**: `height`(기본 120)는 라벨·도움말을 뺀 테두리 영역 높이이고 패딩·카운터·`addon`을 포함합니다. `maxHeight`(기본 240)는 Auto·`resizable`의 최대 높이이고 `height`보다 작으면 `height`가 우선합니다. 양수가 아닌 값은 기본값으로 보정합니다. `rows`는 높이를 바꾸지 않습니다. 비활성·읽기 전용에서는 직접 조절을 끕니다. 카운터·`addon`은 스크롤 영역 밖(칸 아래쪽)에 남습니다.
- **라벨 위치**: `left`면 라벨이 칸 왼쪽에 놓이고, 한 줄 칸 높이(48·40·32)에 맞춰 칸의 **위쪽**에 붙습니다(TextField처럼 세로 가운데가 아님). 라벨 폭은 글자에 맞춥니다.
- **글자 수(`counter`)**: `maxLength`가 있을 때만 `현재 / 최대`로 보입니다. 브라우저 `maxLength`와 같은 UTF-16 코드 단위로 세고, 비제어 입력의 form reset도 반영합니다.
- **`addon`**: `ReactNode` 하나로 글자·아이콘·버튼을 넘깁니다(`trailingContent`·`trailingIcon` prop은 없음. TextField의 `rightAddon`과 같은 생각). 버튼의 이벤트·`disabled`와 아이콘 크기는 사용하는 쪽이 정합니다.
- **반응형**: `size`와 `labelPosition`은 구간별 객체도 받습니다. 구간마다 클래스를 통째로 적은 표로 CSS만 써서 처리하고, TextField·Select와 같은 표(`_internal/fieldLayout.ts`)를 공유합니다. 높이(`height`)는 화면 폭에 따라 자동으로 바뀌지 않습니다.

## 접근성

- 라벨은 `<label htmlFor>`로 입력과 이어집니다. 라벨 없이 쓰면 `aria-label` 또는 `aria-labelledby`를 꼭 줍니다.
- 도움말과 카운터는 `aria-describedby`로 입력과 이어지고, 오류(`status="negative"`)는 `aria-invalid`로도 알립니다. 색만으로 알리지 않고 도움말 글로도 알립니다.
- 비활성은 입력도 폼 제출도 안 되고, 읽기 전용은 포커스·선택·복사·폼 제출이 됩니다.

## 사용 규칙

| 구분 | 내용                                                               |
| ---- | ------------------------------------------------------------------ |
| 권장 | 글자 수 제한이 있으면 `maxLength`와 `counter`를 함께 써요          |
| 권장 | 긴 글에는 `heightMode="auto"` 또는 `"resizable"`을 써요            |
| 금지 | `Label`을 따로 붙이지 않아요(내장되어 있어요)                      |
| 금지 | 라벨 없이 쓰지 않아요(입력칸에는 항상 이름을 붙여요)               |
| 금지 | 오류 문구에 "잘못된 입력이에요"만 쓰지 않고 무엇이 문제인지 말해요 |

## Props 요약

`size` · `label` · `placeholder` · `helper` · `helpIcon` · `addon` · `status` · `counter` · `labelPosition` · `height` · `maxHeight` · `heightMode`와 나머지 `<textarea>` 속성(`value` · `defaultValue` · `onChange` · `maxLength` · `disabled` · `readOnly` · `required` 등). 자세한 표는 docs의 Textarea 페이지를 봅니다.
