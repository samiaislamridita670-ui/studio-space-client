"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { signUp, signIn } from "@/lib/auth-client";

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    image: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  function updateField(field: keyof typeof form, value: string) {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const name = form.name.trim();
    const email = form.email.trim().toLowerCase();
    const password = form.password;

    if (!name) {
      toast.error("Please enter your full name.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must contain at least 6 characters.");
      return;
    }

    if (!/[A-Z]/.test(password)) {
      toast.error("Password must contain an uppercase letter.");
      return;
    }

    if (!/[a-z]/.test(password)) {
      toast.error("Password must contain a lowercase letter.");
      return;
    }

    if (password !== form.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await signUp.email({
        name,
        email,
        password,
        ...(form.image.trim() ? { image: form.image.trim() } : {}),
      });

      if (error) {
        throw new Error(error.message || "Registration failed.");
      }

      if (!data) {
        throw new Error("Registration did not return account information.");
      }

      toast.success("Account created successfully!");

      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-12 sm:px-6">
      <div className="mx-auto max-w-lg">
        <div className="mb-8 text-center">
          <Link
            href="/"
            className="text-3xl font-black tracking-tight text-indigo-600"
          >
            StudioSpace
          </Link>

          <h1 className="mt-6 text-3xl font-bold text-slate-900">
            Create Your Account
          </h1>

          <p className="mt-3 text-slate-600">
            Join StudioSpace and discover inspiring creative spaces.
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-9">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Full Name
              </label>

              <input
                id="name"
                type="text"
                required
                value={form.name}
                onChange={(event) =>
                  updateField("name", event.target.value)
                }
                placeholder="Enter your full name"
                autoComplete="name"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Email Address
              </label>

              <input
                id="email"
                type="email"
                required
                value={form.email}
                onChange={(event) =>
                  updateField("email", event.target.value)
                }
                placeholder="you@example.com"
                autoComplete="email"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label
                htmlFor="image"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Profile Photo URL
              </label>

              <input
                id="image"
                type="url"
                value={form.image}
                onChange={(event) =>
                  updateField("image", event.target.value)
                }
                placeholder="https://example.com/photo.jpg"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-indigo-500"
              />

              <p className="mt-2 text-xs text-slate-500">
                Optional: Add a link to your profile photo.
              </p>
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Password
              </label>

              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={6}
                  value={form.password}
                  onChange={(event) =>
                    updateField("password", event.target.value)
                  }
                  placeholder="Create a password"
                  autoComplete="new-password"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 pr-20 text-slate-900 outline-none focus:border-indigo-500"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-indigo-600"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              <p className="mt-2 text-xs text-slate-500">
                Minimum 6 characters, including uppercase and lowercase letters.
              </p>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Confirm Password
              </label>

              <input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                required
                value={form.confirmPassword}
                onChange={(event) =>
                  updateField("confirmPassword", event.target.value)
                }
                placeholder="Confirm your password"
                autoComplete="new-password"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-indigo-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-indigo-600 px-5 py-3.5 font-bold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <div className="my-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-slate-200" />
            <span className="text-sm text-slate-400">OR</span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          <button
            type="button" onClick={async () => { try { const { error } = await signIn.social({ provider: "google", callbackURL: "/" }); if (error) { alert(error.message || "Google sign-in failed."); } } catch (error) { alert(error instanceof Error ? error.message : "Google sign-in failed."); } }}
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-500 "
          >
            <span className="text-xl font-bold">G</span>
            Continue with Google
          </button>

          <p className="mt-7 text-center text-sm text-slate-600">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-bold text-indigo-600 hover:underline"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}

