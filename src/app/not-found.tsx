import { NotFoundView } from "@/components/error-pages";

export default function RootNotFound() {
  return (
    <main
      data-frontend-root
      className="font-sans bg-background text-foreground min-h-svh flex items-center justify-center"
    >
      <NotFoundView />
    </main>
  );
}
