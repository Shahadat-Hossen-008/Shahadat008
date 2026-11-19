// @vitest-environment jsdom
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({
  usePathname: () => "/about",
}));

import { Header } from "./index";

const NAV_LINKS = [
  { _key: "home", label: "Home", href: "/", external: false },
  { _key: "about", label: "About", href: "/about", external: false },
  { _key: "projects", label: "Projects", href: "/projects", external: false },
];

const CTA_LINK = {
  label: "Resume",
  href: "https://example.com/resume.pdf",
  external: true,
  openInNewTab: true,
};

describe("Header mobile drawer keyboard focus containment (C2a)", () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    (
      globalThis as unknown as { IS_REACT_ACT_ENVIRONMENT?: boolean }
    ).IS_REACT_ACT_ENVIRONMENT = true;
    document.body.style.overflow = "";
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(() => {
    act(() => {
      root.unmount();
    });
    container.remove();
    document.body.style.overflow = "";
  });

  function renderHeader() {
    act(() => {
      root.render(
        <Header
          siteTitle="~SH_"
          hasLogoImage={false}
          navLinks={NAV_LINKS}
          cta={CTA_LINK}
        />,
      );
    });

    const toggle = container.querySelector<HTMLButtonElement>("#nav-icon3");
    const panel = container.querySelector<HTMLElement>(
      "#mobile-navigation-panel",
    );
    if (!toggle || !panel) {
      throw new Error("Expected mobile menu toggle and panel in DOM");
    }
    return { toggle, panel };
  }

  it("keeps the closed drawer out of keyboard navigation via inert and aria-hidden", () => {
    const { toggle, panel } = renderHeader();

    expect(toggle.getAttribute("aria-expanded")).toBe("false");
    expect(panel.getAttribute("aria-hidden")).toBe("true");
    expect(panel.hasAttribute("inert")).toBe(true);
    expect(document.body.style.overflow).toBe("");
  });

  it("preserves initial focus on the toggle when opened and closes cleanly on toggle click", () => {
    const { toggle, panel } = renderHeader();

    toggle.focus();
    act(() => {
      toggle.click();
    });

    expect(toggle.getAttribute("aria-expanded")).toBe("true");
    expect(panel.getAttribute("aria-hidden")).toBe("false");
    expect(panel.hasAttribute("inert")).toBe(false);
    expect(document.body.style.overflow).toBe("hidden");
    // Does not force focus into the drawer on open
    expect(document.activeElement).toBe(toggle);

    // Clicking toggle again closes the drawer and restores scroll
    act(() => {
      toggle.click();
    });

    expect(toggle.getAttribute("aria-expanded")).toBe("false");
    expect(panel.getAttribute("aria-hidden")).toBe("true");
    expect(panel.hasAttribute("inert")).toBe(true);
    expect(document.body.style.overflow).toBe("");
    expect(document.activeElement).toBe(toggle);
  });

  it("wraps Tab from the last focusable drawer element to the first focusable drawer element", () => {
    const { toggle, panel } = renderHeader();

    act(() => {
      toggle.click();
    });

    const links = Array.from(panel.querySelectorAll<HTMLAnchorElement>("a[href]"));
    expect(links.length).toBe(4); // Home, About, Projects, Resume
    const firstLink = links[0]!;
    const lastLink = links[links.length - 1]!;

    lastLink.focus();
    expect(document.activeElement).toBe(lastLink);

    const tabEvent = new KeyboardEvent("keydown", {
      key: "Tab",
      bubbles: true,
      cancelable: true,
    });
    act(() => {
      window.dispatchEvent(tabEvent);
    });

    expect(tabEvent.defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(firstLink);
  });

  it("wraps Shift+Tab from the first focusable drawer element to the last focusable drawer element", () => {
    const { toggle, panel } = renderHeader();

    act(() => {
      toggle.click();
    });

    const links = Array.from(panel.querySelectorAll<HTMLAnchorElement>("a[href]"));
    const firstLink = links[0]!;
    const lastLink = links[links.length - 1]!;

    firstLink.focus();
    expect(document.activeElement).toBe(firstLink);

    const shiftTabEvent = new KeyboardEvent("keydown", {
      key: "Tab",
      shiftKey: true,
      bubbles: true,
      cancelable: true,
    });
    act(() => {
      window.dispatchEvent(shiftTabEvent);
    });

    expect(shiftTabEvent.defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(lastLink);
  });

  it("closes the drawer on Escape, restores focus to #nav-icon3, and restores body scroll", () => {
    const { toggle, panel } = renderHeader();

    act(() => {
      toggle.click();
    });

    const firstLink = panel.querySelector<HTMLAnchorElement>("a[href]")!;
    firstLink.focus();
    expect(document.activeElement).toBe(firstLink);

    act(() => {
      window.dispatchEvent(
        new KeyboardEvent("keydown", { key: "Escape", bubbles: true }),
      );
    });

    expect(toggle.getAttribute("aria-expanded")).toBe("false");
    expect(panel.getAttribute("aria-hidden")).toBe("true");
    expect(panel.hasAttribute("inert")).toBe(true);
    expect(document.body.style.overflow).toBe("");
    expect(document.activeElement).toBe(toggle);
  });

  it("closes the drawer when selecting a mobile navigation link", () => {
    const { toggle, panel } = renderHeader();

    act(() => {
      toggle.click();
    });

    const aboutLink = panel.querySelector<HTMLAnchorElement>(
      'a[href="/about"]',
    )!;
    act(() => {
      aboutLink.click();
    });

    expect(toggle.getAttribute("aria-expanded")).toBe("false");
    expect(panel.getAttribute("aria-hidden")).toBe("true");
    expect(panel.hasAttribute("inert")).toBe(true);
    expect(document.body.style.overflow).toBe("");
  });
});
