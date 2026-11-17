import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { getRedirectTarget } from "@/lib/metadata";
import { buildPageMetadata } from "@/page-builder/shared/metadata";
import { getContactPage } from "../data/loader";

export async function generateContactMetadata(): Promise<Metadata> {
  const contactPageResult = getContactPage();
  const [{ data: contactPage }, metadata] = await Promise.all([
    contactPageResult,
    buildPageMetadata({
      pageSeo: contactPageResult.then(({ data }) => data?.seo),
      path: "/contact",
    }),
  ]);

  const redirectTarget = getRedirectTarget(contactPage?.seo);

  if (redirectTarget) {
    redirect(redirectTarget);
  }

  return metadata;
}
