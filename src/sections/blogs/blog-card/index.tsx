import Link from "next/link";

import { formatDate } from "@/lib/formatDate";
import { cleanText } from "@/sections/shared/section-formatting";
import type { IBlogCardProps } from "./interface";

export function BlogCard({ blogPost }: IBlogCardProps) {
  const title = cleanText(blogPost?.blogTitle);
  if (!blogPost?.slug || !title) return null;

  const publishedDate = formatDate(blogPost.publishedAt, "MMMM d, yyyy");
  const categories = (blogPost.categories ?? [])
    .map((category) => cleanText(category?.title))
    .filter((tag): tag is string => Boolean(tag));
  const excerpt = cleanText(blogPost.excerpt);

  return (
    <article className="group relative py-8 sm:py-10">
      {(publishedDate || categories.length > 0) && (
        <div className="mb-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
          {publishedDate ? (
            <time
              dateTime={blogPost.publishedAt ?? undefined}
              className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground"
            >
              {publishedDate}
            </time>
          ) : (
            <span />
          )}

          {categories.length > 0 && (
            <span className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              {categories.join(" · ")}
            </span>
          )}
        </div>
      )}

      <h2 className="font-display text-2xl sm:text-3xl font-bold leading-snug tracking-tight text-foreground">
        <Link
          href={`/blogs/${blogPost.slug}`}
          className="heading-hover-underline after:absolute after:inset-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground"
        >
          {title}
        </Link>
      </h2>

      {excerpt && (
        <p className="mt-3 max-w-2xl font-sans text-base leading-relaxed text-muted-foreground text-pretty">
          {excerpt}
        </p>
      )}
    </article>
  );
}

export default BlogCard;
