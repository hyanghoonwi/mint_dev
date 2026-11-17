import { Text, Thumbnail } from "@futurewiz-rms/mint";

export default function Overlay() {
  return (
    <Thumbnail
      radius
      overlay
      overlayColor="rgba(0, 0, 0, 0.4)"
      aspectRatio="16:9"
      alt=""
      style={{ width: "100%", maxWidth: 320 }}
    >
      <Text
        variant="heading-3-semibold"
        color="on-fill"
        as="p"
        style={{ position: "absolute", left: 16, bottom: 16 }}
      >
        비트코인 ETF 순유입 지속
      </Text>
    </Thumbnail>
  );
}
