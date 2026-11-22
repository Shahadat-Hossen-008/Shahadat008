import { PortableText } from "next-sanity";
import { formatEditorialLabel } from "../../numbering";
import { inlinePortableTextComponents } from "../inline-components";
import type { IEditorialSectionProps } from "./interface";

/**
 * Renders an Editorial Section inside Portable Text.
 *
 * - `twoColumn` (default): Asymmetric 4fr / 8fr split inside the parent
 *   container (numbered monospace label on the left, heading + body on the right).
 * - `straightforward`: Single-column reading flow using full parent width (`w-full min-w-0`).
 */
export function EditorialSectionBlock({
  layout = "twoColumn",
  label,
  autoNumber = true,
  stepNumber,
  heading,
  body,
}: IEditorialSectionProps) {
  const hasHeading = Boolean(heading?.trim());
  const hasBody = Array.isArray(body) && body.length > 0;

  if (!hasHeading && !hasBody && !label?.trim()) {
    return null;
  }

  const formattedLabel = formatEditorialLabel(
    label,
    autoNumber === false ? null : stepNumber,
  );

  if (layout === "straightforward") {
    return (
      <section data-editorial-section="single" className="my-10 w-full min-w-0">
        <div className="flex w-full min-w-0 flex-col gap-4">
          {formattedLabel && (
            <p className="font-mono text-label uppercase text-muted-foreground">
              {formattedLabel}
            </p>
          )}
          {hasHeading && (
            <h2 className="w-full font-display text-2xl sm:text-3xl font-semibold text-balance text-foreground">
              {heading}
            </h2>
          )}
          {hasBody && (
            <div className="mt-1 w-full min-w-0 [&>*:first-child]:mt-0">
              <PortableText
                value={body}
                components={inlinePortableTextComponents}
              />
            </div>
          )}
        </div>
      </section>
    );
  }

  return (
    <section
      data-editorial-section="twoColumn"
      className="my-10 w-full min-w-0"
    >
      <div className="grid grid-cols-1 gap-6 bento:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] bento:gap-12">
        <div className="min-w-0">
          {formattedLabel && (
            <p className="font-mono pt-2 text-label uppercase text-muted-foreground">
              {formattedLabel}
            </p>
          )}
        </div>
        <div className="flex w-full min-w-0 flex-col gap-5 [&>*:first-child]:mt-0">
          {hasHeading && (
            <h2 className="w-full font-display text-2xl sm:text-3xl font-semibold text-balance text-foreground">
              {heading}
            </h2>
          )}
          {hasBody && (
            <div className="w-full min-w-0 [&>*:first-child]:mt-0">
              <PortableText
                value={body}
                components={inlinePortableTextComponents}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default EditorialSectionBlock;
