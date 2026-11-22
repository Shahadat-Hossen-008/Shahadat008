import { defineField } from "sanity";

const collapsedTile = { collapsible: true, collapsed: true };

export const learningField = defineField({
  name: "learning",
  title: "Current focus & exploration tile",
  type: "object",
  description:
    "Bottom-left tile: what you are exploring, learning, or interested in next.",
  options: collapsedTile,
  fields: [
    defineField({
      name: "eyebrow",
      title: "Eyebrow label",
      type: "string",
      description:
        "Small uppercase label, e.g. Exploring next. Max 30 characters.",
      initialValue: "Exploring next",
      validation: (rule) => rule.max(30),
    }),
    defineField({
      name: "title",
      title: "Topic or exploration",
      type: "string",
      description:
        "One clear line about what you are exploring, learning, or interested in next. Max 140 characters.",
      validation: (rule) => rule.max(140),
    }),
    defineField({
      name: "status",
      title: "Status label",
      type: "string",
      description: "Status indicator text, e.g. Exploring. Max 30 characters.",
      initialValue: "Exploring",
      validation: (rule) => rule.max(30),
    }),
  ],
});
