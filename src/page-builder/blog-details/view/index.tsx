import Link from "next/link";

import { SanityImage } from "@/components/image";
import { CustomPortableText } from "@/components/portable-text";
import { formatDate } from "@/lib/formatDate";
import { splitHeadline } from "@/lib/hero";
import { absoluteUrl } from "@/lib/sanity/routes";
import { estimateReadingTime } from "@/sections/blogs/blog-list/helpers";
import { cleanText } from "@/sections/shared/section-formatting";
import { ShareArticle } from "./sub-components/share-article";
import type { IBlogDetailsProps } from "./interface";

function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function BlogDetailsView({ blog }: IBlogDetailsProps) {
  const titleParts = splitHeadline(blog.blogTitle, blog.titleAccent);
  const publishedDate = formatDate(blog.publishedAt);
  const readingTimeMinutes = estimateReadingTime(blog.blogContent);
  const categories = (blog.categories ?? [])
    .map((category) => cleanText(category?.title))
    .filter((title): title is string => Boolean(title));

  const authorName = cleanText(blog.author?.fullName);
  const authorRole = cleanText(blog.author?.description);
  const hasMeta =
    Boolean(publishedDate) ||
    Boolean(readingTimeMinutes) ||
    categories.length > 0;

  const relativePath = blog.slug ? `/blogs/${blog.slug}` : "/blogs";
  const shareUrl = absoluteUrl(relativePath) ?? relativePath;

  return (
    <article className="bg-background text-foreground pb-24 sm:pb-32">
      <div className="mx-auto w-full max-w-detail px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 lg:pt-20">
        <Link
          href="/blogs"
          className="group inline-flex items-center gap-2 min-h-10 font-sans text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors mb-8 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
        >
          <span
            aria-hidden="true"
            className="transition-transform duration-200 group-hover:-translate-x-1"
          >
            ←
          </span>
          <span className="link-hover-underline">Back to Blogs</span>
        </Link>

        <header className="mb-12 sm:mb-14">
          {hasMeta && (
            <div className="mb-4 flex flex-wrap items-center gap-2.5 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              {publishedDate && (
                <time dateTime={blog.publishedAt ?? undefined}>
                  {publishedDate}
                </time>
              )}
              {publishedDate && readingTimeMinutes && (
                <span aria-hidden="true">•</span>
              )}
              {readingTimeMinutes && <span>{readingTimeMinutes} MIN READ</span>}
              {(publishedDate || readingTimeMinutes) &&
                categories.length > 0 && <span aria-hidden="true">•</span>}
              {categories.length > 0 && <span>{categories.join(" · ")}</span>}
            </div>
          )}

          <h1 className="font-display text-4xl sm:text-5xl lg:text-[3.25rem] font-bold text-balance text-foreground leading-[1.08] tracking-tight">
            {titleParts.length === 3 ? (
              <>
                {titleParts[0]}
                <em className="font-normal italic">{titleParts[1]}</em>
                {titleParts[2]}
              </>
            ) : (
              blog.blogTitle
            )}
          </h1>

          {authorName && (
            <div className="mt-8 flex items-center gap-4">
              <div className="size-12 shrink-0 overflow-hidden rounded-full border border-foreground/15 bg-surface flex items-center justify-center">
                {blog.author?.avatar?.imageFile ? (
                  <SanityImage
                    image={blog.author.avatar.imageFile}
                    alt=""
                    width={96}
                    height={96}
                    className="size-full object-cover"
                  />
                ) : (
                  <span
                    aria-hidden="true"
                    className="font-sans text-sm font-semibold tracking-wider text-muted-foreground"
                  >
                    {getInitials(authorName)}
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-0.5">
                <p className="font-sans text-base font-semibold leading-snug tracking-[-0.01em] text-foreground">
                  {authorName}
                </p>
                {authorRole && (
                  <p className="font-sans text-sm font-medium leading-snug text-muted-foreground">
                    {authorRole}
                  </p>
                )}
              </div>
            </div>
          )}
        </header>

        {blog.blogContent && (
          <section aria-label="Article Body" className="w-full min-w-0">
            <CustomPortableText value={blog.blogContent} />
          </section>
        )}

        <ShareArticle title={blog.blogTitle} shareUrl={shareUrl} />
      </div>
    </article>
  );
}

export default BlogDetailsView;
