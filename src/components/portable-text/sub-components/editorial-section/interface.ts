import type { IPortableTextTypedObject } from "../../interface";

export interface IEditorialSectionProps {
  /**
   * Controls the section layout within the parent container's full width:
   * - `twoColumn` (default): label on the left, heading and body on the right.
   * - `straightforward`: single-column narrative flow.
   */
  layout?: "twoColumn" | "straightforward" | string | null;
  label?: string | null;
  autoNumber?: boolean | null;
  stepNumber?: number | null;
  heading?: string | null;
  body?: IPortableTextTypedObject[] | null;
}
