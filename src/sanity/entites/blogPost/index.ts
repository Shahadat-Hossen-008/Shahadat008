import { DocumentIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";
import { SiSanity } from "react-icons/si";

import { splitHeadline } from "@/lib/hero";
import { seo, seoGroup } from "@/sanity/_root/seo";
import { slug } from "@/sanity/_root/seo/slug";

export default defineType({
  name: "blogPost",
  title: "Blog Post",
  type: "document",
  icon: DocumentIcon,
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
    /**
     * Per-article SEO. `includeSlug: false` because `blogPost` already owns a
     * top level `slug` that drives `/blogs/[slug]` — a second slug here would
     * be a second source of truth for the same URL. `seo.openGraph.image`
     * serves as the article's social/OG preview image.
     */
    seo({ group: "seo", includeSlug: false, optional: true }),
    defineField({
      name: "blogTitle",
      title: "Blog Title",
      type: "string",
      group: "content",
      validation: (Rule) =>
        Rule.required().error(
          "Blog title is required to generate a page on the website.",
        ),
    }),
    defineField({
      name: "titleAccent",
      title: "Title Accent",
      type: "string",
      group: "content",
      description:
        "Optional. A phrase from the blog title shown in italic, e.g. “Intent-Based”. Must match exact case.",
      validation: (rule) =>
        rule.custom((value, context) => {
          if (typeof value !== "string" || !value.trim()) return true;
          const title = (context.parent as { blogTitle?: string } | undefined)
            ?.blogTitle;
          return splitHeadline(title, value).length === 3
            ? true
            : "Title accent must appear in the blog title with matching case.";
        }),
    }),
    {
      ...slug({ source: "blogTitle", isFixed: false, prefix: "blogs" }),
      group: "content",
    },
    defineField({
      name: "author",
      title: "Author",
      type: "reference",
      to: [{ type: "author" }],
      group: "content",
      validation: (Rule) =>
        Rule.required().error("Please select an author for this post."),
    }),
    defineField({
      name: "publishedAt",
      title: "Published At",
      type: "datetime",
      group: "content",
      validation: (Rule) =>
        Rule.required().error("Please provide a publish date."),
    }),
    defineField({
      name: "categories",
      title: "Blog Tags",
      type: "array",
      description: "Topics used for tagging and filtering on the blog page.",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "blogTag" }],
        }),
      ],
      validation: (rule) => rule.unique().max(4),
      group: "content",
    }),
    defineField({
      name: "excerpt",
      title: "Excerpt",
      type: "text",
      rows: 3,
      group: "content",
      description:
        "Short 1–2 sentence summary shown on the blog index. Max 220 characters.",
      validation: (rule) =>
        rule
          .required()
          .max(220)
          .error("Please provide a concise excerpt (max 220 characters)."),
    }),
    defineField({
      name: "blogContent",
      title: "Blog Content",
      type: "portableText",
      group: "content",
      validation: (rule) =>
        rule.required().error("Blog content cannot be empty."),
    }),
  ],
  preview: {
    select: {
      title: "blogTitle",
      authorName: "author.fullName",
      media: "author.avatar.imageFile",
    },
    prepare({ title, media, authorName }) {
      return {
        title,
        media: media ?? DocumentIcon,
        subtitle: authorName ? `by ${authorName}` : undefined,
      };
    },
  },
});
