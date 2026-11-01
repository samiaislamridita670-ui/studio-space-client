import { NextRequest, NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";

const mongoUri = process.env.MONGODB_URI;

if (!mongoUri) {
  throw new Error("MONGODB_URI is missing from environment variables.");
}

const globalForMongo = globalThis as typeof globalThis & {
  studioSpaceBookingClient?: MongoClient;
};

const client =
  globalForMongo.studioSpaceBookingClient ?? new MongoClient(mongoUri);

if (process.env.NODE_ENV !== "production") {
  globalForMongo.studioSpaceBookingClient = client;
}

const db = client.db("studioSpaceDB");

async function getAuthenticatedUser() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return session?.user ?? null;
}

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

// GET: নিজের booking দেখাবে
export async function GET() {
  try {
    const user = await getAuthenticatedUser();

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Please sign in to view your bookings." },
        { status: 401 }
      );
    }

    await client.connect();

    const bookings = await db
      .collection("bookings")
      .find({ userId: user.id })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({
      success: true,
      count: bookings.length,
      data: bookings.map((booking) => ({
        ...booking,
        _id: booking._id.toString(),
      })),
    });
  } catch (error) {
    console.error("Fetch bookings error:", error);

    return NextResponse.json(
      { success: false, message: "Unable to fetch bookings." },
      { status: 500 }
    );
  }
}

// POST: Transaction-protected booking creation
export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser();

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Please sign in before booking." },
        { status: 401 }
      );
    }

    const body = await request.json();

    const { studioId, bookingDate, startTime, endTime, guests } = body;

    if (
      typeof studioId !== "string" ||
      !ObjectId.isValid(studioId) ||
      typeof bookingDate !== "string" ||
      typeof startTime !== "string" ||
      typeof endTime !== "string"
    ) {
      return NextResponse.json(
        { success: false, message: "Please provide valid booking details." },
        { status: 400 }
      );
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(bookingDate)) {
      return NextResponse.json(
        { success: false, message: "Invalid booking date." },
        { status: 400 }
      );
    }

    if (
      !/^([01]\d|2[0-3]):[0-5]\d$/.test(startTime) ||
      !/^([01]\d|2[0-3]):[0-5]\d$/.test(endTime) ||
      endTime <= startTime
    ) {
      return NextResponse.json(
        { success: false, message: "Please select a valid time range." },
        { status: 400 }
      );
    }

    const [year, month, day] = bookingDate.split("-").map(Number);
    const selectedDate = new Date(Date.UTC(year, month - 1, day));

    if (
      selectedDate.getUTCFullYear() !== year ||
      selectedDate.getUTCMonth() !== month - 1 ||
      selectedDate.getUTCDate() !== day ||
      bookingDate < getBangladeshDate()
    ) {
      return NextResponse.json(
        { success: false, message: "Please select today or a future date." },
        { status: 400 }
      );
    }

    const guestCount = Number(guests);

    if (!Number.isInteger(guestCount) || guestCount < 1) {
      return NextResponse.json(
        { success: false, message: "Guest count must be at least 1." },
        { status: 400 }
      );
    }

    await client.connect();

    const studioObjectId = new ObjectId(studioId);
    const session = client.startSession();

    let bookingResult:
      | { conflict: true }
      | { conflict: false; booking: Record<string, unknown> & { _id: ObjectId } }
      | null = null;

    try {
      await session.withTransaction(
        async () => {
          // Atomic write on the studio document serializes
          // concurrent booking transactions for this studio.
          const studioUpdate = await db.collection("studios").updateOne(
            { _id: studioObjectId },
            { $inc: { bookingLockVersion: 1 } },
            { session }
          );

          if (studioUpdate.matchedCount === 0) {
            throw new Error("STUDIO_NOT_FOUND");
          }

          const studio = await db.collection("studios").findOne(
            { _id: studioObjectId },
            { session }
          );

          if (!studio) {
            throw new Error("STUDIO_NOT_FOUND");
          }

          if (guestCount > Number(studio.maxCapacity || 1)) {
            throw new Error("GUEST_CAPACITY_EXCEEDED");
          }

          const overlappingBooking = await db
            .collection("bookings")
            .findOne(
              {
                studioId,
                bookingDate,
                status: { $in: ["pending", "confirmed"] },
                startTime: { $lt: endTime },
                endTime: { $gt: startTime },
              },
              { session }
            );

          if (overlappingBooking) {
            bookingResult = { conflict: true };
            return;
          }

          const [startHour, startMinute] = startTime.split(":").map(Number);
          const [endHour, endMinute] = endTime.split(":").map(Number);

          const duration =
            endHour * 60 +
            endMinute -
            (startHour * 60 + startMinute);

          const totalHours = duration / 60;
          const hourlyRate = Number(studio.hourlyRate);
          const totalPrice = totalHours * hourlyRate;

          if (!Number.isFinite(hourlyRate) || hourlyRate < 0) {
            throw new Error("INVALID_STUDIO_PRICE");
          }

          const booking = {
            studioId,
            studioTitle: studio.title,
            studioImage: studio.image || "",
            location: studio.location || "",
            userId: user.id,
            userName: user.name || "",
            userEmail: user.email,
            bookingDate,
            startTime,
            endTime,
            guests: guestCount,
            hourlyRate,
            totalHours,
            totalPrice,
            status: "pending",
            createdAt: new Date(),
            updatedAt: new Date(),
          };

          const result = await db.collection("bookings").insertOne(
            booking,
            { session }
          );

          bookingResult = {
            conflict: false,
            booking: {
              ...booking,
              _id: result.insertedId,
            },
          };
        },
        {
          readPreference: "primary",
          readConcern: { level: "snapshot" },
          writeConcern: { w: "majority" },
        }
      );
    } finally {
      await session.endSession();
    }

    const finalBookingResult = bookingResult as
      | { conflict: true }
      | {
          conflict: false;
          booking: Record<string, unknown> & { _id: ObjectId };
        }
      | null;

    if (!finalBookingResult) {
      throw new Error("Booking transaction did not return a result.");
    }

    if (finalBookingResult.conflict) {
      return NextResponse.json(
        {
          success: false,
          message: "This studio is already booked for the selected time.",
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Booking request submitted successfully!",
        data: {
          ...finalBookingResult.booking,
          _id: finalBookingResult.booking._id.toString(),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "STUDIO_NOT_FOUND") {
        return NextResponse.json(
          { success: false, message: "Studio not found." },
          { status: 404 }
        );
      }

      if (error.message === "GUEST_CAPACITY_EXCEEDED") {
        return NextResponse.json(
          { success: false, message: "Guest count exceeds studio capacity." },
          { status: 400 }
        );
      }

      if (error.message === "INVALID_STUDIO_PRICE") {
        return NextResponse.json(
          { success: false, message: "Studio price is invalid." },
          { status: 400 }
        );
      }
    }

    console.error("Create booking error:", error);

    return NextResponse.json(
      { success: false, message: "Unable to create booking." },
      { status: 500 }
    );
  }
}
