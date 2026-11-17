import { Button, EnvelopeIcon, MagnifyingGlassIcon, Text, TextField } from "@futurewiz-rms/mint";

export default function Adornments() {
  return (
    // leftAddon · rightAddon은 ReactNode예요. 아이콘은 20px로 맞춰지고, 글자·버튼은 여러 개(<>…</>)도 넘길 수 있어요
    <>
      <TextField label="검색" placeholder="코인 이름" leftAddon={<MagnifyingGlassIcon />} />
      <TextField
        label="인증번호"
        placeholder="6자리"
        rightAddon={
          <>
            <Text variant="body-4-medium" color="secondary">
              03:00
            </Text>
            <Button color="secondary" size="sm">
              재전송
            </Button>
          </>
        }
      />
      <TextField label="이메일" placeholder="mint@example.com" rightAddon={<EnvelopeIcon />} />
    </>
  );
}
