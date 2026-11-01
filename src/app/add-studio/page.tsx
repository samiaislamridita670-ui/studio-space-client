"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const API_URL = "/api/studios";

export default function AddStudioPage() {
const router = useRouter();

const [loading, setLoading] = useState(false);
const [message, setMessage] = useState("");
const [messageType, setMessageType] = useState<"success" | "error">("error");

const [formData, setFormData] = useState({
title: "",
category: "Photo Studio",
hourlyRate: "",
securityDeposit: "",
maxCapacity: "",
location: "",
image: "",
amenities: "",
overview: "",
hostName: "",
hostEmail: "",
});

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
setMessage("");


const hourlyRate = Number(formData.hourlyRate);
const securityDeposit = Number(formData.securityDeposit);
const maxCapacity = Number(formData.maxCapacity);

if (
  hourlyRate <= 0 ||
  securityDeposit < 0 ||
  maxCapacity < 1 ||
  !Number.isInteger(maxCapacity)
) {
  setMessageType("error");
  setMessage(
    "Please enter a valid hourly rate, security deposit, and maximum capacity."
  );
  return;
}

const amenities = formData.amenities
  .split(",")
  .map((item) => item.trim())
  .filter(Boolean);

const payload = {
  title: formData.title.trim(),
  category: formData.category,
  hourlyRate,
  securityDeposit,
  maxCapacity,
  location: formData.location.trim(),
  image: formData.image.trim(),
  amenities,
  overview: formData.overview.trim(),
  hostName: formData.hostName.trim(),
  hostEmail: formData.hostEmail.trim(),
};

try {
  setLoading(true);

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(
      result.message || "Unable to publish your studio. Please try again."
    );
  }

  setMessageType("success");
  setMessage(
    "Your studio has been published successfully! Redirecting to Explore Studios..."
  );

  window.setTimeout(() => {
    router.push("/studios");
  }, 1200);
} catch (error) {
  setMessageType("error");

  if (error instanceof TypeError) {
    setMessage(
      "Unable to connect to the server. Please ensure the backend is running and try again."
    );
  } else {
    setMessage(
      error instanceof Error
        ? error.message
        : "Something went wrong. Please try again."
    );
  }
} finally {
  setLoading(false);
}


}

const inputClass =
"mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100";

const labelClass = "block text-sm font-semibold text-slate-700";

return ( <main className="min-h-screen bg-slate-50"> <nav className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur"> <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4"> <Link
         href="/"
         className="text-2xl font-extrabold tracking-tight text-indigo-700"
       >
StudioSpace<span className="text-slate-800">.</span> </Link>


      <Link
        href="/studios"
        className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-indigo-700"
      >
        Explore Studios →
      </Link>
    </div>
  </nav>

  <section className="mx-auto max-w-4xl px-5 py-12 sm:py-16">
    <div className="mb-8">
      <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-indigo-600">
        Become a Host
      </p>

      <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
        Add Your Studio
      </h1>

      <p className="mt-3 max-w-2xl leading-7 text-slate-600">
        Share your creative workspace with photographers, musicians,
        podcasters, and other creators. Complete the form below to list
        your studio.
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
          Enter the basic details of your workspace.
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
          placeholder="e.g. Premium Photography Studio"
          required
          minLength={3}
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
            placeholder="1500"
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
            placeholder="2000"
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
            placeholder="10"
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
          placeholder="e.g. Dhanmondi, Dhaka, Bangladesh"
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
          Provide a publicly accessible image URL that opens directly in a
          browser.
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
          placeholder="Describe your studio, its facilities, and what makes it special..."
          required
          minLength={20}
        />
      </div>

      <div className="border-t border-slate-200 pt-7">
        <h2 className="text-lg font-bold text-slate-900">
          Host Information
        </h2>
        <p className="mt-1 text-sm leading-6 text-slate-500">
          Enter your contact details as the studio host.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="hostName" className={labelClass}>
            Host Name *
          </label>
          <input
            id="hostName"
            name="hostName"
            value={formData.hostName}
            onChange={handleChange}
            className={inputClass}
            placeholder="Your full name"
            required
          />
        </div>

        <div>
          <label htmlFor="hostEmail" className={labelClass}>
            Host Email *
          </label>
          <input
            id="hostEmail"
            name="hostEmail"
            type="email"
            value={formData.hostEmail}
            onChange={handleChange}
            className={inputClass}
            placeholder="you@example.com"
            required
          />
        </div>
      </div>

      {message && (
        <div
          role={messageType === "error" ? "alert" : "status"}
          className={`rounded-xl border px-4 py-3 text-sm leading-6 ${
            messageType === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {message}
        </div>
      )}

      <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:justify-end">
        <Link
          href="/studios"
          className="inline-flex items-center justify-center rounded-xl border border-slate-300 px-6 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
        >
          Cancel
        </Link>

        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-7 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Publishing Studio..." : "Publish Studio →"}
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
