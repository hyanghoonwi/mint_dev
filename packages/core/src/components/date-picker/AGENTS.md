# DatePicker 사용 규칙

`DatePicker`를 쓰거나 고칠 때 **이 문서대로 쓰는 것을 권장**합니다. **Figma에 없는 컴포넌트**입니다(시안 확정 전에 제품 요구로 2026-11 추가). `TextField` + `Popover` + `Calendar`를 묶은 완성 컴포넌트이고 모양은 세 컴포넌트를 그대로 따릅니다.

- **날짜를 입력받는 칸**입니다. 칸을 누르면 달력이 칸 바로 아래에 뜨고, 고른 날짜가 `YYYY-MM-DD`로 칸에 들어갑니다. 직접 입력도 됩니다.
- 날짜 입력을 화면마다 TextField·Popover·Calendar로 조립하면 값 넣기·키보드·포커스가 달라지므로 이 컴포넌트를 씁니다.
- 클라이언트 컴포넌트입니다(`"use client"`). 서버 컴포넌트에서 import할 수 있고 `onChange`만 클라이언트 컴포넌트에서 넘깁니다.

## 동작

| 동작            | 결과                                                                                                  |
| --------------- | ----------------------------------------------------------------------------------------------------- |
| 칸을 누름       | 달력이 열리고 포커스는 칸에 남음(계속 입력 가능)                                                      |
| ↓ 또는 Enter    | 달력이 열리고 선택한 날(없으면 오늘)로 포커스가 감. 달력 안은 Calendar 키보드 규칙                    |
| 날짜를 고름     | 값이 바뀌고(`onChange`) 달력이 닫히며 포커스가 칸으로 돌아옴                                          |
| Esc             | 달력이 닫히고 포커스가 칸으로 돌아옴                                                                  |
| Tab·바깥 누르기 | 달력이 닫힘                                                                                           |
| 직접 입력       | 올바르고 고를 수 있는 날짜를 다 입력하면 값이 바뀜. 지우면 `""`. 틀린 값은 칸을 벗어날 때 원래 값으로 |

- **값**: 문자열(`YYYY-MM-DD`), 비어 있으면 `""`. `today`는 필수이고 서버에서 정해 넘깁니다(렌더 중 현재 시각을 읽지 않음).
- **고를 수 없는 날**: `min`·`max` 밖, `disabledDates`. 달력에서 흐리고 입력해도 들어가지 않습니다(없는 날짜 `2026-02-30`도 마찬가지).
- **칸**: TextField의 속성(`label`·`helper`·`helpIcon`·`status`·`size`·`labelPosition`·`disabled`·`readOnly`·`required`·`name` 등)을 그대로 받습니다. 오른쪽에는 `CalendarBlankIcon`이 고정되어 `leftAddon`·`rightAddon`은 받지 않습니다. 지우기 버튼은 TextField 그대로입니다. 비활성·읽기 전용은 달력이 열리지 않습니다.
- **달력 상자**: Popover(`role="dialog"`, 이름 "날짜 고르기")로 띄우고 위치는 라벨·도움말이 아닌 **입력 칸 바로 아래**입니다. 폭 320(좁은 화면은 화면 폭 − 16). 모바일도 같은 Popover입니다.

## 사용 규칙

| 구분 | 내용                                                               |
| ---- | ------------------------------------------------------------------ |
| 권장 | 고를 수 있는 범위는 `min`·`max`로 막고 도움말로 알려요             |
| 권장 | 폼 값으로 쓰려면 `name`을 주거나 `value`·`onChange`로 들고 있어요  |
| 금지 | `placeholder`의 형식 안내(`YYYY-MM-DD`)를 지우지 않아요            |
| 금지 | TextField·Popover·Calendar를 직접 조립해 날짜 입력을 만들지 않아요 |
| 금지 | `Label`을 따로 붙이지 않아요(내장)                                 |

## Props 요약

`value` · `defaultValue` · `today` · `min` · `max` · `disabledDates` · `holidays` · `weekStartsOn` · `onChange`와 TextField의 속성(`label` · `placeholder` · `helper` · `helpIcon` · `size` · `status` · `labelPosition` · `disabled` · `readOnly` · `required` · `name` 등). 자세한 표는 docs의 Date picker 페이지를 봅니다.
