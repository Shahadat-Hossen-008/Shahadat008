import { defineQuery } from "next-sanity";

import { SECTION_HEADING_FRAGMENT, SEO_FIELDS_FRAGMENT } from "@/fragments";
import { BLOG_CARD_FRAGMENT } from "@/sections/blogs/blog-card/builder/fragment";
import { PAGE_SECTIONS_FRAGMENT } from "@/sections/section-builder/fragment";

/** Singleton Blog page query, including the page-owned opening and sections. */
export const BLOG_PAGE_QUERY = defineQuery(
  `*[_type == "blogPage"][0]{
    ${SEO_FIELDS_FRAGMENT},
    ${SECTION_HEADING_FRAGMENT},
    "blogPosts": select(
      defined(blogPosts) && count(blogPosts) > 0 =>
        blogPosts[]->{ ${BLOG_CARD_FRAGMENT} },
      *[_type == "blogPost"] | order(publishedAt desc, _createdAt desc)[]{
        ${BLOG_CARD_FRAGMENT}
      }
    ),
    ${PAGE_SECTIONS_FRAGMENT}
  }`,
);
