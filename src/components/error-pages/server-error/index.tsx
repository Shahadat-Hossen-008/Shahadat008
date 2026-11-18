import Link from "next/link";
import { IoRefresh } from "react-icons/io5";

import type { IServerErrorViewProps } from "./interface";

/**
 * 500 Internal Server Error editorial view with interrupted-line animation:
 * - Line wrapper fades in over 0–0.8s.
 * - Dominant first line segment and short trailing stub grow from width 0 over 0–2s
 *   with an intentional visible gap between them.
 * - Mint dot pulses gently on an infinite 2s cycle (paused under reduced motion).
 * - Headline & description fade/move up at 0.3–1.1s.
 * - `500` watermark fades in behind the headline at 1.0–1.8s to `0.03` opacity.
 * - Never exposes internal stack traces or raw error details.
 */
export function ServerErrorView({
  onReset,
  homeHref = "/",
}: IServerErrorViewProps) {
  return (
    <section
      aria-labelledby="error-500-heading"
      className="relative flex min-h-[calc(100svh-10rem)] w-full items-center justify-center overflow-hidden bg-background px-4 py-20 sm:px-6 sm:py-28 lg:px-8 text-foreground"
    >
      <div className="mx-auto flex w-full max-w-2xl flex-col items-center text-center">
        {/* Interrupted Horizontal Line + Pulsing Mint Dot (0–2s) */}
        <div
          aria-hidden="true"
          data-testid="error-500-line-wrapper"
          className="error-line-wrapper mb-12 sm:mb-14 inline-flex items-center justify-center gap-3"
        >
          <span
            data-testid="error-500-mint-dot"
            className="error-mint-pulse size-2.5 rounded-full bg-mint"
          />
          <span
            data-testid="error-500-line-primary"
            className="error-line-primary h-0.5 rounded-full bg-foreground"
          />
          <span
            data-testid="error-500-line-stub"
            className="error-line-stub h-0.5 rounded-full bg-foreground"
          />
        </div>

        {/* Animated Editorial Content (0.3–1.1s) + 500 Watermark (1.0–1.8s) */}
        <div className="error-500-content relative flex flex-col items-center">
          <span
            aria-hidden="true"
            data-testid="error-500-watermark"
            className="error-watermark absolute top-6 sm:top-4 left-1/2 -translate-x-1/2 font-display text-[7.5rem] sm:text-[9.5rem] lg:text-[11rem] font-normal leading-none tracking-tight text-foreground"
          >
            500
          </span>

          <p className="relative z-10 font-sans text-[11px] sm:text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            500 — SOMETHING WENT WRONG
          </p>

          <h1
            id="error-500-heading"
            className="relative z-10 mt-5 font-display text-4xl sm:text-5xl lg:text-[3.5rem] font-bold leading-[1.06] tracking-tight text-balance text-foreground"
          >
            A small
            <em className="mt-1 block font-display font-normal italic">
              interruption.
            </em>
          </h1>

          <p className="relative z-10 mt-6 max-w-lg font-sans text-base sm:text-lg leading-relaxed text-muted-foreground text-pretty">
            Something unexpected happened while loading this page. Please try
            again.
          </p>

          <div className="relative z-10 mt-10 flex flex-wrap items-center justify-center gap-6 sm:gap-8">
            {onReset && (
              <button
                type="button"
                onClick={() => onReset()}
                className="inline-flex items-center justify-center gap-2.5 rounded-full bg-foreground text-background px-7 py-3.5 font-sans text-xs font-semibold uppercase tracking-[0.18em] transition-opacity duration-200 hover:opacity-90 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
              >
                <span>TRY AGAIN</span>
                <IoRefresh aria-hidden="true" className="text-sm" />
              </button>
            )}

            <Link
              href={homeHref}
              className="group inline-flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-foreground py-2 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground"
            >
              <span className="border-b border-foreground/35 pb-1 transition-colors duration-200 group-hover:border-foreground">
                BACK TO HOME
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

export default ServerErrorView;
