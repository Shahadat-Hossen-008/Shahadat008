"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { NavLinkItem } from "@/components/nav-link";
import { SocialLinks } from "@/components/social-links";
import { urlFor } from "@/sanity/lib/image";
import type { IHeaderProps } from "./interface";

const DESKTOP_LINK_BASE_CLASS =
  "header-nav-link font-sans text-[15px] transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground rounded-xs";

const DESKTOP_CTA_CLASS =
  "inline-flex items-center justify-center rounded-full bg-forest px-6 py-2.5 font-sans text-[15px] font-medium text-limestone transition-colors duration-200 hover:bg-soft-forest focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest";

const MOBILE_LINK_BASE_CLASS =
  "mobile-nav-link group flex items-center justify-between py-4 px-2 font-sans text-lg transition-colors duration-200 border-b border-foreground/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground rounded-xs";

const MOBILE_CTA_CLASS =
  "mt-6 inline-flex w-full items-center justify-center rounded-full bg-forest px-6 py-3.5 font-sans text-base font-medium text-limestone transition-colors duration-200 hover:bg-soft-forest focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest";

function normalizeRoutePath(raw: string): string {
  const withoutQueryOrHash = raw.split(/[?#]/)[0]?.trim() ?? "";
  if (!withoutQueryOrHash.startsWith("/")) return "";
  const trimmed = withoutQueryOrHash.replace(/\/+$/, "");
  if (trimmed === "" || trimmed === "/") return "/";
  if (trimmed === "/blog" || trimmed.startsWith("/blog/")) {
    return `/blogs${trimmed.slice("/blog".length)}`;
  }
  if (trimmed === "/project" || trimmed.startsWith("/project/")) {
    return `/projects${trimmed.slice("/project".length)}`;
  }
  return trimmed;
}

/**
 * Determines whether a navigation link matches the current pathname.
 *
 * - `/` matches only the root `/` route.
 * - Top-level section routes (`/projects`, `/blogs`, `/about`, `/contact`)
 *   match both the index route and nested detail routes (`/projects/[slug]`,
 *   `/blogs/[slug]`) strictly on `/` segment boundaries so similar prefixes
 *   (e.g. `/projects-archive`) never false-match.
 */
export function isNavLinkActive(
  pathname: string | null | undefined,
  linkHref: string | null | undefined,
): boolean {
  if (!pathname || !linkHref) return false;

  const current = normalizeRoutePath(pathname);
  const target = normalizeRoutePath(linkHref);

  if (!current || !target) return false;
  if (target === "/") {
    return current === "/";
  }

  return current === target || current.startsWith(`${target}/`);
}

export function Header({
  siteTitle,
  logo,
  hasLogoImage,
  navLinks,
  cta,
  showSocialLinks,
  socialLinks,
}: IHeaderProps) {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleButtonRef = useRef<HTMLButtonElement | null>(null);
  const drawerPanelRef = useRef<HTMLElement | null>(null);

  const closeMenu = () => setIsMenuOpen(false);

  // Lock background scrolling, handle Escape, and contain Tab focus while the mobile drawer is open
  useEffect(() => {
    if (!isMenuOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
        toggleButtonRef.current?.focus();
        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      const panel = drawerPanelRef.current;
      if (!panel || !panel.contains(document.activeElement)) {
        return;
      }

      const links = panel.querySelectorAll<HTMLAnchorElement>("a[href]");
      if (links.length === 0) {
        return;
      }

      const firstLink = links[0];
      const lastLink = links[links.length - 1];

      if (event.shiftKey) {
        if (document.activeElement === firstLink) {
          event.preventDefault();
          lastLink?.focus();
        }
      } else if (document.activeElement === lastLink) {
        event.preventDefault();
        firstLink?.focus();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isMenuOpen]);

  const logoDimensions = logo?.imageFile?.asset?.metadata?.dimensions;
  const logoWidth =
    logoDimensions?.width && logoDimensions.width > 0
      ? Math.round(logoDimensions.width)
      : 120;
  const logoHeight =
    logoDimensions?.height && logoDimensions.height > 0
      ? Math.round(logoDimensions.height)
      : 40;

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Top Section: Persistent Header Bar (Logo on left, Nav / #nav-icon3 on right) */}
      <div
        className={`relative z-60 w-full transition-colors duration-200 ${
          isMenuOpen
            ? "bg-background border-b border-foreground/12"
            : "bg-background/90 backdrop-blur-md"
        }`}
      >
        <div className="mx-auto flex w-full max-w-page items-center justify-between px-4 py-4 sm:px-6 lg:px-8 lg:py-6">
          {/* Left: Portfolio Logo */}
          <div className="flex items-center shrink-0">
            {hasLogoImage ? (
              <Link
                href="/"
                onClick={closeMenu}
                aria-label={logo?.altText || siteTitle || "Home"}
                className="inline-flex items-center shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground rounded-sm"
              >
                <Image
                  src={urlFor(logo!.imageFile!)
                    .width(240)
                    .fit("max")
                    .auto("format")
                    .url()}
                  alt={logo?.altText || siteTitle || "Logo"}
                  width={logoWidth}
                  height={logoHeight}
                  className="h-9 sm:h-10 w-auto object-contain"
                />
              </Link>
            ) : (
              siteTitle && (
                <Link
                  href="/"
                  onClick={closeMenu}
                  className="inline-flex items-center font-mono text-lg sm:text-xl font-bold tracking-tight text-foreground transition-opacity duration-200 hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground rounded-sm"
                >
                  {siteTitle}
                </Link>
              )
            )}
          </div>

          {/* Right: All Desktop Navigation Items + Resume CTA + Mobile Toggle */}
          <div className="flex items-center justify-end gap-7 xl:gap-8">
            {navLinks.length > 0 && (
              <nav
                aria-label="Main"
                className="hidden lg:flex items-center gap-7 xl:gap-8"
              >
                {navLinks.map((link) => {
                  const active = isNavLinkActive(pathname, link.href);

                  return (
                    <NavLinkItem
                      key={link._key ?? link.label}
                      link={link}
                      isActive={active}
                      className={`${DESKTOP_LINK_BASE_CLASS} ${
                        active
                          ? "font-semibold text-foreground"
                          : "font-medium text-foreground/85 hover:text-foreground"
                      }`}
                    />
                  );
                })}
              </nav>
            )}

            {showSocialLinks && (
              <SocialLinks
                links={socialLinks}
                className="hidden lg:flex items-center gap-4"
              />
            )}

            {cta?.href && !cta.isDisabled && (
              <div className="hidden lg:block">
                <NavLinkItem link={cta} className={DESKTOP_CTA_CLASS} />
              </div>
            )}

            {/* Mobile Four-Line Hamburger Button (#nav-icon3) stays in place in the top bar */}
            <button
              ref={toggleButtonRef}
              type="button"
              id="nav-icon3"
              data-testid="mobile-menu-toggle"
              aria-label={
                isMenuOpen ? "Close navigation menu" : "Open navigation menu"
              }
              aria-expanded={isMenuOpen}
              aria-controls="mobile-navigation-panel"
              onClick={() => setIsMenuOpen((open) => !open)}
              className={`nav-icon3 relative z-60 inline-flex size-11 items-center justify-center rounded-full text-foreground lg:hidden cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground ${
                isMenuOpen ? "open" : ""
              }`}
            >
              <span aria-hidden="true" className="nav-icon3-bars">
                <span />
                <span />
                <span />
                <span />
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Section Viewport: Clipped container directly below the header bar to prevent horizontal overflow while closed */}
      <div className="pointer-events-none absolute top-full inset-x-0 z-50 h-[calc(100dvh-4.75rem)] overflow-hidden lg:hidden">
        {/* Backdrop Scrim */}
        <div
          aria-hidden="true"
          data-testid="mobile-menu-backdrop"
          onClick={closeMenu}
          className={`mobile-nav-backdrop absolute inset-0 z-40 bg-forest/25 backdrop-blur-xs ${
            isMenuOpen
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }`}
        />

        {/* Complete Navigation Drawer Container: Slides as one unit from translateX(100%) to translateX(0) */}
        <aside
          ref={drawerPanelRef}
          id="mobile-navigation-panel"
          data-testid="mobile-navigation-panel"
          data-open={isMenuOpen ? "true" : "false"}
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
          aria-hidden={!isMenuOpen}
          inert={!isMenuOpen ? true : undefined}
          className={`mobile-nav-panel absolute top-0 right-0 z-50 flex h-full w-full sm:max-w-sm flex-col justify-between overflow-y-auto bg-surface px-6 pt-6 pb-10 shadow-2xl border-l border-foreground/10 ${
            isMenuOpen ? "pointer-events-auto" : "pointer-events-none"
          }`}
        >
          <nav aria-label="Mobile" className="flex flex-col">
            {navLinks.map((link) => {
              const active = isNavLinkActive(pathname, link.href);

              return (
                <NavLinkItem
                  key={link._key ?? link.label}
                  link={{ ...link, openInNewTab: false }}
                  isActive={active}
                  className={`${MOBILE_LINK_BASE_CLASS} ${
                    active
                      ? "font-semibold text-foreground"
                      : "font-medium text-foreground/85 hover:text-foreground"
                  }`}
                  onNavigate={closeMenu}
                >
                  <span className="mobile-nav-link-text">{link.label}</span>
                  <span
                    aria-hidden="true"
                    className={`transition-transform duration-200 group-hover:translate-x-1 ${
                      active ? "text-foreground" : "text-muted-foreground/70"
                    }`}
                  >
                    →
                  </span>
                </NavLinkItem>
              );
            })}

            {cta?.href && !cta.isDisabled && (
              <NavLinkItem
                link={cta}
                className={MOBILE_CTA_CLASS}
                onNavigate={closeMenu}
              />
            )}
          </nav>

          {showSocialLinks && (
            <SocialLinks
              links={socialLinks}
              variant="circle"
              className="flex flex-wrap items-center gap-3 pt-6 border-t border-foreground/10"
            />
          )}
        </aside>
      </div>
    </header>
  );
}

export default Header;
