import { defineField, defineType } from "sanity";
import { SiSanity } from "react-icons/si";
import { IoMailOutline } from "react-icons/io5";

import { seo, seoGroup } from "@/sanity/_root/seo";
import { sectionHeaderFields } from "@/sanity/_root/section-header";

export const contact = defineType({
  name: "contactPage",
  title: "Contact Page",
  type: "document",
  icon: IoMailOutline,
  groups: [
    seoGroup,
    {
      name: "content",
      title: "Content",
      icon: SiSanity,
      default: true,
    },
  ],
  fields: [
    seo({ group: "seo", slugOptions: { isFixed: true, prefix: "contact" } }),
    ...sectionHeaderFields({
      headingMax: 60,
      headingDescription:
        "Main headline of the contact page, e.g. “Let’s build something careful together.”. Max 60 characters.",
      group: "content",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
      group: "content",
      description:
        "Short supporting intro below the heading, e.g. “I’m open to conversations about frontend architecture, design systems, and product-focused engineering.”. Max 220 characters.",
      validation: (rule) => rule.max(220),
    }),
    defineField({
      name: "pageSections",
      title: "Page Sections",
      type: "pageSections",
      group: "content",
    }),
  ],
  preview: {
    select: {
      title: "seo.title",
    },
    prepare({ title }) {
      return {
        title: title || "Contact Page",
        subtitle: "Contact Page",
      };
    },
  },
});
