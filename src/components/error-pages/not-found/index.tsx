import Link from "next/link";
import { IoHome } from "react-icons/io5";

import type { INotFoundViewProps } from "./interface";

/**
 * 404 Not Found editorial view with one-shot SVG arc drawing animation:
 * - Start dot `(24, 146)` is stationary and visible immediately from the first frame.
 * - Arc path (`length = 415.42`) draws from `(24, 146)` to `(296, 114)` over 0–3s via pure CSS.
 * - End mint dot `(296, 114)` appears right at the endpoint when the 3s line draw completes.
 * - Headline & description fade/move up at 0.5–1.3s.
 * - `404` watermark fades in behind the illustration at 1.0–1.8s to `0.03` opacity.
 */
export function NotFoundView({
  homeHref = "/",
  projectsHref = "/projects",
}: INotFoundViewProps) {
  return (
    <section
      aria-labelledby="error-404-heading"
      className="relative flex min-h-[calc(100svh-10rem)] w-full items-center justify-center overflow-hidden bg-background px-4 py-20 sm:px-6 sm:py-28 lg:px-8 text-foreground"
    >
      <div className="mx-auto flex w-full max-w-2xl flex-col items-center text-center">
        {/* Arc Illustration + 404 Watermark Stack */}
        <div
          aria-hidden="true"
          className="relative mb-10 sm:mb-12 flex items-center justify-center w-full max-w-[20rem] sm:max-w-88 h-36 sm:h-44"
        >
          <span
            data-testid="error-404-watermark"
            className="error-watermark absolute inset-0 flex items-center justify-center font-display text-[6.75rem] sm:text-[8.25rem] font-normal leading-none tracking-tight text-foreground"
          >
            404
          </span>

          <svg
            viewBox="0 0 320 168"
            fill="none"
            className="relative z-10 w-full h-auto overflow-visible"
          >
            <path
              data-testid="error-404-arc-path"
              d="M 24 146 C 68 146, 86 18, 134 18 C 186 18, 218 146, 266 146 C 282 146, 294 134, 296 114"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              className="error-arc-path text-foreground"
            />
            <circle
              data-testid="error-404-start-dot"
              cx="24"
              cy="146"
              r="3.25"
              className="error-arc-start-dot fill-foreground"
            />
            <circle
              data-testid="error-404-end-dot"
              cx="296"
              cy="114"
              r="4.25"
              className="error-arc-end-dot fill-mint"
            />
          </svg>
        </div>

        {/* Animated Editorial Content (0.5–1.3s) */}
        <div className="error-404-content flex flex-col items-center">
          <p className="font-sans text-[11px] sm:text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            404 — PAGE NOT FOUND
          </p>

          <h1
            id="error-404-heading"
            className="mt-5 font-display text-4xl sm:text-5xl lg:text-[3.5rem] font-bold leading-[1.06] tracking-tight text-balance text-foreground"
          >
            This page took a
            <em className="mt-1 block font-display font-normal italic">
              different path.
            </em>
          </h1>

          <p className="mt-6 max-w-md font-sans text-base sm:text-lg leading-relaxed text-muted-foreground text-pretty">
            The page you are looking for may have moved, or the link might be
            outdated. Let&apos;s get you back on track.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 sm:gap-8">
            <Link
              href={homeHref}
              className="inline-flex items-center justify-center gap-2.5 rounded-full bg-foreground text-background px-7 py-3.5 font-sans text-xs font-semibold uppercase tracking-[0.18em] transition-opacity duration-200 hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
            >
              <span>BACK TO HOME</span>
              <IoHome aria-hidden="true" className="text-sm" />
            </Link>

            <Link
              href={projectsHref}
              className="group inline-flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-foreground py-2 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground"
            >
              <span className="border-b border-foreground/35 pb-1 transition-colors duration-200 group-hover:border-foreground">
                EXPLORE PROJECTS
              </span>
              <span
                aria-hidden="true"
                className="transition-transform duration-200 group-hover:translate-x-1"
              >
                →
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default NotFoundView;
