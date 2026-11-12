import { Text, Thumbnail } from "@futurewiz-rms/mint";

export default function Overlay() {
  return (
    <Thumbnail
      alt=""
      aspectRatio="16:9"
      radius
      overlay
      overlayColor="rgba(0, 0, 0, 0.4)"
      style={{ width: "100%", maxWidth: 320 }}
    >
      <Text
        as="p"
        variant="heading-3-semibold"
        color="on-fill"
        style={{ position: "absolute", left: 16, bottom: 16 }}
      >
        비트코인 ETF 순유입 지속
      </Text>
    </Thumbnail>
  );
}
