"use server";

import { headers } from "next/headers";
import nodemailer from "nodemailer";
import { render } from "@react-email/render";
import { EmailContainer } from "@/emails";
import {
  isBotSubmission,
  validateContactSubmission,
} from "./contactValidation";

let transporter: nodemailer.Transporter | undefined;

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_REQUESTS_PER_WINDOW = 3;
const DEDUP_WINDOW_MS = 60 * 1000; // 60 seconds idempotency window for rapid double-clicks

const submissionTimestampsByIp = new Map<string, number[]>();
const recentPayloads = new Map<string, number>();

function requiredEnvironmentValue(name: string): string {
  const value = process.env[name]?.trim();
  if (!value || /[\r\n\0]/.test(value)) {
    throw new Error(`Missing or invalid environment variable: ${name}`);
  }
  return value;
}

function getTransporter(user: string, password: string): nodemailer.Transporter {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user, pass: password },
      pool: true,
      maxConnections: 1,
      maxMessages: 20,
    });
  }

  return transporter;
}

function getSafeErrorCode(error: unknown): string {
  if (
    error instanceof Error &&
    "code" in error &&
    typeof error.code === "string"
  ) {
    return error.code;
  }
  return error instanceof Error ? error.name : "UnknownError";
}

async function getClientIp(): Promise<string> {
  try {
    const headerStore = await headers();
    const forwardedFor = headerStore.get("x-forwarded-for");
    if (forwardedFor) {
      return forwardedFor.split(",")[0]?.trim() || "unknown";
    }
    return headerStore.get("x-real-ip")?.trim() || "unknown";
  } catch {
    return "unknown";
  }
}

function isDuplicateSubmission(
  payloadKey: string,
  now = Date.now(),
): boolean {
  for (const [key, timestamp] of recentPayloads.entries()) {
    if (now - timestamp >= DEDUP_WINDOW_MS) {
      recentPayloads.delete(key);
    }
  }

  const lastSentAt = recentPayloads.get(payloadKey);
  if (lastSentAt !== undefined && now - lastSentAt < DEDUP_WINDOW_MS) {
    return true;
  }

  recentPayloads.set(payloadKey, now);
  return false;
}

function isRateLimited(ip: string, now = Date.now()): boolean {
  for (const [key, timestamps] of submissionTimestampsByIp.entries()) {
    const valid = timestamps.filter(
      (timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS,
    );
    if (valid.length === 0) {
      submissionTimestampsByIp.delete(key);
    } else {
      submissionTimestampsByIp.set(key, valid);
    }
  }

  const recent = submissionTimestampsByIp.get(ip) ?? [];
  if (recent.length >= MAX_REQUESTS_PER_WINDOW) {
    return true;
  }

  recent.push(now);
  submissionTimestampsByIp.set(ip, recent);
  return false;
}

export async function sendMail(formData: unknown) {
  // Silently absorb honeypot or sub-800ms bot submissions without sending mail
  if (isBotSubmission(formData)) {
    return { success: true, error: null };
  }

  const validated = validateContactSubmission(formData);
  if (!validated) {
    return { success: false, error: "Please enter valid contact details." };
  }

  // Idempotency guard: if a user double-clicks Submit rapidly, treat the duplicate as succeeded
  const payloadKey = `${validated.email.toLowerCase()}|${validated.subject}|${validated.message}`;
  if (isDuplicateSubmission(payloadKey)) {
    return { success: true, error: null };
  }

  const clientIp = await getClientIp();
  if (isRateLimited(clientIp)) {
    return {
      success: false,
      error: "Too many messages sent recently. Please try again in a few minutes.",
    };
  }

  try {
    const user = requiredEnvironmentValue("SMTP_USER");
    const password = requiredEnvironmentValue("SMTP_PASSWORD");
    const recipient = requiredEnvironmentValue("MAIL_RECIEVER_ADDRESS");
    const mailer = getTransporter(user, password);

    const emailHtml = await render(
      EmailContainer({
        name: validated.name,
        email: validated.email,
        subject: validated.subject,
        message: validated.message,
      }),
    );

    await mailer.sendMail({
      from: `"Website Contact" <${user}>`,
      to: recipient,
      subject: `[${validated.subject}] Message from ${validated.name}`,
      text: `From: ${validated.name} <${validated.email}>\nTopic: ${validated.subject}\n\n${validated.message}`,
      html: emailHtml,
      replyTo: validated.email,
    });

    return { success: true, error: null };
  } catch (error) {
    recentPayloads.delete(payloadKey);
    console.error("Contact form email delivery failed", {
      code: getSafeErrorCode(error),
    });
    return {
      success: false,
      error: "Unable to send message right now. Please try again shortly.",
    };
  }
}
