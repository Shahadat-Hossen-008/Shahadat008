import Image from "next/image";
import Link from "next/link";

import { SocialLinks } from "@/components/social-links";
import { urlFor } from "@/sanity/lib/image";
import type { IFooterProps } from "./interface";

export function Footer({
  siteTitle,
  logo,
  hasLogoImage,
  mainContent,
  base,
  socialLinks,
}: IFooterProps) {
  const copyrightText =
    base?.trim() || `© 2024 ${siteTitle?.trim() || "Shahadat Hossain"}`;
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
    <footer className="bg-background text-foreground">
      <div className="mx-auto w-full max-w-page px-4 pt-10 pb-8 sm:px-6 sm:pt-14 sm:pb-12 lg:px-8">
        <div className="rounded-panel bg-surface border border-foreground/10 px-6 py-10 sm:px-10 sm:py-12 lg:px-14 lg:py-14">
          <div className="flex flex-col justify-between gap-10 md:flex-row md:items-start">
            {/* 1. Existing Portfolio Logo & 2. Short Professional Description */}
            <div className="flex flex-col items-start gap-5 max-w-md">
              {hasLogoImage ? (
                <Link
                  href="/"
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
                    className="inline-flex items-center font-mono text-lg sm:text-xl font-bold tracking-tight text-foreground transition-opacity duration-200 hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground rounded-sm"
                  >
                    {siteTitle}
                  </Link>
                )
              )}

              {mainContent && (
                <p className="font-display text-2xl sm:text-[1.75rem] leading-[1.28] tracking-tight text-foreground">
                  {mainContent}
                </p>
              )}
            </div>

            {/* 3. Social Connection Links */}
            {Boolean(socialLinks?.length) && (
              <div className="flex flex-col items-start gap-4">
                <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  CONNECT
                </span>
                <SocialLinks
                  links={socialLinks}
                  variant="circle"
                  className="flex flex-wrap items-center gap-3"
                />
              </div>
            )}
          </div>

          {/* 4. Copyright Message */}
          <div className="mt-10 sm:mt-12 border-t border-foreground/12 pt-6 font-sans text-xs sm:text-sm text-muted-foreground">
            {copyrightText}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
