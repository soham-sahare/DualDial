import Link from "next/link";

/**
 * Custom 404 Not Found page for Dual Dial.
 *
 * @returns React component.
 */
export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-white p-6 text-center">
      <h1 className="text-4xl font-bold font-mono">404</h1>
      <p className="text-sm text-slate-400 mt-2">Page Not Found</p>
      <Link
        href="/"
        className="mt-6 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors"
      >
        Return to Dual Dial
      </Link>
    </div>
  );
}
