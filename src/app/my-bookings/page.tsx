
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";

type Booking = {
  _id: string;
  studioId: string;
  studioTitle: string;
  studioImage?: string;
  location?: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  guests: number;
  totalHours: number;
  totalPrice: number;
  status: string;
};

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState("");
  const [bookingToCancel, setBookingToCancel] = useState<Booking | null>(null);

  const loadBookings = useCallback(async (signal?: AbortSignal) => {
    try {
      const response = await fetch("/api/bookings", {
        method: "GET",
        cache: "no-store",
        credentials: "include",
        signal,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || result.error || "Unable to load your bookings."
        );
      }

      const fetchedBookings: Booking[] = Array.isArray(result.data)
        ? result.data
        : [];

      if (signal?.aborted) return;

      setBookings(
        fetchedBookings.filter(
          (booking) => booking.status?.toLowerCase() !== "cancelled"
        )
      );
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        return;
      }

      console.error("Load bookings error:", error);

      if (!signal?.aborted) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Unable to load your bookings."
        );
      }
    } finally {
      if (!signal?.aborted) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    // Defer loading until after the effect has completed.
    const timer = window.setTimeout(() => {
      void loadBookings(controller.signal);
    }, 0);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [loadBookings]);

  async function cancelBooking() {
    if (!bookingToCancel || cancellingId) return;

    const id = bookingToCancel._id;

    setCancellingId(id);

    try {
      const response = await fetch(`/api/bookings/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const result = await response.json();

      if (!response.ok || result.success !== true) {
        throw new Error(
          result.message || result.error || "Unable to cancel this booking."
        );
      }

      setBookings((previousBookings) =>
        previousBookings.filter((booking) => booking._id !== id)
      );

      setBookingToCancel(null);
      toast.success("Booking cancelled successfully.");
    } catch (error) {
      console.error("Cancel booking error:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to cancel the booking. Please try again."
      );
    } finally {
      setCancellingId("");
    }
  }

  function getStatusStyle(status: string) {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "bg-green-100 text-green-700";

      case "completed":
        return "bg-blue-100 text-blue-700";

      case "cancelled":
        return "bg-red-100 text-red-700";

      default:
        return "bg-amber-100 text-amber-800";
    }
  }

  function formatDate(dateString: string) {
    const date = new Date(`${dateString}T12:00:00`);

    if (Number.isNaN(date.getTime())) {
      return dateString;
    }

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      timeZone: "Asia/Dhaka",
    });
  }

  return (
    <main className="min-h-screen bg-[#faf9f6] px-4 py-10 text-[#20231f] sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#668b18]">
              YOUR CREATIVE JOURNEY
            </p>

            <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
              My Bookings
            </h1>

            <p className="mt-3 text-gray-500">
              Manage and view your studio booking requests.
            </p>
          </div>

          <Link
            href="/studios"
            className="inline-flex items-center justify-center gap-2 self-start rounded-xl bg-[#20231f] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#42483d] sm:self-auto"
          >
            Explore Studios <span aria-hidden="true">↗</span>
          </Link>
        </div>

        {loading ? (
          <div
            className="mt-10 space-y-5"
            aria-label="Loading bookings"
            aria-busy="true"
          >
            {[1, 2].map((item) => (
              <div
                key={item}
                className="flex animate-pulse flex-col gap-5 rounded-2xl border border-gray-200 bg-white p-5 sm:flex-row"
              >
                <div className="h-48 w-full rounded-xl bg-gray-200 sm:w-64" />

                <div className="flex-1 space-y-4 py-2">
                  <div className="h-5 w-24 rounded-full bg-gray-200" />
                  <div className="h-7 w-2/3 rounded bg-gray-200" />
                  <div className="h-4 w-1/2 rounded bg-gray-200" />
                  <div className="h-6 w-1/3 rounded bg-gray-200" />
                </div>
              </div>
            ))}
          </div>
        ) : bookings.length === 0 ? (
          <section className="mt-10 rounded-3xl border border-gray-200 bg-white px-6 py-16 text-center sm:px-12">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#eff5df] text-4xl">
              ◉
            </div>

            <h2 className="mt-6 text-2xl font-black">No active bookings</h2>

            <p className="mx-auto mt-3 max-w-md leading-7 text-gray-500">
              You have no active booking requests here. Cancelled bookings are
              hidden from this list. Explore studios to make a new booking.
            </p>

            <Link
              href="/studios"
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#20231f] px-6 py-3.5 font-bold text-white transition hover:bg-[#42483d]"
            >
              Find a Studio <span aria-hidden="true">↗</span>
            </Link>
          </section>
        ) : (
          <section className="mt-9 space-y-5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-gray-500">
                {bookings.length}{" "}
                {bookings.length === 1 ? "booking" : "bookings"}
              </p>
            </div>

            {bookings.map((booking) => (
              <article
                key={booking._id}
                className="overflow-hidden rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md sm:p-5"
              >
                <div className="flex flex-col gap-5 md:flex-row">
                  <Link
                    href={`/studios/${booking.studioId}`}
                    className="block shrink-0 overflow-hidden rounded-xl bg-[#edf1e5] md:w-64"
                  >
                    {booking.studioImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={booking.studioImage}
                        alt={booking.studioTitle}
                        className="h-52 w-full object-cover transition duration-300 hover:scale-[1.02] md:h-44"
                      />
                    ) : (
                      <div className="flex h-52 items-center justify-center text-5xl md:h-44">
                        🎬
                      </div>
                    )}
                  </Link>

                  <div className="flex min-w-0 flex-1 flex-col justify-between gap-5">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold capitalize ${getStatusStyle(
                            booking.status
                          )}`}
                        >
                          <span aria-hidden="true">
                            {booking.status.toLowerCase() === "confirmed"
                              ? "✓"
                              : booking.status.toLowerCase() === "completed"
                                ? "●"
                                : "◷"}
                          </span>
                          {booking.status}
                        </span>
                      </div>

                      <Link
                        href={`/studios/${booking.studioId}`}
                        className="mt-3 block text-xl font-black tracking-tight transition hover:text-[#668b18] sm:text-2xl"
                      >
                        {booking.studioTitle}
                      </Link>

                      {booking.location && (
                        <p className="mt-2 text-sm text-gray-500">
                          📍 {booking.location}
                        </p>
                      )}

                      <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-3 text-sm sm:grid-cols-2 lg:grid-cols-3">
                        <div>
                          <p className="text-gray-400">Booking date</p>
                          <p className="mt-1 font-semibold text-gray-700">
                            {formatDate(booking.bookingDate)}
                          </p>
                        </div>

                        <div>
                          <p className="text-gray-400">Time</p>
                          <p className="mt-1 font-semibold text-gray-700">
                            {booking.startTime} – {booking.endTime}
                          </p>
                        </div>

                        <div>
                          <p className="text-gray-400">Guests</p>
                          <p className="mt-1 font-semibold text-gray-700">
                            {booking.guests}
                          </p>
                        </div>

                        <div>
                          <p className="text-gray-400">Booking ID</p>
                          <p className="mt-1 font-semibold text-gray-700">
                            #{booking._id.slice(-6)}
                          </p>
                        </div>

                        <div>
                          <p className="text-gray-400">Duration</p>
                          <p className="mt-1 font-semibold text-gray-700">
                            {booking.totalHours}{" "}
                            {booking.totalHours === 1 ? "hour" : "hours"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col justify-between gap-4 border-t border-gray-100 pt-4 sm:flex-row sm:items-center">
                      <div>
                        <p className="text-xs font-medium text-gray-400">
                          Total booking price
                        </p>

                        <p className="mt-1 text-2xl font-black text-[#668b18]">
                          ৳{Number(booking.totalPrice).toLocaleString("en-US")}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {booking.status.toLowerCase() === "pending" && (
                          <button
                            type="button"
                            onClick={() => setBookingToCancel(booking)}
                            disabled={cancellingId === booking._id}
                            className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 px-4 py-2.5 text-sm font-bold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            ✕ Cancel
                          </button>
                        )}

                        <Link
                          href={`/studios/${booking.studioId}`}
                          className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#20231f] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#42483d]"
                        >
                          View Details <span aria-hidden="true">↗</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </section>
        )}
      </div>

      {bookingToCancel && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !cancellingId) {
              setBookingToCancel(null);
            }
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="cancel-booking-title"
            aria-describedby="cancel-booking-description"
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-xl text-red-600">
              !
            </div>

            <h2
              id="cancel-booking-title"
              className="mt-4 text-xl font-black text-gray-900"
            >
              Cancel this booking?
            </h2>

            <p
              id="cancel-booking-description"
              className="mt-2 leading-6 text-gray-600"
            >
              Are you sure you want to cancel your booking for{" "}
              <strong>{bookingToCancel.studioTitle}</strong>? This action
              cannot be undone from this page.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                disabled={Boolean(cancellingId)}
                onClick={() => setBookingToCancel(null)}
                className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-bold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
              >
                Keep Booking
              </button>

              <button
                type="button"
                disabled={Boolean(cancellingId)}
                onClick={() => void cancelBooking()}
                className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {cancellingId ? "Cancelling..." : "Yes, Cancel"}
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
