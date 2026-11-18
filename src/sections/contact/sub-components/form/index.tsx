"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

import {
  countMessageLinks,
  EMAIL_PATTERN,
  MAX_MESSAGE_LINKS,
} from "@/app/actions/contactValidation";
import { sendMail } from "@/app/actions/sendEmail";
import {
  CONTACT_SUBJECT_OPTIONS,
  type FormSubmitData,
} from "./interface";

const LABEL_CLASS =
  "font-sans text-xs font-semibold uppercase tracking-[0.18em] text-foreground";
const INPUT_CLASS =
  "w-full rounded-lg border border-foreground/20 bg-transparent px-4 py-3.5 font-sans text-base text-foreground placeholder:text-muted-foreground/60 transition-colors duration-200 focus-visible:outline-none focus-visible:border-foreground focus-visible:ring-1 focus-visible:ring-foreground aria-[invalid=true]:border-error aria-[invalid=true]:focus-visible:border-error aria-[invalid=true]:focus-visible:ring-error";
const ERROR_TEXT_CLASS = "font-sans text-xs font-medium text-error mt-1";

function computeElapsedMs(renderedAt?: number): number | undefined {
  if (!renderedAt || renderedAt <= 0) return undefined;
  return Math.max(0, Date.now() - renderedAt);
}

export function ContactForm() {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormSubmitData>({
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      subject: "Project Inquiry",
      message: "",
      _gotcha: "",
      renderedAt: 0,
    },
  });

  useEffect(() => {
    setValue("renderedAt", Date.now());
  }, [setValue]);

  const onSubmit = async (data: FormSubmitData) => {
    const result = await sendMail({
      ...data,
      elapsedMs: computeElapsedMs(data.renderedAt),
    });

    if (result.success) {
      toast.success("Message sent successfully", {
        position: "bottom-right",
        toastId: "contact-form-success",
      });
      reset({
        name: "",
        email: "",
        subject: "Project Inquiry",
        message: "",
        _gotcha: "",
        renderedAt: data.renderedAt,
      });
    } else {
      toast.error(result.error, {
        position: "bottom-right",
        toastId: "contact-form-error",
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="flex flex-col gap-7 sm:gap-8"
    >
      {/* Non-vCard Honeypot Trap (ignored by browser autofill & password managers) */}
      <div aria-hidden="true" className="sr-only">
        <label htmlFor="_gotcha">Do not fill this field</label>
        <input
          type="text"
          id="_gotcha"
          tabIndex={-1}
          autoComplete="new-password"
          data-1p-ignore="true"
          data-lpignore="true"
          data-form-type="other"
          {...register("_gotcha")}
        />
      </div>

      {/* Row 1: Full Name & Email Address */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-7">
        <div className="flex flex-col gap-2.5">
          <label htmlFor="name" className={LABEL_CLASS}>
            FULL NAME <span aria-hidden="true">*</span>
          </label>
          <input
            type="text"
            id="name"
            autoComplete="name"
            placeholder="What should I call you?"
            maxLength={100}
            aria-required="true"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "name-error" : undefined}
            className={INPUT_CLASS}
            {...register("name", {
              required: "Please enter your name.",
              maxLength: {
                value: 100,
                message: "Name must be 100 characters or fewer.",
              },
              validate: (value) =>
                value.trim().length > 0 || "Please enter your name.",
            })}
          />
          {errors.name && (
            <p id="name-error" className={ERROR_TEXT_CLASS}>
              {errors.name.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2.5">
          <label htmlFor="email" className={LABEL_CLASS}>
            EMAIL ADDRESS <span aria-hidden="true">*</span>
          </label>
          <input
            type="email"
            id="email"
            autoComplete="email"
            inputMode="email"
            placeholder="Where can I reach you?"
            maxLength={254}
            aria-required="true"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "email-error" : undefined}
            className={INPUT_CLASS}
            {...register("email", {
              required: "Please enter your email address.",
              pattern: {
                value: EMAIL_PATTERN,
                message: "Please enter a valid email address.",
              },
              maxLength: {
                value: 254,
                message: "Email must be 254 characters or fewer.",
              },
            })}
          />
          {errors.email && (
            <p id="email-error" className={ERROR_TEXT_CLASS}>
              {errors.email.message}
            </p>
          )}
        </div>
      </div>

      {/* Row 2: What's This About? (Dropdown) */}
      <div className="flex flex-col gap-2.5">
        <label htmlFor="subject" className={LABEL_CLASS}>
          WHAT&apos;S THIS ABOUT?
        </label>
        <div className="relative">
          <select
            id="subject"
            aria-invalid={Boolean(errors.subject)}
            aria-describedby={errors.subject ? "subject-error" : undefined}
            className={`${INPUT_CLASS} appearance-none pr-10 cursor-pointer`}
            {...register("subject", {
              required: "Please select a topic.",
            })}
          >
            {CONTACT_SUBJECT_OPTIONS.map((option) => (
              <option
                key={option}
                value={option}
                className="bg-background text-foreground"
              >
                {option}
              </option>
            ))}
          </select>
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-muted-foreground"
          >
            ▾
          </span>
        </div>
        {errors.subject && (
          <p id="subject-error" className={ERROR_TEXT_CLASS}>
            {errors.subject.message}
          </p>
        )}
      </div>

      {/* Row 3: Message */}
      <div className="flex flex-col gap-2.5">
        <label htmlFor="message" className={LABEL_CLASS}>
          MESSAGE <span aria-hidden="true">*</span>
        </label>
        <textarea
          id="message"
          rows={6}
          maxLength={5000}
          placeholder="Tell me a bit about what's on your mind..."
          aria-required="true"
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "message-error" : undefined}
          className={`${INPUT_CLASS} resize-y`}
          {...register("message", {
            required: "Please enter a message.",
            maxLength: {
              value: 5000,
              message: "Message must be 5,000 characters or fewer.",
            },
            validate: {
              notEmpty: (value) =>
                value.trim().length > 0 || "Please enter a message.",
              maxLinks: (value) =>
                countMessageLinks(value) <= MAX_MESSAGE_LINKS ||
                `Please include ${MAX_MESSAGE_LINKS} or fewer links in your message.`,
            },
          })}
        />
        {errors.message && (
          <p id="message-error" className={ERROR_TEXT_CLASS}>
            {errors.message.message}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="group inline-flex items-center justify-center gap-3 rounded-full bg-foreground text-background px-8 py-4 font-sans text-xs font-semibold uppercase tracking-[0.18em] transition-opacity duration-200 hover:opacity-90 disabled:opacity-60 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
        >
          <span>{isSubmitting ? "SENDING..." : "SEND MESSAGE"}</span>
          <span
            aria-hidden="true"
            className="transition-transform duration-200 group-hover:translate-x-1"
          >
            →
          </span>
        </button>
      </div>
    </form>
  );
}

export default ContactForm;
