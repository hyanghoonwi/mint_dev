import { readFile } from "node:fs/promises";
import path from "node:path";
import type { ComponentType, CSSProperties } from "react";
import { compileMdx } from "nextra/compile";
import { MDXRemote } from "nextra/mdx-remote";
import { mintCodeTheme } from "../../mint-code-theme.mjs";

interface ExampleProps {
  /** `src/examples/` 아래의 파일 경로(확장자 제외). 예: `button/FullWidth` */
  name: string;
  /** 미리보기 영역 안쪽 레이아웃 (예: flexDirection, maxWidth). 코드에는 나타나지 않는다. */
  style?: CSSProperties;
  /**
   * 코드를 숨긴다. 화면을 그리는 구현이라 사용법이 아닌 "시각 확인용" 예시에만 쓴다.
   * 사용법은 MDX에 짧은 코드 블록으로 따로 적는다.
   */
  hideCode?: boolean;
}

/**
 * 문서의 예시: 예시 파일 하나에서 실행 결과(미리보기)와 코드를 함께 만든다. MDX에서는 `<Example name="button/FullWidth" />`로 쓴다.
 * 서버 컴포넌트라서 파일을 직접 읽고, 코드 하이라이트도 서버에서 끝낸다(브라우저로 코드 하이라이터를 보내지 않는다).
 * 그래서 문서에 보이는 코드가 곧 실제로 실행되고 타입 검사되는 코드이고, 미리보기와 코드가 어긋날 수 없다.
 */
export default async function Example({ name, style, hideCode = false }: ExampleProps) {
  const { default: Component } = (await import(`../examples/${name}`)) as {
    default: ComponentType;
  };

  let code = null;
  if (!hideCode) {
    const source = (
      await readFile(path.join(process.cwd(), "src/examples", `${name}.tsx`), "utf8")
    ).trim();
    // next.config의 코드 색 설정은 이 함수에 자동으로 적용되지 않아서 같은 테마를 직접 넘긴다
    const compiled = await compileMdx(`\`\`\`tsx\n${source}\n\`\`\``, {
      mdxOptions: {
        rehypePrettyCodeOptions: { theme: { light: mintCodeTheme, dark: mintCodeTheme } },
      },
    });
    code = <MDXRemote compiledSource={compiled} />;
  }

  return (
    <div className="docs-example">
      {/* 미리보기 안의 글자는 검색 색인에 넣지 않는다(검색 결과에 버튼 이름 같은 조각이 섞이지 않게) */}
      <div className="docs-example__preview" data-pagefind-ignore>
        <div className="docs-example__stage" style={style}>
          <Component />
        </div>
      </div>
      {code && <div className="docs-example__code">{code}</div>}
    </div>
  );
}
