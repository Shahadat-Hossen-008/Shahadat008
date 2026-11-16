import type { BLOG_PAGE_QUERYResult } from "@/sanity/types";

export type BlogPostItem = NonNullable<
  NonNullable<BLOG_PAGE_QUERYResult>["blogPosts"]
>[number];

export interface IBlogCardProps {
  slug: string;
  blogTitle: string;
  publishedDate: string | null;
  publishedAt?: string | null;
  categories: string[];
  excerpt?: string | null;
}
