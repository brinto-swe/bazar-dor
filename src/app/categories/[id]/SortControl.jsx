"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

export default function SortControl({ categoryId, selectedSort }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleSortChange(event) {
    const sort = event.target.value;
    const query = sort ? `?sort=${sort}` : "";

    startTransition(() => {
      router.push(`/categories/${categoryId}${query}`);
    });
  }

  return (
    <>
      <label htmlFor="price-sort" className="text-sm text-base-content/70">
        সাজান
      </label>
      <select
        id="price-sort"
        value={selectedSort}
        onChange={handleSortChange}
        disabled={isPending}
        className="select select-bordered min-h-10 text-sm"
      >
        <option value="">ডিফল্ট</option>
        <option value="asc">দাম: কম থেকে বেশি</option>
        <option value="desc">দাম: বেশি থেকে কম</option>
      </select>

      {isPending ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#f2f6f3]/75 backdrop-blur-[2px]" role="status">
          <div className="flex items-center gap-3 rounded-xl border border-base-300 bg-base-100 px-5 py-4 text-base font-medium shadow-lg">
            <span className="loading loading-spinner loading-md text-emerald-700" />
            দাম সাজানো হচ্ছে...
          </div>
        </div>
      ) : null}
    </>
  );
}