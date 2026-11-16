"use client";

import { useCallback, type MouseEvent } from "react";
import { FaLink, FaLinkedin, FaXTwitter } from "react-icons/fa6";
import { toast } from "react-toastify";

import type { IShareArticleProps } from "./interface";

const ICON_BTN_CLASS =
  "inline-flex size-10 items-center justify-center rounded-full text-muted-foreground transition-colors duration-200 hover:bg-surface hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground cursor-pointer";

function buildShareHref(
  network: "x" | "linkedin",
  url: string,
  title: string,
): string {
  const encodedUrl = encodeURIComponent(url);
  if (network === "x") {
    const encodedTitle = encodeURIComponent(title);
    return `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`;
  }
  return `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
}

export function ShareArticle({ title, shareUrl }: IShareArticleProps) {
  const safeTitle = title?.trim() || "Article";
  const resolvedUrl = shareUrl?.trim() || "";

  const handleSocialClick = useCallback(
    (network: "x" | "linkedin") => (event: MouseEvent<HTMLAnchorElement>) => {
      if (typeof window === "undefined" || /^https?:\/\//i.test(resolvedUrl)) {
        return;
      }
      event.preventDefault();
      const fullUrl = resolvedUrl
        ? new URL(resolvedUrl, window.location.origin).toString()
        : window.location.href;
      window.open(
        buildShareHref(network, fullUrl, safeTitle),
        "_blank",
        "noopener,noreferrer",
      );
    },
    [resolvedUrl, safeTitle],
  );

  const handleCopyLink = useCallback(async () => {
    const targetUrl =
      typeof window !== "undefined" ? window.location.href : resolvedUrl;
    if (
      !targetUrl ||
      typeof navigator === "undefined" ||
      !navigator.clipboard
    ) {
      toast.error("Unable to copy link", {
        position: "bottom-right",
        toastId: "copy-article-link-error",
      });
      return;
    }

    try {
      await navigator.clipboard.writeText(targetUrl);
      toast.success("Link copied to clipboard", {
        position: "bottom-right",
        toastId: "copy-article-link",
      });
    } catch {
      toast.error("Unable to copy link", {
        position: "bottom-right",
        toastId: "copy-article-link-error",
      });
    }
  }, [resolvedUrl]);

  const xShareHref = buildShareHref("x", resolvedUrl, safeTitle);
  const linkedInShareHref = buildShareHref("linkedin", resolvedUrl, safeTitle);

  return (
    <footer
      aria-label="Share this article"
      className="mt-14 sm:mt-16 border-t border-foreground/15 pt-8 sm:pt-10 flex flex-wrap items-center justify-between gap-4"
    >
      <span className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        SHARE THIS ARTICLE
      </span>

      <div className="flex items-center gap-1.5 sm:gap-2">
        <a
          href={xShareHref}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleSocialClick("x")}
          aria-label="Share article on X"
          title="Share on X"
          className={ICON_BTN_CLASS}
        >
          <FaXTwitter aria-hidden="true" className="text-button" />
        </a>

        <a
          href={linkedInShareHref}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleSocialClick("linkedin")}
          aria-label="Share article on LinkedIn"
          title="Share on LinkedIn"
          className={ICON_BTN_CLASS}
        >
          <FaLinkedin aria-hidden="true" className="text-button" />
        </a>

        <button
          type="button"
          onClick={handleCopyLink}
          aria-label="Copy article link"
          title="Copy link"
          className={ICON_BTN_CLASS}
        >
          <FaLink aria-hidden="true" className="text-button" />
        </button>
      </div>
    </footer>
  );
}

export default ShareArticle;
