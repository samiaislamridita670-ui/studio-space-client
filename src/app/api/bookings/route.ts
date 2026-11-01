import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { MongoClient } from "mongodb";



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

  if (!session?.user) {
    return null;
  }

  return session.user;
}

// GET: নিজের booking দেখাবে
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

export async function GET() {
  try {
    const user = await getAuthenticatedUser();

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Please sign in to view your bookings." },
        { status: 401 }
      );
    }

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

// POST: নতুন booking তৈরি করবে


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

    const dateParts = bookingDate.split("-").map(Number);
      const [year, month, day] = dateParts;
      const selectedDate = new Date(Date.UTC(year, month - 1, day));

      if (
        dateParts.length !== 3 ||
        !Number.isFinite(selectedDate.getTime()) ||
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

    const studio = await db.collection("studios").findOne({
      _id: new ObjectId(studioId),
    });

    if (!studio) {
      return NextResponse.json(
        { success: false, message: "Studio not found." },
        { status: 404 }
      );
    }

    if (guestCount > Number(studio.maxCapacity || 1)) {
      return NextResponse.json(
        { success: false, message: "Guest count exceeds studio capacity." },
        { status: 400 }
      );
    }

    const [startHour, startMinute] = startTime.split(":").map(Number);
    const [endHour, endMinute] = endTime.split(":").map(Number);

    const duration =
      endHour * 60 +
      endMinute -
      (startHour * 60 + startMinute);

    const totalHours = duration / 60;
    const totalPrice = totalHours * Number(studio.hourlyRate);

    const overlappingBooking = await db.collection("bookings").findOne({
      studioId,
      bookingDate,
      status: { $in: ["pending", "confirmed"] },
      startTime: { $lt: endTime },
      endTime: { $gt: startTime },
    });

    if (overlappingBooking) {
      return NextResponse.json(
        {
          success: false,
          message: "This studio is already booked for the selected time.",
        },
        { status: 409 }
      );
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
      hourlyRate: Number(studio.hourlyRate),
      totalHours,
      totalPrice,
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("bookings").insertOne(booking);

    return NextResponse.json(
      {
        success: true,
        message: "Booking request submitted successfully!",
        data: {
          ...booking,
          _id: result.insertedId.toString(),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create booking error:", error);

    return NextResponse.json(
      { success: false, message: "Unable to create booking." },
      { status: 500 }
    );
  }
}

