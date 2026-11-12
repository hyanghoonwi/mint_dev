# Divider 사용 규칙

`Divider`를 쓰거나 고칠 때 **이 문서대로 쓰는 것을 권장**합니다. 출처는 Figma `Divider`(node `2291:34429`)와 `Divider Guidelines`(node `2291:34493`)입니다. Figma와 이 문서가 다르면 Figma가 맞습니다.

- **내용을 시각적으로 나누는 선**입니다. 표시 전용이라 누르거나 동작하지 않습니다.
- 상태·이벤트가 없어서 `"use client"`가 없습니다. 서버 컴포넌트에서 바로 씁니다.
- 반응형 웹(모바일웹 ~ PC)에서 같은 컴포넌트를 씁니다.

## 여백(Spacing)과 차이

|      | Divider                   | 여백(Spacing)             |
| ---- | ------------------------- | ------------------------- |
| 목적 | 내용을 선이나 띠로 나눠요 | 내용 사이를 띄워요        |
| 모양 | 1px 선 또는 8px 띠        | 빈 공간이라 보이지 않아요 |
| 위치 | 목록 항목 사이, 영역 사이 | 요소 사이 간격으로 써요   |

## 구성

| 구성                | 선택지                         | 설명                                                                            |
| ------------------- | ------------------------------ | ------------------------------------------------------------------------------- |
| 방향(`orientation`) | `horizontal` · `vertical`      | 가로선은 위아래를, 세로선은 좌우를 나눠요                                       |
| 스타일(`variant`)   | `default` · `strong` · `thick` | `default` 일반 구분, `strong` 더 또렷하게, `thick` 8px 띠로 영역 구분(가로선만) |
| 인셋(`inset`)       | `false` · `true`               | `true`면 좌우에 20px 여백(가로선만)                                             |

- **색**: `default` `border-default` · `strong` `border-strong` · `thick` `background-lower`(8px 띠).
- **크기**: 선 두께 1px, `thick`은 8px. 가로선은 부모 폭을 채우고, 세로선은 flex 줄 안에서 높이를 채웁니다(`self-stretch`). flex 밖의 세로선은 `className`으로 높이를 줍니다.
- 세로선에 `thick`·`inset`을 주면 무시하고 `default` 선으로 그립니다.

```tsx
<Divider />
<Divider variant="thick" />
<Divider inset />
<div style={{ display: "flex", alignItems: "center", gap: 12 }}>
  <span>최신순</span>
  <Divider orientation="vertical" className="h-3" />
  <span>인기순</span>
</div>
```

## 사용 규칙

| 구분 | 내용                                                                           |
| ---- | ------------------------------------------------------------------------------ |
| 권장 | 목록 항목 사이에는 `default`를 써요. 화면 영역을 크게 나눌 때만 `thick`을 써요 |
| 권장 | 여백만으로 나뉘면 선을 더하지 않아요. 선이 많으면 화면이 답답해 보여요         |
| 금지 | 선 색을 임의로 바꾸지 않고 border 변수만 써요                                  |
| 금지 | 눌러서 동작하는 요소로 쓰지 않아요                                             |

## 접근성

- **선만으로 정보를 전달하지 않아요:** 구분선은 장식이라 보조기기에서 읽지 않아요(`aria-hidden`). 나뉜 내용은 제목이나 글자로도 알 수 있게 해요.

## Props 요약

`orientation` · `variant` · `inset`과 나머지 `<div>` 속성. 자세한 표는 docs의 Divider 페이지를 봅니다.
