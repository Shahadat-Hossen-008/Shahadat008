import { cache } from "react";

import { sanityFetch } from "@/sanity/lib/live";
import { CONTACT_PAGE_QUERY } from "./query";

/** Deduplicates the Contact page query across route rendering and metadata. */
export const getContactPage = cache(async () => {
  try {
    return await sanityFetch({ query: CONTACT_PAGE_QUERY });
  } catch (error) {
    console.warn("[getContactPage] Network error fetching contact page:", error);
    return { data: null };
  }
});
