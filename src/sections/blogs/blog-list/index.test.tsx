import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import type { BlogPostItem } from "../blog-card/interface";
import {
  estimateReadingTime,
  filterPostsByTag,
  getBlogTags,
} from "./helpers";
import { BlogListSection } from "./index";

const mockPosts: BlogPostItem[] = [
  {
    _id: "b1",
    _createdAt: "2024-10-24T00:00:00Z",
    blogTitle: "The Case for Intent-Based Component APIs",
    slug: "intent-based-component-apis",
    excerpt:
      'Why building components around "what they represent" rather than "how they look" is the key to a scalable, resilient design system.',
    categories: [{ _id: "cat-1", title: "Design Systems" }],
    publishedAt: "2024-10-24T00:00:00Z",
  },
  {
    _id: "b2",
    _createdAt: "2024-09-12T00:00:00Z",
    blogTitle: "Rethinking Hydration in React 19",
    slug: "rethinking-hydration-react-19",
    excerpt:
      "Exploring the performance benefits of Server Components and the new hydration strategies arriving in the latest React release.",
    categories: [{ _id: "cat-2", title: "Technical Engineering" }],
    publishedAt: "2024-09-12T00:00:00Z",
  },
];

describe("BlogListSection", () => {
  it("renders section heading, tag filter pills, and editorial article rows", () => {
    const html = renderToStaticMarkup(
      <BlogListSection
        eyebrow="WRITING & NOTES"
        heading="Thoughts on engineering & design."
        headingAccent="design."
        posts={mockPosts}
      />,
    );

    expect(html).toContain("WRITING &amp; NOTES");
    expect(html).toContain("ALL POSTS");
    expect(html).toContain("Design Systems");
    expect(html).toContain("Technical Engineering");
    expect(html).toContain("The Case for Intent-Based Component APIs");
    expect(html).toContain('href="/blogs/intent-based-component-apis"');
    expect(html).toContain("October 24, 2024");
    expect(html).toContain('dateTime="2024-10-24T00:00:00Z"');
  });

  it("extracts unique sorted tags and filters posts accurately", () => {
    expect(getBlogTags(mockPosts)).toEqual([
      "Design Systems",
      "Technical Engineering",
    ]);
    expect(filterPostsByTag(mockPosts, "all")).toHaveLength(2);
    expect(filterPostsByTag(mockPosts, "Design Systems")).toHaveLength(1);
    expect(filterPostsByTag(mockPosts, "Design Systems")[0]?._id).toBe("b1");
  });

  it("estimates reading time from portable text blocks", () => {
    const words = Array.from({ length: 450 }, () => "word").join(" ");
    const minutes = estimateReadingTime([
      {
        _key: "p1",
        _type: "block",
        children: [{ _key: "s1", _type: "span", text: words }],
      },
    ]);
    expect(minutes).toBe(3);
    expect(estimateReadingTime([])).toBeNull();
  });
});
