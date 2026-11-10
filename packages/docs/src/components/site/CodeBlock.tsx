"use client";

import { Highlight } from "prism-react-renderer";
import { mintPrismTheme } from "../../prismTheme";

/** 코드를 브라우저에서 하이라이트한다(값에 따라 코드가 바뀌는 샌드박스용) */
export function HighlightedCode({ code }: { code: string }) {
  return (
    <Highlight code={code} language="tsx" theme={mintPrismTheme}>
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre className={`docs-code ${className}`} style={style}>
          <code>
            {tokens.map((line, index) => (
              <span key={index} {...getLineProps({ line })} style={{ display: "block" }}>
                {line.map((token, key) => (
                  <span key={key} {...getTokenProps({ token })} />
                ))}
              </span>
            ))}
          </code>
        </pre>
      )}
    </Highlight>
  );
}
