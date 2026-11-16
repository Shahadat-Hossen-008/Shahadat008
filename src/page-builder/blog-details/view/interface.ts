import type { SINGLE_BLOG_POST_QUERYResult } from "@/sanity/types";

export type BlogDetailsData = NonNullable<SINGLE_BLOG_POST_QUERYResult>;

export interface IBlogDetailsProps {
  blog: BlogDetailsData;
}

export interface IBlogPostPageProps {
  params: Promise<{ slug: string }>;
}
