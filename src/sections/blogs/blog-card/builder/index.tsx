import { formatDate } from "@/lib/formatDate";
import { cleanText } from "@/sections/shared/section-formatting";
import { BlogCard } from "../index";
import type { ISanityBlogCardProps } from "./interface";

export function BlogCardBuilder({ blogPost }: ISanityBlogCardProps) {
  const title = cleanText(blogPost?.blogTitle);
  if (!blogPost?.slug || !title) return null;

  const categories = (blogPost.categories ?? [])
    .map((category) => cleanText(category?.title))
    .filter((tag): tag is string => Boolean(tag));

  return (
    <BlogCard
      slug={blogPost.slug}
      blogTitle={title}
      publishedDate={formatDate(blogPost.publishedAt, "MMMM d, yyyy")}
      publishedAt={blogPost.publishedAt}
      categories={categories}
      excerpt={cleanText(blogPost.excerpt)}
    />
  );
}

export default BlogCardBuilder;
