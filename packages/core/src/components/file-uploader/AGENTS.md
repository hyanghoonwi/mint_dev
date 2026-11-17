# File Uploader 사용 규칙

`FileUploader` · `FileItem`을 쓰거나 고칠 때 **이 문서대로 쓰는 것을 권장**합니다. 출처는 Figma `File Uploader`(node `2433:116406`)와 `File Uploader Guidelines`(node `2432:115888`)입니다. Figma와 이 문서가 다르면 Figma가 맞습니다.

- **올릴 파일을 고르는 곳**(`FileUploader`: Figma의 Dropzone과 File Upload Button 두 모양)과 **올린 파일 목록**(File Item = `FileItem`)으로 나눕니다. 넓은 화면은 끌어다 놓는 칸, 모바일 웹·좁은 자리는 버튼을 씁니다.
- **두 모양은 `layout` 하나로 고릅니다**(2026-11 결정). 처음에는 `FileUploadButton`을 따로 만들었지만, 문서는 "모바일은 버튼"이라는데 화면 폭에 따라 두 컴포넌트를 바꿀 방법이 없어서(JS로 화면 폭을 읽는 것은 금지) 모순이라 합쳤습니다. `layout={{ base: "button", tablet: "dropzone" }}`처럼 구간별 값을 받고, 두 모양을 함께 그려 두고 CSS로 구간마다 하나만 보이게 합니다(`zoneVisibleClasses` · `buttonVisibleClasses`). 파일 입력·라벨·도움말은 하나라서 화면 폭이 바뀌어도 고른 파일과 상태가 유지됩니다. `layout`과 `size`는 서로 다른 축이라 각각 구간별로 줍니다. 기본 `layout`은 `dropzone`입니다.
- **입력 칸 계열**입니다. 라벨·도움말·상태·크기는 TextField와 같은 이름(`label`·`helper`·`helpIcon`·`status`·`size`·`disabled`·`required`·`name`)이고 라벨은 `Label` 내장입니다. TextField와 다른 점: `status`는 Figma에 있는 `normal`·`negative`만(확인 완료 `positive` 없음), 라벨 위치(`labelPosition`)는 없음(라벨은 항상 위), 도움말 보통 색은 Figma대로 `text-tertiary`(TextField는 `text-secondary`).
- `FileUploader`는 클라이언트 컴포넌트(끌어다 놓기 상태·파일 입력), `FileItem`은 상태가 없어 서버 컴포넌트에서도 씁니다. 파일 입력 로직은 `_internal/fileInput.ts`에 있습니다.

## 구성

| 구성                         | 선택지                                        | 설명                                                                                                                       |
| ---------------------------- | --------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| 모양(`layout`)               | Dropzone · Button                             | 구간별 값을 받아요. 모바일 웹은 버튼, 넓은 화면은 칸이면 `{ base: "button", tablet: "dropzone" }`                          |
| Dropzone 크기(`size`)        | Large · Medium · Small                        | 여백 32 · 24 · 16, 모서리 12 · 10 · 8, 문구 Body 2·3·4 Medium, 아이콘 24·24·20, 버튼 40·40·32                              |
| Dropzone 상태                | Normal · Pressed · Disabled / Status Negative | Pressed는 파일을 끌어 올렸을 때(마우스를 올려도 같음): `border-brand` 점선·`fill-brand-weak`·파란 문구                     |
| 버튼 모양(`layout="button"`) | Normal · Negative                             | Figma File Upload Button. `Button` outline·neutral에 `UploadSimpleIcon`, 높이는 `size`(32·40·48). Negative는 도움말만 빨강 |
| File Item 상태(`status`)     | Waiting · Uploading · Complete · Negative     | 대기 중 / 진행 막대(6px, `fill-brand`)와 % / 체크(`icon-success`) / 빨간 이유와 다시 시도                                  |
| File Item 크기(`size`)       | Large · Medium · Small                        | 여백 16 · 12 · 8×12, 앞 상자 48 · 40 · 32(아이콘 24·20·16), 이름 Body 2·3·4 Medium, 삭제 버튼 40·32·28                     |
| File Item 이미지(`image`)    | 켜기 · 끄기                                   | 이미지 파일은 썸네일이 파일 아이콘을 덮음                                                                                  |

- **칸**: 바탕 `background-default`, 점선 `border-strong`, 오류는 `fill-danger` 점선, 비활성은 `fill-disabled`·`border-disabled`·흐린 글자. 아이콘 `CloudArrowUpIcon`(`icon-secondary`).
- **버튼 모양**: 칸 안의 문구(`title`·`description`)는 보이지 않으니 허용 형식은 `helper`에 적습니다.
- **File Item**: 바탕 `background-default`, 테두리 `border-default`, 모서리 12(Small 8), 앞 상자 `fill-alpha-50`·모서리 8, 아이콘 `FileTextIcon`. 정보 줄은 확장자(이름에서 자동, 대문자, Medium) · 용량 · 상태 글자(`text-tertiary`, 실패는 `text-danger`). 대기·올리는 중의 버튼은 ×(취소), 완료·실패는 휴지통(삭제). 다시 시도는 `TextButton` sm. 삭제 버튼 아이콘은 IconButton 크기 규칙(20·16·14)을 따라서 Figma(20)와 조금 다를 수 있습니다.

## 동작

- 칸의 빈 곳이나 버튼을 누르면 파일 고르기 창이 열립니다. 라벨을 눌러도 열립니다.
- 끌어다 놓은 파일은 `accept`로 걸러서 맞는 파일은 `onFilesSelect`, 안 맞는 파일은 `onFilesReject`로 넘깁니다. `multiple`이 아니면 첫 파일만 넘깁니다. (고르기 창은 브라우저가 `accept`로 거릅니다.)
- 고른 파일은 숨긴 `<input type="file">`에도 넣어서(`DataTransfer`) `name`을 주면 폼으로 제출되고 `required` 검사도 됩니다.
- 목록·이미지 미리보기·용량·개수 검사·업로드 진행률·취소·다시 시도는 **`useFileUpload` 훅**이 맡습니다(`hooks/useFileUpload.ts`). 사용하는 쪽은 `uploaderProps`를 펼치고 `items`를 `FileItem`으로 그립니다. 컴포넌트는 모양과 파일 고르기만 하고 목록 상태를 갖지 않습니다(2026-11 결정: 예시 코드가 지저분해져서 훅으로 분리). **컴포넌트 안에서 훅을 쓰지 않습니다**: 목록을 다른 곳에 그리거나 `uploading`으로 제출 버튼을 막거나 폼에 담으려면 상태를 사용하는 쪽이 들고 있어야 해서입니다. docs·스토리의 사용 예시는 모두 훅과 함께 보여 줍니다. 훅의 `uploaderProps`는 오류가 있을 때만 `status`·`helper`를 넣으므로 평소 값은 앞에 적습니다.

## 접근성

- 파일 고르기는 `Button`(키보드로 누름)이 맡고, 숨긴 입력은 `tabIndex={-1}`입니다. 칸 모양과 버튼 모양의 버튼이 모두 DOM에 있지만 숨겨진 쪽은 `display: none`이라 포커스·스크린리더에 잡히지 않습니다. 도움말은 `aria-describedby`로 버튼과 입력에 이어지고, 오류는 `aria-invalid`로도 알립니다.
- 진행 막대는 `role="progressbar"`(`aria-valuenow`)와 이름("파일 이름 올리는 중"), 완료 체크는 "완료"로 읽힙니다. 삭제·취소 버튼 이름은 "파일 이름 삭제"·"파일 이름 올리기 취소"입니다.

## 사용 규칙

| 구분 | 내용                                                                                 |
| ---- | ------------------------------------------------------------------------------------ |
| 권장 | 모바일 웹을 지원하는 화면은 `layout={{ base: "button", tablet: "dropzone" }}`을 줘요 |
| 권장 | 허용 형식과 최대 용량을 `description`(버튼 모양이면 `helper`)에 미리 적어요          |
| 권장 | 올리는 중에는 `FileItem`에 진행 막대와 %를 보여 줘요                                 |
| 금지 | 화면 폭을 JS로 읽어 칸·버튼을 바꾸지 않아요(`layout` 구간별 값)                      |
| 금지 | 실패한 파일을 말없이 지우지 않아요(`negative`와 이유·다시 시도)                      |
| 금지 | `Label`을 따로 붙이지 않아요(내장)                                                   |

## Props 요약

`FileUploader`: `size` · `layout` · `label` · `title` · `description` · `helper` · `helpIcon` · `buttonLabel` · `status` · `disabled` · `required` · `accept` · `multiple` · `name` · `onFilesSelect` · `onFilesReject` / `FileItem`: `size` · `name` · `fileSize` · `image` · `status` · `progress` · `message` · `disabled` · `onRemove` · `onRetry`. 자세한 표는 docs의 File uploader 페이지를 봅니다.
