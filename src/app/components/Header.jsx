import Image from "next/image";
import Link from "next/link";
import { connection } from "next/server";
import logoIcon from "../../assets/logo-icon.png";

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
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-3 text-base-content">
          <span className="flex size-10 items-center justify-center rounded-lg bg-emerald-700 text-white">
            <Image src={logoIcon} alt="" className="size-4.5 brightness-0 invert" />
          </span>
          <span className="flex flex-col leading-tight">
            <span className="text-lg font-bold">বাজার দর</span>
            <span className="mt-1 text-xs text-base-content/60">{today}</span>
          </span>
        </Link>

        <details className="dropdown dropdown-end">
          <summary className="flex cursor-pointer list-none items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-base-200 [&::-webkit-details-marker]:hidden">
            <span className="flex size-9 items-center justify-center rounded-full bg-emerald-100 text-sm font-semibold text-emerald-800">
              অ
            </span>
            <span className="hidden text-base sm:inline">আমার অ্যাকাউন্ট</span>
            <svg aria-hidden="true" className="size-4 text-base-content/50" viewBox="0 0 12 12" fill="currentColor">
              <path d="m2 4 4 4 4-4H2Z" />
            </svg>
          </summary>
          <div className="dropdown-content z-50 mt-2 w-64 rounded-xl border border-base-300 bg-base-100 p-4 shadow-lg">
            <p className="text-base font-semibold text-base-content">আপনার অ্যাকাউন্ট</p>
            <p className="mt-1 text-sm text-base-content/60">বাজারদরের ব্যক্তিগত আপডেট দেখুন</p>
            <div className="mt-3 flex flex-col gap-1 border-t border-base-200 pt-2 text-base">
              <Link className="rounded-md px-2 py-2 hover:bg-base-200" href="/sign-in">লগ ইন</Link>
              <Link className="rounded-md px-2 py-2 text-error hover:bg-base-200" href="/sign-up">নতুন অ্যাকাউন্ট তৈরি করুন</Link>
            </div>
          </div>
        </details>
      </div>

      <nav id="categories" aria-label="পণ্যের বিভাগ" className="border-t border-base-200">
        <ul className="mx-auto flex h-12 max-w-6xl items-center gap-2 overflow-x-auto px-4 scrollbar-none sm:gap-3 sm:px-6">
          {categories.map((category) => (
            <li key={category.id} className="shrink-0">
              <Link
                href={`/categories/${category.id}`}
                className="flex h-10 items-center gap-2 rounded-md px-3 text-sm font-medium text-base-content/80 transition-colors hover:bg-base-200 hover:text-emerald-800"
              >
                <span aria-hidden="true" className="text-base">{category.icon}</span>
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
