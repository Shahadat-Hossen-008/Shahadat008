"use client";

import { ServerErrorView } from "@/components/error-pages";

export default function RootError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main
      data-frontend-root
      className="font-sans bg-background text-foreground min-h-svh flex items-center justify-center"
    >
      <ServerErrorView onReset={reset} />
    </main>
  );
}
