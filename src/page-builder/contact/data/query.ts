import { defineQuery } from "next-sanity";

import { SECTION_HEADING_FRAGMENT, SEO_FIELDS_FRAGMENT } from "@/fragments";
import { PAGE_SECTIONS_FRAGMENT } from "@/sections/section-builder/fragment";

/** Singleton Contact page query, including the page-owned opening and sections. */
export const CONTACT_PAGE_QUERY = defineQuery(
  `*[_type == "contactPage"][0]{
    ${SEO_FIELDS_FRAGMENT},
    ${SECTION_HEADING_FRAGMENT},
    description,
    ${PAGE_SECTIONS_FRAGMENT}
  }`,
);
