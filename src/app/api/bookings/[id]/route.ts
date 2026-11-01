import { NextResponse } from "next/server";
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

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // 1. Verify authenticated user
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: "Please sign in first." },
        { status: 401 }
      );
    }

    // 2. Validate booking ID
    const { id } = await context.params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid booking ID." },
        { status: 400 }
      );
    }

    const bookingId = new ObjectId(id);
    const userId = session.user.id;

    // 3. Verify booking ownership
    const booking = await db.collection("bookings").findOne({
      _id: bookingId,
      userId,
    });

    if (!booking) {
      return NextResponse.json(
        { success: false, message: "Booking not found." },
        { status: 404 }
      );
    }

    // 4. Only pending bookings can be cancelled
    if (booking.status !== "pending") {
      return NextResponse.json(
        {
          success: false,
          message: "Only pending bookings can be cancelled.",
        },
        { status: 400 }
      );
    }

    // 5. Atomic cancellation: update only if status is still pending
    const result = await db.collection("bookings").updateOne(
      {
        _id: bookingId,
        userId,
        status: "pending",
      },
      {
        $set: {
          status: "cancelled",
          updatedAt: new Date(),
        },
      }
    );

    // 6. Check whether the booking was actually updated
    if (result.matchedCount === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "This booking is no longer pending and cannot be cancelled.",
        },
        { status: 409 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Booking cancelled successfully.",
    });
  } catch (error) {
    console.error("Cancel booking error:", error);

    return NextResponse.json(
      { success: false, message: "Unable to cancel booking." },
      { status: 500 }
    );
  }
}