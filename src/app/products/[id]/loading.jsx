export default function Loading() {
  return (
    <main className="min-h-screen bg-[#f2f6f3] px-4 pb-12 pt-6 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="skeleton h-5 w-64" />
        <div className="skeleton mt-5 h-28 rounded-xl" />
        <div className="skeleton mt-5 h-36 rounded-xl" />
        <div className="skeleton mt-5 h-80 rounded-xl" />
      </div>
    </main>
  );
}