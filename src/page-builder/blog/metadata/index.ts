import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { getRedirectTarget } from "@/lib/metadata";
import { buildPageMetadata } from "@/page-builder/shared/metadata";
import { getBlogPage } from "../data/loader";

export async function generateBlogMetadata(): Promise<Metadata> {
  const blogPageResult = getBlogPage();
  const [{ data: blogPage }, metadata] = await Promise.all([
    blogPageResult,
    buildPageMetadata({
      pageSeo: blogPageResult.then(({ data }) => data?.seo),
      path: "/blogs",
    }),
  ]);

  const redirectTarget = getRedirectTarget(blogPage?.seo);

  if (redirectTarget) {
    redirect(redirectTarget);
  }

  return metadata;
}
