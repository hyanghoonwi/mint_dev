import { Pagination } from "@futurewiz-rms/mint";

export default function Responsive() {
  return (
    // 모바일·태블릿은 7칸(compact), 데스크톱(1024px~)부터 9칸(extended)
    <Pagination
      page={6}
      total={99}
      variant={{ base: "compact", desktop: "extended" }}
      getHref={(page) => `?page=${page}`}
    />
  );
}
