import { addons } from "storybook/manager-api";
import { create } from "storybook/theming";

const theme = create({
  base: "light",
  brandTitle: "MINT",
  brandTarget: "_self",

  colorPrimary: "#00856F",
  colorSecondary: "#00856F",

  appBg: "#F9FAFB",
  appContentBg: "#FFFFFF",
  appPreviewBg: "#FFFFFF",
  appBorderColor: "#E5E8EB",
  appBorderRadius: 8,

  fontBase: '"Pretendard Variable", Pretendard, -apple-system, BlinkMacSystemFont, sans-serif',
  fontCode: "ui-monospace, SFMono-Regular, Menlo, monospace",

  textColor: "#191F28",
  textInverseColor: "#FFFFFF",
  textMutedColor: "#4E5968",

  barTextColor: "#4E5968",
  barSelectedColor: "#00856F",
  barHoverColor: "#00856F",
  barBg: "#FFFFFF",

  buttonBg: "#F9FAFB",
  buttonBorder: "#E5E8EB",
  booleanBg: "#F2F4F6",
  booleanSelectedBg: "#00856F",

  inputBg: "#FFFFFF",
  inputBorder: "#E5E8EB",
  inputTextColor: "#191F28",
  inputBorderRadius: 8,
});

addons.setConfig({
  theme,
  sidebar: {
    showRoots: false,
  },
});
