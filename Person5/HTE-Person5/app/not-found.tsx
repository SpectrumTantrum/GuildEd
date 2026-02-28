import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-8">
      <h1 className="text-xl font-medium text-energy-text-on-tint">
        This page could not be found.
      </h1>
      <Link
        href="/"
        className="rounded-lg bg-map-teal-dark px-4 py-2 text-base font-medium text-white focus:outline-none focus-visible:ring-3 focus-visible:ring-focus-ring focus-visible:ring-offset-2"
      >
        Go to Energy Check-in
      </Link>
    </div>
  );
}
