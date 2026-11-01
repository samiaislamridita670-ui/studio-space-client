import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

const BACKEND_URL =
  process.env.BACKEND_URL || "http://localhost:5000";

type RouteContext = {
  params: Promise<{ id: string }>;
};

async function getAuthenticatedUser() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return session?.user || null;
}

function getInternalHeaders(user: {
  id: string;
  name: string;
  email: string;
}) {
  const secret = process.env.INTERNAL_API_SECRET;

  if (!secret) {
    throw new Error("INTERNAL_API_SECRET is missing.");
  }

  return {
    "Content-Type": "application/json",
    "x-internal-api-secret": secret,
    "x-authenticated-user-id": user.id,
    "x-authenticated-user-name": user.name || "Studio Host",
    "x-authenticated-user-email": user.email,
  };
}

async function proxyResponse(response: Response) {
  const data = await response.json();

  return NextResponse.json(data, {
    status: response.status,
  });
}

// Public: Get studio details
export async function GET(
  _request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params;

    const response = await fetch(
      `${BACKEND_URL}/api/studios/${encodeURIComponent(id)}`,
      { cache: "no-store" }
    );

    return proxyResponse(response);
  } catch (error) {
    console.error("Studio details proxy error:", error);

    return NextResponse.json(
      { success: false, message: "Unable to fetch studio." },
      { status: 500 }
    );
  }
}

// Private: Update studio
export async function PUT(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const user = await getAuthenticatedUser();

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Please login first." },
        { status: 401 }
      );
    }

    const { id } = await context.params;
    const body = await request.json();

    const response = await fetch(
      `${BACKEND_URL}/api/studios/${encodeURIComponent(id)}`,
      {
        method: "PUT",
        headers: getInternalHeaders(user),
        body: JSON.stringify(body),
        cache: "no-store",
      }
    );

    return proxyResponse(response);
  } catch (error) {
    console.error("Studio PUT proxy error:", error);

    return NextResponse.json(
      { success: false, message: "Unable to update studio." },
      { status: 500 }
    );
  }
}

// Private: Delete studio
export async function DELETE(
  _request: NextRequest,
  context: RouteContext
) {
  try {
    const user = await getAuthenticatedUser();

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Please login first." },
        { status: 401 }
      );
    }

    const { id } = await context.params;

    const response = await fetch(
      `${BACKEND_URL}/api/studios/${encodeURIComponent(id)}`,
      {
        method: "DELETE",
        headers: getInternalHeaders(user),
        cache: "no-store",
      }
    );

    return proxyResponse(response);
  } catch (error) {
    console.error("Studio DELETE proxy error:", error);

    return NextResponse.json(
      { success: false, message: "Unable to delete studio." },
      { status: 500 }
    );
  }
}
