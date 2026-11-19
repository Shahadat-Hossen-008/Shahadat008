import { hasSanityImage } from "@/sanity/lib/images";
import { Footer } from "../index";
import type { IFooterProps } from "../interface";
import type { SiteSocialLink } from "../../interface";
import type { ISanityFooterProps } from "./interface";

/**
 * Site-wide minimal footer builder.
 *
 * Reuses `layout.identity.logo` and `layout.identity.socialLinks` alongside
 * `layout.footer.mainContent` and `layout.footer.base`.
 *
 * Renders nothing at all when `layout` does not exist yet, rather than an
 * empty shell.
 */
export function FooterBuilder({ layout }: ISanityFooterProps) {
  const identity = layout?.identity;
  const footer = layout?.footer;

  if (!identity) {
    return null;
  }

  const hasLogoImage = hasSanityImage(identity.logo);
  const mainContent = footer?.mainContent || identity.siteDescription;

  const baseSocialLinks: SiteSocialLink[] = [...(identity.socialLinks ?? [])];
  const hasEmailSocial = baseSocialLinks.some(
    (item) => item.network === "email",
  );
  if (!hasEmailSocial && footer?.email?.trim()) {
    baseSocialLinks.push({
      network: "email",
      label: "Email",
      url: `mailto:${footer.email.trim()}`,
    });
  }

  const hasContent =
    hasLogoImage ||
    Boolean(identity.siteTitle) ||
    Boolean(mainContent) ||
    baseSocialLinks.length > 0 ||
    Boolean(footer?.base);

  if (!hasContent) {
    return null;
  }

  const footerProps: IFooterProps = {
    siteTitle: identity.siteTitle,
    logo: identity.logo,
    hasLogoImage,
    mainContent,
    base: footer?.base,
    socialLinks: baseSocialLinks,
  };

  return <Footer {...footerProps} />;
}

export default FooterBuilder;
