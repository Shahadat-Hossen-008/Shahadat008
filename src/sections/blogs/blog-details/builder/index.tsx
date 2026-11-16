import { formatDate } from "@/lib/formatDate";
import { absoluteUrl } from "@/lib/sanity/routes";
import { estimateReadingTime } from "@/sections/blogs/blog-list/helpers";
import { cleanText } from "@/sections/shared/section-formatting";
import { BlogDetails } from "../index";
import type { ISanityBlogDetailsProps } from "./interface";

export function BlogDetailsBuilder({ blog }: ISanityBlogDetailsProps) {
  const categories = (blog.categories ?? [])
    .map((category) => cleanText(category?.title))
    .filter((title): title is string => Boolean(title));

  const relativePath = blog.slug ? `/blogs/${blog.slug}` : "/blogs";
  const shareUrl = absoluteUrl(relativePath) ?? relativePath;

  return (
    <BlogDetails
      blogTitle={blog.blogTitle}
      titleAccent={blog.titleAccent}
      publishedDate={formatDate(blog.publishedAt)}
      publishedAt={blog.publishedAt}
      readingTimeMinutes={estimateReadingTime(blog.blogContent)}
      categories={categories}
      author={blog.author}
      blogContent={blog.blogContent}
      shareUrl={shareUrl}
    />
  );
}

export default BlogDetailsBuilder;
