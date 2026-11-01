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
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: "Please sign in first." },
        { status: 401 }
      );
    }

    const { id } = await context.params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid booking ID." },
        { status: 400 }
      );
    }

    const booking = await db.collection("bookings").findOne({
      _id: new ObjectId(id),
      userId: session.user.id,
    });

    if (!booking) {
      return NextResponse.json(
        { success: false, message: "Booking not found." },
        { status: 404 }
      );
    }

    if (booking.status !== "pending") {
      return NextResponse.json(
        {
          success: false,
          message: "Only pending bookings can be cancelled.",
        },
        { status: 400 }
      );
    }

    await db.collection("bookings").updateOne(
      {
        _id: new ObjectId(id),
        userId: session.user.id,
        status: "pending",
      },
      {
        $set: {
          status: "cancelled",
          updatedAt: new Date(),
        },
      }
    );

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
