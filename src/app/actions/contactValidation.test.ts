import { describe, expect, it } from "vitest";

import {
  isBotSubmission,
  validateContactSubmission,
} from "./contactValidation";

const validSubmission = {
  name: "Taylor",
  email: "taylor@example.com",
  subject: "Project Inquiry",
  message: "A message\nwith multiple lines.",
};

describe("validateContactSubmission", () => {
  it("trims and accepts valid contact details across all allowed inquiry types", () => {
    expect(
      validateContactSubmission({
        name: " Taylor ",
        email: " taylor@example.com ",
        subject: " Job Opportunity ",
        message: " A message ",
      }),
    ).toEqual({
      name: "Taylor",
      email: "taylor@example.com",
      subject: "Job Opportunity",
      message: "A message",
    });
  });

  it("allows recruiter messages with up to 10 reference links", () => {
    const messageWithLinks = Array.from(
      { length: 8 },
      (_, i) => `https://company.example.com/link-${i}`,
    ).join(" ");
    expect(
      validateContactSubmission({
        ...validSubmission,
        message: messageWithLinks,
      }),
    ).not.toBeNull();
  });

  it.each([
    null,
    [],
    { ...validSubmission, name: 1 },
    { ...validSubmission, email: "not an email" },
    { ...validSubmission, email: `victim@example.com\r\nBcc: bad@example.com` },
    { ...validSubmission, subject: "Unlisted Subject" },
    { ...validSubmission, subject: "Project Inquiry\r\nBcc: bad@example.com" },
    { ...validSubmission, name: " ".repeat(101) },
    { ...validSubmission, message: "m".repeat(5001) },
    { ...validSubmission, message: "not empty\0hidden" },
    {
      ...validSubmission,
      message: Array.from({ length: 11 }, (_, i) => `https://spam${i}.com`).join(
        " ",
      ),
    },
  ])("rejects invalid contact payload %#", (value) => {
    expect(validateContactSubmission(value)).toBeNull();
  });

  it("detects honeypot and sub-800ms bot payloads using same-clock elapsedMs", () => {
    expect(
      isBotSubmission({ ...validSubmission, _gotcha: "https://bot.example" }),
    ).toBe(true);
    expect(isBotSubmission({ ...validSubmission, elapsedMs: 250 })).toBe(true);
    expect(
      isBotSubmission({ ...validSubmission, _gotcha: "", elapsedMs: 1200 }),
    ).toBe(false);
  });
});
