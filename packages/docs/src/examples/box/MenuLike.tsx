import { Box, Text } from "@futurewiz-rms/mint";

export default function MenuLike() {
  return (
    // Menu의 겉 상자도 Box예요: 테두리(outline) · 모서리 12 · 넘침 잘라냄 + 흰 배경 토큰
    <Box tone="outline" radius={12} overflow="hidden" className="w-[240px] bg-fill-white">
      <Box radius={0} padding={8}>
        <Box radius={8} padding={8} className="bg-fill-brand-weak">
          <Text variant="label-2-semibold" color="brand">
            최신순
          </Text>
        </Box>
        <Box radius={8} padding={8}>
          <Text variant="body-4-medium">인기순</Text>
        </Box>
      </Box>
      <Box
        radius={0}
        direction="horizontal"
        align="center"
        justify="between"
        className="h-[52px] border-t border-border-default px-3"
      >
        <Text variant="label-3-medium" color="secondary">
          초기화
        </Text>
        <Text variant="label-3-medium" color="brand">
          적용
        </Text>
      </Box>
    </Box>
  );
}
