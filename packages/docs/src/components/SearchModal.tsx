"use client";

// 헤더의 돋보기 버튼 → 검색 모달. ⌘K(Windows는 Ctrl+K)나 /로도 연다.
// Nextra 기본 검색(<Search>)은 결과 목록을 body 아래 포털로 띄워서 모달 안에 넣으면 모달 뒤에 가려진다.
// 그래서 같은 검색 색인(Pagefind, 빌드 뒤 /_pagefind/에 생성)을 직접 불러와 결과를 모달 안에 그린다.
// 색인은 빌드해야 생기므로 `npm run docs`(dev)에서는 검색이 동작하지 않는다(`npm run docs:preview`로 확인).
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { usePathname, useRouter } from "next/navigation";

interface Result {
  url: string;
  title: string;
  excerpt: string;
}

interface Pagefind {
  options: (options: Record<string, unknown>) => Promise<void>;
  debouncedSearch: (query: string) => Promise<{
    results: { data: () => Promise<{ url: string; excerpt: string; meta: { title?: string } }> }[];
  } | null>;
}

let pagefindPromise: Promise<Pagefind> | null = null;

/** 검색 색인을 한 번만 불러온다 */
function loadPagefind() {
  pagefindPromise ??= (async () => {
    const pagefind = (await import(
      /* webpackIgnore: true */ "/_pagefind/pagefind.js" as string
    )) as Pagefind;
    await pagefind.options({ baseUrl: "/" });
    return pagefind;
  })();
  return pagefindPromise;
}

/** 정적 내보내기에서는 주소가 .html로 끝나서 떼어 낸다 */
function cleanUrl(url: string) {
  return url.replace(/\.html$/, "").replace(/\.html#/, "#");
}

function MagnifierIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
      <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function SearchModal() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const [active, setActive] = useState(0);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");

  const open = () => {
    const dialog = dialogRef.current;
    if (!dialog || dialog.open) return;
    dialog.showModal();
    inputRef.current?.focus();
    inputRef.current?.select();
  };

  // ⌘K · Ctrl+K · / 로 연다(입력 중일 때 /는 무시)
  useEffect(() => {
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      const typing =
        event.target instanceof HTMLElement &&
        (["INPUT", "TEXTAREA", "SELECT"].includes(event.target.tagName) ||
          event.target.isContentEditable);
      const shortcut = event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey);
      if (shortcut || (event.key === "/" && !typing)) {
        event.preventDefault();
        open();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  // 다른 페이지로 이동하면 닫는다
  useEffect(() => {
    dialogRef.current?.close();
  }, [pathname]);

  // 마지막으로 보낸 검색 번호. 늦게 도착한 이전 검색 결과는 버린다
  const latest = useRef(0);

  // 입력이 바뀌면 검색한다(Pagefind가 연속 입력을 알아서 묶는다)
  const search = (value: string) => {
    setQuery(value);
    const id = ++latest.current;
    const text = value.trim();
    if (!text) {
      setResults([]);
      setStatus("idle");
      return;
    }
    setStatus("loading");
    loadPagefind()
      .then((pagefind) => pagefind.debouncedSearch(text))
      .then(async (result) => {
        if (!result || id !== latest.current) return;
        const data = await Promise.all(result.results.slice(0, 8).map((item) => item.data()));
        if (id !== latest.current) return;
        setResults(
          data.map((item) => ({
            url: cleanUrl(item.url),
            title: item.meta.title ?? item.url,
            excerpt: item.excerpt,
          })),
        );
        setActive(0);
        setStatus("idle");
      })
      .catch(() => {
        if (id === latest.current) setStatus("error");
      });
  };

  const go = (url: string) => {
    dialogRef.current?.close();
    router.push(url);
  };

  const onInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((index) => Math.min(index + 1, results.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((index) => Math.max(index - 1, 0));
    } else if (event.key === "Enter" && results[active]) {
      event.preventDefault();
      go(results[active].url);
    }
  };

  return (
    <>
      <button type="button" className="docs-search-trigger" aria-label="검색" onClick={open}>
        <MagnifierIcon />
      </button>
      <dialog
        ref={dialogRef}
        className="docs-search-modal"
        aria-label="문서 검색"
        // 바깥(어두운 배경)을 누르면 닫는다
        onClick={(event) => {
          if (event.target === event.currentTarget) event.currentTarget.close();
        }}
      >
        <div className="docs-search-modal__field">
          <MagnifierIcon />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(event) => search(event.target.value)}
            onKeyDown={onInputKeyDown}
            placeholder="검색어를 입력하세요"
            aria-label="검색어"
            aria-controls="docs-search-results"
            aria-activedescendant={results[active] ? `docs-search-${active}` : undefined}
            autoComplete="off"
            spellCheck={false}
          />
          <kbd>Esc</kbd>
        </div>
        <div className="docs-search-modal__body">
          {status === "error" ? (
            <p className="docs-search-modal__message">
              검색을 불러오지 못했어요. 검색 색인은 빌드한 뒤에 생겨요.
            </p>
          ) : status === "loading" && results.length === 0 ? (
            <p className="docs-search-modal__message">불러오는 중…</p>
          ) : query.trim() && results.length === 0 ? (
            <p className="docs-search-modal__message">검색 결과가 없어요</p>
          ) : (
            <ul id="docs-search-results" role="listbox" className="docs-search-modal__list">
              {results.map((result, index) => (
                <li
                  key={result.url}
                  id={`docs-search-${index}`}
                  role="option"
                  aria-selected={index === active}
                  className="docs-search-modal__item"
                  onMouseEnter={() => setActive(index)}
                  onClick={() => go(result.url)}
                >
                  <strong>{result.title}</strong>
                  {/* Pagefind가 만든 발췌문(검색어는 <mark>). 본문 글자를 이스케이프해서 준다 */}
                  <span dangerouslySetInnerHTML={{ __html: result.excerpt }} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </dialog>
    </>
  );
}
