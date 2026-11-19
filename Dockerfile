# docs 사이트와 Storybook을 한 이미지(nginx)에 담는다. docs는 `/`, Storybook은 `/storybook/`.
# docs는 정적 파일로 내보낸다(DOCS_EXPORT=1 → packages/docs/out). Node 서버가 필요 없다.

FROM node:22-alpine AS builder
WORKDIR /app

# 의존성 설치는 소스보다 먼저 해서, 소스만 바뀌면 설치 단계를 캐시로 건너뛴다
COPY package.json package-lock.json ./
COPY packages/core/package.json packages/core/
COPY packages/docs/package.json packages/docs/
COPY packages/storybook/package.json packages/storybook/
RUN npm ci

COPY . .

# docs 헤더의 "Storybook" 아이콘을 같은 서버의 /storybook/으로 연결한다(로컬 개발은 http://localhost:6006)
ENV STORYBOOK_URL=/storybook/
# docs 빌드가 core를 먼저 빌드하고(prebuild) 끝나면 검색 색인을 만든다(postbuild)
RUN DOCS_EXPORT=1 npm run build -w @mint/docs
RUN npm run build-storybook

FROM nginx:1.27-alpine AS runner
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/packages/docs/out /usr/share/nginx/html
COPY --from=builder /app/packages/storybook/storybook-static /usr/share/nginx/html/storybook

ENV TZ=Asia/Seoul
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s CMD wget -q --spider http://127.0.0.1/ || exit 1
