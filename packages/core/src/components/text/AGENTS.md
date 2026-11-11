# Text 사용 규칙

`Text`를 쓰거나 고칠 때 **이 문서대로 쓰는 것을 권장**합니다. 출처는 Figma `Typography`(Specimen node `32:61`, Token node `33:7`)입니다. Figma와 이 문서가 다르면 Figma가 맞습니다.

- **토큰 텍스트 스타일로 글자를 그리는 컴포넌트**입니다. Figma의 59개 스타일(역할-번호-웨이트)만 고를 수 있어서 토큰 밖의 크기(`text-[36px]`)를 막습니다.
- 서버 컴포넌트에서 그대로 쓸 수 있습니다(`"use client"` 없음).
- 클래스(`text-body-2-regular`)를 직접 써도 됩니다. `Text`는 태그·색·말줄임을 한곳에서 정하고 싶을 때 씁니다.

## 구성

| prop      | 선택지                                                                                                                           | 설명                                           |
| --------- | -------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| `variant` | `display-1-bold` … `caption-2-semibold` (59개)                                                                                   | 필수. 크기·줄 간격·자간·웨이트가 함께 정해져요 |
| `as`      | `span`(기본) · `p` · `h1`~`h6` · `label` · `strong` 등                                                                           | 문서 구조에 맞는 태그. 모양과 따로 골라요      |
| `color`   | `strong` · `primary` · `secondary` · `tertiary` · `subtle` · `disabled` · `brand` · `danger` · `success` · `warning` · `on-fill` | 시맨틱 글자색. 생략하면 부모 색을 이어받아요   |
| `lines`   | `1` · `2` · `3` · `4`                                                                                                            | 이 줄 수를 넘으면 말줄임(…)                    |

- **역할**: Display(랜딩·히어로, 한 화면에 하나) · Title(페이지 제목) · Heading(섹션·카드·모달 제목) · Body(본문, 기본 Body 2 16px, 긴 글은 Body 1) · Label(버튼·탭·칩·입력 라벨, 한 줄 전용) · Caption(날짜·도움말·각주).
- **크기는 값 하나만 받습니다.** Figma 가이드: "크기와 줄 간격은 화면 크기와 관계없이 하나의 체계를 씁니다." 구간별로 다른 스타일을 고르는 것을 허용할지는 아직 정하지 않았습니다(정해지면 `utils/responsive.ts`로 `variant`를 엽니다).
- 나머지 속성은 고른 태그에 그대로 넘어갑니다(`id`, `htmlFor` 등).

```tsx
<Text variant="title-1-bold" as="h1">비트코인</Text>
<Text variant="body-2-regular" as="p" color="secondary">설명</Text>
<Text variant="body-3-medium" lines={2}>긴 제목은 두 줄에서 자릅니다…</Text>
```

## 사용 규칙

- 제목처럼 보여도 문서 구조상 제목이 아니면 `as`를 `p`·`span`으로 둡니다. 반대로 `h1`은 페이지에 하나만 둡니다.
- Label 스타일은 한 줄 전용입니다. 여러 줄 글에는 Body를 씁니다.
- 색은 `color`의 시맨틱 이름만 씁니다. hex나 `text-[#...]`를 쓰지 않습니다.
- 말줄임(`lines`)을 쓰면 잘린 내용을 볼 방법(상세 화면, 툴팁 등)을 함께 둡니다.

## Props 요약

`variant`(필수) · `as` · `color` · `lines` · `children`과 고른 태그의 나머지 속성. 자세한 표는 docs의 Text 페이지를 봅니다.
