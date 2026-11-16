import type { SINGLE_BLOG_POST_QUERYResult } from "@/sanity/types";

export type SingleBlogPost = NonNullable<SINGLE_BLOG_POST_QUERYResult>;

export interface IBlogDetailsProps {
  blogTitle: SingleBlogPost["blogTitle"];
  titleAccent?: string | null;
  publishedDate: string | null;
  publishedAt?: string | null;
  readingTimeMinutes: number | null;
  categories?: string[];
  author: SingleBlogPost["author"];
  blogContent: SingleBlogPost["blogContent"];
  shareUrl?: string | null;
}
