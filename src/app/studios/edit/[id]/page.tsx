"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

const API_URL = "/api/studios";

type StudioForm = {
title: string;
category: string;
hourlyRate: string;
securityDeposit: string;
maxCapacity: string;
location: string;
image: string;
amenities: string;
overview: string;
};

const initialForm: StudioForm = {
title: "",
category: "Photo Studio",
hourlyRate: "",
securityDeposit: "",
maxCapacity: "",
location: "",
image: "",
amenities: "",
overview: "",
};

export default function EditStudioPage() {
const params = useParams<{ id: string }>();
const router = useRouter();
const studioId = params.id;

const [formData, setFormData] = useState<StudioForm>(initialForm);
const [loading, setLoading] = useState(true);
const [saving, setSaving] = useState(false);
const [error, setError] = useState("");
const [success, setSuccess] = useState("");

useEffect(() => {
if (!studioId) return;


let cancelled = false;

async function loadStudio() {
  try {
    setLoading(true);
    setError("");

    const response = await fetch(`${API_URL}/${studioId}`);
    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Unable to load studio details.");
    }

    const studio = result.data;

    if (!studio) {
      throw new Error("Studio not found.");
    }

    if (cancelled) return;

    setFormData({
      title: studio.title ?? "",
      category: studio.category ?? "Photo Studio",
      hourlyRate: String(studio.hourlyRate ?? ""),
      securityDeposit: String(studio.securityDeposit ?? 0),
      maxCapacity: String(studio.maxCapacity ?? ""),
      location: studio.location ?? "",
      image: studio.image ?? "",
      amenities: Array.isArray(studio.amenities)
        ? studio.amenities.join(", ")
        : "",
      overview: studio.overview ?? "",
    });
  } catch (err) {
    if (cancelled) return;

    setError(
      err instanceof TypeError
        ? "Unable to connect to the server. Please try again."
        : err instanceof Error
          ? err.message
          : "Something went wrong."
    );
  } finally {
    if (!cancelled) setLoading(false);
  }
}

void loadStudio();

return () => {
  cancelled = true;
};


}, [studioId]);

function handleChange(
event: React.ChangeEvent<
HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
>
) {
const { name, value } = event.target;


setFormData((previous) => ({
  ...previous,
  [name]: value,
}));


}

async function handleSubmit(event: FormEvent<HTMLFormElement>) {
event.preventDefault();
setError("");
setSuccess("");


const hourlyRate = Number(formData.hourlyRate);
const securityDeposit = Number(formData.securityDeposit);
const maxCapacity = Number(formData.maxCapacity);

if (
  !Number.isFinite(hourlyRate) ||
  hourlyRate <= 0 ||
  !Number.isFinite(securityDeposit) ||
  securityDeposit < 0 ||
  !Number.isInteger(maxCapacity) ||
  maxCapacity < 1
) {
  setError(
    "Please enter a valid hourly rate, security deposit, and whole-number capacity."
  );
  return;
}

const payload = {
  title: formData.title.trim(),
  category: formData.category,
  hourlyRate,
  securityDeposit,
  maxCapacity,
  location: formData.location.trim(),
  image: formData.image.trim(),
  amenities: formData.amenities
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean),
  overview: formData.overview.trim(),
};

try {
  setSaving(true);

  const response = await fetch(`${API_URL}/${studioId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Unable to update studio.");
  }

  setSuccess("Studio updated successfully! Redirecting to your listings...");

  window.setTimeout(() => {
    router.push("/my-listings");
  }, 1200);
} catch (err) {
  setError(
    err instanceof TypeError
      ? "Unable to connect to the server. Please check your connection."
      : err instanceof Error
        ? err.message
        : "Something went wrong. Please try again."
  );
} finally {
  setSaving(false);
}


}

const inputClass =
"mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100";

const labelClass = "block text-sm font-semibold text-slate-700";

if (loading) {
return ( <main className="min-h-screen bg-slate-50 px-5 py-16"> <div className="mx-auto max-w-3xl animate-pulse rounded-3xl border border-slate-200 bg-white p-8"> <div className="h-8 w-64 rounded bg-slate-200" /> <div className="mt-4 h-4 w-full max-w-md rounded bg-slate-200" /> <div className="mt-10 space-y-6">
{Array.from({ length: 7 }).map((_, index) => ( <div key={index} className="h-12 rounded-xl bg-slate-100" />
))} </div> </div> </main>
);
}

if (error && !formData.title) {
return ( <main className="min-h-screen bg-slate-50 px-5 py-16"> <div className="mx-auto max-w-xl rounded-3xl border border-slate-200 bg-white p-8 text-center"> <h1 className="text-2xl font-extrabold text-slate-900">
Unable to Load Studio </h1>


      <p role="alert" className="mt-4 leading-7 text-red-600">
        {error}
      </p>

      <div className="mt-6 flex justify-center gap-3">
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white hover:bg-indigo-700"
        >
          Try Again
        </button>

        <Link
          href="/my-listings"
          className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50"
        >
          Back to Listings
        </Link>
      </div>
    </div>
  </main>
);


}

return ( <main className="min-h-screen bg-slate-50"> <nav className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur"> <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4"> <Link
         href="/"
         className="text-2xl font-extrabold tracking-tight text-indigo-700"
       >
StudioSpace<span className="text-slate-800">.</span> </Link>


      <Link
        href="/my-listings"
        className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-indigo-700"
      >
        ← My Listings
      </Link>
    </div>
  </nav>

  <section className="mx-auto max-w-4xl px-5 py-12 sm:py-16">
    <div className="mb-8">
      <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-indigo-600">
        Host Dashboard
      </p>

      <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
        Edit Studio
      </h1>

      <p className="mt-3 leading-7 text-slate-600">
        Update your studio details, pricing, facilities, and description.
        Your changes will be saved to the database.
      </p>
    </div>

    <form
      onSubmit={handleSubmit}
      className="space-y-8 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8"
    >
      <div>
        <h2 className="text-lg font-bold text-slate-900">
          Studio Information
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Fields marked with * are required.
        </p>
      </div>

      <div>
        <label htmlFor="title" className={labelClass}>
          Studio Title *
        </label>
        <input
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className={inputClass}
          placeholder="Premium Photography Studio"
          minLength={3}
          required
        />
      </div>

      <div>
        <label htmlFor="category" className={labelClass}>
          Studio Category *
        </label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          className={inputClass}
          required
        >
          <option value="Photo Studio">Photo Studio</option>
          <option value="Sound Stage">Sound Stage</option>
          <option value="Podcast Room">Podcast Room</option>
          <option value="Music Suite">Music Suite</option>
          <option value="Art Workshop">Art Workshop</option>
        </select>
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <div>
          <label htmlFor="hourlyRate" className={labelClass}>
            Hourly Rate (৳) *
          </label>
          <input
            id="hourlyRate"
            name="hourlyRate"
            type="number"
            min="1"
            step="1"
            value={formData.hourlyRate}
            onChange={handleChange}
            className={inputClass}
            required
          />
        </div>

        <div>
          <label htmlFor="securityDeposit" className={labelClass}>
            Security Deposit (৳) *
          </label>
          <input
            id="securityDeposit"
            name="securityDeposit"
            type="number"
            min="0"
            step="1"
            value={formData.securityDeposit}
            onChange={handleChange}
            className={inputClass}
            required
          />
        </div>

        <div>
          <label htmlFor="maxCapacity" className={labelClass}>
            Maximum Capacity *
          </label>
          <input
            id="maxCapacity"
            name="maxCapacity"
            type="number"
            min="1"
            step="1"
            value={formData.maxCapacity}
            onChange={handleChange}
            className={inputClass}
            required
          />
        </div>
      </div>

      <div>
        <label htmlFor="location" className={labelClass}>
          Location / Address *
        </label>
        <input
          id="location"
          name="location"
          value={formData.location}
          onChange={handleChange}
          className={inputClass}
          placeholder="Dhanmondi, Dhaka, Bangladesh"
          required
        />
      </div>

      <div>
        <label htmlFor="image" className={labelClass}>
          Studio Image URL *
        </label>
        <input
          id="image"
          name="image"
          type="url"
          value={formData.image}
          onChange={handleChange}
          className={inputClass}
          placeholder="https://example.com/studio-image.jpg"
          required
        />

        <p className="mt-2 text-xs leading-5 text-slate-500">
          Provide a publicly accessible image URL.
        </p>

        {formData.image.trim() && (
          <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={formData.image}
              alt="Studio preview"
              className="h-52 w-full object-cover"
              onError={(event) => {
                event.currentTarget.style.display = "none";
              }}
              onLoad={(event) => {
                event.currentTarget.style.display = "block";
              }}
            />
          </div>
        )}
      </div>

      <div>
        <label htmlFor="amenities" className={labelClass}>
          Amenities *
        </label>
        <input
          id="amenities"
          name="amenities"
          value={formData.amenities}
          onChange={handleChange}
          className={inputClass}
          placeholder="Wi-Fi, Air Conditioning, Lighting"
          required
        />
        <p className="mt-2 text-xs text-slate-500">
          Separate each amenity with a comma.
        </p>
      </div>

      <div>
        <label htmlFor="overview" className={labelClass}>
          Studio Description *
        </label>
        <textarea
          id="overview"
          name="overview"
          value={formData.overview}
          onChange={handleChange}
          className={`${inputClass} min-h-36 resize-y`}
          placeholder="Describe your studio and its facilities..."
          minLength={20}
          required
        />
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700"
        >
          {error}
        </div>
      )}

      {success && (
        <div
          role="status"
          className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm leading-6 text-emerald-800"
        >
          {success}
        </div>
      )}

      <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:justify-end">
        <Link
          href="/my-listings"
          className="inline-flex items-center justify-center rounded-xl border border-slate-300 px-6 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
        >
          Cancel
        </Link>

        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-7 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? "Saving Changes..." : "Save Changes →"}
        </button>
      </div>
    </form>
  </section>

  <footer className="border-t border-slate-200 bg-white px-5 py-6 text-center text-sm text-slate-500">
    © {new Date().getFullYear()} StudioSpace. All rights reserved.
  </footer>
</main>


);
}
