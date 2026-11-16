import { defineQuery } from "next-sanity";

import {
  CUSTOM_IMAGE_FRAGMENT,
  PORTABLE_TEXT_PROJECTION,
  SEO_FIELDS_FRAGMENT,
} from "@/fragments";

/** Single blog post by slug. */
export const SINGLE_BLOG_POST_QUERY = defineQuery(/* groq */ `
  *[_type == "blogPost" && slug.current == $slug][0]{
    _id,
    _createdAt,
    blogTitle,
    titleAccent,
    "slug": slug.current,
    excerpt,
    categories[]->{ _id, title },
    author->{
      _id,
      fullName,
      description,
      avatar {
        ${CUSTOM_IMAGE_FRAGMENT}
      }
    },
    publishedAt,
    "blogContent": blogContent${PORTABLE_TEXT_PROJECTION},
    ${SEO_FIELDS_FRAGMENT}
  }
`);
