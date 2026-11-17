export const CONTACT_SUBJECT_OPTIONS = [
  "Project Inquiry",
  "Job Opportunity",
  "Collaboration",
  "General Message",
] as const;

export type ContactSubjectOption = (typeof CONTACT_SUBJECT_OPTIONS)[number];

export interface FormSubmitData {
  name: string;
  email: string;
  subject: ContactSubjectOption;
  message: string;
  /** Hidden honeypot field — must stay empty for human submissions. */
  website?: string;
  /** Client mount timestamp (`Date.now()`) used to compute same-clock fill duration. */
  renderedAt?: number;
  /** Client-computed fill duration (`Date.now() - renderedAt`) immune to server clock skew. */
  elapsedMs?: number;
}
