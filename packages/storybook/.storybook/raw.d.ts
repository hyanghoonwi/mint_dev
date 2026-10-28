// Vite의 `?raw` import: 파일 내용을 문자열로 가져온다 (스토리의 코드 패널에 docs 예시 원본을 보여 줄 때 쓴다)
declare module "*?raw" {
  const content: string;
  export default content;
}
