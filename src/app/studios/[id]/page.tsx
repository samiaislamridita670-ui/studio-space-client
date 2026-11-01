
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

type Studio = {
  _id: string;
  title: string;
  category: string;
  hourlyRate: number;
  securityDeposit: number;
  maxCapacity: number;
  location: string;
  image: string;
  rating: number;
  amenities: string[];
  overview: string;
  hostName: string;
  hostEmail: string;
};

function getBangladeshDate(): string {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Dhaka",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());

  const year = parts.find((part) => part.type === "year")?.value;
  const month = parts.find((part) => part.type === "month")?.value;
  const day = parts.find((part) => part.type === "day")?.value;

  if (!year || !month || !day) {
    throw new Error("Unable to determine the Bangladesh date.");
  }

  return `${year}-${month}-${day}`;
}

export default function StudioDetailsPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  const [studio, setStudio] = useState<Studio | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showBooking, setShowBooking] = useState(false);
  const [bookingDate, setBookingDate] = useState("");
  const [startTime, setStartTime] = useState("10:00");
  const [endTime, setEndTime] = useState("12:00");
  const [guests, setGuests] = useState("2");
  const [bookingMessage, setBookingMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchStudio = useCallback(async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `/api/studios/${encodeURIComponent(id)}`
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Studio not found.");
      }

      setStudio(result.data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load studio details."
      );
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void fetchStudio();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [fetchStudio]);

  async function handleBookingRequest(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (isSubmitting) return;

    if (!studio) {
      setBookingMessage("Studio details are not available. Please try again.");
      return;
    }

    if (!bookingDate || !startTime || !endTime || !guests.trim()) {
      setBookingMessage("Please complete all booking fields.");
      return;
    }

    let today: string;

    try {
      today = getBangladeshDate();
    } catch {
      setBookingMessage("Unable to check today's date. Please try again.");
      return;
    }

    if (bookingDate < today) {
      setBookingMessage("Please select today or a future date.");
      return;
    }

    if (endTime <= startTime) {
      setBookingMessage("End time must be later than start time.");
      return;
    }

    const guestCount = Number(guests);

    if (
      !Number.isInteger(guestCount) ||
      guestCount < 1 ||
      guestCount > studio.maxCapacity
    ) {
      setBookingMessage(
        `Please enter a whole number of guests between 1 and ${studio.maxCapacity}.`
      );
      return;
    }

    setIsSubmitting(true);
    setBookingMessage("");

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studioId: studio._id,
          bookingDate,
          startTime,
          endTime,
          guests: guestCount,
        }),
      });

      const result = await response.json().catch(() => null);

      if (response.status === 401) {
        setBookingMessage(
          "Please log in before submitting a booking request."
        );
        return;
      }

      if (!response.ok || result?.success === false) {
        setBookingMessage(
          result?.message || "Unable to submit your booking request."
        );
        return;
      }

      setBookingMessage(
        "Booking request submitted successfully! Your booking is pending host confirmation."
      );
    } catch (err) {
      console.error("Booking submission error:", err);
      setBookingMessage(
        "Unable to connect to the booking service. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#faf9f6] px-5 py-20">
        <div className="mx-auto max-w-6xl animate-pulse">
          <div className="h-8 w-64 rounded bg-gray-200" />
          <div className="mt-6 h-96 rounded-3xl bg-gray-200" />
          <div className="mt-6 h-8 w-1/2 rounded bg-gray-200" />
          <div className="mt-4 h-5 w-3/4 rounded bg-gray-200" />
        </div>
      </main>
    );
  }

  if (error || !studio) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#faf9f6] px-5">
        <div className="max-w-lg rounded-3xl border border-gray-200 bg-white p-10 text-center">
          <div className="text-5xl" aria-hidden="true">
            🏢
          </div>

          <h1 className="mt-5 text-3xl font-black">Studio not found</h1>

          <p className="mt-3 text-gray-600">
            {error || "This creative space may no longer be available."}
          </p>

          <button
            type="button"
            onClick={() => void fetchStudio()}
            className="mt-6 rounded-full border border-gray-300 px-6 py-3 font-bold hover:bg-gray-50"
          >
            Try Again
          </button>

          <div>
            <Link
              href="/studios"
              className="mt-4 inline-flex rounded-full bg-[#20231f] px-6 py-3 font-bold text-white hover:bg-[#42483d]"
            >
              ← Explore Studios
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const isBookingSuccessful = bookingMessage.startsWith(
    "Booking request submitted successfully!"
  );

  return (
    <main className="min-h-screen bg-[#faf9f6] text-[#20231f]">
      <section className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
        <Link
          href="/studios"
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-[#668b18]"
        >
          ← Back to Explore Studios
        </Link>

        <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <span className="rounded-full bg-[#eaf2d9] px-4 py-2 text-sm font-bold text-[#526e1e]">
              {studio.category}
            </span>

            <h1 className="mt-5 text-3xl font-black sm:text-5xl">
              {studio.title}
            </h1>

            <p className="mt-4 text-gray-600">
              📍 {studio.location}
              <span className="mx-3">·</span>
              ★ {studio.rating} rating
              <span className="mx-3">·</span>
              Up to {studio.maxCapacity} guests
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <p className="text-sm text-gray-500">Hourly rate</p>

            <p className="mt-1 text-3xl font-black">
              ৳{studio.hourlyRate.toLocaleString("en-BD")}
              <span className="text-sm font-medium text-gray-500">
                {" "}
                / hour
              </span>
            </p>
          </div>
        </div>

        <div className="mt-8 overflow-hidden rounded-3xl bg-gray-200">
          <img
            src={studio.image}
            alt={studio.title}
            className="h-[300px] w-full object-cover sm:h-[480px]"
          />
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_360px]">
          <div className="space-y-10">
            <section>
              <h2 className="text-2xl font-black">About this space</h2>

              <p className="mt-4 whitespace-pre-line leading-8 text-gray-600">
                {studio.overview || "No description has been added yet."}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-black">Studio details</h2>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-gray-200 bg-white p-5">
                  <p className="text-sm text-gray-500">Maximum capacity</p>
                  <p className="mt-2 text-lg font-bold">
                    👥 {studio.maxCapacity} guests
                  </p>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-white p-5">
                  <p className="text-sm text-gray-500">Security deposit</p>
                  <p className="mt-2 text-lg font-bold">
                    ৳{studio.securityDeposit.toLocaleString("en-BD")}
                  </p>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-white p-5">
                  <p className="text-sm text-gray-500">Category</p>
                  <p className="mt-2 text-lg font-bold">{studio.category}</p>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-white p-5">
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="mt-2 text-lg font-bold">{studio.location}</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-black">Amenities</h2>

              {studio.amenities?.length ? (
                <div className="mt-5 flex flex-wrap gap-3">
                  {studio.amenities.map((amenity, index) => (
                    <span
                      key={`${amenity}-${index}`}
                      className="rounded-full border border-gray-200 bg-white px-5 py-3 text-sm font-medium"
                    >
                      ✓ {amenity}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="mt-3 text-gray-500">
                  No amenities have been listed yet.
                </p>
              )}
            </section>

            <section>
              <h2 className="text-2xl font-black">Your host</h2>

              <div className="mt-5 flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-5">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#eaf2d9] text-2xl font-black">
                  {studio.hostName?.charAt(0).toUpperCase() || "H"}
                </div>

                <div>
                  <p className="font-bold">
                    {studio.hostName || "Studio Host"}
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    StudioSpace host
                  </p>
                </div>
              </div>
            </section>
          </div>

          <aside className="h-fit rounded-3xl border border-gray-200 bg-white p-6 shadow-sm lg:sticky lg:top-24">
            <p className="text-sm text-gray-500">Reserve this workspace</p>

            <p className="mt-2 text-3xl font-black">
              ৳{studio.hourlyRate.toLocaleString("en-BD")}
              <span className="text-sm font-medium text-gray-500">
                {" "}
                / hour
              </span>
            </p>

            <div className="mt-5 space-y-3 border-y border-gray-100 py-5 text-sm">
              <div className="flex justify-between gap-3">
                <span className="text-gray-500">Security deposit</span>
                <span className="font-semibold">
                  ৳{studio.securityDeposit.toLocaleString("en-BD")}
                </span>
              </div>

              <div className="flex justify-between gap-3">
                <span className="text-gray-500">Capacity</span>
                <span className="font-semibold">
                  {studio.maxCapacity} guests
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setBookingMessage("");
                setShowBooking(true);
              }}
              className="mt-5 w-full rounded-full bg-[#dfff64] px-6 py-4 font-black transition hover:bg-[#c9ef43]"
            >
              Book Workspace Now ↗
            </button>

            <p className="mt-4 text-center text-xs leading-5 text-gray-500">
              Booking is subject to host confirmation and availability.
            </p>
          </aside>
        </div>
      </section>

      {showBooking && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/60 p-4"
          onMouseDown={(event) => {
            if (
              event.target === event.currentTarget &&
              !isSubmitting
            ) {
              setShowBooking(false);
            }
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="booking-title"
            className="my-8 w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl sm:p-8"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-bold uppercase tracking-widest text-[#668b18]">
                  Make it yours
                </p>

                <h2 id="booking-title" className="mt-2 text-2xl font-black">
                  Request a booking
                </h2>

                <p className="mt-2 text-sm text-gray-500">
                  {studio.title}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowBooking(false)}
                disabled={isSubmitting}
                aria-label="Close booking dialog"
                className="rounded-full bg-gray-100 px-3 py-2 font-bold hover:bg-gray-200 disabled:opacity-50"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleBookingRequest} className="mt-6 space-y-4">
              <div>
                <label
                  htmlFor="booking-date"
                  className="mb-2 block text-sm font-bold"
                >
                  Booking date
                </label>

                <input
                  id="booking-date"
                  type="date"
                  min={getBangladeshDate()}
                  value={bookingDate}
                  onChange={(event) => setBookingDate(event.target.value)}
                  required
                  disabled={isSubmitting}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#789b32] disabled:bg-gray-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="start-time"
                    className="mb-2 block text-sm font-bold"
                  >
                    Start time
                  </label>

                  <input
                    id="start-time"
                    type="time"
                    value={startTime}
                    onChange={(event) => setStartTime(event.target.value)}
                    required
                    disabled={isSubmitting}
                    className="w-full rounded-xl border border-gray-200 px-3 py-3 outline-none focus:border-[#789b32] disabled:bg-gray-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="end-time"
                    className="mb-2 block text-sm font-bold"
                  >
                    End time
                  </label>

                  <input
                    id="end-time"
                    type="time"
                    value={endTime}
                    onChange={(event) => setEndTime(event.target.value)}
                    required
                    disabled={isSubmitting}
                    className="w-full rounded-xl border border-gray-200 px-3 py-3 outline-none focus:border-[#789b32] disabled:bg-gray-100"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="guest-count"
                  className="mb-2 block text-sm font-bold"
                >
                  Number of guests
                </label>

                <input
                  id="guest-count"
                  type="number"
                  min="1"
                  max={studio.maxCapacity}
                  step="1"
                  value={guests}
                  onChange={(event) => setGuests(event.target.value)}
                  required
                  disabled={isSubmitting}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#789b32] disabled:bg-gray-100"
                />

                <p className="mt-1 text-xs text-gray-500">
                  Maximum capacity: {studio.maxCapacity} guests
                </p>
              </div>

              <div className="rounded-2xl bg-[#f5f7ef] p-4">
                <div className="flex justify-between gap-3">
                  <span className="text-sm text-gray-600">Hourly rate</span>
                  <span className="font-bold">
                    ৳{studio.hourlyRate.toLocaleString("en-BD")}
                  </span>
                </div>

                <div className="mt-2 flex justify-between gap-3">
                  <span className="text-sm text-gray-600">
                    Security deposit
                  </span>
                  <span className="font-bold">
                    ৳{studio.securityDeposit.toLocaleString("en-BD")}
                  </span>
                </div>

                <p className="mt-3 text-xs leading-5 text-gray-500">
                  The final booking amount and availability will be confirmed
                  according to the booking details and host approval.
                </p>
              </div>

              {bookingMessage && (
                <div
                  role="status"
                  aria-live="polite"
                  className={`rounded-xl p-3 text-sm ${
                    isBookingSuccessful
                      ? "bg-green-50 text-green-800"
                      : bookingMessage.startsWith("Submitting")
                        ? "bg-blue-50 text-blue-800"
                        : "bg-[#f5f7ef] text-gray-700"
                  }`}
                >
                  {bookingMessage}
                </div>
              )}

              {isBookingSuccessful ? (
                <div className="space-y-3">
                  <Link
                    href="/my-bookings"
                    onClick={() => setShowBooking(false)}
                    className="block w-full rounded-full bg-[#dfff64] px-6 py-4 text-center font-black text-[#20231f] transition hover:bg-[#c9ef43]"
                  >
                    View My Bookings →
                  </Link>

                  <button
                    type="button"
                    onClick={() => setShowBooking(false)}
                    className="w-full rounded-full border border-gray-200 px-6 py-3 font-bold hover:bg-gray-50"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-full bg-[#20231f] px-6 py-4 font-bold text-white transition hover:bg-[#42483d] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? "Submitting Booking..." : "Continue Booking"}
                </button>
              )}

              <p className="text-center text-xs leading-5 text-gray-500">
                Your booking request is subject to availability and host
                confirmation.
              </p>
            </form>
          </section>
        </div>
      )}
    </main>
  );
}

