import type { SiteIdentity, SiteSocialLink } from "../interface";

export type FooterLogo = NonNullable<SiteIdentity>["logo"];

export interface IFooterProps {
  siteTitle?: string | null;
  logo?: FooterLogo;
  hasLogoImage: boolean;
  mainContent?: string | null;
  base?: string | null;
  socialLinks?: SiteSocialLink[] | null;
}
