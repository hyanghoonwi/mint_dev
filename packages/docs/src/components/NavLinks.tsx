// 헤더 오른쪽의 바로가기 아이콘: Storybook · GitHub. 검색(돋보기) 왼쪽에 놓인다.
// Storybook 주소는 빌드할 때 STORYBOOK_URL로 정한다. Docker 이미지는 같은 서버의 `/storybook/`으로,
// 지정하지 않으면(로컬 개발) `npm run storybook`이 띄우는 http://localhost:6006으로 간다.
const storybookUrl = process.env.STORYBOOK_URL ?? "http://localhost:6006";
const githubUrl = "https://github.com/futurewiz-rms/cryptolabs-design-system";

function StorybookIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3.5" y="3.5" width="17" height="17" rx="4" stroke="currentColor" strokeWidth="2" />
      <path
        d="M15 8.6c-.5-.9-1.5-1.4-2.9-1.4-1.6 0-2.8.8-2.8 2.1 0 3 5.6 1.5 5.6 4.4 0 1.4-1.3 2.3-3 2.3-1.5 0-2.6-.6-3.2-1.6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function GithubIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23a11.5 11.5 0 0 1 3.003-.404c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222 0 1.606-.015 2.896-.015 3.286 0 .321.216.694.825.576C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

export function NavLinks() {
  return (
    <>
      <a
        className="docs-icon-link"
        href={storybookUrl}
        target="_blank"
        rel="noreferrer"
        aria-label="Storybook 열기"
        title="Storybook"
      >
        <StorybookIcon />
      </a>
      <a
        className="docs-icon-link"
        href={githubUrl}
        target="_blank"
        rel="noreferrer"
        aria-label="GitHub 저장소 열기"
        title="GitHub"
      >
        <GithubIcon />
      </a>
    </>
  );
}
