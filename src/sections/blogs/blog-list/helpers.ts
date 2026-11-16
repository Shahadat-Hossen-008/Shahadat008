import { toPlainText } from "@portabletext/react";

import type { BlogPostItem } from "../blog-card/interface";

const WORDS_PER_MINUTE = 200;

/** Extracts sorted, unique blog tag titles from the visible posts. */
export function getBlogTags(posts: BlogPostItem[]): string[] {
  const tags = new Set<string>();
  for (const post of posts) {
    if (!post.categories) continue;
    for (const category of post.categories) {
      if (category?.title) {
        tags.add(category.title);
      }
    }
  }
  return Array.from(tags).sort((a, b) => a.localeCompare(b));
}

/** Filters blog posts by selected tag title, or returns all when `"all"`. */
export function filterPostsByTag(
  posts: BlogPostItem[],
  activeTag: string,
): BlogPostItem[] {
  if (activeTag === "all") return posts;
  return posts.filter((post) =>
    post.categories?.some((category) => category?.title === activeTag),
  );
}

/** Estimates reading time in whole minutes from Portable Text blocks. */
export function estimateReadingTime(
  blocks: readonly unknown[] | null | undefined,
): number | null {
  if (!blocks || blocks.length === 0) return null;

  try {
    const text = toPlainText(
      blocks as Parameters<typeof toPlainText>[0],
    ).trim();
    if (!text) return null;
    const words = text.split(/\s+/).length;
    return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
  } catch {
    return null;
  }
}
