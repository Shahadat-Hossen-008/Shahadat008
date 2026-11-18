import {
  CONTACT_SUBJECT_OPTIONS,
  type ContactSubjectOption,
  type FormSubmitData,
} from "@/sections/contact/sub-components/form/interface";

export const EMAIL_PATTERN =
  /^[A-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?(?:\.[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?)+$/i;
const HEADER_CONTROL_CHARACTERS = /[\u0000-\u001f\u007f]/;
const MESSAGE_CONTROL_CHARACTERS =
  /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/;
const URL_LINK_PATTERN = /https?:\/\/|www\./gi;

const ALLOWED_SUBJECTS = new Set<string>(CONTACT_SUBJECT_OPTIONS);
const MIN_HUMAN_FILL_MS = 800;
export const MAX_MESSAGE_LINKS = 10;

export function countMessageLinks(text: string): number {
  return (text.match(URL_LINK_PATTERN) ?? []).length;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Detects automated bot submissions via:
 * 1. Filled non-vCard honeypot (`_gotcha` field)
 * 2. Same-clock fill duration faster than human interaction (`elapsedMs < 800ms`),
 *    avoiding false positives from client-vs-server clock skew.
 */
export function isBotSubmission(value: unknown): boolean {
  if (!isRecord(value)) return false;

  if (typeof value._gotcha === "string" && value._gotcha.trim().length > 0) {
    return true;
  }

  if (
    typeof value.elapsedMs === "number" &&
    Number.isFinite(value.elapsedMs) &&
    value.elapsedMs >= 0 &&
    value.elapsedMs < MIN_HUMAN_FILL_MS
  ) {
    return true;
  }

  return false;
}

export function validateContactSubmission(
  value: unknown,
): Pick<FormSubmitData, "name" | "email" | "subject" | "message"> | null {
  if (!isRecord(value)) return null;

  const { name, email, subject, message } = value;
  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof subject !== "string" ||
    typeof message !== "string"
  ) {
    return null;
  }

  const cleanName = name.trim();
  const cleanEmail = email.trim();
  const cleanSubject = subject.trim();
  const cleanMessage = message.trim();

  if (
    cleanName.length === 0 ||
    cleanName.length > 100 ||
    HEADER_CONTROL_CHARACTERS.test(cleanName) ||
    cleanEmail.length > 254 ||
    HEADER_CONTROL_CHARACTERS.test(cleanEmail) ||
    !EMAIL_PATTERN.test(cleanEmail) ||
    !ALLOWED_SUBJECTS.has(cleanSubject) ||
    HEADER_CONTROL_CHARACTERS.test(cleanSubject) ||
    cleanMessage.length === 0 ||
    cleanMessage.length > 5000 ||
    MESSAGE_CONTROL_CHARACTERS.test(cleanMessage) ||
    countMessageLinks(cleanMessage) > MAX_MESSAGE_LINKS
  ) {
    return null;
  }

  return {
    name: cleanName,
    email: cleanEmail,
    subject: cleanSubject as ContactSubjectOption,
    message: cleanMessage,
  };
}
