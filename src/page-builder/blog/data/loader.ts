import { cache } from "react";

import { sanityFetch } from "@/sanity/lib/live";
import { BLOG_PAGE_QUERY } from "./query";

/** Deduplicates the Blog page query across route rendering and metadata. */
export const getBlogPage = cache(async () => {
  try {
    return await sanityFetch({ query: BLOG_PAGE_QUERY });
  } catch (error) {
    console.warn("[getBlogPage] Network error fetching blog page:", error);
    return { data: null };
  }
});
