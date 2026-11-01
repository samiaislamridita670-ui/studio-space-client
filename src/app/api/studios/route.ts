import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

const BACKEND_URL =
  process.env.BACKEND_URL || "http://localhost:5000";

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

// Public: Explore Studios
export async function GET(request: NextRequest) {
  try {
    const mine = request.nextUrl.searchParams.get("mine");

    if (mine === "1") {
      const user = await getAuthenticatedUser();

      if (!user) {
        return NextResponse.json(
          { success: false, message: "Please login first." },
          { status: 401 }
        );
      }

      const response = await fetch(
        `${BACKEND_URL}/api/studios/mine`,
        {
          headers: getInternalHeaders(user),
          cache: "no-store",
        }
      );

      return proxyResponse(response);
    }

    const query = request.nextUrl.searchParams.toString();
    const url = `${BACKEND_URL}/api/studios${query ? `?${query}` : ""}`;

    const response = await fetch(url, {
      cache: "no-store",
    });

    return proxyResponse(response);
  } catch (error) {
    console.error("Studio GET proxy error:", error);

    return NextResponse.json(
      { success: false, message: "Unable to fetch studios." },
      { status: 500 }
    );
  }
}

// Private: Create Studio
export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser();

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Please login first." },
        { status: 401 }
      );
    }

    const body = await request.json();

    const response = await fetch(`${BACKEND_URL}/api/studios`, {
      method: "POST",
      headers: getInternalHeaders(user),
      body: JSON.stringify(body),
      cache: "no-store",
    });

    return proxyResponse(response);
  } catch (error) {
    console.error("Studio POST proxy error:", error);

    return NextResponse.json(
      { success: false, message: "Unable to create studio." },
      { status: 500 }
    );
  }
}
