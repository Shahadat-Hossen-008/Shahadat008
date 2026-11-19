import { ContactSection } from "@/sections/contact";
import { SectionBuilder } from "@/sections/section-builder";
import type { IContactPageBuilderProps } from "./interface";

export function ContactPageBuilder({ page }: IContactPageBuilderProps) {
  return (
    <div className="pt-8 pb-28">
      <ContactSection
        eyebrow={page?.eyebrow}
        heading={page?.heading}
        headingAccent={page?.headingAccent}
        description={page?.description}
      />
      {page?.sections && <SectionBuilder sections={page.sections} />}
    </div>
  );
}

export default ContactPageBuilder;
