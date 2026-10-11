export default function Loading() {
  return (
    <div className="min-h-screen bg-[#f2f6f3] px-4 pb-12 pt-6 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="skeleton h-56 rounded-xl" />

        <div className="mt-8">
          <div className="skeleton h-7 w-48" />
          <div className="mt-4 grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }, (_, index) => (
              <div key={index} className="skeleton h-32 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}