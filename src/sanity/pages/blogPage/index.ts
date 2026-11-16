import { defineArrayMember, defineField, defineType } from "sanity";
import { SiSanity } from "react-icons/si";
import { FaBlog } from "react-icons/fa";
import { seo, seoGroup } from "@/sanity/_root/seo";
import { sectionHeaderFields } from "@/sanity/_root/section-header";

export const blog = defineType({
  name: "blogPage",
  title: "Blog Page",
  type: "document",
  icon: FaBlog,
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
    seo({ group: "seo", slugOptions: { isFixed: true, prefix: "blogs" } }),
    ...sectionHeaderFields({
      headingMax: 60,
      headingDescription:
        "Main headline of the blog page, e.g. “Notes on engineering & design.”. Max 60 characters.",
      group: "content",
    }),
    defineField({
      name: "blogPosts",
      title: "Blog Posts",
      type: "array",
      description:
        "Posts shown on the blog index, in order. Drag to reorder. Leave empty to show all published posts automatically.",
      group: "content",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "blogPost" }],
        }),
      ],
      validation: (rule) => rule.unique(),
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
        title: title || "Blog Page",
        subtitle: "Blog Page",
      };
    },
  },
});
