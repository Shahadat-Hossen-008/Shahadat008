import { readFileSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { BlogDetailsView } from "./index";
import type { BlogDetailsData } from "./interface";

const mockBlogPost: BlogDetailsData = {
  _id: "b1",
  _createdAt: "2024-10-24T00:00:00Z",
  blogTitle: "The Case for Intent-Based Component APIs.",
  titleAccent: "Intent-Based",
  slug: "intent-based-component-apis",
  excerpt: "Why intent-based APIs scale.",
  categories: [{ _id: "c1", title: "Design Systems" }],
  author: {
    _id: "a1",
    fullName: "Shahadat Hossain",
    description: "Software Engineer",
    avatar: null,
  },
  publishedAt: "2024-10-24T00:00:00Z",
  blogContent: [
    {
      _key: "p1",
      _type: "block",
      markDefs: null,
      children: [
        {
          _key: "s1",
          _type: "span",
          text: "Component APIs should encode domain intent rather than visual styling.",
        },
      ],
    },
  ],
  seo: null,
};

describe("BlogDetailsView", () => {
  it("renders meta row, italic title accent, author byline, rich text body, and share bar", () => {
    const html = renderToStaticMarkup(<BlogDetailsView blog={mockBlogPost} />);

    expect(html).toContain('href="/blogs"');
    expect(html).toContain("Back to Blogs");
    expect(html).toContain("Oct 24, 2024");
    expect(html).toContain("1 MIN READ");
    expect(html).toContain("Design Systems");
    expect(html).toContain('<em class="font-normal italic">Intent-Based</em>');
    expect(html).toContain("Shahadat Hossain");
    expect(html).toContain("Software Engineer");
    expect(html).toContain("SH");
    expect(html).toContain(
      "Component APIs should encode domain intent rather than visual styling.",
    );
    expect(html).toContain("SHARE THIS ARTICLE");
    expect(html).toContain('aria-label="Share article on X"');
    expect(html).toContain('aria-label="Share article on LinkedIn"');
    expect(html).toContain('aria-label="Copy article link"');
  });

  it("is a server component (no \"use client\")", () => {
    const source = readFileSync(new URL("./index.tsx", import.meta.url), "utf8");
    expect(source).not.toMatch(/["']use client["']/);
  });
});
