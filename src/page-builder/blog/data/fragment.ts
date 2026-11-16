export const BLOG_CARD_FRAGMENT = /* groq */ `
  _id,
  _createdAt,
  blogTitle,
  "slug": slug.current,
  excerpt,
  categories[]->{ _id, title },
  publishedAt
`;
