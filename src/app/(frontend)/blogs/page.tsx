import type { Metadata } from "next";

import {
  BlogPageBuilder,
  generateBlogMetadata,
  getBlogPage,
} from "@/page-builder/blog";

export async function generateMetadata(): Promise<Metadata> {
  return generateBlogMetadata();
}

export default async function BlogsPage() {
  const { data: blogPage } = await getBlogPage();

  return <BlogPageBuilder page={blogPage} />;
}
