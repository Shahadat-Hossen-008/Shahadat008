import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

import type { PROFILE_QUERYResult } from "@/sanity/types";
import HomePage from "./page";

vi.mock("@/sanity/lib/live", () => ({
  sanityFetch: vi.fn(),
}));

import { sanityFetch } from "@/sanity/lib/live";

const sampleProfileData: PROFILE_QUERYResult = {
  fullName: "Shahadat Hossen",
  hero: {
    statusLabel: "Available",
    location: "Remote",
    headline: "Building thoughtful web experiences",
    headlineAccent: null,
    subline: "Specializing in React, TypeScript, and Design Systems.",
    primaryCta: null,
    secondaryCta: null,
    portrait: null,
    nowBuilding: null,
    facts: null,
  },
  sections: [],
  seo: {
    title: "Portfolio",
    description: "Welcome to my portfolio",
    openGraph: null,
    robots: null,
    canonicalUrl: null,
    redirect: null,
    keywords: null,
  },
};

describe("HomePage", () => {
  it("fetches profile data cleanly via getProfile and renders MyProfilePageBuilder", async () => {
    vi.mocked(sanityFetch).mockResolvedValueOnce({
      data: sampleProfileData,
    } as never);

    const PageComponent = await HomePage();
    const html = renderToStaticMarkup(PageComponent);

    expect(html).toContain("Building thoughtful web experiences");
    expect(html).toContain(
      "mx-auto w-full max-w-page px-4 pt-12 pb-12 sm:px-6 sm:pt-16 lg:px-8 lg:pt-20 lg:pb-16",
    );
  });
});
