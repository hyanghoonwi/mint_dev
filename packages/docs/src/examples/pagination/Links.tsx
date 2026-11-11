import Link from "next/link";
import { Pagination } from "@futurewiz-rms/mint";

// 서버 컴포넌트에서 주소의 ?page=로 페이지를 바꿔요(page.tsx의 searchParams로 받은 값을 넘겨요)
export default function Links() {
  const page = 6;

  return <Pagination page={page} total={99} getHref={(p) => `?page=${p}`} linkComponent={Link} />;
}
