"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

type UserProfile = {
name: string;
email: string;
image?: string;
};

export default function Navbar() {
const pathname = usePathname();
const router = useRouter();

const [menuOpen, setMenuOpen] = useState(false);
const [profileOpen, setProfileOpen] = useState(false);
const [user, setUser] = useState<UserProfile | null>(null);
const [signingOut, setSigningOut] = useState(false);

const profileRef = useRef<HTMLDivElement>(null);

useEffect(() => {
// Read the user profile saved after a successful login.
try {
const savedUser = localStorage.getItem("studioSpaceUser");


  if (savedUser) {
    setUser(JSON.parse(savedUser) as UserProfile);
  } else {
    setUser(null);
  }
} catch {
  setUser(null);
}


}, [pathname]);

useEffect(() => {
function handleOutsideClick(event: MouseEvent) {
if (
profileRef.current &&
!profileRef.current.contains(event.target as Node)
) {
setProfileOpen(false);
}
}


document.addEventListener("mousedown", handleOutsideClick);

return () => {
  document.removeEventListener("mousedown", handleOutsideClick);
};


}, []);

async function handleSignOut() {
setSigningOut(true);


try {
  // This endpoint will be implemented in the Express authentication API.
  const response = await fetch("http://localhost:5000/api/auth/logout", {
    method: "POST",
    credentials: "include",
  });

  // A 404 is expected until the backend logout endpoint is implemented.
  if (!response.ok && response.status !== 404) {
    throw new Error("Unable to sign out. Please try again.");
  }
} catch {
  // The UI session is still cleared locally.
  // A real server-side logout endpoint is needed for complete sign-out.
} finally {
  localStorage.removeItem("studioSpaceUser");
  setUser(null);
  setProfileOpen(false);
  setMenuOpen(false);
  setSigningOut(false);
  router.push("/");
  router.refresh();
}


}

const navigationLinks = [
{ label: "Home", href: "/" },
{ label: "Explore Studios", href: "/studios" },
{ label: "How It Works", href: "/#how-it-works" },
{ label: "About Us", href: "/#about" },
];

const initials =
user?.name
?.trim()
.split(/\s+/)
.map((part) => part[0])
.join("")
.slice(0, 2)
.toUpperCase() || "U";

return ( <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 text-slate-900 shadow-sm backdrop-blur-xl"> <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
{/* Logo */}
<Link
href="/"
className="flex shrink-0 items-center gap-2.5"
onClick={() => setMenuOpen(false)}
> <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 text-xl font-black text-white shadow-lg shadow-indigo-200">
S </span>


      <span className="text-xl font-extrabold tracking-tight sm:text-2xl">
        Studio<span className="text-indigo-600">Space</span>
      </span>
    </Link>

    {/* Desktop Navigation */}
    <div className="hidden items-center gap-7 lg:flex">
      {navigationLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={`text-sm font-medium transition hover:text-indigo-600 ${
            pathname === link.href
              ? "text-indigo-600"
              : "text-slate-600"
          }`}
        >
          {link.label}
        </Link>
      ))}
    </div>

    {/* Desktop Authentication */}
    <div className="hidden items-center gap-3 lg:flex">
      {!user ? (
        <>
          <Link
            href="/login"
            className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-indigo-600"
          >
            Sign In
          </Link>

          <Link
            href="/register"
            className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-200 transition hover:bg-indigo-700"
          >
            Sign Up
          </Link>
        </>
      ) : (
        <div className="relative" ref={profileRef}>
          <button
            type="button"
            onClick={() => setProfileOpen(!profileOpen)}
            aria-expanded={profileOpen}
            aria-label="Open profile menu"
            className="flex items-center gap-3 rounded-full border border-slate-200 py-1.5 pl-1.5 pr-3 transition hover:border-indigo-300 hover:bg-slate-50"
          >
            {user.image ? (
              <img
                src={user.image}
                alt="Profile"
                className="h-10 w-10 rounded-full object-cover"
              />
            ) : (
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 text-sm font-bold text-white">
                {initials}
              </span>
            )}

            <span className="max-w-28 truncate text-sm font-semibold">
              {user.name}
            </span>

            <svg
              className={`h-4 w-4 text-slate-500 transition ${
                profileOpen ? "rotate-180" : ""
              }`}
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M5.22 7.22a.75.75 0 0 1 1.06 0L10 10.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 8.28a.75.75 0 0 1 0-1.06Z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          {profileOpen && (
            <div className="absolute right-0 top-full mt-3 w-72 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-200/70">
              <div className="border-b border-slate-100 bg-slate-50 px-5 py-4">
                <p className="truncate font-bold text-slate-900">
                  {user.name}
                </p>
                <p className="mt-1 truncate text-sm text-slate-500">
                  {user.email}
                </p>
              </div>

              <div className="p-2">
                <Link
                  href="/profile"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-indigo-50 hover:text-indigo-700"
                >
                  <span>👤</span>
                  View My Profile
                </Link>

                <Link
                  href="/dashboard"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-indigo-50 hover:text-indigo-700"
                >
                  <span>📊</span>
                  Dashboard
                </Link>

                <Link
                  href="/add-studio"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-indigo-50 hover:text-indigo-700"
                >
                  <span>➕</span>
                  Add New Studio
                </Link>

                <Link
                  href="/my-listings"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-indigo-50 hover:text-indigo-700"
                >
                  <span>🏢</span>
                  My Studio Listings
                </Link>

                <Link
                  href="/my-bookings"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-indigo-50 hover:text-indigo-700"
                >
                  <span>📅</span>
                  My Bookings
                </Link>
              </div>

              <div className="border-t border-slate-100 p-2">
                <button
                  type="button"
                  onClick={handleSignOut}
                  disabled={signingOut}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-60"
                >
                  <span>↪</span>
                  {signingOut ? "Signing Out..." : "Sign Out"}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>

    {/* Mobile Menu Button */}
    <button
      type="button"
      onClick={() => setMenuOpen(!menuOpen)}
      className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-700 transition hover:bg-slate-100 lg:hidden"
      aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
      aria-expanded={menuOpen}
    >
      {menuOpen ? (
        <svg
          className="h-6 w-6"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <path d="m18 6-12 12M6 6l12 12" />
        </svg>
      ) : (
        <svg
          className="h-6 w-6"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <path d="M4 7h16M4 12h16M4 17h16" />
        </svg>
      )}
    </button>
  </nav>

  {/* Mobile Navigation */}
  {menuOpen && (
    <div className="border-t border-slate-200 bg-white px-4 py-4 shadow-lg lg:hidden sm:px-6">
      <div className="mx-auto max-w-7xl space-y-1">
        {navigationLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={() => setMenuOpen(false)}
            className="block rounded-xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-indigo-50 hover:text-indigo-700"
          >
            {link.label}
          </Link>
        ))}

        <div className="my-3 border-t border-slate-100" />

        {!user ? (
          <div className="grid grid-cols-2 gap-3 pt-2">
            <Link
              href="/login"
              onClick={() => setMenuOpen(false)}
              className="rounded-xl border border-slate-200 px-4 py-3 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Sign In
            </Link>

            <Link
              href="/register"
              onClick={() => setMenuOpen(false)}
              className="rounded-xl bg-indigo-600 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              Sign Up
            </Link>
          </div>
        ) : (
          <div className="pt-2">
            <div className="mb-3 flex items-center gap-3 rounded-xl bg-slate-50 p-3">
              {user.image ? (
                <img
                  src={user.image}
                  alt="Profile"
                  className="h-11 w-11 rounded-full object-cover"
                />
              ) : (
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-indigo-600 font-bold text-white">
                  {initials}
                </span>
              )}

              <div className="min-w-0">
                <p className="truncate font-semibold text-slate-900">
                  {user.name}
                </p>
                <p className="truncate text-sm text-slate-500">
                  {user.email}
                </p>
              </div>
            </div>

            {[
              { label: "View My Profile", href: "/profile" },
              { label: "Dashboard", href: "/dashboard" },
              { label: "Add New Studio", href: "/add-studio" },
              { label: "My Studio Listings", href: "/my-listings" },
              { label: "My Bookings", href: "/my-bookings" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="block rounded-xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-indigo-50 hover:text-indigo-700"
              >
                {item.label}
              </Link>
            ))}

            <button
              type="button"
              onClick={handleSignOut}
              disabled={signingOut}
              className="mt-2 w-full rounded-xl px-4 py-3 text-left text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-60"
            >
              {signingOut ? "Signing Out..." : "Sign Out"}
            </button>
          </div>
        )}
      </div>
    </div>
  )}
</header>


);
}

