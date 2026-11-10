// 상단 탭 구성(Montage와 같은 틀). `type: "page"`인 항목이 상단 탭이 되고,
// 사이드바는 지금 열린 탭의 폴더 안만 보여 준다. 탭 안의 그룹 제목은 각 폴더 `_meta.js`의 `---` 구분선이다.
// 빵부스러기·이전/다음 링크는 쓰지 않는다(폴더에 걸면 하위 페이지가 물려받는다).
// 마지막 수정일(timestamp)도 쓰지 않는다(Figma 시안에 없음)
const plain = { breadcrumb: false, pagination: false, timestamp: false };

export default {
  // 첫 화면(/). 탭에는 보이지 않고, 사이드바·목차 없이 화면 전체를 쓴다
  index: {
    type: "page",
    display: "hidden",
    theme: { layout: "full", sidebar: false, toc: false, timestamp: false, ...plain },
  },
  "getting-started": { type: "page", title: "Getting started", theme: plain },
  foundations: { type: "page", title: "Foundations", theme: plain },
  components: { type: "page", title: "Components", theme: plain },
  // 아직 비어 있다(훅은 따로 만든다)
  utilities: { type: "page", title: "Utilities", theme: plain },
};
