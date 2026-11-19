import { ImageIcon } from "@sanity/icons";
import { defineField } from "sanity";

import { link } from "../link";

export const customImage = defineField({
  name: "customImage",
  title: "Custom Image",
  icon: ImageIcon,
  type: "object",
  fields: [
    defineField({
      type: "image",
      name: "imageFile",
      options: { hotspot: true },
    }),
    defineField({
      type: "string",
      name: "altText",
      title: "Alternative Text",
      validation: (rule) =>
        rule
          .required()
          .warning("Alternative text is recommended for accessibility"),
    }),
    defineField({
      type: "boolean",
      name: "isClickable",
      title: "Is Clickable?",
      initialValue: false,
      validation: (rule) =>
        rule.custom((isClickable, context) => {
          if (!isClickable) return true;
          const parent = context.parent as { link?: unknown } | undefined;
          if (!parent?.link || typeof parent.link !== "object") {
            return "Configure the link details when the image is clickable.";
          }
          return true;
        }),
    }),
    defineField({
      ...link("link"),
      hidden: ({ parent }) => !parent?.isClickable,
    }),
  ],
});
