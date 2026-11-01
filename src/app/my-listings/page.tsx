"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";

const API_URL = "/api/studios";

type Studio = {
_id: string;
title: string;
category: string;
hourlyRate: number;
securityDeposit: number;
maxCapacity: number;
location: string;
image: string;
amenities: string[];
overview: string;
hostName: string;
hostEmail: string;
rating?: number;
};

export default function MyListingsPage() {
const [studios, setStudios] = useState<Studio[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");
const [notice, setNotice] = useState("");
const [deletingId, setDeletingId] = useState<string | null>(null);
const [deleteLoading, setDeleteLoading] = useState(false);

const fetchStudios = useCallback(async () => {
try {
setLoading(true);
setError("");


  const response = await fetch(`${API_URL}?mine=1`);
  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Studios load করা যায়নি।");
  }

  setStudios(result.data || []);
} catch (err) {
  setError(
    err instanceof TypeError
      ? "Backend server-এর সঙ্গে যোগাযোগ করা যাচ্ছে না। Server চালু আছে কি না পরীক্ষা করো।"
      : err instanceof Error
        ? err.message
        : "একটি সমস্যা হয়েছে। আবার চেষ্টা করো।"
  );
} finally {
  setLoading(false);
}


}, []);

useEffect(() => {
    const timer = window.setTimeout(() => {
      void fetchStudios();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [fetchStudios]);

async function handleDelete() {
if (!deletingId) return;


try {
  setDeleteLoading(true);
  setNotice("");
  setError("");

  const response = await fetch(`${API_URL}/${encodeURIComponent(deletingId)}`, {
    method: "DELETE",
  });

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Studio delete করা যায়নি।");
  }

  setStudios((previous) =>
    previous.filter((studio) => studio._id !== deletingId)
  );

  setDeletingId(null);
  setNotice("Studio সফলভাবে delete করা হয়েছে।");
} catch (err) {
  setError(
    err instanceof TypeError
      ? "Backend server-এর সঙ্গে যোগাযোগ করা যাচ্ছে না।"
      : err instanceof Error
        ? err.message
        : "Studio delete করা যায়নি।"
  );
  setDeletingId(null);
} finally {
  setDeleteLoading(false);
}


}

return ( <main className="min-h-screen bg-slate-50">
{/* Navbar */} <nav className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur"> <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4"> <Link
         href="/"
         className="text-2xl font-extrabold tracking-tight text-indigo-700"
       >
StudioSpace<span className="text-slate-800">.</span> </Link>


      <div className="flex items-center gap-3">
        <Link
          href="/studios"
          className="hidden rounded-xl px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 sm:inline-flex"
        >
          Explore Studios
        </Link>

        <Link
          href="/add-studio"
          className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-indigo-700"
        >
          + Add Studio
        </Link>
      </div>
    </div>
  </nav>

  {/* Main Content */}
  <section className="mx-auto max-w-7xl px-5 py-10 sm:py-14">
    <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
      <div>
        <p className="mb-2 text-sm font-bold uppercase tracking-[0.2em] text-indigo-600">
          Host Dashboard
        </p>

        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          My Studio Listings
        </h1>

        <p className="mt-3 max-w-2xl leading-7 text-slate-600">
          Manage your creative workspaces, review their details and update
          your listings whenever you need.
        </p>
      </div>

      <div className="flex items-center gap-3 self-start rounded-2xl border border-slate-200 bg-white px-5 py-3 shadow-sm sm:self-auto">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-xl">
          🏢
        </div>
        <div>
          <p className="text-2xl font-extrabold text-slate-900">
            {loading ? "—" : studios.length}
          </p>
          <p className="text-xs font-medium text-slate-500">
            Total listings
          </p>
        </div>
      </div>
    </div>

    {/* Success Message */}
    {notice && (
      <div
        role="status"
        className="mb-6 flex items-center justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
      >
        <span>✓ {notice}</span>
        <button
          type="button"
          onClick={() => setNotice("")}
          className="font-bold"
          aria-label="Dismiss success message"
        >
          ✕
        </button>
      </div>
    )}

    {/* Error Message */}
    {error && (
      <div
        role="alert"
        className="mb-6 flex items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
      >
        <span>{error}</span>
        <button
          type="button"
          onClick={() => {
            setError("");
            void fetchStudios();
          }}
          className="shrink-0 rounded-lg border border-red-200 px-3 py-1.5 font-bold hover:bg-red-100"
        >
          Retry
        </button>
      </div>
    )}

    {/* Loading Skeleton */}
    {loading ? (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
          >
            <div className="h-52 animate-pulse bg-slate-200" />
            <div className="space-y-4 p-5">
              <div className="h-4 w-1/3 animate-pulse rounded bg-slate-200" />
              <div className="h-6 w-3/4 animate-pulse rounded bg-slate-200" />
              <div className="h-4 w-1/2 animate-pulse rounded bg-slate-200" />
              <div className="h-10 animate-pulse rounded-xl bg-slate-200" />
            </div>
          </div>
        ))}
      </div>
    ) : studios.length === 0 && !error ? (
      /* Empty State */
      <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center sm:py-20">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-indigo-50 text-4xl">
          🏢
        </div>

        <h2 className="mt-6 text-2xl font-bold text-slate-900">
          No studios yet
        </h2>

        <p className="mx-auto mt-3 max-w-md leading-7 text-slate-600">
          You haven&apos;t added any studios yet. List your creative
          workspace and make it available to creators.
        </p>

        <Link
          href="/add-studio"
          className="mt-7 inline-flex items-center justify-center rounded-xl bg-indigo-600 px-6 py-3 font-bold text-white transition hover:bg-indigo-700"
        >
          Add Your First Studio →
        </Link>
      </div>
    ) : (
      /* Studio Cards */
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {studios.map((studio) => (
          <article
            key={studio._id}
            className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="relative h-52 overflow-hidden bg-slate-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={studio.image}
                alt={studio.title}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                onError={(event) => {
                  event.currentTarget.style.display = "none";
                }}
              />

              <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-indigo-700 shadow-sm">
                {studio.category}
              </span>

              <span className="absolute right-4 top-4 rounded-full bg-slate-900/75 px-3 py-1.5 text-xs font-bold text-white">
                ★ {studio.rating ?? 0}
              </span>
            </div>

            <div className="p-5">
              <h2 className="line-clamp-1 text-xl font-bold text-slate-900">
                {studio.title}
              </h2>

              <p className="mt-2 flex items-start gap-2 text-sm text-slate-500">
                <span aria-hidden="true">📍</span>
                <span>{studio.location}</span>
              </p>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-slate-50 p-3">
                  <p className="text-xs text-slate-500">Hourly Rate</p>
                  <p className="mt-1 text-lg font-extrabold text-indigo-700">
                    ৳{studio.hourlyRate.toLocaleString("en-US")}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-3">
                  <p className="text-xs text-slate-500">Max Capacity</p>
                  <p className="mt-1 text-lg font-extrabold text-slate-900">
                    {studio.maxCapacity} people
                  </p>
                </div>
              </div>

              <p className="mt-4 line-clamp-2 min-h-10 text-sm leading-5 text-slate-600">
                {studio.overview}
              </p>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <Link
                  href={`/studios/edit/${studio._id}`}
                  className="inline-flex items-center justify-center rounded-xl border border-indigo-200 px-3 py-3 text-sm font-bold text-indigo-700 transition hover:bg-indigo-50"
                >
                  ✎ Edit Studio
                </Link>

                <button
                  type="button"
                  onClick={() => setDeletingId(studio._id)}
                  className="inline-flex items-center justify-center rounded-xl border border-red-200 px-3 py-3 text-sm font-bold text-red-600 transition hover:bg-red-50"
                >
                  🗑 Delete
                </button>
              </div>

              <Link
                href={`/studios/${studio._id}`}
                className="mt-3 flex items-center justify-center rounded-xl bg-slate-900 px-4 py-3 text-sm font-bold text-white transition hover:bg-slate-700"
              >
                View Details →
              </Link>
            </div>
          </article>
        ))}
      </div>
    )}
  </section>

  {/* Delete Confirmation Modal */}
  {deletingId && (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (
          event.target === event.currentTarget &&
          !deleteLoading
        ) {
          setDeletingId(null);
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-title"
        className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl sm:p-8"
      >
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-2xl">
          🗑
        </div>

        <h2
          id="delete-title"
          className="mt-5 text-2xl font-extrabold text-slate-900"
        >
          Delete this studio?
        </h2>

        <p className="mt-3 leading-7 text-slate-600">
          This action will permanently remove this studio listing from the
          database. You cannot undo this action.
        </p>

        <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            disabled={deleteLoading}
            onClick={() => setDeletingId(null)}
            className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
          >
            Keep Studio
          </button>

          <button
            type="button"
            disabled={deleteLoading}
            onClick={() => void handleDelete()}
            className="rounded-xl bg-red-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {deleteLoading ? "Deleting..." : "Yes, Delete"}
          </button>
        </div>
      </div>
    </div>
  )}

  <footer className="border-t border-slate-200 bg-white px-5 py-6 text-center text-sm text-slate-500">
    © {new Date().getFullYear()} StudioSpace. Built for creative people.
  </footer>
</main>


);
}




