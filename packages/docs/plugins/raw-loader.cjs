// 파일 내용을 그대로 문자열로 내보내는 webpack 로더.
// 예시 파일의 "코드 블록에 보여 줄 원본"을 가져오는 데 쓴다(remark-example.ts가 import에 인라인으로 지정한다).
module.exports = function rawLoader(source) {
  return `export default ${JSON.stringify(source)};`;
};
