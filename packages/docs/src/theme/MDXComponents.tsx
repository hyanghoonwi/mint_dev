import MDXComponents from "@theme-original/MDXComponents";
import Example from "@site/src/components/Example";

// 모든 문서에서 import 없이 <Example name="..." />를 쓸 수 있게 한다
export default { ...MDXComponents, Example };
