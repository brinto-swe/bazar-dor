import Link from "next/link";
import { connection } from "next/server";

const CATEGORIES_URL = "https://api.abcz.workers.dev/api/bazardor/categories";

const Header = async () => {
  await connection();

  const response = await fetch(CATEGORIES_URL, { cache: "no-store" });
  const categories = await response.json();
  const today = new Intl.DateTimeFormat("bn-BD", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  return (
    <header className="border-b border-base-300 bg-base-100">
      <div className="mx-auto flex h-14 max-w-205 items-center justify-between px-3 sm:px-0">
        <Link href="/" className="flex items-center gap-2.5 text-base-content">
          <span className="flex size-8 items-center justify-center rounded-lg bg-emerald-700 text-white">
            <svg
              aria-hidden="true"
              className="size-4.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.7"
            >
              <path d="M3.5 9h17l-1.4-5h-14L3.5 9Z" />
              <path d="M5 9v11h14V9M9 20v-6h6v6M3.5 9c0 1.5 2.5 2.2 3.7.7C8.5 11.2 11 10.5 12 9c1 1.5 3.5 2.2 4.8.7 1.2 1.5 3.7.8 3.7-.7" />
            </svg>
          </span>
          <span className="flex flex-col leading-tight">
            <span className="text-[15px] font-bold">বাজার দর</span>
            <span className="mt-0.5 text-[10px] text-base-content/60">{today}</span>
          </span>
        </Link>

        <details className="dropdown dropdown-end">
          <summary className="flex cursor-pointer list-none items-center gap-2 rounded-md px-2 py-1.5 text-xs hover:bg-base-200 [&::-webkit-details-marker]:hidden">
            <span className="flex size-7 items-center justify-center rounded-full bg-emerald-100 text-[11px] font-semibold text-emerald-800">
              অ
            </span>
            <span className="hidden text-sm sm:inline">আমার অ্যাকাউন্ট</span>
            <svg aria-hidden="true" className="size-3 text-base-content/50" viewBox="0 0 12 12" fill="currentColor">
              <path d="m2 4 4 4 4-4H2Z" />
            </svg>
          </summary>
          <div className="dropdown-content z-50 mt-2 w-56 rounded-xl border border-base-300 bg-base-100 p-4 shadow-lg">
            <p className="text-sm font-semibold text-base-content">আপনার অ্যাকাউন্ট</p>
            <p className="mt-0.5 text-xs text-base-content/60">বাজারদরের ব্যক্তিগত আপডেট দেখুন</p>
            <div className="mt-3 flex flex-col gap-1 border-t border-base-200 pt-2 text-sm">
              <Link className="rounded-md px-2 py-1.5 hover:bg-base-200" href="/sign-in">লগ ইন</Link>
              <Link className="rounded-md px-2 py-1.5 text-error hover:bg-base-200" href="/sign-up">নতুন অ্যাকাউন্ট তৈরি করুন</Link>
            </div>
          </div>
        </details>
      </div>

      <nav aria-label="পণ্যের বিভাগ" className="border-t border-base-200">
        <ul className="mx-auto flex h-9 max-w-205 items-center gap-1 overflow-x-auto px-2 scrollbar-none sm:gap-2 sm:px-0">
          {categories.map((category) => (
            <li key={category.id} className="shrink-0">
              <Link
                href={`/?category=${encodeURIComponent(category.slug)}`}
                className="flex h-8 items-center gap-1.5 rounded-md px-2 text-xs font-medium text-base-content/80 transition-colors hover:bg-base-200 hover:text-emerald-800"
              >
                <span aria-hidden="true" className="text-[13px]">{category.icon}</span>
                <span>{category.nameBn}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
