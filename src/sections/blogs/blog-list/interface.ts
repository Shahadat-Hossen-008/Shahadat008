import type { BlogPostItem } from "../blog-card/interface";

export interface IBlogListSectionProps {
  eyebrow?: string | null;
  heading?: string | null;
  headingAccent?: string | null;
  posts: BlogPostItem[];
}
