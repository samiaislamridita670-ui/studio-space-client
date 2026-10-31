import Link from "next/link";

const stats = [
  {
    title: "Total Studios",
    value: "—",
    description: "Your published studio listings",
    icon: "🏢",
    color: "bg-indigo-50",
  },
  {
    title: "Total Bookings",
    value: "—",
    description: "Bookings made by you",
    icon: "📅",
    color: "bg-blue-50",
  },
  {
    title: "Pending Bookings",
    value: "—",
    description: "Bookings awaiting confirmation",
    icon: "⏳",
    color: "bg-amber-50",
  },
];

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        <div className="mb-10">
          <p className="mb-2 font-semibold text-indigo-600">
            YOUR WORKSPACE
          </p>

          <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
            Welcome to Your Dashboard
          </h1>

          <p className="mt-3 text-slate-600">
            Manage your creative spaces and bookings in one place.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {stats.map((stat) => (
            <div
              key={stat.title}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div
                className={`mb-5 flex h-14 w-14 items-center justify-center rounded-xl text-2xl ${stat.color}`}
              >
                {stat.icon}
              </div>

              <h2 className="text-sm font-semibold text-slate-500">
                {stat.title}
              </h2>

              <p className="mt-2 text-4xl font-bold text-slate-900">
                {stat.value}
              </p>

              <p className="mt-3 text-sm text-slate-500">
                {stat.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-2">

          <section className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
            <h2 className="mb-6 text-xl font-bold text-slate-900">
              Quick Actions
            </h2>

            <div className="grid gap-4 sm:grid-cols-2">
              <Link
                href="/add-studio"
                className="rounded-xl bg-indigo-600 px-5 py-4 text-center font-semibold text-white transition hover:bg-indigo-700"
              >
                + Add New Studio
              </Link>

              <Link
                href="/my-listings"
                className="rounded-xl border border-slate-200 px-5 py-4 text-center font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                My Studio Listings
              </Link>

              <Link
                href="/studios"
                className="rounded-xl border border-slate-200 px-5 py-4 text-center font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Explore Studios
              </Link>

              <Link
                href="/my-bookings"
                className="rounded-xl border border-slate-200 px-5 py-4 text-center font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                My Bookings
              </Link>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
            <h2 className="mb-6 text-xl font-bold text-slate-900">
              Recent Activity
            </h2>

            <div className="flex min-h-48 flex-col items-center justify-center text-center">
              <div className="mb-4 text-5xl">📋</div>

              <h3 className="text-lg font-semibold text-slate-800">
                No activity to display yet
              </h3>

              <p className="mt-2 max-w-sm text-sm text-slate-500">
                Your recent studio and booking activity will appear here.
              </p>
            </div>
          </section>

        </div>
      </div>
    </main>
  );
}
