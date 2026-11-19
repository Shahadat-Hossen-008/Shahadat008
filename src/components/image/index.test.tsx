import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { SanityImage } from "./index";

const mockImage = {
  _type: "image" as const,
  asset: {
    _type: "reference" as const,
    _ref: "image-Tb9Ew8CXIwaY6R1kjMvI0uRR-2000x3000-jpg",
  },
};

describe("SanityImage alt text", () => {
  it("passes editor-provided alt text through unchanged without a prefix", () => {
    const html = renderToStaticMarkup(
      <SanityImage
        image={mockImage}
        alt="Architecture diagram of the ingestion pipeline"
        width={800}
        height={600}
      />,
    );

    expect(html).toContain(
      'alt="Architecture diagram of the ingestion pipeline"',
    );
    expect(html).not.toContain("portfolio of");
  });

  it("renders an empty alt attribute for decorative images", () => {
    const html = renderToStaticMarkup(
      <SanityImage image={mockImage} alt="" width={800} height={600} />,
    );

    expect(html).toContain('alt=""');
    expect(html).not.toContain("portfolio of");
  });

  it("renders an empty alt attribute when alt is undefined or null", () => {
    const undefinedHtml = renderToStaticMarkup(
      <SanityImage image={mockImage} width={800} height={600} />,
    );
    const nullHtml = renderToStaticMarkup(
      <SanityImage image={mockImage} alt={null} width={800} height={600} />,
    );

    expect(undefinedHtml).toContain('alt=""');
    expect(undefinedHtml).not.toContain("undefined");
    expect(undefinedHtml).not.toContain("portfolio of");

    expect(nullHtml).toContain('alt=""');
    expect(nullHtml).not.toContain("null");
    expect(nullHtml).not.toContain("portfolio of");
  });
});
