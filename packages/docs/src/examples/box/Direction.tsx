import { Box, Text } from "@futurewiz-rms/mint";

export default function Direction() {
  return (
    <>
      <Box tone="outline" padding={16} gap={8} className="w-[160px]">
        <Text variant="body-4-regular">위</Text>
        <Text variant="body-4-regular">아래</Text>
      </Box>
      <Box tone="outline" direction="horizontal" align="center" padding={16} gap={8}>
        <Text variant="body-4-regular">왼쪽</Text>
        <Text variant="body-4-regular">오른쪽</Text>
      </Box>
    </>
  );
}
