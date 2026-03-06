import Link from "next/link";

export default function SubmitPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <h1 className="text-4xl font-bold mb-2">Submit a Tool</h1>
      <p className="text-muted-foreground mb-6 max-w-md">
        Want to add your product to StackOver? Open an issue on GitHub and
        we&apos;ll review it.
      </p>
      <div className="flex gap-3">
        <a
          href="https://github.com/marcusbey/stackover_dev/issues/new?title=Tool+Submission:+[Tool+Name]&body=Website:%0ADescription:%0ACategory:"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          Submit via GitHub
        </a>
        <Link
          href="/"
          className="inline-flex items-center px-4 py-2 rounded-lg border text-sm font-medium hover:bg-accent transition-colors"
        >
          Back to Explorer
        </Link>
      </div>
    </div>
  );
}
