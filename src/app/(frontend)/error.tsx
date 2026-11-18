"use client";

import { ServerErrorView } from "@/components/error-pages";

export default function FrontendError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <ServerErrorView onReset={reset} />;
}
