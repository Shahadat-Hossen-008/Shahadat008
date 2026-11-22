import { readFileSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { HeroBuilder } from "./index";
import type { HeroData } from "./interface";

const baseHero: HeroData = {
  statusLabel: "Available for work",
  location: "Remote",
  headline: "Building fast careful web products.",
  headlineAccent: "careful",
  subline: "Frontend engineer focused on React and Next.js.",
  primaryCta: {
    label: "View Projects",
    type: "internal",
    url: null,
    openInNewTab: false,
    isDisabled: false,
    reference: { _type: "projectPage", slug: "projects" },
  },
  secondaryCta: null,
  portrait: null,
  nowBuilding: {
    title: "Design System",
    description: "Building reusable UI primitives.",
    progress: 75,
  },
  facts: [{ label: "Focus", value: "Frontend" }],
};

describe("HeroBuilder", () => {
  it("returns null when hero is missing or headline is blank", () => {
    expect(renderToStaticMarkup(<HeroBuilder hero={null} />)).toBe("");
    expect(
      renderToStaticMarkup(
        <HeroBuilder hero={{ ...baseHero, headline: "   " }} />,
      ),
    ).toBe("");
  });

  it("renders headline with italic accent, reduced-motion status dot, CTAs, and panel", () => {
    const html = renderToStaticMarkup(
      <HeroBuilder hero={baseHero} fullName="Shahadat Hossain" />,
    );

    expect(html).toContain('id="hero-heading"');
    expect(html).toContain("<em");
    expect(html).toContain("careful</em>");
    expect(html).toContain("motion-reduce:animate-none");
    expect(html).toContain('href="/projects"');
    expect(html).toContain("View Projects");
    expect(html).toContain("Design System");
    expect(html).toContain("75%");
    expect(html).toContain("SH");
  });

  it("is a server component (no \"use client\")", () => {
    for (const file of ["index.tsx", "../index.tsx"]) {
      const source = readFileSync(new URL(file, import.meta.url), "utf8");
      expect(source).not.toMatch(/["']use client["']/);
    }
  });
});
