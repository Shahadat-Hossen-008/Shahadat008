import type { Metadata } from "next";

import {
  ContactPageBuilder,
  generateContactMetadata,
  getContactPage,
} from "@/page-builder/contact";

export async function generateMetadata(): Promise<Metadata> {
  return generateContactMetadata();
}

export default async function ContactPage() {
  const { data: contactPage } = await getContactPage();

  return <ContactPageBuilder page={contactPage} />;
}
