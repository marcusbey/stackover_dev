import Link from "next/link";

export default function PricingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <h1 className="text-4xl font-bold mb-2">Pricing</h1>
      <p className="text-muted-foreground mb-6 max-w-md">
        StackOver is <span className="font-semibold text-foreground">free</span>{" "}
        during beta. Explore, vote, and build your stack at no cost.
      </p>
      <Link
        href="/"
        className="inline-flex items-center px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
      >
        Back to Explorer
      </Link>
    </div>
  );
}
