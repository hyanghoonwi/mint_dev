import { Thumbnail } from "@futurewiz-rms/mint";

export default function Responsive() {
  return (
    // 모바일 1:1, 태블릿(768px~)부터 16:9
    <Thumbnail
      alt=""
      aspectRatio={{ base: "1:1", tablet: "16:9" }}
      radius
      style={{ width: "100%", maxWidth: 240 }}
    />
  );
}
