import Link from "next/link";

export const metadata = { title: "페이지를 찾을 수 없어요" };

export default function NotFound() {
  return (
    <div style={{ padding: "96px 24px", textAlign: "center" }}>
      <h1>페이지를 찾을 수 없어요</h1>
      <p>
        <Link href="/">소개로 돌아가기</Link>
      </p>
    </div>
  );
}
