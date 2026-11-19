# 훅

> 색인: [`../AGENTS.md`](../AGENTS.md)

모두 클라이언트 컴포넌트에서 씁니다(`"use client"`가 달려 있어 import는 어디서나 됩니다). Provider가 필요 없습니다. 브라우저 API는 effect·이벤트 안에서만 써서 서버 렌더에서 오류가 나지 않습니다. 오버레이를 여는 `useOverlay`와 토스트를 띄우는 `useToaster`는 [오버레이](overlay.md)에 있습니다(둘 다 Provider 필요).

- **`useInView`** — 요소가 화면(또는 스크롤 상자)에 들어왔는지 알려 줍니다. 무한 스크롤, 보일 때 불러오기·나타나기에 씁니다. API는 `react-intersection-observer` 방식입니다.
  - `const { ref, inView, entry } = useInView(options)` 또는 `const [ref, inView, entry] = useInView()`. `ref`를 관찰할 요소에 붙입니다
  - `options`: `threshold`(0~1, 기본 0 = 1px이라도 보이면) · `root`(스크롤 상자 요소, 기본 화면) · `rootMargin`(예: `"0px 0px 200px 0px"`면 바닥 200px 전에 미리) · `triggerOnce`(처음 한 번만, 이후 계속 `true`) · `skip`(관찰 안 함) · `initialInView`(첫 결과 전 값, 기본 `false`) · `fallbackInView`(IntersectionObserver가 없을 때 값) · `onChange(inView, entry)`
  - 서버 렌더와 첫 화면에서는 `initialInView`(기본 `false`)입니다. 보이는지에 따라 중요한 내용을 숨기지 않습니다(검색·스크린리더가 못 읽음)
  - 무한 스크롤: 목록 끝에 빈 요소(`<div ref={ref} />`)를 두고 `useEffect(() => { if (inView && !loading && hasMore) loadMore() }, [inView, loading, hasMore, items.length])`처럼 씁니다. `onChange`만 쓰면 새 목록이 붙은 뒤에도 끝이 계속 보일 때 다음 페이지를 놓칩니다. 더 없으면 `skip`으로 멈춥니다
- **`useClipboard`** — 글자를 클립보드에 복사하고, 복사했는지 잠시 알려 줍니다(지갑 주소·거래 ID 복사).
  - `const { copy, copied, error, reset } = useClipboard({ timeout: 2000 })`
  - `copy(text)`: `Promise<boolean>`(성공 `true`). 버튼 `onClick` 같은 사용자 동작 안에서 부릅니다(브라우저 규칙). Clipboard API가 없으면(http 주소 등) 예전 방식으로 한 번 더 시도합니다
  - `copied`: 복사 직후 `true`, `timeout`(ms, 기본 2000) 뒤 `false`. `timeout: 0`이면 `reset()` 전까지 유지
  - `error`: 마지막 실패의 오류(성공하면 `null`). `onSuccess(text)`·`onError(error)` 옵션도 있습니다
  - 복사 버튼은 `copied`일 때 아이콘(`CopyIcon` → `CheckIcon`)과 이름(`aria-label` "복사" → "복사했어요")을 함께 바꿉니다. 색만으로 알리지 않습니다
- **`useDebounceValue`** — 값이 `delay`(ms, 기본 300) 동안 더 바뀌지 않으면 확정합니다. 검색어 입력처럼 빠르게 바뀌는 값으로 요청할 때 횟수를 줄입니다.
  - `const { debouncedValue, isDebouncing, flush, cancel } = useDebounceValue(query, 300)` → 요청·필터에는 `debouncedValue`를, 입력창 `value`에는 원래 값(`query`)을 씁니다
  - `isDebouncing`: 값이 바뀌어 확정을 기다리는 중(`true`). 입력 중 표시에 씁니다
  - `flush()`: 기다리지 않고 지금 값을 확정(Enter·검색 버튼). `cancel()`: 기다리던 값을 버리고 이전 확정 값 유지(값이 다시 바뀌면 다시 기다림)
  - 첫 렌더(서버 렌더 포함)에서는 넘긴 값이 확정 값입니다. `delay`가 0 이하면 기다리지 않습니다
  - 객체·배열을 넘길 때는 매 렌더 새로 만들지 않습니다(`useMemo`). 새 객체는 바뀐 것으로 보고 계속 기다립니다
  - 함수 호출 자체를 늦추는 용도(debounce 함수)는 아닙니다. 값만 늦춥니다
- **`useFileUpload`** — 파일 올리기 목록을 관리합니다(고른 파일 · 이미지 미리보기 주소 · 용량·개수·형식 검사 · 업로드 진행률·취소·다시 시도). `FileUploader`·`FileItem`은 모양만 맡으니 목록 상태를 직접 만들지 말고 이 훅을 씁니다. 클라이언트 컴포넌트에서 씁니다
  - `const upload = useFileUpload({ maxSize, maxFiles, upload, messages })` → `<FileUploader helper="평소 도움말" {...upload.uploaderProps} />` · `upload.items.map((item) => <FileItem key={item.id} {...upload.itemProps(item)} />)`
  - `uploaderProps`: `onFilesSelect`·`onFilesReject`, 개수 초과·형식 오류가 있을 때만 `status="negative"`·`helper`(오류 문구). **평소 `helper`·`status`는 `uploaderProps`보다 앞에** 적어야 오류 때만 바뀝니다
  - `upload(file, { onProgress, signal })`(선택): 주면 고르자마자 올림. `onProgress(0~100)`로 진행률, ×(취소)·`remove`·화면 이탈 때 `signal`로 중단(`fetch` 등 요청에 그대로 전달). 실패하면 `negative`와 `messages.failed`, "다시 시도"(`retry`). 주지 않으면 고른 파일은 바로 완료(첨부됨)로 보이고 보낼 때 `items`의 `file`을 `FormData`에 담음
  - `maxSize`(byte): 넘는 파일은 목록에 실패로 남기고 이유("10MB보다 큰 파일이에요"), 다시 시도는 없음. `maxFiles`: 넘는 파일은 받지 않고 오류(`error`). `messages`로 문구(`tooLarge`·`tooMany`·`rejected`·`failed`)를 바꿈
  - `items`: `{ id, file, name, sizeLabel, preview, status, progress, error }`. `uploading`(올리는 중 있음, 제출 버튼 막기), `add(files)`·`remove(id)`·`retry(id)`·`clear()`
  - 이미지 미리보기 주소(`URL.createObjectURL`)는 훅이 만들고 지울 때·화면을 떠날 때 돌려줍니다. 용량 글자는 `formatFileSize(bytes)`로도 만들 수 있습니다
