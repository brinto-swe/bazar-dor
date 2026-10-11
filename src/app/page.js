export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-6 py-12">
      <section className="w-full max-w-3xl rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
        <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-zinc-500">
          Assignment 07
        </p>
        <h1 className="text-4xl font-bold tracking-tight text-zinc-900">
          Welcome to your Next.js app
        </h1>
        <p className="mt-4 text-lg leading-8 text-zinc-600">
          Your homepage is working correctly and the previous empty render issue has been fixed.
        </p>
      </section>
    </main>
  );
}
