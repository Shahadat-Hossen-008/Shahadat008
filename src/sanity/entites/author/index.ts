import { StringRule, defineField, defineType } from "sanity";
import { UserIcon } from "@sanity/icons";

export default defineType({
  name: "author",
  type: "document",
  title: "Author",
  icon: UserIcon,
  fields: [
    defineField({
      name: "fullName",
      title: "Full Name",
      type: "string",
      description: "The full name of the author.",
      validation: (rule: StringRule) =>
        rule.required().error("Please provide the full name."),
    }),
    defineField({
      name: "description",
      title: "Role / Title",
      type: "text",
      rows: 2,
      description:
        "Short role or title shown in the article byline, e.g. “Software Engineer”.",
      validation: (rule: StringRule) =>
        rule.required().error("Please provide a short role or description."),
    }),
    defineField({
      name: "avatar",
      title: "Avatar",
      type: "customImage",
      description: "Optional profile photo shown beside the author byline.",
    }),
  ],
  preview: {
    select: {
      fullName: "fullName",
      role: "description",
      media: "avatar.imageFile",
    },
    prepare({ fullName, role, media }) {
      return {
        title: fullName,
        media: media ?? UserIcon,
        subtitle: role || "Author",
      };
    },
  },
});
