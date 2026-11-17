import { SectionHeading } from "@/components/section-heading";
import { cleanText } from "@/sections/shared/section-formatting";
import { ContactForm } from "./sub-components/form";
import type { IContactSectionProps } from "./interface";

const DEFAULT_DESCRIPTION =
  "I’m open to conversations about frontend architecture, design systems, and product-focused engineering.";

export function ContactSection({
  eyebrow,
  heading,
  headingAccent,
  description,
}: IContactSectionProps) {
  const cleanDescription = cleanText(description) || DEFAULT_DESCRIPTION;

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="bg-background text-foreground"
    >
      <div className="mx-auto w-full max-w-page px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10 pb-20 sm:pb-28 lg:pb-36">
        <SectionHeading
          as="h1"
          id="contact-heading"
          eyebrow={eyebrow || "GET IN TOUCH"}
          heading={heading || "Let’s build something careful together."}
          headingAccent={headingAccent ?? "careful together."}
        />

        <p className="mt-6 max-w-2xl font-sans text-lg sm:text-xl leading-relaxed text-muted-foreground text-pretty">
          {cleanDescription}
        </p>

        <div className="mt-12 sm:mt-16 max-w-reading">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}

export default ContactSection;
