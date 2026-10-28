/**
 * MDX는 JSX 태그 안의 텍스트를 줄바꿈해서 쓰면(Prettier가 이렇게 정리한다) 그 텍스트를 `<p>`로 감싼다.
 * `<Button>\n  추가\n</Button>`가 `<button><p>추가</p></button>`이 되어 문단 여백이 붙고 높이가 커진다.
 * 코드에 적힌 모양 그대로 렌더링되도록, JSX 요소의 자식이 문단 하나뿐이면 그 문단을 풀어 준다.
 */
interface MdxNode {
  type: string;
  name?: string | null;
  children?: MdxNode[];
}

// 마크다운 본문을 그대로 담는 컨테이너는 문단을 유지한다
const KEEP_PARAGRAPH = new Set(["Tabs", "TabItem", "details", "summary"]);

function unwrap(node: MdxNode) {
  node.children?.forEach(unwrap);
  const isJsx = node.type === "mdxJsxFlowElement" || node.type === "mdxJsxTextElement";
  if (
    isJsx &&
    node.name &&
    !KEEP_PARAGRAPH.has(node.name) &&
    node.children?.length === 1 &&
    node.children[0].type === "paragraph"
  ) {
    node.children = node.children[0].children ?? [];
  }
}

export default function remarkUnwrapJsxParagraph() {
  return (tree: MdxNode) => unwrap(tree);
}
