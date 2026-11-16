import { CUSTOM_IMAGE_FRAGMENT, PORTABLE_TEXT_PROJECTION } from "@/fragments";

export const BLOG_DETAILS_FRAGMENT = /* groq */ `
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
  "blogContent": blogContent${PORTABLE_TEXT_PROJECTION}
`;
