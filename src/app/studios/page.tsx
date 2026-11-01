"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

type Studio = {
_id: string;
title: string;
category: string;
hourlyRate: number;
securityDeposit: number;
maxCapacity: number;
location: string;
image: string;
rating: number;
amenities: string[];
overview: string;
};

const categories = [
"All Categories",
"Photo Studio",
"Sound Stage",
"Podcast Room",
"Music Suite",
"Art Workshop",
];

export default function StudiosPage() {
const searchParams = useSearchParams();

const [studios, setStudios] = useState<Studio[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");
const [search, setSearch] = useState(
searchParams.get("search") || ""
);
const [category, setCategory] = useState(
searchParams.get("category") || "All Categories"
);
const [maxPrice, setMaxPrice] = useState("50000");

useEffect(() => {
const initialSearch = searchParams.get("search") || "";
const initialCategory =
searchParams.get("category") || "All Categories";


const timer = window.setTimeout(() => {
      setSearch(initialSearch);
      setCategory(initialCategory);
    }, 0);

    return () => window.clearTimeout(timer);


}, [searchParams]);

useEffect(() => {
async function fetchStudios() {
try {
setLoading(true);
setError("");


    const response = await fetch(
      "/api/studios"
    );

    if (!response.ok) {
      throw new Error("Could not load studios.");
    }

    const result = await response.json();

    if (result.success) {
      setStudios(result.data);
    } else {
      throw new Error("Failed to retrieve studio data.");
    }
  } catch (err) {
    setError(
      err instanceof Error
        ? err.message
        : "Something went wrong."
    );
  } finally {
    setLoading(false);
  }
}

fetchStudios();


}, []);

const filteredStudios = studios.filter((studio) => {
const query = search.trim().toLowerCase();


const matchesSearch =
  studio.title.toLowerCase().includes(query) ||
  studio.location.toLowerCase().includes(query) ||
  studio.category.toLowerCase().includes(query);

const matchesCategory =
  category === "All Categories" ||
  studio.category.toLowerCase() === category.toLowerCase();

const matchesPrice = studio.hourlyRate <= Number(maxPrice);

return matchesSearch && matchesCategory && matchesPrice;


});

return ( <main className="min-h-screen bg-[#faf9f6] text-[#20231f]"> <section className="bg-[#20231f] px-5 py-16 text-white sm:py-20"> <div className="mx-auto max-w-7xl"> <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#dfff64]">
Discover your next creative space </p>


      <h1 className="mt-4 text-4xl font-black sm:text-6xl">
        Explore Studios
      </h1>

      <p className="mt-5 max-w-2xl leading-7 text-gray-300">
        Find the perfect photography studio, sound stage, podcast
        room, or creative workspace for your next project.
      </p>
    </div>
  </section>

  <section className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
    <div className="grid gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm md:grid-cols-3">
      <div>
        <label
          htmlFor="studio-search"
          className="mb-2 block text-sm font-bold"
        >
          Search studios
        </label>

        <input
          id="studio-search"
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Studio name or location"
          className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-[#789b32]"
        />
      </div>

      <div>
        <label
          htmlFor="studio-category"
          className="mb-2 block text-sm font-bold"
        >
          Category
        </label>

        <select
          id="studio-category"
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:border-[#789b32]"
        >
          {categories.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="studio-price"
          className="mb-2 block text-sm font-bold"
        >
          Maximum hourly price: ৳
          {Number(maxPrice).toLocaleString("en-BD")}
        </label>

        <input
          id="studio-price"
          type="range"
          min="500"
          max="50000"
          step="500"
          value={maxPrice}
          onChange={(event) => setMaxPrice(event.target.value)}
          className="mt-3 w-full accent-[#789b32]"
        />
      </div>
    </div>

    <div className="my-8 flex flex-wrap items-center justify-between gap-3">
      <div>
        <h2 className="text-2xl font-black">
          Available creative spaces
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          {loading
            ? "Loading studios..."
            : `${filteredStudios.length} studio(s) found`}
        </p>
      </div>

      <button
        onClick={() => {
          setSearch("");
          setCategory("All Categories");
          setMaxPrice("50000");
        }}
        className="rounded-full border border-gray-300 px-5 py-2 text-sm font-semibold transition hover:bg-white"
      >
        Clear Filters
      </button>
    </div>

    {loading ? (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <div
            key={item}
            className="animate-pulse overflow-hidden rounded-2xl bg-white"
          >
            <div className="h-56 bg-gray-200" />
            <div className="space-y-3 p-5">
              <div className="h-5 w-3/4 rounded bg-gray-200" />
              <div className="h-4 w-1/2 rounded bg-gray-200" />
            </div>
          </div>
        ))}
      </div>
    ) : error ? (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
        <h3 className="text-xl font-bold text-red-700">
          Unable to load studios
        </h3>
        <p className="mt-2 text-red-600">{error}</p>
        <p className="mt-2 text-sm text-gray-600">
          Make sure the backend is running at localhost:5000.
        </p>
      </div>
    ) : filteredStudios.length === 0 ? (
      <div className="rounded-3xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
        <span className="text-5xl" aria-hidden="true">
          🏢
        </span>
        <h3 className="mt-4 text-xl font-bold">
          No studios found
        </h3>
        <p className="mt-2 text-gray-500">
          Try changing your search, category, or price filter.
        </p>
        <button
          onClick={() => {
            setSearch("");
            setCategory("All Categories");
            setMaxPrice("50000");
          }}
          className="mt-6 rounded-full bg-[#20231f] px-6 py-3 font-semibold text-white hover:bg-[#42483d]"
        >
          Show all studios
        </button>
      </div>
    ) : (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredStudios.map((studio) => (
          <article
            key={studio._id}
            className="group overflow-hidden rounded-2xl border border-gray-200 bg-white transition hover:-translate-y-1 hover:shadow-xl"
          >
            <a
              href={`/studios/${studio._id}`}
              className="block"
            >
              <img
                src={studio.image}
                alt={studio.title}
                className="h-56 w-full object-cover"
              />
            </a>

            <div className="p-5">
              <span className="rounded-full bg-[#f0f4e7] px-3 py-1.5 text-xs font-bold text-[#526e1e]">
                {studio.category}
              </span>

              <h3 className="mt-4 text-xl font-bold">
                {studio.title}
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                📍 {studio.location}
              </p>

              <div className="mt-4 flex flex-wrap gap-3 text-sm text-gray-600">
                <span>👥 {studio.maxCapacity} guests</span>
                <span>★ {studio.rating} rating</span>
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4">
                <p>
                  <span className="text-xl font-black">
                    ৳{studio.hourlyRate.toLocaleString("en-BD")}
                  </span>
                  <span className="text-sm text-gray-500">
                    {" "}/ hour
                  </span>
                </p>

                <a
                  href={`/studios/${studio._id}`}
                  className="font-bold text-[#668b18] hover:underline"
                >
                  View details ↗
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>
    )}
  </section>
</main>


);
}

