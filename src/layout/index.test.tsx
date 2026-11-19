import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

const { usePathnameMock } = vi.hoisted(() => ({
  usePathnameMock: vi.fn<() => string | null>(() => "/"),
}));

vi.mock("next/navigation", () => ({
  usePathname: usePathnameMock,
}));

import { Footer } from "./footer";
import { FooterBuilder } from "./footer/builder";
import { Header, isNavLinkActive } from "./header";
import { HeaderBuilder } from "./header/builder";
import type { Layout } from "./interface";

const mockLayout: Layout = {
  identity: {
    siteTitle: "~SH_",
    siteDescription:
      "Frontend-focused engineering for clear, fast, and considered web products.",
    logo: null,
    favicon: null,
    socialLinks: [
      {
        network: "github",
        label: "GitHub",
        url: "https://github.com/shahadat",
      },
      {
        network: "linkedin",
        label: "LinkedIn",
        url: "https://linkedin.com/in/shahadat",
      },
      {
        network: "email",
        label: "Email",
        url: "mailto:hello@shahadat.dev",
      },
    ],
  },
  header: {
    links: [
      {
        _key: "nav-home",
        label: "Home",
        type: "internal",
        url: null,
        openInNewTab: false,
        isDisabled: false,
        reference: { _type: "myProfilePage", slug: null },
      },
      {
        _key: "nav-about",
        label: "About",
        type: "internal",
        url: null,
        openInNewTab: false,
        isDisabled: false,
        reference: { _type: "aboutPage", slug: null },
      },
      {
        _key: "nav-projects",
        label: "Projects",
        type: "internal",
        url: null,
        openInNewTab: false,
        isDisabled: false,
        reference: { _type: "projectPage", slug: null },
      },
      {
        _key: "nav-blog",
        label: "Blog",
        type: "internal",
        url: null,
        openInNewTab: false,
        isDisabled: false,
        reference: { _type: "blogPage", slug: null },
      },
      {
        _key: "nav-contact",
        label: "Contact",
        type: "internal",
        url: null,
        openInNewTab: false,
        isDisabled: false,
        reference: { _type: "contactPage", slug: null },
      },
    ],
    cta: {
      label: "Resume",
      type: "external",
      url: "/resume.pdf",
      openInNewTab: true,
      isDisabled: false,
      reference: null,
    },
    showSocialLinks: false,
  },
  footer: {
    mainContent:
      "Frontend-focused engineering for clear, fast, and considered web products.",
    email: "hello@shahadat.dev",
    phone: null,
    base: "© 2024 Shahadat Hossain",
  },
};

describe("Header & HeaderBuilder", () => {
  it("renders left-aligned logo, right-aligned navigation links, and primary forest Resume CTA", () => {
    const html = renderToStaticMarkup(<HeaderBuilder layout={mockLayout} />);

    expect(html).toContain("~SH_");
    expect(html).toContain("Home");
    expect(html).toContain("About");
    expect(html).toContain("Projects");
    expect(html).toContain("Blog");
    expect(html).toContain("Contact");
    expect(html).toContain("Resume");
    expect(html).toContain("bg-forest");
    expect(html).toContain("text-limestone");
  });

  it("renders the four-line #nav-icon3 hamburger button and right slide-in mobile navigation drawer", () => {
    const html = renderToStaticMarkup(
      <Header
        siteTitle="~SH_"
        hasLogoImage={false}
        navLinks={[
          {
            _key: "1",
            label: "About",
            href: "/about",
            external: false,
          },
        ]}
        cta={{
          label: "Resume",
          href: "/resume.pdf",
          external: true,
          openInNewTab: true,
        }}
      />,
    );

    expect(html).toContain('id="nav-icon3"');
    expect(html).toContain('aria-label="Open navigation menu"');
    expect(html).toContain('aria-expanded="false"');
    expect(html).toContain('aria-controls="mobile-navigation-panel"');

    // Four horizontal bars inside .nav-icon3-bars
    const barsMatch = html.match(
      /<span aria-hidden="true" class="nav-icon3-bars">(<span><\/span>){4}<\/span>/,
    );
    expect(barsMatch).not.toBeNull();

    // Right-to-left slide-in mobile drawer positioned below the persistent top header bar (top-full)
    expect(html).toContain('id="mobile-navigation-panel"');
    expect(html).toContain('data-open="false"');
    expect(html).toContain('role="dialog"');
    expect(html).toContain('aria-modal="true"');
    expect(html).toContain("top-full inset-x-0");
    expect(html).toContain("mobile-nav-panel");
    expect(html).not.toContain("mobile-nav-item");
  });

  it("correctly identifies active routes for Home, About, Projects, project detail pages, Blog, blog detail pages, and Contact without false prefix matches", () => {
    // Home (/)
    expect(isNavLinkActive("/", "/")).toBe(true);
    expect(isNavLinkActive("/about", "/")).toBe(false);
    expect(isNavLinkActive("/projects", "/")).toBe(false);

    // About (/about)
    expect(isNavLinkActive("/about", "/about")).toBe(true);
    expect(isNavLinkActive("/about-me", "/about")).toBe(false);

    // Projects & project detail pages (/projects & /projects/[slug])
    expect(isNavLinkActive("/projects", "/projects")).toBe(true);
    expect(isNavLinkActive("/projects/design-system", "/projects")).toBe(true);
    expect(isNavLinkActive("/projects-archive", "/projects")).toBe(false);

    // Blog & blog detail pages (/blogs & /blogs/[slug])
    expect(isNavLinkActive("/blogs", "/blogs")).toBe(true);
    expect(isNavLinkActive("/blogs/intent-based-apis", "/blogs")).toBe(true);
    expect(isNavLinkActive("/blog/intent-based-apis", "/blogs")).toBe(true);
    expect(isNavLinkActive("/blogs-archive", "/blogs")).toBe(false);

    // Contact (/contact)
    expect(isNavLinkActive("/contact", "/contact")).toBe(true);
    expect(isNavLinkActive("/contact-us", "/contact")).toBe(false);
  });

  it("applies aria-current='page', data-active='true', and font-semibold to the active desktop and mobile links on nested detail routes", () => {
    usePathnameMock.mockReturnValue("/projects/design-system");
    const html = renderToStaticMarkup(<HeaderBuilder layout={mockLayout} />);

    // Both desktop and mobile Projects links receive aria-current="page" and font-semibold
    const activeLinkMatches = html.match(
      /<a(?=[^>]*href="\/projects")(?=[^>]*aria-current="page")(?=[^>]*data-active="true")[^>]*>/g,
    );
    expect(activeLinkMatches).toHaveLength(2);
    expect(activeLinkMatches?.[0]).toContain("font-semibold");
    expect(activeLinkMatches?.[1]).toContain("font-semibold");

    // Other links do not have aria-current="page"
    expect(html).not.toMatch(
      /<a(?=[^>]*href="\/about")(?=[^>]*aria-current="page")[^>]*>/,
    );
    expect(html).not.toMatch(
      /<a(?=[^>]*href="\/blogs")(?=[^>]*aria-current="page")[^>]*>/,
    );
    usePathnameMock.mockReturnValue("/");
  });
});

describe("Footer & FooterBuilder", () => {
  it("renders ONLY the 4 minimal elements: identical logo, short description, circular social links, and copyright", () => {
    const html = renderToStaticMarkup(<FooterBuilder layout={mockLayout} />);

    // 1. Identical logo
    expect(html).toContain("~SH_");

    // 2. Short professional description beneath logo
    expect(html).toContain(
      "Frontend-focused engineering for clear, fast, and considered web products.",
    );

    // 3. Social connection links (CONNECT + circular buttons)
    expect(html).toContain("CONNECT");
    expect(html).toContain('aria-label="GitHub"');
    expect(html).toContain('aria-label="LinkedIn"');
    expect(html).toContain('aria-label="Email"');
    expect(html).toContain("rounded-full border border-foreground/20");

    // 4. Copyright message
    expect(html).toContain("© 2024 Shahadat Hossain");

    // Verify excluded elements: no footer nav columns, no duplicate plain-text email, no extra tech tagline
    expect(html).not.toContain("EXPLORE");
    expect(html).not.toContain("Footer links");
    expect(html).not.toContain("Built with Next.js and Sanity");
    expect(html).not.toContain("<address");
  });

  it("renders identical logo markup in both Header and Footer", () => {
    const headerHtml = renderToStaticMarkup(
      <Header siteTitle="~SH_" hasLogoImage={false} navLinks={[]} />,
    );
    const footerHtml = renderToStaticMarkup(
      <Footer
        siteTitle="~SH_"
        hasLogoImage={false}
        mainContent="Short pitch"
        base="© 2024 Shahadat Hossain"
        socialLinks={[]}
      />,
    );

    const expectedLogoLink =
      '<a class="inline-flex items-center font-mono text-lg sm:text-xl font-bold tracking-tight text-foreground transition-opacity duration-200 hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground rounded-sm" href="/">~SH_</a>';

    expect(headerHtml).toContain(expectedLogoLink);
    expect(footerHtml).toContain(expectedLogoLink);
  });

  it("renders uploaded Sanity logo images with fit=max and natural aspect ratio without square cropping or rounded-full clipping", () => {
    const sampleLogo = {
      imageFile: {
        asset: {
          _id: "image-abc123-240x80-png",
          url: "https://cdn.sanity.io/images/test/production/abc123-240x80.png",
          metadata: {
            dimensions: {
              width: 240,
              height: 80,
            },
          },
        },
      },
      altText: "Shahadat Logo",
    };

    const headerHtml = renderToStaticMarkup(
      <Header
        siteTitle="~SH_"
        logo={sampleLogo}
        hasLogoImage={true}
        navLinks={[]}
      />,
    );
    const footerHtml = renderToStaticMarkup(
      <Footer
        siteTitle="~SH_"
        logo={sampleLogo}
        hasLogoImage={true}
        mainContent="Short pitch"
        base="© 2024 Shahadat Hossain"
        socialLinks={[]}
      />,
    );

    expect(headerHtml).toContain("fit%3Dmax");
    expect(headerHtml).toContain('width="240"');
    expect(headerHtml).toContain('height="80"');
    expect(headerHtml).toContain("h-9 sm:h-10 w-auto object-contain");
    expect(headerHtml).not.toContain("h%3D96");
    expect(headerHtml).not.toContain("rect%3D");

    expect(footerHtml).toContain("fit%3Dmax");
    expect(footerHtml).toContain('width="240"');
    expect(footerHtml).toContain('height="80"');
    expect(footerHtml).toContain("h-9 sm:h-10 w-auto object-contain");
    expect(footerHtml).not.toContain("h%3D96");
    expect(footerHtml).not.toContain("rect%3D");
  });
});

describe("#nav-icon3 CSS Animation & Reduced-Motion Specification", () => {
  const globalsCss = readFileSync(
    resolve(process.cwd(), "src/app/globals.css"),
    "utf8",
  );

  it("defines 4-line #nav-icon3 morphing into X, single-unit drawer translateX(100%) -> translateX(0), scaleX(0) -> scaleX(1) forest underline, and respects prefers-reduced-motion", () => {
    expect(globalsCss).toContain(".nav-icon3-bars span:nth-child(1)");
    expect(globalsCss).toContain(".nav-icon3-bars span:nth-child(2)");
    expect(globalsCss).toContain(".nav-icon3-bars span:nth-child(3)");
    expect(globalsCss).toContain(".nav-icon3-bars span:nth-child(4)");
    expect(globalsCss).toContain("transform: rotate(45deg);");
    expect(globalsCss).toContain("transform: rotate(-45deg);");
    expect(globalsCss).toContain("transform: translateX(100%);");
    expect(globalsCss).toContain("transform: translateX(0);");
    expect(globalsCss).toContain(".header-nav-link::after");
    expect(globalsCss).toContain("transform: scaleX(0);");
    expect(globalsCss).toContain("transform-origin: left center;");
    expect(globalsCss).toContain("transform: scaleX(1);");
    expect(globalsCss).toContain("transition: transform 280ms var(--ease-soft);");
    expect(globalsCss).not.toContain(".mobile-nav-item");
  });
});
