# Version

`@futurewiz-rms/mint`의 버전별 변경 사항이에요. 최신 버전이 위에 있어요.

**버전 규칙**: 1.0.0 전(`0.x`)에는 새 기능과 브레이킹 변경을 모두 minor로 올려요. 1.0.0부터는 브레이킹 변경은 major, 새 기능은 minor, 버그 수정은 patch로 올리고, 브레이킹 변경에는 **업그레이드 방법**을 함께 적어요.

## 미배포

### 변경

- **색 토큰 이름**: 시맨틱 컬러 이름이 Figma 변수와 같아졌어요. `text-text-primary`·`text-text-secondary`·`text-text-disabled`·`border-border-default`는 이름은 같고 값이 Figma 값으로 바뀌었어요.

### 삭제 (브레이킹)

- **이전 임시 색 토큰**: `text-caption`·`text-inverse`·`text-on-brand`, `brand-primary`·`brand-primary-hover`·`brand-tint`·`brand-error`, `bg-page`·`bg-surface`·`bg-elevated`·`bg-overlay`, `border-subtle`, 시세 색(`price-up`·`price-down`·`price-flat`)을 없앴어요. 다크 모드 값도 Figma에 Dark가 생길 때까지 없어요.
  업그레이드: `bg-brand-primary`→`bg-fill-brand`, `text-text-on-brand`→`text-text-on-fill`, `bg-brand-tint`→`bg-fill-brand-weak`, `text-brand-primary`→`text-text-brand`, `bg-brand-error`→`bg-fill-danger`, `bg-bg-surface`→`bg-background-default`, `bg-bg-page`·`bg-bg-elevated`→`bg-background-lower`, `text-text-caption`→`text-text-tertiary`, `border-border-subtle`→`border-border-default`로 바꾸세요. 시세 색은 대체가 없어서 `text-text-danger` 등을 상황에 맞게 쓰거나 앱에서 직접 정하세요.

### 추가

- **`Text`**: Figma 텍스트 스타일(59개)로 글자를 그릴 수 있어요. `variant`(예: `title-1-bold`)로 모양을, `as`로 태그를 따로 고르고, `color`(시맨틱 글자색)와 `lines`(1~4줄 말줄임)를 지원해요. 서버 컴포넌트에서도 쓸 수 있어요.
- **`Pagination`**: 많은 데이터를 페이지로 나눠 이동할 수 있어요. `page`·`total`만 주면 처음·끝과 현재 주변 번호를 알아서 보여 주고, `variant`(`responsive`·`extended`·`compact`)를 골라요. 주소로 이동하려면 `getHref`(Next.js는 `linkComponent={Link}`), 화면 안에서 바꾸려면 `onChange`를 써요. 서버 컴포넌트에서도 쓸 수 있어요.
- **`PageCounter`·`PageDots`**: 배너·캐러셀·이미지 갤러리의 현재 위치를 숫자(1 / 10)나 점으로 보여 줄 수 있어요. `current`·`total`을 넘기고 `variant`·`size`(`lg`·`md`)를 골라요. 이미지 위에서는 `PageDots`의 `variant="white"`를 써요. 서버 컴포넌트에서도 쓸 수 있어요.
- **`IconButton`**: 아이콘만으로 동작을 실행하는 원형 버튼이에요. `variant`(`normal`·`background`·`outline`·`solid`), `size`(`xs`·`sm`·`md`·`lg`, Button과 같은 높이), `badge`, `disabled`를 지원하고, `aria-label`이 필수예요. 서버 컴포넌트에서도 쓸 수 있어요. `size`는 `{ base: "sm", tablet: "md" }`처럼 구간별 값도 받아요.
- **`FramedCheckbox`·`FramedRadio`·`Framed`**: 선택지를 틀로 묶어 보여 주고 선택된 틀을 테두리로 강조할 수 있어요. 틀 어디를 눌러도 안의 체크박스·라디오가 선택되고, `label`·`description`, `size`(`sm`·`md`·`lg`), 오류 `error`, `shadow`를 지원해요.
- **`Radio`·`RadioGroup`**: 여러 선택지 중 하나만 고르는 라디오예요. `RadioGroup`의 `value`·`defaultValue`·`onChange`로 선택 값을 다루고, `Radio`는 레이블, 촘촘한 `tight`, `disabled`를 지원해요. 레이블을 눌러도 선택되고 방향키로 옮길 수 있어요. 진짜 `<input type="radio">`라서 `name`으로 폼에 그대로 제출돼요.
- **`Chip`**: 필터·카테고리처럼 선택 상태가 있는 칩이에요. `variant`(`solid`·`outline`), `size`(`lg`·`md`·`sm`), `shape`(`square`·`pill`), `active`, `disabled`와 앞뒤 구성(`leftAddon`·`rightAddon`·`leadingImage`·`count`), `badge`를 지원하고, 서버 컴포넌트에서도 쓸 수 있어요. `size`는 `{ base: "sm", tablet: "md" }`처럼 구간별 값도 받아요.
- **`Checkbox`**: 여러 개를 고르거나 한 항목을 켜고 끄는 체크박스예요. `checked`·`defaultChecked`, 일부 선택 `indeterminate`, 강조 레이블 `bold`, 촘촘한 `tight`, `disabled`를 지원하고, 레이블을 눌러도 선택돼요. 진짜 `<input type="checkbox">`라서 `name`·`value`로 폼에 그대로 제출돼요.
- **`CheckMark`**: 목록에서 선택된 항목을 표시하는 체크 표시예요. `checked`, 레이블(`children`), 촘촘한 `tight`, `disabled`를 지원하고, `onClick`을 주면 항목 전체가 눌리는 버튼이 돼요(`role`로 `checkbox`·`radio`·`option` 등을 골라요). 서버 컴포넌트에서도 쓸 수 있어요.
- **`Category`**: 같은 목록을 거르거나 분류를 고르는 칩 목록이에요. 한 번에 하나만 선택하고, 넘치면 가로로 스크롤하며 가장자리 그라데이션이 자동으로 나타나요. `variant`(`solid`·`outline`), `size`(`lg`·`md`), `shape`(`square`·`pill`), 맨 앞 "전체" 칩(`all`), 칩별 `icon`·`badge`를 지원해요. `size`는 `{ base: "lg", desktop: "md" }`처럼 구간별 값도 받아요.
- **`SkeletonText`·`SkeletonRectangle`·`SkeletonCircle`**: 콘텐츠를 불러오는 동안 들어올 자리를 회색 덩어리로 보여 줄 수 있어요. 텍스트 줄은 `length`·`align`, 네모는 `radius`, 원은 `size`(Avatar 크기)를 고르고, 회색 바탕 위에서는 `color="white"`를 써요. 밝아졌다 흐려지며 깜빡이고, `animate={false}`로 끌 수 있어요.
- **`useOverlay`·`OverlayProvider`**: FDS와 같은 API로 Alert 같은 오버레이를 함수 안에서 열 수 있어요. `open`·`openAsync`(`await`로 결과 받기)·`close(id)`·`exit(id)`·`closeAll`을 쓰고, `overlayId`로 중복 열림을 막을 수 있어요. 앱 최상단(`app/layout.tsx`)을 `OverlayProvider`로 한 번 감싸요.
- **`Circular`**: 로드 시간이 짧은 일반적인 상황에 쓰는 원형 로딩이에요. `size`(기본 28)와 `color`(`default`·`brand`·`on-fill`)를 지원하고, 서버 컴포넌트에서도 쓸 수 있어요.
- **`Badge`**: 상태·종류를 짧게 알리는 표시 전용 라벨이에요. `variant`(`fill`·`weak`), `color`(`brand`·`neutral`·`danger`·`success`·`warning`), `size`(`sm`·`md`·`lg`)를 지원하고, 서버 컴포넌트에서도 쓸 수 있어요.
- **`Avatar`·`AvatarGroup`**: 사용자나 대상을 나타내는 프로필 칸이에요. `src`·`name`·`icon` 중 있는 것으로 이미지, 이름 첫 글자, 아이콘을 알아서 보여 주고, `size`(24·32·40·48·64), `variant`(`person`·`brand`), `badge`(크기는 `badgeSize`로 따로 고를 수 있어요), `disabled`, `onClick`을 지원해요. `AvatarGroup`은 겹쳐 놓고 넘치면 `+N`을 보여 줘요. 서버 컴포넌트에서도 쓸 수 있어요.
- **`Alert`**: 꼭 확인하고 넘어가야 하는 상황에 쓰는 대화상자예요. `open`·`onClose`로 열고 닫고, `heading`, `body`, 하단 버튼 영역 `action`(`Button`을 1~2개 직접 넣어요)을 props로 받아서 `<Alert ... />`처럼 자식 없이 써요. Tab·Enter·Esc로 조작하고 열리면 포커스가 안에 머물러요.
- **아이콘**: Phosphor 기반 아이콘 183개를 `ArrowLeftIcon`처럼 아이콘마다 컴포넌트로 쓸 수 있어요. `size`(16·20·24)와 `variant`(`line`·`fill`)를 지원하고, 쓰는 아이콘만 번들에 들어가요.
- **`Button`**: 텍스트 버튼이에요. `variant`(`solid`·`outline`·`ghost`)와 `color`(`primary`·`neutral`·`secondary`·`destructive`)로 위계를 고르고, `size`(`xs`·`sm`·`md`·`lg`), `leftAddon`·`rightAddon`, `loading`(원 크기는 버튼 크기를 따라요), `fullWidth`를 지원해요. 서버 컴포넌트에서도 쓸 수 있어요. `size`와 `fullWidth`는 `{ base: "lg", tablet: "md" }`처럼 구간별 값도 받아서 화면 폭에 따라 바꿀 수 있어요.
- **시맨틱 컬러**: Figma `Color - Semantic`의 57개를 `bg-background-default`, `text-text-primary`, `bg-fill-brand`, `border-border-strong`, `text-icon-brand`처럼 클래스로 쓸 수 있어요. 지금은 Light 모드만 있어요.
- **토큰**: 모서리 토큰을 추가했어요.
- **`Container`·`Grid`**: 반응형 페이지 레이아웃이에요. `Container`가 좌우 여백과 최대 폭(1440px)을 맡고, `Grid.Item`의 `span={{ base, tablet, desktop }}`로 구간별 차지할 컬럼 수를 정해요(모바일 4·태블릿 8·데스크톱 12컬럼, 거터·여백 20). 서버 컴포넌트에서 쓸 수 있어요.
- **간격 스케일**: Figma와 같은 12단계(4~96px)를 `--mint-spacing-20` 변수와 `p-5`·`gap-3` 같은 클래스로 쓸 수 있어요.
- **브레이크포인트**: `tablet:`(768px)과 `desktop:`(1024px) 접두어를 쓸 수 있어요. Tailwind 기본 `sm:`·`md:` 등은 없어요.
- **글자 스타일**: 역할별 글자 스타일 59개를 `text-title-1-bold`, `text-body-2-regular`처럼 클래스 하나로 쓸 수 있어요. 글자 크기는 화면 폭에 따라 바뀌지 않아요.
- **아토믹 컬러**: Figma와 같은 원시 색 123개를 `--color-atomic-*` CSS 변수로 쓸 수 있어요.
