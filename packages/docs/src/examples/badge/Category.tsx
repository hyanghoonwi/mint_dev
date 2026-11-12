import { Badge, Text } from "@futurewiz-rms/mint";

const posts = [
  { title: "비트코인 단기 상승 신호", category: "시그널", color: "teal" },
  { title: "11월 시장 동향 정리", category: "리포트", color: "violet" },
  { title: "신규 가입 에어드랍", category: "이벤트", color: "pink" },
] as const;

export default function Category() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, width: 280 }}>
      {posts.map((post) => (
        <div key={post.title} style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Badge variant="weak" color={post.color} size="sm">
            {post.category}
          </Badge>
          <Text variant="body-3-regular" color="strong">
            {post.title}
          </Text>
        </div>
      ))}
    </div>
  );
}
