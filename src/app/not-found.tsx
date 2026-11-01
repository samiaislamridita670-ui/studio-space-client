import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-[80vh] items-center justify-center bg-slate-50 px-6 py-20">
      <div className="max-w-xl text-center">
        <div className="mb-6 text-8xl font-black text-indigo-600">
          404
        </div>

        <h1 className="mb-4 text-4xl font-bold text-slate-900">
          Oops! This page is missing.
        </h1>

        <p className="mb-8 text-lg text-slate-600">
          The creative space you are looking for could not be found.
          Let&apos;s get you back to exploring amazing studios.
        </p>

        <Link
          href="/"
          className="inline-flex rounded-xl bg-indigo-600 px-8 py-4 font-semibold text-white transition hover:bg-indigo-700"
        >
          Return to Home
        </Link>
      </div>
    </main>
  );
}


