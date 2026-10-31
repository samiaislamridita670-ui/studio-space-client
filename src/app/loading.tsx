export default function Loading() {
  return (
    <main className="flex min-h-[75vh] flex-col items-center justify-center bg-slate-50 px-6">
      <div className="relative mb-8">
        <div className="h-20 w-20 animate-spin rounded-full border-4 border-indigo-100 border-t-indigo-600" />
        <div className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-indigo-600">
          S
        </div>
      </div>

      <h2 className="text-2xl font-bold text-slate-900">
        StudioSpace
      </h2>

      <p className="mt-3 animate-pulse text-slate-500">
        Preparing your creative experience...
      </p>
    </main>
  );
}
