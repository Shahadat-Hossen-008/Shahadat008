import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

import FrontendError from "@/app/(frontend)/error";
import FrontendNotFound from "@/app/(frontend)/not-found";
import RootError from "@/app/error";
import RootNotFound from "@/app/not-found";
import { NotFoundView, ServerErrorView } from "./index";

describe("404 NotFoundView & Route Integration", () => {
  it("renders editorial 404 copy, navigation actions, watermark, and SVG arc illustration", () => {
    const html = renderToStaticMarkup(<NotFoundView />);

    expect(html).toContain("404 — PAGE NOT FOUND");
    expect(html).toContain("This page took a");
    expect(html).toContain("different path.");
    expect(html).toContain(
      "The page you are looking for may have moved, or the link might be outdated.",
    );

    expect(html).toContain('href="/"');
    expect(html).toContain("BACK TO HOME");
    expect(html).toContain('href="/projects"');
    expect(html).toContain("EXPLORE PROJECTS");

    // 404 Watermark
    expect(html).toContain('data-testid="error-404-watermark"');
    expect(html).toContain("error-watermark");
    expect(html).toContain(">404</span>");

    // SVG Arc Path and Endpoint Dots
    expect(html).toContain('data-testid="error-404-arc-path"');
    expect(html).toContain(
      'd="M 24 146 C 68 146, 86 18, 134 18 C 186 18, 218 146, 266 146 C 282 146, 294 134, 296 114"',
    );
    expect(html).toContain("error-arc-path");

    // Start dot (24, 146) and Mint end dot (296, 114) match path endpoints
    expect(html).toContain('data-testid="error-404-start-dot"');
    expect(html).toContain('cx="24" cy="146"');
    expect(html).toContain("error-arc-start-dot");

    expect(html).toContain('data-testid="error-404-end-dot"');
    expect(html).toContain('cx="296" cy="114"');
    expect(html).toContain("error-arc-end-dot");
    expect(html).toContain("fill-mint");
  });

  it("renders both root and frontend not-found route components cleanly", () => {
    const frontendHtml = renderToStaticMarkup(<FrontendNotFound />);
    expect(frontendHtml).toContain("404 — PAGE NOT FOUND");

    const rootHtml = renderToStaticMarkup(<RootNotFound />);
    expect(rootHtml).toContain("data-frontend-root");
    expect(rootHtml).toContain("404 — PAGE NOT FOUND");
  });
});

describe("500 ServerErrorView & Route Integration", () => {
  it("renders editorial 500 copy, interrupted line segments, pulsing mint dot, and watermark", () => {
    const resetMock = vi.fn();
    const html = renderToStaticMarkup(<ServerErrorView onReset={resetMock} />);

    expect(html).toContain("500 — SOMETHING WENT WRONG");
    expect(html).toContain("A small");
    expect(html).toContain("interruption.");
    expect(html).toContain(
      "Something unexpected happened while loading this page. Please try again.",
    );

    expect(html).toContain("TRY AGAIN");
    expect(html).toContain('href="/"');
    expect(html).toContain("BACK TO HOME");

    // Interrupted Line Wrapper, Mint Dot, Dominant First Line, and Trailing Stub
    expect(html).toContain('data-testid="error-500-line-wrapper"');
    expect(html).toContain("error-line-wrapper");
    expect(html).toContain('data-testid="error-500-mint-dot"');
    expect(html).toContain("error-mint-pulse");
    expect(html).toContain('data-testid="error-500-line-primary"');
    expect(html).toContain("error-line-primary");
    expect(html).toContain('data-testid="error-500-line-stub"');
    expect(html).toContain("error-line-stub");

    // 500 Watermark
    expect(html).toContain('data-testid="error-500-watermark"');
    expect(html).toContain("error-watermark");
    expect(html).toContain(">500</span>");
  });

  it("invokes Next.js reset() callback when the TRY AGAIN button is clicked", () => {
    const resetMock = vi.fn();
    const tree = ServerErrorView({ onReset: resetMock });

    function findButtonOnClick(node: unknown): (() => void) | undefined {
      if (!node || typeof node !== "object") return undefined;
      const element = node as {
        type?: unknown;
        props?: { onClick?: () => void; children?: unknown };
      };
      if (
        element.type === "button" &&
        typeof element.props?.onClick === "function"
      ) {
        return element.props.onClick;
      }
      const children = element.props?.children;
      if (Array.isArray(children)) {
        for (const child of children) {
          const found = findButtonOnClick(child);
          if (found) return found;
        }
      } else if (children) {
        return findButtonOnClick(children);
      }
      return undefined;
    }

    const onClick = findButtonOnClick(tree);
    expect(typeof onClick).toBe("function");
    onClick?.();
    expect(resetMock).toHaveBeenCalledTimes(1);
  });

  it("omits TRY AGAIN button when onReset is not provided", () => {
    const html = renderToStaticMarkup(<ServerErrorView />);
    expect(html).not.toContain("TRY AGAIN");
    expect(html).toContain("BACK TO HOME");
  });

  it("never exposes internal error messages, digests, or stack traces in error.tsx boundaries", () => {
    const resetMock = vi.fn();
    const sensitiveError = Object.assign(
      new Error("FATAL: ECONNREFUSED 10.0.0.42:5432 secret_db_token=xyz987"),
      {
        digest: "DIGEST_INTERNAL_999",
        stack: "Error: FATAL at Object.<anonymous> (/app/server/secret.ts:12:4)",
      },
    );

    const frontendHtml = renderToStaticMarkup(
      <FrontendError error={sensitiveError} reset={resetMock} />,
    );
    expect(frontendHtml).not.toContain("ECONNREFUSED");
    expect(frontendHtml).not.toContain("secret_db_token");
    expect(frontendHtml).not.toContain("DIGEST_INTERNAL_999");
    expect(frontendHtml).not.toContain("/app/server/secret.ts");

    const rootHtml = renderToStaticMarkup(
      <RootError error={sensitiveError} reset={resetMock} />,
    );
    expect(rootHtml).toContain("data-frontend-root");
    expect(rootHtml).not.toContain("ECONNREFUSED");
    expect(rootHtml).not.toContain("DIGEST_INTERNAL_999");
  });
});

describe("Error Page CSS Animation & Reduced-Motion Specification", () => {
  const globalsCss = readFileSync(
    resolve(process.cwd(), "src/app/globals.css"),
    "utf8",
  );

  it("defines centralized keyframes and static measured arc length (415.42) without runtime JS hooks", () => {
    const notFoundSource = readFileSync(
      resolve(process.cwd(), "src/components/error-pages/not-found/index.tsx"),
      "utf8",
    );
    expect(notFoundSource).not.toContain("useEffect");
    expect(notFoundSource).not.toContain("useRef");
    expect(notFoundSource).not.toContain("getTotalLength");

    expect(globalsCss).toContain("stroke-dasharray: 415.42;");
    expect(globalsCss).toContain("stroke-dashoffset: 415.42;");
    expect(globalsCss).toContain("--arc-draw-duration: 3s;");
    expect(globalsCss).toContain("@keyframes error-arc-draw");
    expect(globalsCss).toContain("@keyframes error-fade-up");
    expect(globalsCss).toContain("@keyframes error-watermark-fade");
    expect(globalsCss).toContain("@keyframes error-line-primary-grow");
    expect(globalsCss).toContain("@keyframes error-line-stub-grow");
    expect(globalsCss).toContain("@keyframes error-mint-pulse");
  });

  it("keeps the 404 start dot stationary from frame 0, synchronizes the end dot with arc completion, and enforces reduced-motion fallback", () => {
    // 404 timings: stationary start dot (opacity: 1; animation: none), 3s arc draw, end dot synchronized with --arc-draw-duration (3s)
    expect(globalsCss).toContain(
      "animation: error-arc-draw var(--arc-draw-duration, 3s) ease 0s forwards;",
    );
    expect(globalsCss).toMatch(
      /\.error-arc-start-dot\s*\{\s*opacity:\s*1;\s*transform:\s*none;\s*animation:\s*none;\s*\}/,
    );
    expect(globalsCss).toContain(
      "animation: error-fade-in 0.2s ease-out var(--arc-draw-duration, 3s) forwards;",
    );
    expect(globalsCss).toContain(
      "animation: error-fade-up 0.8s ease 0.5s forwards;",
    );
    expect(globalsCss).toContain(
      "animation: error-watermark-fade 0.8s ease 1s forwards;",
    );

    // 500 timings: 0.8s wrapper, 2s segments, 0.3-1.1s content, 2s infinite mint pulse
    expect(globalsCss).toContain(
      "animation: error-fade-in 0.8s ease 0s forwards;",
    );
    expect(globalsCss).toContain(
      "animation: error-line-primary-grow 2s ease 0s forwards;",
    );
    expect(globalsCss).toContain(
      "animation: error-line-stub-grow 2s ease 0s forwards;",
    );
    expect(globalsCss).toContain(
      "animation: error-fade-up 0.8s ease 0.3s forwards;",
    );
    expect(globalsCss).toContain(
      "animation: error-mint-pulse 2s ease-in-out infinite;",
    );

    // Reduced-motion static overrides
    expect(globalsCss).toContain("@media (prefers-reduced-motion: reduce)");
    expect(globalsCss).toContain("stroke-dashoffset: 0 !important;");
  });
});
