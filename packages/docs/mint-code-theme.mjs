// 코드 블록 색(shiki 테마). 시안처럼 라이트·다크 모두 어두운 배경을 쓴다.
/** @type {import("shiki").ThemeRegistrationRaw} */
export const mintCodeTheme = {
  name: "mint",
  type: "dark",
  colors: { "editor.background": "#07100D", "editor.foreground": "#E6F2EC" },
  tokenColors: [
    { settings: { foreground: "#E6F2EC" } },
    {
      scope: ["comment", "punctuation.definition.comment"],
      settings: { foreground: "#6E887E", fontStyle: "italic" },
    },
    {
      scope: ["keyword", "storage", "storage.type", "storage.modifier", "keyword.control"],
      settings: { foreground: "#F08CC0" },
    },
    {
      scope: ["string", "string.quoted", "punctuation.definition.string", "string.template"],
      settings: { foreground: "#3BE3A6" },
    },
    {
      scope: [
        "entity.name.tag",
        "support.class.component",
        "entity.name.type",
        "entity.name.class",
        "entity.name.function",
        "support.function",
        "meta.function-call entity.name.function",
      ],
      settings: { foreground: "#6CB6FF" },
    },
    {
      scope: [
        "entity.other.attribute-name",
        "variable.other.property",
        "variable.other.object.property",
        "meta.object-literal.key",
      ],
      settings: { foreground: "#E6F2EC" },
    },
    {
      scope: ["constant.numeric", "constant.language", "variable.other.constant", "constant.other"],
      settings: { foreground: "#F5C26B" },
    },
    {
      scope: ["punctuation", "meta.brace", "keyword.operator", "meta.tag punctuation"],
      settings: { foreground: "#A9C2B8" },
    },
  ],
};
