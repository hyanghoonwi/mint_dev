"use client";

// 스크롤 방향(올리면 보임·내리면 숨김)을 상태로 가져서 클라이언트 컴포넌트다.
// 출처: Figma `Header Desktop`(2462:121821·121833)·`Header Mobile`(2462:121848·121854)·`Header Guidelines`(2462:121862).
// Figma는 Desktop·Mobile을 따로 두지만 코드는 하나다. 같은 내용을 CSS(`tablet:`)로 펼치거나 햄버거로 접어서
// 화면 폭에 맞는 하나만 보인다(JS로 화면 폭을 읽지 않으므로 서버·브라우저 결과가 같다).
// 라우팅: core는 next/link를 import하지 않는다. 링크가 필요한 곳(로고·메뉴·로그인·프로필·햄버거)은 모두
// `linkComponent`(예: Next.js `Link`)로 그리고, 생략하면 `<a>`다. 현재 위치(`active`)는 사용하는 쪽이 라우터에서 계산해 넘긴다.
import {
  useEffect,
  useRef,
  useState,
  type ComponentProps,
  type ElementType,
  type ReactNode,
} from "react";
import { cn } from "../../utils/cn";
import { Avatar } from "../avatar/Avatar";
import { ListIcon } from "../icon/icons.generated";
import { IconButton } from "../icon-button/IconButton";
import { TextButton } from "../text-button/TextButton";

/** 메뉴 항목 하나 */
export interface HeaderItem {
  /** 메뉴 이름 */
  label: string;
  /** 이동할 주소 */
  href: string;
  /** 현재 위치면 `true`. 흰 글자로 보이고 `aria-current="page"`가 붙는다 */
  active?: boolean;
}

/** 로그인한 사용자의 프로필(오른쪽 영역) */
export interface HeaderProfile {
  /** 프로필 이미지 주소. 없으면 `name`의 첫 글자 */
  src?: string;
  /** 이름. 이미지가 없을 때 첫 글자를 보여 주고, 스크린리더에 읽힌다 */
  name?: string;
  /** 새 알림이 있으면 `true`. 프로필 오른쪽 위에 파란 점이 달린다 */
  badge?: boolean;
  /** 프로필을 누르면 이동할 주소(마이페이지). `onClick`과 함께 쓰지 않는다 */
  href?: string;
  /** 이동이 아니라 동작이면(예: 프로필 메뉴 열기) 이것을 넘긴다 */
  onClick?: () => void;
}

export interface HeaderProps extends Omit<ComponentProps<"header">, "children"> {
  /** 메뉴. 6개까지 한 줄에 맞게 디자인되어 있다. 화면이 좁으면 햄버거 뒤로 접힌다 */
  items: HeaderItem[];
  /** 스크롤을 내리면 가려지고 올리면 다시 보이게 한다(sticky). 기본 `true`. `false`면 항상 보인다 */
  hideOnScroll?: boolean;
  /** 로그인 버튼을 누르면 이동할 주소 */
  loginHref?: string;
  /** 로그인 버튼 문구. 기본 `로그인` */
  loginLabel?: string;
  /** 로고(필수). `<img>`·`<svg>` 등. 높이 32px 안에서 보인다 */
  logo: ReactNode;
  /** 로고를 누르면 이동할 주소. 기본 `/` */
  logoHref?: string;
  /** 로고 링크의 스크린리더 이름. 기본 `홈` */
  logoLabel?: string;
  /** 모바일 햄버거를 누르면 이동할 주소(메뉴 화면). 메뉴 화면은 Header 범위 밖이다 */
  menuHref?: string;
  /** 햄버거 버튼의 스크린리더 이름. 기본 `메뉴` */
  menuLabel?: string;
  /** `member`일 때 보일 프로필 */
  profile?: HeaderProfile;
  /** `guest`는 로그인 버튼, `member`는 프로필. 기본 `guest` */
  user?: "guest" | "member";
  /** 링크를 그릴 컴포넌트(예: Next.js `Link`). 모든 링크에 쓰이고 생략하면 `<a>` */
  linkComponent?: ElementType;
  /** 로그인 버튼을 눌렀을 때(모달을 여는 등). `loginHref`와 함께 써도 된다 */
  onLoginClick?: () => void;
  /** 모바일 햄버거를 눌렀을 때. `menuHref` 대신 직접 메뉴를 열 때 쓴다 */
  onMenuClick?: () => void;
}

// 이 위치보다 위에서는 방향과 관계없이 항상 보인다(px)
const REVEAL_ZONE = 80;
// 흔들림을 걸러내는 최소 이동량(px)
const SCROLL_THRESHOLD = 8;

const focusOnDark = "focus-visible:outline-fill-white";

/** 서비스 맨 위에 고정되는 글로벌 내비게이션. 768px부터 메뉴를 펼치고, 그보다 좁으면 햄버거로 접는다 */
export function Header({
  items,
  hideOnScroll = true,
  loginHref,
  loginLabel = "로그인",
  logo,
  logoHref = "/",
  logoLabel = "홈",
  menuHref,
  menuLabel = "메뉴",
  profile,
  user = "guest",
  linkComponent,
  onLoginClick,
  onMenuClick,
  className,
  ...props
}: HeaderProps) {
  const Link = linkComponent ?? "a";
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    if (!hideOnScroll) return;
    lastScrollY.current = window.scrollY;
    const onScroll = () => {
      const current = window.scrollY;
      const delta = current - lastScrollY.current;
      if (current < REVEAL_ZONE) {
        setHidden(false);
      } else if (Math.abs(delta) >= SCROLL_THRESHOLD) {
        setHidden(delta > 0);
      } else {
        return;
      }
      lastScrollY.current = current;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [hideOnScroll]);

  const loginClasses = cn(
    "inline-flex h-8 shrink-0 cursor-pointer items-center justify-center rounded-full bg-fill-brand px-3 font-mint text-label-3-medium whitespace-nowrap text-text-on-fill transition-colors hover:bg-fill-brand-pressed active:bg-fill-brand-pressed focus-visible:outline-2 focus-visible:outline-offset-2",
    "tablet:h-10 tablet:px-4 tablet:text-label-2-medium",
    focusOnDark,
  );

  const profileAvatar = (
    <span className="relative block size-10">
      <Avatar size={40} src={profile?.src} name={profile?.name} />
      {profile?.badge && (
        // Figma Avatar Push Badge(Dot, Medium): 8px, 흰 테두리 1.5px, 오른쪽 위
        <span
          aria-hidden="true"
          className="absolute top-[-1px] right-0 size-2 rounded-full border-[1.5px] border-solid border-fill-white bg-fill-brand"
        />
      )}
    </span>
  );
  const profileLabel = profile?.name
    ? `${profile.name}${profile.badge ? ", 새 알림" : ""}`
    : profile?.badge
      ? "프로필, 새 알림"
      : "프로필";
  const profileClasses = cn(
    "relative block shrink-0 cursor-pointer rounded-full focus-visible:outline-2 focus-visible:outline-offset-2",
    focusOnDark,
  );

  return (
    <header
      className={cn(
        // 바깥 칸은 클릭을 가로채지 않는다(알약만 누를 수 있다). 여백: 모바일은 알약 폭을 %로 정해(아래 nav) 따로 없고, 태블릿 20, 데스크톱 64(spacing-20 · 64)
        "pointer-events-none sticky top-0 z-40 flex w-full min-w-[240px] justify-center px-0 pt-4 pb-2 transition-transform duration-300 ease-out motion-reduce:transition-none",
        "tablet:px-5 tablet:pt-8 tablet:pb-4 desktop:px-16",
        // 가려져 있어도 키보드 포커스가 안으로 들어오면 다시 보인다
        hidden && hideOnScroll ? "-translate-y-full focus-within:translate-y-0" : "translate-y-0",
        className,
      )}
      {...props}
    >
      <nav
        aria-label="주요 메뉴"
        className="pointer-events-auto flex h-14 w-[89.3333%] items-center gap-1 rounded-full bg-fill-alpha-900 pr-2 pl-5 shadow-floating tablet:w-fit tablet:gap-2 tablet:pr-3"
      >
        <Link
          href={logoHref}
          aria-label={logoLabel}
          className={cn(
            "flex h-8 flex-1 items-center rounded-8 focus-visible:outline-2 focus-visible:outline-offset-2 tablet:mr-3 tablet:flex-none",
            focusOnDark,
          )}
        >
          {logo}
        </Link>

        {/* 메뉴: 768px부터 펼쳐 보이고 그보다 좁으면 숨긴다(CSS) */}
        <ul className="m-0 hidden list-none items-center gap-4 p-0 pr-2 tablet:flex">
          {items.map((item) => (
            // 주소가 같은 메뉴(`#` 등)가 있어도 겹치지 않게 이름까지 키에 넣는다
            <li key={`${item.href}|${item.label}`}>
              <TextButton
                href={item.href}
                linkComponent={linkComponent}
                color="inverse"
                aria-current={item.active ? "page" : undefined}
                className={cn("rounded-full", item.active && "text-text-on-fill", focusOnDark)}
              >
                {item.label}
              </TextButton>
            </li>
          ))}
        </ul>

        {user === "member" ? (
          profile?.href !== undefined ? (
            <Link
              href={profile.href}
              aria-label={profileLabel}
              onClick={profile.onClick}
              className={profileClasses}
            >
              {profileAvatar}
            </Link>
          ) : (
            <button
              type="button"
              aria-label={profileLabel}
              onClick={profile?.onClick}
              className={profileClasses}
            >
              {profileAvatar}
            </button>
          )
        ) : loginHref !== undefined ? (
          <Link href={loginHref} onClick={onLoginClick} className={loginClasses}>
            {loginLabel}
          </Link>
        ) : (
          <button type="button" onClick={onLoginClick} className={loginClasses}>
            {loginLabel}
          </button>
        )}

        {/* 햄버거: 768px 미만에서만. 드롭다운 없이 메뉴 화면으로 들어간다 */}
        {menuHref !== undefined ? (
          <Link
            href={menuHref}
            aria-label={menuLabel}
            onClick={onMenuClick}
            className={cn(
              "inline-flex size-10 shrink-0 items-center justify-center rounded-full text-icon-on-fill transition-colors hover:bg-fill-white/12 active:bg-fill-white/12 focus-visible:outline-2 focus-visible:outline-offset-2 tablet:hidden [&_svg]:size-5",
              focusOnDark,
            )}
          >
            <ListIcon />
          </Link>
        ) : (
          <IconButton
            icon={<ListIcon />}
            aria-label={menuLabel}
            onClick={onMenuClick}
            className={cn(
              "text-icon-on-fill hover:bg-fill-white/12 active:bg-fill-white/12 tablet:hidden",
              focusOnDark,
            )}
          />
        )}
      </nav>
    </header>
  );
}
