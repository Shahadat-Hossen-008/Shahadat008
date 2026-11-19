import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { ContactPageBuilder } from "./index";

describe("ContactPageBuilder", () => {
  it("renders contact heading, description, dropdown options, and submit button", () => {
    const html = renderToStaticMarkup(
      <ContactPageBuilder
        page={{
          seo: {
            title: "Contact",
            description: "Get in touch",
            openGraph: null,
            robots: null,
            canonicalUrl: null,
            redirect: null,
            keywords: null,
          },
          eyebrow: "GET IN TOUCH",
          heading: "Let’s build something careful together.",
          headingAccent: "careful together.",
          description:
            "I’m open to conversations about frontend architecture, design systems, and product-focused engineering.",
          sections: [],
        }}
      />,
    );

    expect(html).toContain("GET IN TOUCH");
    expect(html).toContain("careful together.");
    expect(html).toContain(
      "I’m open to conversations about frontend architecture",
    );
    expect(html).toContain("FULL NAME");
    expect(html).toContain("EMAIL ADDRESS");
    expect(html).toContain("WHAT&#x27;S THIS ABOUT?");
    expect(html).toContain("Project Inquiry");
    expect(html).toContain("Job Opportunity");
    expect(html).toContain("Collaboration");
    expect(html).toContain("General Message");
    expect(html).toContain("MESSAGE");
    expect(html).toContain("SEND MESSAGE");
    expect(html).not.toContain("<main");
  });
});
