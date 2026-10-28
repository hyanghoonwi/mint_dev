/**
 * MDX의 `<Example name="button/Variants" />`를 예시 파일(`src/examples/button/Variants.tsx`) 하나에서 만든다.
 *
 * - 미리보기: 그 파일의 기본 export 컴포넌트를 그대로 렌더링한다.
 * - 코드 블록: 같은 파일의 원본 텍스트를 보여 준다.
 *
 * 그래서 문서에 보이는 코드가 곧 실제로 실행되고 타입체크되는 코드이고, 미리보기와 코드가 어긋날 수 없다.
 * 이 플러그인이 파일 import 두 개(컴포넌트, 원본)를 MDX에 넣고 `<Example component source />`로 바꿔 준다.
 */
import path from "node:path";

// 원본 텍스트를 가져오는 로더. `!!`로 Babel 등 다른 로더가 먼저 변환하지 않게 한다.
const RAW_LOADER = path.resolve(__dirname, "raw-loader.cjs");

interface MdxAttribute {
  type: string;
  name?: string;
  value?: unknown;
}

interface MdxNode {
  type: string;
  name?: string | null;
  attributes?: MdxAttribute[];
  children?: MdxNode[];
  value?: string;
  data?: unknown;
}

const identifier = (name: string) => ({ type: "Identifier", name });

function importNode(local: string, source: string): MdxNode {
  return {
    type: "mdxjsEsm",
    value: `import ${local} from ${JSON.stringify(source)};`,
    data: {
      estree: {
        type: "Program",
        sourceType: "module",
        body: [
          {
            type: "ImportDeclaration",
            specifiers: [{ type: "ImportDefaultSpecifier", local: identifier(local) }],
            source: { type: "Literal", value: source, raw: JSON.stringify(source) },
          },
        ],
      },
    },
  };
}

function expressionAttribute(name: string, expression: string): MdxAttribute {
  return {
    type: "mdxJsxAttribute",
    name,
    value: {
      type: "mdxJsxAttributeValueExpression",
      value: expression,
      data: {
        estree: {
          type: "Program",
          sourceType: "module",
          body: [{ type: "ExpressionStatement", expression: identifier(expression) }],
        },
      },
    },
  };
}

export default function remarkExample() {
  return (tree: MdxNode) => {
    const imports: MdxNode[] = [];
    let count = 0;

    const visit = (node: MdxNode) => {
      node.children?.forEach(visit);
      const isJsx = node.type === "mdxJsxFlowElement" || node.type === "mdxJsxTextElement";
      if (!isJsx || node.name !== "Example") {
        return;
      }
      const nameAttr = node.attributes?.find(
        (a) => a.type === "mdxJsxAttribute" && a.name === "name",
      );
      if (!nameAttr || typeof nameAttr.value !== "string") {
        throw new Error(
          '<Example>에는 문자열 name이 필요합니다. 예: <Example name="button/Variants" />',
        );
      }
      const id = count++;
      const component = `__mintExample${id}`;
      const source = `__mintExampleSource${id}`;
      imports.push(
        importNode(component, `@site/src/examples/${nameAttr.value}`),
        importNode(source, `!!${RAW_LOADER}!@site/src/examples/${nameAttr.value}.tsx`),
      );
      node.attributes = [
        ...(node.attributes ?? []).filter((a) => a !== nameAttr),
        expressionAttribute("component", component),
        expressionAttribute("source", source),
      ];
    };

    visit(tree);
    tree.children = [...imports, ...(tree.children ?? [])];
  };
}
