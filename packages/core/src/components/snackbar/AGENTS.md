# Snackbar 사용 규칙

`Snackbar`를 쓰거나 고칠 때 **이 문서대로 쓰는 것을 권장**합니다. 출처는 Figma `Snackbar`(node `2316:39526`)와 `Snackbar Guidelines`(node `2316:39631`)입니다. Figma와 이 문서가 다르면 Figma가 맞습니다.

- **작업 뒤 다음 행동을 제안하는 메시지**입니다. 꼭 확인해야 하는 정보나 되돌릴 수 없는 작업에는 쓰지 않습니다.
- **쓰는 방법은 둘**입니다.
  - 본문에 두기: `<Snackbar>`를 화면 안에 그대로 렌더링합니다. 숨기는 것은 사용하는 쪽이 상태로 정합니다(`onClose`).
  - 띄우기: 행동 뒤에 잠시 보여 주려면 `useSnackbar()`로 띄웁니다. `useToast`와 같은 `ToastProvider`가 그리고, 토스트와 같은 자리에 띄운 순서대로 섞여 쌓입니다. 기본 5초(`snackbarDuration`) 뒤 사라지고, `addOn`의 버튼을 누른 뒤 닫으려면 `snackbar.dismiss(id)`를 부릅니다(`id`를 옵션으로 정해 둡니다).
- 상태가 없어서 `"use client"`가 없습니다. `onClose`나 `addOn`의 버튼에 `onClick`을 넘길 때만 클라이언트 컴포넌트 안에서 씁니다.

## Toast·Alert와 차이

|      | Snackbar                  | Toast                      | Alert                |
| ---- | ------------------------- | -------------------------- | -------------------- |
| 목적 | 결과와 다음 행동을 알려요 | 결과만 짧게 알려요         | 꼭 확인해야 하는 일  |
| 버튼 | 1개(선택)                 | 없어요                     | Text Button 1개      |
| 위치 | 본문 안 또는 토스트 자리  | 화면 위·아래에 떴다 사라짐 | 화면 가운데 대화상자 |
| 예시 | 삭제했어요 · 되돌리기     | 저장했어요                 | 정말 삭제할까요?     |

## 구성

| 구성            | 선택지                                            | 설명                                                |
| --------------- | ------------------------------------------------- | --------------------------------------------------- |
| 종류(`variant`) | `normal` · `positive` · `cautionary` · `negative` | 완료는 positive, 주의는 cautionary, 오류는 negative |
| 제목·설명       | `heading` · `description`                         | 제목은 한 줄(넘치면 말줄임), 설명은 필요할 때만     |
| 버튼            | `addOn` · 닫기 버튼                               | 다음 행동은 버튼 하나, 닫기는 선택(`onClose`)       |
| 아이콘          | `icon`(기본 끔)                                   | 종류에 맞는 아이콘(Toast와 같은 아이콘)             |

- **모양**: 배경 아토믹 gray-600(불투명, Figma가 직접 씀), 모서리 12, 패딩 왼쪽 16 · 오른쪽 12 · 세로 12, 간격 8, 높이 54 이상. 폭은 놓인 자리를 채우고 최대 420(Figma 356~420). 제목 Body 4 SemiBold, 설명 Body 5 Regular, 글자 `text-on-fill`. 본문에 두면 그림자가 없고, `useSnackbar`로 띄우면 폭 420(좁은 화면은 좌우 20을 뺀 폭)에 `shadow-floating`입니다.
- **버튼**: `Button variant="outline" color="neutral" size="md"`. 닫기 버튼은 32 원형에 X 20(`aria-label="닫기"`)이고, 누르면 `onClose`가 불립니다.

```tsx
// 띄우기
const snackbar = useSnackbar();
snackbar("관심 코인에서 삭제했어요.", {
  id: "delete",
  addOn: (
    <Button
      variant="outline"
      color="neutral"
      size="md"
      onClick={() => {
        undo();
        snackbar.dismiss("delete");
      }}
    >
      되돌리기
    </Button>
  ),
});

// 본문에 두기
const [open, setOpen] = useState(true);

{
  open && (
    <Snackbar
      heading="본인 인증이 필요해요."
      addOn={
        <Button variant="outline" color="neutral" size="md" onClick={verify}>
          인증
        </Button>
      }
      onClose={() => setOpen(false)}
    />
  );
}
```

## 사용 규칙

| 구분 | 내용                                                            |
| ---- | --------------------------------------------------------------- |
| 권장 | "되돌리기"처럼 방금 한 행동을 취소하는 버튼을 둬요              |
| 권장 | 버튼 레이블은 2~4자 행동으로 써요                               |
| 금지 | 되돌릴 수 없는 일의 확인을 Snackbar로 받지 않아요. Alert를 써요 |
| 금지 | 버튼을 둘 이상 넣지 않아요                                      |

## 접근성

- **키보드로 닿을 수 있어요:** 버튼과 닫기 버튼은 Tab으로 포커스를 받아요.
- 화면이 바뀌면서 새로 나타나 바로 읽혀야 하면 `role="status"`를 넘깁니다.

## Props 요약

`variant` · `heading`(필수) · `description` · `icon` · `addOn`(`ReactNode`, 다음 행동 버튼) · `onClose`(넘기면 닫기 버튼)와 나머지 `<div>` 속성. 자세한 표는 docs의 Snackbar 페이지를 봅니다.
