"use client";

import { useMemo, useState } from "react";

import { SectionHeading } from "@/components/section-heading";
import { BlogCardBuilder } from "../blog-card/builder";
import { filterPostsByTag, getBlogTags } from "./helpers";
import type { IBlogListSectionProps } from "./interface";

const BASE_FILTER_BTN =
  "font-sans text-xs tracking-[0.18em] uppercase px-3.5 py-2 rounded-full border transition-colors duration-150 cursor-pointer whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground";
const ACTIVE_FILTER_BTN =
  "font-semibold text-foreground bg-surface border-foreground/20";
const INACTIVE_FILTER_BTN =
  "font-medium text-muted-foreground bg-transparent border-transparent hover:text-foreground hover:bg-surface/50 hover:border-foreground/10";

export function BlogListSection({
  eyebrow,
  heading,
  headingAccent,
  posts,
}: IBlogListSectionProps) {
  const [activeTag, setActiveTag] = useState("all");

  const validPosts = useMemo(
    () =>
      posts.filter(
        (post) =>
          typeof post?.blogTitle === "string" &&
          post.blogTitle.trim().length > 0 &&
          Boolean(post.slug),
      ),
    [posts],
  );

  const allTags = useMemo(() => getBlogTags(validPosts), [validPosts]);

  const filteredPosts = useMemo(
    () => filterPostsByTag(validPosts, activeTag),
    [validPosts, activeTag],
  );

  return (
    <section
      id="blogs"
      aria-labelledby="blogs-heading"
      className="bg-background text-foreground"
    >
      <div className="mx-auto w-full max-w-page px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10 pb-20 sm:pb-28 lg:pb-36">
        <SectionHeading
          as="h1"
          id="blogs-heading"
          eyebrow={eyebrow || "WRITING & NOTES"}
          heading={heading || "Thoughts on engineering & design."}
          headingAccent={headingAccent ?? "design."}
        />

        {allTags.length > 0 && (
          <div
            role="group"
            aria-label="Filter articles by tag"
            className="mt-10 sm:mt-12 border-b border-foreground/15 pb-5 flex flex-wrap items-center gap-2.5 sm:gap-3"
          >
            <button
              type="button"
              aria-pressed={activeTag === "all"}
              onClick={() => setActiveTag("all")}
              className={`${BASE_FILTER_BTN} ${
                activeTag === "all" ? ACTIVE_FILTER_BTN : INACTIVE_FILTER_BTN
              }`}
            >
              ALL POSTS
            </button>

            {allTags.map((tag) => {
              const isActive = activeTag === tag;

              return (
                <button
                  key={tag}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => setActiveTag(tag)}
                  className={`${BASE_FILTER_BTN} ${
                    isActive ? ACTIVE_FILTER_BTN : INACTIVE_FILTER_BTN
                  }`}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        )}

        {filteredPosts.length > 0 ? (
          <ul
            aria-live="polite"
            className={`divide-y divide-foreground/15 border-b border-foreground/15 ${
              allTags.length === 0 ? "mt-10 sm:mt-12 border-t" : ""
            }`}
          >
            {filteredPosts.map((post) => (
              <li key={post._id}>
                <BlogCardBuilder blogPost={post} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-12 font-sans text-base text-muted-foreground">
            No articles published yet.
          </p>
        )}
      </div>
    </section>
  );
}

export default BlogListSection;
