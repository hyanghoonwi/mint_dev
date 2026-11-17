import { Box, Switch } from "@futurewiz-rms/mint";

export default function States() {
  return (
    <Box gap={16}>
      <Switch defaultChecked>알림 받기</Switch>
      <Switch>다크 모드</Switch>
      <Switch defaultChecked disabled>
        자동 로그인
      </Switch>
      <Switch disabled>마케팅 정보 받기</Switch>
    </Box>
  );
}
