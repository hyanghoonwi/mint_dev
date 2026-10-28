import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * 타이포 토큰(styles/typography.css의 `--text-*`)이 만드는 `text-title-1-bold`, `text-caption-1-regular` 같은 유틸리티 이름.
 * tailwind-merge는 이 이름을 모르면 글자 색(`text-text-caption`)과 같은 그룹으로 보고 앞의 것을 지워 버린다.
 * 그래서 글자 크기(font-size) 그룹으로 등록한다. 이름 규칙은 `<역할>-<번호>-<웨이트>`라서 목록 대신 규칙으로 알아본다.
 * 역할이나 웨이트가 늘어나면 이 정규식도 고친다.
 */
const TYPOGRAPHY_TOKEN =
  /^(display|title|heading|body|label|caption)-\d-(regular|medium|semibold|bold)$/;

/**
 * 반경 토큰(styles/shape.css의 `--radius-*`)이 만드는 `rounded-8`, `rounded-12` 같은 이름.
 * tailwind-merge는 `rounded-md` 같은 이름만 알아서, 이 숫자 이름을 모르면 `rounded-8 rounded-12`를 둘 다 남긴다.
 * 색·폰트 패밀리 토큰은 따로 등록하지 않아도 알아본다. 반경 값이 늘어나도 숫자 규칙이라 그대로 동작한다.
 */
const RADIUS_TOKEN = /^\d+$/;

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [{ text: [(value: string) => TYPOGRAPHY_TOKEN.test(value)] }],
      rounded: [{ rounded: [(value: string) => RADIUS_TOKEN.test(value)] }],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
