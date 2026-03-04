"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <h1 className="text-4xl font-bold mb-4">Something went wrong</h1>
      <p className="text-muted-foreground mb-6">
        An unexpected error occurred. Please try again.
      </p>
      <button
        onClick={reset}
        className="inline-flex items-center px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
      >
        Try again
      </button>
    </div>
  );
}
