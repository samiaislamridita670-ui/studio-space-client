"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Studio = {
_id: string;
title: string;
category: string;
hourlyRate: number;
location: string;
image: string;
rating?: number;
maxCapacity?: number;
};

const slides = [
{
eyebrow: "YOUR SPACE. YOUR STORY.",
title: "Make room for your next big idea.",
description:
"Discover inspiring creative spaces for photography, music, podcasts, and production.",
image:
"https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1800&q=85",
button: "Explore Studios",
href: "/studios",
},
{
eyebrow: "CREATE WITHOUT LIMITS",
title: "Find the perfect space to create.",
description:
"From professional photography studios to podcast rooms, find a space that fits your vision.",
image:
"https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1800&q=85",
button: "Discover Spaces",
href: "/studios",
},
{
eyebrow: "SHARE YOUR CREATIVE SPACE",
title: "Turn your studio into an opportunity.",
description:
"List your creative workspace and connect with people who are ready to bring ideas to life.",
image:
"https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1800&q=85",
button: "List Your Studio",
href: "/add-studio",
},
];

const categories = [
{
name: "Photo Studio",
description: "Capture your best moments.",
image:
"https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=700&q=80",
icon: "📸",
},
{
name: "Sound Stage",
description: "Bring visual stories to life.",
image:
"https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=700&q=80",
icon: "🎬",
},
{
name: "Podcast Room",
description: "Give your voice a platform.",
image:
"https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=700&q=80",
icon: "🎙️",
},
{
name: "Music Suite",
description: "Make your next great sound.",
image:
"https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=700&q=80",
icon: "🎵",
},
{
name: "Art Workshop",
description: "Make creativity tangible.",
image:
"https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=700&q=80",
icon: "🎨",
},
];

const steps = [
{
number: "01",
title: "Discover",
description:
"Browse creative spaces and find the right studio for your project.",
icon: "⌕",
},
{
number: "02",
title: "Choose",
description:
"Compare amenities, locations, capacities, and hourly rates.",
icon: "◇",
},
{
number: "03",
title: "Book",
description:
"Choose your preferred date and time for your creative session.",
icon: "▣",
},
{
number: "04",
title: "Create",
description:
"Show up, get inspired, and turn your ideas into something amazing.",
icon: "✳",
},
];

export default function HomePage() {
const router = useRouter();

const [activeSlide, setActiveSlide] = useState(0);
const [search, setSearch] = useState("");
const [studios, setStudios] = useState<Studio[]>([]);
const [loading, setLoading] = useState(true);
const [apiError, setApiError] = useState(false);

useEffect(() => {
const timer = window.setInterval(() => {
setActiveSlide((current) => (current + 1) % slides.length);
}, 6000);


return () => window.clearInterval(timer);


}, []);

useEffect(() => {
async function fetchFeaturedStudios() {
try {
const response = await fetch("/api/studios?limit=6&sort=rating");


    if (!response.ok) {
      throw new Error("Unable to load studios.");
    }

    const result = await response.json();
    const studioData = Array.isArray(result.data) ? result.data : [];

    setStudios(studioData);
    setApiError(false);
  } catch {
    setApiError(true);
    setStudios([]);
  } finally {
    setLoading(false);
  }
}

fetchFeaturedStudios();


}, []);

function handleSearch(event: React.FormEvent<HTMLFormElement>) {
event.preventDefault();


const query = search.trim();

if (query) {
  router.push(`/studios?search=${encodeURIComponent(query)}`);
} else {
  router.push("/studios");
}


}

function formatPrice(price: number) {
return new Intl.NumberFormat("en-BD", {
maximumFractionDigits: 0,
}).format(price);
}

const currentSlide = slides[activeSlide];

return ( <main className="min-h-screen bg-[#f8f9f4] text-[#20231f]">
{/* Hero Section */} <section className="relative overflow-hidden bg-[#20231f]"> <div className="absolute inset-0">
{slides.map((slide, index) => (
<div key={slide.title}
className={`absolute inset-0 transition-opacity duration-1000 ${
                activeSlide === index ? "opacity-100" : "opacity-0"
              }`}
aria-hidden={activeSlide !== index}
> <img
             src={slide.image}
             alt=""
             className="h-full w-full object-cover"
           /> </div>
))}


      <div className="absolute inset-0 bg-gradient-to-r from-[#171a16]/95 via-[#171a16]/75 to-[#171a16]/30" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#171a16]/60 to-transparent" />
    </div>

    <div className="relative mx-auto grid min-h-[590px] max-w-7xl items-center gap-12 px-5 py-20 sm:px-8 lg:min-h-[650px] lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
      <div className="max-w-2xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold tracking-[0.18em] text-[#dfff64] backdrop-blur-sm sm:text-sm">
          <span className="h-2 w-2 rounded-full bg-[#dfff64]" />
          {currentSlide.eyebrow}
        </div>

        <h1 className="mt-7 text-4xl font-black leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-7xl">
          {currentSlide.title.split(" ").slice(0, -2).join(" ")}{" "}
          <span className="text-[#dfff64]">
            {currentSlide.title.split(" ").slice(-2).join(" ")}
          </span>
        </h1>

        <p className="mt-6 max-w-xl text-base leading-8 text-white/75 sm:text-lg">
          {currentSlide.description}
        </p>

        <form
          onSubmit={handleSearch}
          className="mt-9 flex max-w-xl flex-col gap-3 rounded-2xl bg-white p-2 sm:flex-row sm:items-center"
        >
          <div className="flex min-w-0 flex-1 items-center gap-3 px-3">
            <svg
              className="h-5 w-5 shrink-0 text-gray-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m16 16 4 4" />
            </svg>

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search studios, categories, or locations"
              aria-label="Search studios"
              className="w-full min-w-0 border-0 bg-transparent py-3 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:ring-0"
            />
          </div>

          <button
            type="submit"
            className="shrink-0 rounded-xl bg-[#dfff64] px-6 py-3.5 text-sm font-bold text-[#20231f] transition hover:bg-[#c8ef43]"
          >
            Search Spaces <span aria-hidden="true">↗</span>
          </button>
        </form>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/studios"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#dfff64] px-6 py-3.5 text-sm font-bold text-[#20231f] transition hover:bg-[#c8ef43] focus:outline-none focus:ring-2 focus:ring-[#dfff64] focus:ring-offset-2 focus:ring-offset-[#20231f]"
          >
            Explore Studios <span aria-hidden="true">↗</span>
          </Link>

          <Link
            href="/add-studio"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/35 bg-white/10 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white"
          >
            Host Your Space <span aria-hidden="true">＋</span>
          </Link>
        </div>

        <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-white/70">
          <span className="flex items-center gap-2">
            <span className="text-[#dfff64]">✓</span>
            Unique creative spaces
          </span>
          <span className="flex items-center gap-2">
            <span className="text-[#dfff64]">✓</span>
            Flexible hourly booking
          </span>
        </div>

        <div className="mt-9 flex items-center gap-3">
          {slides.map((slide, index) => (
            <button
              key={slide.title}
              type="button"
              onClick={() => setActiveSlide(index)}
              aria-label={`Show slide ${index + 1}`}
              aria-pressed={activeSlide === index}
              className={`h-2 rounded-full transition-all ${
                activeSlide === index
                  ? "w-10 bg-[#dfff64]"
                  : "w-3 bg-white/40 hover:bg-white/70"
              }`}
            />
          ))}

          <span className="ml-2 text-xs tracking-widest text-white/60">
            0{activeSlide + 1} / 0{slides.length}
          </span>

          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              onClick={() =>
                setActiveSlide((current) => (current - 1 + slides.length) % slides.length)
              }
              aria-label="Previous slide"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 text-lg text-white transition hover:border-[#dfff64] hover:bg-[#dfff64] hover:text-[#20231f] focus:outline-none focus:ring-2 focus:ring-[#dfff64]"
            >
              <span aria-hidden="true">←</span>
            </button>

            <button
              type="button"
              onClick={() =>
                setActiveSlide((current) => (current + 1) % slides.length)
              }
              aria-label="Next slide"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 text-lg text-white transition hover:border-[#dfff64] hover:bg-[#dfff64] hover:text-[#20231f] focus:outline-none focus:ring-2 focus:ring-[#dfff64]"
            >
              <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>
      </div>

      <div className="hidden lg:flex lg:justify-end">
        <div className="w-full max-w-sm rounded-3xl border border-white/20 bg-white/10 p-5 shadow-2xl backdrop-blur-xl">
          <div className="overflow-hidden rounded-2xl">
            <img
              src={currentSlide.image}
              alt="Creative workspace"
              className="h-64 w-full object-cover"
            />
          </div>

          <div className="flex items-start justify-between gap-4 pt-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#dfff64]">
                Made for creators
              </p>
              <h2 className="mt-2 text-xl font-bold text-white">
                Your next project starts here.
              </h2>
            </div>

            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#dfff64] text-xl text-[#20231f]">
              ↗
            </span>
          </div>

          <p className="mt-3 text-sm leading-6 text-white/65">
            Find a space that fits your vision, your schedule, and your
            budget.
          </p>
        </div>
      </div>
    </div>
  </section>

  {/* Categories */}
  <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-8">
    <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#668b18]">
          FIND YOUR SPACE
        </p>

        <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
          What are you creating?
        </h2>

        <p className="mt-3 max-w-xl leading-7 text-gray-500">
          Explore creative spaces designed to bring every kind of idea to
          life.
        </p>
      </div>

      <Link
        href="/studios"
        className="inline-flex items-center gap-2 self-start text-sm font-bold text-[#526f16] transition hover:text-black sm:self-auto"
      >
        Explore all studios <span aria-hidden="true">↗</span>
      </Link>
    </div>

    <div className="mt-9 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
      {categories.map((category) => (
        <Link
          key={category.name}
          href={`/studios?category=${encodeURIComponent(category.name)}`}
          className="group overflow-hidden rounded-2xl border border-gray-200 bg-white transition duration-300 hover:-translate-y-1 hover:border-[#c7dd81] hover:shadow-xl hover:shadow-black/5"
        >
          <div className="relative h-44 overflow-hidden">
            <img
              src={category.image}
              alt={category.name}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

            <span className="absolute bottom-3 left-3 flex h-10 w-10 items-center justify-center rounded-xl bg-[#dfff64] text-xl">
              {category.icon}
            </span>
          </div>

          <div className="p-5">
            <h3 className="font-bold transition group-hover:text-[#668b18]">
              {category.name}
            </h3>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              {category.description}
            </p>

            <div className="mt-4 flex items-center justify-between text-sm font-semibold">
              <span className="text-gray-400">Explore category</span>
              <span className="transition group-hover:translate-x-1">
                →
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  </section>

  {/* Featured Studios */}
  <section className="border-y border-gray-200 bg-white py-20">
    <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-8">
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#668b18]">
            HANDPICKED SPACES
          </p>

          <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
            Featured studios
          </h2>

          <p className="mt-3 max-w-xl leading-7 text-gray-500">
            Discover creative spaces ready for your next production.
          </p>
        </div>

        <Link
          href="/studios"
          className="inline-flex items-center gap-2 self-start rounded-full border border-gray-200 px-5 py-3 text-sm font-bold transition hover:border-[#dfff64] hover:bg-[#f3f8e7] sm:self-auto"
        >
          View all studios <span aria-hidden="true">↗</span>
        </Link>
      </div>

      {loading ? (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-2xl border border-gray-200"
            >
              <div className="h-56 animate-pulse bg-gray-200" />
              <div className="space-y-3 p-5">
                <div className="h-4 w-1/3 animate-pulse rounded bg-gray-200" />
                <div className="h-6 w-3/4 animate-pulse rounded bg-gray-200" />
                <div className="h-4 w-1/2 animate-pulse rounded bg-gray-200" />
              </div>
            </div>
          ))}
        </div>
      ) : studios.length > 0 ? (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {studios.map((studio) => (
            <Link
              href={`/studios/${studio._id}`}
              key={studio._id}
              className="group overflow-hidden rounded-2xl border border-gray-200 bg-white transition duration-300 hover:-translate-y-1 hover:border-[#c7dd81] hover:shadow-xl hover:shadow-black/5"
            >
              <div className="relative h-56 overflow-hidden bg-gray-100">
                <img
                  src={studio.image}
                  alt={studio.title}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />

                <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-[#526f16] shadow-sm">
                  {studio.category}
                </span>

                <span className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold shadow-sm">
                  <span className="text-amber-500">★</span>
                  {(studio.rating ?? 0).toFixed(1)}
                </span>
              </div>

              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-lg font-bold transition group-hover:text-[#668b18]">
                    {studio.title}
                  </h3>

                  <span className="shrink-0 text-lg font-black">
                    ৳{formatPrice(studio.hourlyRate)}
                    <span className="text-xs font-medium text-gray-400">
                      /hr
                    </span>
                  </span>
                </div>

                <p className="mt-3 flex items-center gap-2 text-sm text-gray-500">
                  <svg
                    className="h-4 w-4 shrink-0"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    aria-hidden="true"
                  >
                    <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
                    <circle cx="12" cy="10" r="2.5" />
                  </svg>
                  {studio.location}
                </p>

                {studio.maxCapacity !== undefined && (
                  <p className="mt-2 text-sm text-gray-500">
                    Capacity: {studio.maxCapacity} people
                  </p>
                )}

                <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4">
                  <span className="text-sm font-semibold text-gray-500">
                    View studio details
                  </span>

                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f0f5e5] transition group-hover:bg-[#dfff64]">
                    ↗
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="mt-10 rounded-3xl border border-dashed border-gray-300 bg-[#f8f9f4] px-6 py-14 text-center">
          <span className="text-4xl" aria-hidden="true">
            🏢
          </span>

          <h3 className="mt-4 text-xl font-bold">
            {apiError ? "Studios are temporarily unavailable" : "No studios listed yet"}
          </h3>

          <p className="mx-auto mt-2 max-w-md leading-7 text-gray-500">
            {apiError
              ? "We could not connect to the studio service. Please try again when the server is available."
              : "Be among the first to share a creative workspace with the StudioSpace community."}
          </p>

          <Link
            href="/add-studio"
            className="mt-6 inline-flex rounded-full bg-[#20231f] px-6 py-3 font-semibold text-white transition hover:bg-[#42483d]"
          >
            List Your Studio
          </Link>
        </div>
      )}
    </div>
  </section>

  {/* How It Works */}
  <section
    id="how-it-works"
    className="scroll-mt-24 mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-8"
  >
    <div className="mx-auto max-w-2xl text-center">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#668b18]">
        SIMPLE BY DESIGN
      </p>

      <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
        How StudioSpace works
      </h2>

      <p className="mt-4 leading-7 text-gray-500">
        Four simple steps to take your next creative project from idea to
        reality.
      </p>
    </div>

    <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {steps.map((step) => (
        <div
          key={step.number}
          className="rounded-2xl border border-gray-200 bg-white p-6 transition hover:border-[#c7dd81] hover:shadow-lg hover:shadow-black/5"
        >
          <div className="flex items-center justify-between">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#eff5df] text-2xl font-bold text-[#526f16]">
              {step.icon}
            </span>

            <span className="text-3xl font-black text-gray-200">
              {step.number}
            </span>
          </div>

          <h3 className="mt-6 text-xl font-bold">{step.title}</h3>

          <p className="mt-3 text-sm leading-7 text-gray-500">
            {step.description}
          </p>
        </div>
      ))}
    </div>
  </section>

  {/* Host CTA */}
  <section className="px-5 pb-20 sm:px-8 lg:px-8">
    <div className="mx-auto grid max-w-7xl overflow-hidden rounded-3xl bg-[#dfff64] md:grid-cols-[1fr_auto] md:items-center">
      <div className="p-8 sm:p-12 lg:p-14">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-[#526f16]">
          FOR STUDIO OWNERS
        </p>

        <h2 className="mt-4 max-w-2xl text-3xl font-black leading-tight tracking-tight sm:text-4xl lg:text-5xl">
          Your creative space deserves to be discovered.
        </h2>

        <p className="mt-5 max-w-xl leading-7 text-[#42483d]">
          Share your studio with creators, attract new customers, and make
          more of your available space.
        </p>

        <Link
          href="/add-studio"
          className="mt-7 inline-flex items-center gap-3 rounded-full bg-[#20231f] px-6 py-4 text-sm font-bold text-white transition hover:bg-[#42483d]"
        >
          List Your Studio <span aria-hidden="true">↗</span>
        </Link>
      </div>

      <div className="hidden self-stretch p-6 md:flex md:items-center md:justify-center lg:p-10">
        <div className="flex h-52 w-52 items-center justify-center rounded-full border border-[#20231f]/15 bg-white/30">
          <div className="flex h-36 w-36 items-center justify-center rounded-full bg-[#20231f] text-7xl text-[#dfff64]">
            ✳
          </div>
        </div>
      </div>
    </div>
  </section>

  {/* About */}
  <section id="about" className="scroll-mt-24 bg-white py-16">
    <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-8 md:grid-cols-2 md:items-center lg:px-8">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#668b18]">
          ABOUT STUDIOSPACE
        </p>

        <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
          A better space for every creative idea.
        </h2>
      </div>

      <p className="leading-8 text-gray-500">
        StudioSpace is a peer-to-peer creative workspace sharing platform
        designed to connect studio owners with creators. Whether you are
        producing a podcast, shooting a film, recording music, or making
        art, we help you discover spaces that fit your needs.
      </p>
    </div>
  </section>

  {/* Footer */}
  <footer className="bg-[#20231f] text-white">
    <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-8">
      <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link href="/" className="inline-flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#dfff64] text-2xl text-[#20231f]">
              ◉
            </span>

            <span className="text-xl font-black">
              Studio<span className="text-[#dfff64]">Space</span>
            </span>
          </Link>

          <p className="mt-5 max-w-xs text-sm leading-7 text-white/60">
            Connecting creative minds with inspiring spaces. Discover,
            share, and create with StudioSpace.
          </p>
        </div>

        <div>
          <h3 className="font-bold">Explore</h3>

          <div className="mt-5 flex flex-col gap-3 text-sm text-white/60">
            <Link className="transition hover:text-[#dfff64]" href="/studios">
              All Studios
            </Link>

            {categories.slice(0, 3).map((category) => (
              <Link
                key={category.name}
                className="transition hover:text-[#dfff64]"
                href={`/studios?category=${encodeURIComponent(category.name)}`}
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-bold">For Studio Owners</h3>

          <div className="mt-5 flex flex-col gap-3 text-sm text-white/60">
            <Link
              className="transition hover:text-[#dfff64]"
              href="/add-studio"
            >
              List Your Studio
            </Link>

            <Link
              className="transition hover:text-[#dfff64]"
              href="/my-listings"
            >
              Manage Listings
            </Link>

            <Link
              className="transition hover:text-[#dfff64]"
              href="/register"
            >
              Create an Account
            </Link>
          </div>
        </div>

        <div>
          <h3 className="font-bold">Your Account</h3>

          <div className="mt-5 flex flex-col gap-3 text-sm text-white/60">
            <Link
              className="transition hover:text-[#dfff64]"
              href="/login"
            >
              Log In
            </Link>

            <Link
              className="transition hover:text-[#dfff64]"
              href="/my-bookings"
            >
              My Bookings
            </Link>

            <Link
              className="transition hover:text-[#dfff64]"
              href="/terms"
            >
              Terms of Service
            </Link>

            <Link
              className="transition hover:text-[#dfff64]"
              href="/privacy"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-6 text-sm text-white/50 sm:flex-row sm:items-center sm:justify-between">
        <p>© 2026 StudioSpace. All rights reserved.</p>

        <p>Made for creative minds.</p>
      </div>
    </div>
  </footer>
</main>


);
}





