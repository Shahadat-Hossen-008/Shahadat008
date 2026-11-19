// @vitest-environment jsdom
import {
  createSchema,
  defineArrayMember,
  defineField,
  defineType,
  validateDocument,
} from "sanity";
import { describe, expect, it } from "vitest";

import { INTERNAL_REFERENCE_TYPES } from "@/lib/sanity/routes";
import { link } from "@/sanity/_root/link";
import { customImage } from "./index";

const compiledSchema = createSchema({
  name: "custom-image-test",
  types: [
    customImage,
    ...INTERNAL_REFERENCE_TYPES.map((name) =>
      defineType({
        name,
        type: "document",
        fields: [defineField({ name: "title", type: "string" })],
      }),
    ),
    defineType({
      name: "testImageDoc",
      type: "document",
      fields: [
        defineField({
          name: "heroImage",
          type: "customImage",
        }),
        defineField({
          name: "nestedGroup",
          type: "object",
          fields: [
            defineField({
              name: "portrait",
              type: "customImage",
            }),
          ],
        }),
        defineField({
          name: "body",
          type: "array",
          of: [
            defineArrayMember({
              name: "portableTextImage",
              type: "customImage",
            }),
          ],
        }),
        defineField({
          ...link("standaloneLink"),
        }),
      ],
    }),
  ],
});

const mockWorkspace = {
  schema: compiledSchema,
  getClient: () => ({
    fetch: async () => null,
  }),
};

function validateDoc(fields: Record<string, unknown>) {
  return validateDocument({
    document: {
      _id: "test-doc-1",
      _type: "testImageDoc",
      _createdAt: "2024-01-01T00:00:00Z",
      _updatedAt: "2024-01-01T00:00:00Z",
      _rev: "rev-1",
      ...fields,
    },
    workspace: mockWorkspace as never,
    getClient: mockWorkspace.getClient as never,
    getDocumentExists: async () => true,
    environment: "cli",
  });
}

function makeImage(overrides: Record<string, unknown> = {}) {
  return {
    _type: "customImage",
    altText: "Project mockup",
    ...overrides,
  };
}

describe("customImage conditional shared link schema", () => {
  it("hides the link field unless isClickable is true", () => {
    const linkField = customImage.fields.find((f) => f.name === "link");
    expect(linkField).toBeDefined();
    expect(typeof linkField?.hidden).toBe("function");

    const hiddenFn = linkField!.hidden as (ctx: {
      parent?: { isClickable?: boolean };
    }) => boolean;
    expect(hiddenFn({ parent: { isClickable: false } })).toBe(true);
    expect(hiddenFn({ parent: {} })).toBe(true);
    expect(hiddenFn({ parent: { isClickable: true } })).toBe(false);
  });

  it("produces no validation errors when isClickable is false and link is omitted", async () => {
    const markers = await validateDoc({
      heroImage: makeImage({ isClickable: false }),
    });

    const errors = markers.filter(
      (m) => m.level === "error" && m.path[0] === "heroImage",
    );
    expect(errors).toEqual([]);
  });

  it("requires link details on isClickable when isClickable is true and link is omitted", async () => {
    const markers = await validateDoc({
      heroImage: makeImage({ isClickable: true }),
    });

    const errors = markers.filter(
      (m) => m.level === "error" && m.path[0] === "heroImage",
    );
    expect(errors).toHaveLength(1);
    expect(errors[0]?.path).toEqual(["heroImage", "isClickable"]);
    expect(errors[0]?.message).toBe(
      "Configure the link details when the image is clickable.",
    );
  });

  it("enforces shared link field validation when isClickable is true with an incomplete external link", async () => {
    const markers = await validateDoc({
      heroImage: makeImage({
        isClickable: true,
        link: { type: "external" },
      }),
    });

    const errors = markers.filter(
      (m) => m.level === "error" && m.path[0] === "heroImage",
    );
    expect(errors.map((m) => m.message)).toEqual(
      expect.arrayContaining([
        "A label is required.",
        "An external link needs a URL.",
      ]),
    );
  });

  it("enforces shared reference validation when isClickable is true with an incomplete internal link", async () => {
    const markers = await validateDoc({
      heroImage: makeImage({
        isClickable: true,
        link: { label: "Read more", type: "internal" },
      }),
    });

    const errors = markers.filter(
      (m) => m.level === "error" && m.path[0] === "heroImage",
    );
    expect(errors.map((m) => m.message)).toEqual(
      expect.arrayContaining(["Choose the page this link should open."]),
    );
  });

  it("passes validation when isClickable is true with a valid external link", async () => {
    const markers = await validateDoc({
      heroImage: makeImage({
        isClickable: true,
        link: {
          label: "Visit project",
          type: "external",
          url: "https://example.com",
          openInNewTab: true,
          isDisabled: false,
        },
      }),
    });

    const errors = markers.filter(
      (m) => m.level === "error" && m.path[0] === "heroImage",
    );
    expect(errors).toEqual([]);
  });

  it("passes validation when isClickable is true with a valid internal link", async () => {
    const markers = await validateDoc({
      heroImage: makeImage({
        isClickable: true,
        link: {
          label: "About page",
          type: "internal",
          reference: { _type: "reference", _ref: "aboutPage" },
          openInNewTab: false,
          isDisabled: false,
        },
      }),
    });

    const errors = markers.filter(
      (m) => m.level === "error" && m.path[0] === "heroImage",
    );
    expect(errors).toEqual([]);
  });

  it("applies the same validation inside a nested object", async () => {
    const disabledMarkers = await validateDoc({
      nestedGroup: { portrait: makeImage({ isClickable: false }) },
    });
    expect(
      disabledMarkers.filter(
        (m) => m.level === "error" && m.path[0] === "nestedGroup",
      ),
    ).toEqual([]);

    const missingLinkMarkers = await validateDoc({
      nestedGroup: { portrait: makeImage({ isClickable: true }) },
    });
    const missingErrors = missingLinkMarkers.filter(
      (m) => m.level === "error" && m.path[0] === "nestedGroup",
    );
    expect(missingErrors).toHaveLength(1);
    expect(missingErrors[0]?.path).toEqual([
      "nestedGroup",
      "portrait",
      "isClickable",
    ]);

    const invalidLinkMarkers = await validateDoc({
      nestedGroup: {
        portrait: makeImage({ isClickable: true, link: { type: "external" } }),
      },
    });
    expect(
      invalidLinkMarkers
        .filter((m) => m.level === "error" && m.path[0] === "nestedGroup")
        .map((m) => m.message),
    ).toEqual(
      expect.arrayContaining([
        "A label is required.",
        "An external link needs a URL.",
      ]),
    );
  });

  it("applies the same validation inside an array item (e.g. portableTextImage)", async () => {
    const disabledMarkers = await validateDoc({
      body: [
        {
          _key: "img-1",
          _type: "portableTextImage",
          altText: "Diagram",
          isClickable: false,
        },
      ],
    });
    expect(
      disabledMarkers.filter(
        (m) => m.level === "error" && m.path[0] === "body",
      ),
    ).toEqual([]);

    const missingLinkMarkers = await validateDoc({
      body: [
        {
          _key: "img-2",
          _type: "portableTextImage",
          altText: "Diagram",
          isClickable: true,
        },
      ],
    });
    const missingErrors = missingLinkMarkers.filter(
      (m) => m.level === "error" && m.path[0] === "body",
    );
    expect(missingErrors).toHaveLength(1);
    expect(missingErrors[0]?.path).toEqual([
      "body",
      { _key: "img-2" },
      "isClickable",
    ]);

    const invalidLinkMarkers = await validateDoc({
      body: [
        {
          _key: "img-3",
          _type: "portableTextImage",
          altText: "Diagram",
          isClickable: true,
          link: { label: "Docs", type: "internal" },
        },
      ],
    });
    expect(
      invalidLinkMarkers
        .filter((m) => m.level === "error" && m.path[0] === "body")
        .map((m) => m.message),
    ).toEqual(
      expect.arrayContaining(["Choose the page this link should open."]),
    );
  });

  it("documents accepted Option A trade-off: hidden partial leftover link data still triggers shared link validation", async () => {
    const markers = await validateDoc({
      heroImage: makeImage({
        isClickable: false,
        link: { type: "external" },
      }),
    });

    const errors = markers.filter(
      (m) => m.level === "error" && m.path[0] === "heroImage",
    );
    expect(errors.map((m) => m.message)).toEqual(
      expect.arrayContaining([
        "A label is required.",
        "An external link needs a URL.",
      ]),
    );
  });

  it("does not weaken standalone shared link() validation outside customImage", async () => {
    const markers = await validateDoc({
      standaloneLink: { type: "external" },
    });

    const linkErrors = markers.filter(
      (m) => m.level === "error" && m.path[0] === "standaloneLink",
    );
    expect(linkErrors.map((m) => m.message)).toEqual(
      expect.arrayContaining([
        "A label is required.",
        "An external link needs a URL.",
      ]),
    );
  });
});
