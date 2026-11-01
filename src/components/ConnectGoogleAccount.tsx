"use client";

import { useState } from "react";
import { linkSocial, useSession } from "@/lib/auth-client";

export default function ConnectGoogleAccount() {
  const { data: session, isPending } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (isPending || !session?.user) return null;

  async function handleConnect() {
    setLoading(true);
    setError("");

    try {
      const result = await linkSocial({
        provider: "google",
        callbackURL: "/dashboard",
      });

      if (result.error) {
        throw new Error(result.error.message || "Google linking failed.");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to connect Google."
      );
      setLoading(false);
    }
  }

  return (
    <div className="mt-6 rounded-xl border border-indigo-200 bg-indigo-50 p-5">
      <h3 className="text-lg font-bold text-slate-900">
        Connect Your Google Account
      </h3>

      <p className="mt-2 text-sm text-slate-600">
        Link Google with your existing StudioSpace account.
      </p>

      <button
        type="button"
        onClick={handleConnect}
        disabled={loading}
        className="mt-4 rounded-lg bg-indigo-600 px-5 py-3 font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
      >
        {loading ? "Connecting..." : "Connect Google Account"}
      </button>

      {error && (
        <p role="alert" className="mt-3 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
