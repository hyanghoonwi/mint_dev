import type { PrismTheme } from "prism-react-renderer";

// 문서의 코드 블록 색. 코드 블록은 라이트·다크 모두 어두운 배경을 쓴다.
export const mintPrismTheme: PrismTheme = {
  plain: { color: "#E6F2EC", backgroundColor: "#07100D" },
  styles: [
    {
      types: ["comment", "prolog", "doctype", "cdata"],
      style: { color: "#6E887E", fontStyle: "italic" },
    },
    { types: ["keyword", "operator.arrow", "module"], style: { color: "#F08CC0" } },
    { types: ["string", "attr-value", "template-string", "char"], style: { color: "#3BE3A6" } },
    { types: ["tag", "class-name", "maybe-class-name", "function"], style: { color: "#6CB6FF" } },
    { types: ["attr-name", "property"], style: { color: "#E6F2EC" } },
    { types: ["number", "boolean", "constant"], style: { color: "#F5C26B" } },
    { types: ["punctuation", "operator"], style: { color: "#A9C2B8" } },
  ],
};
