import type { ComponentType, CSSProperties } from "react";
import CodeBlock from "@theme/CodeBlock";
import Preview from "./Preview";

interface ExampleProps {
  /** 예시 파일의 기본 export 컴포넌트 (remark-example이 채운다) */
  component: ComponentType;
  /** 예시 파일의 원본 텍스트 (remark-example이 채운다) */
  source: string;
  /** 미리보기 상자 안쪽 레이아웃 (예: flexDirection, maxWidth). 코드에는 나타나지 않는다. */
  style?: CSSProperties;
  /**
   * 코드 블록을 숨긴다. 토큰을 한눈에 보는 갤러리처럼 "시각 확인용" 예시에 쓴다.
   * 그 코드는 사용하는 쪽이 쓰는 코드가 아니라 화면을 그리는 구현이라서, 사용법은 MDX에 짧은 코드 블록으로 따로 적는다.
   */
  hideCode?: boolean;
}

/**
 * 문서의 예시: 미리보기와 코드 블록을 같은 파일에서 만든다. MDX에서는 `<Example name="button/Variants" />`로 쓴다.
 */
export default function Example({
  component: Component,
  source,
  style,
  hideCode = false,
}: ExampleProps) {
  return (
    <>
      <Preview style={style}>
        <Component />
      </Preview>
      {!hideCode && <CodeBlock language="tsx">{source.trim()}</CodeBlock>}
    </>
  );
}
