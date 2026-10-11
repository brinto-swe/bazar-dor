import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { connection } from "next/server";
import HeaderActions from "./HeaderActions";
import logoIcon from "../../assets/logo-icon.png";
import { date } from "better-auth";

const CATEGORIES_URL = "https://api.abcz.workers.dev/api/bazardor/categories";

async function TodayDate() {
  await connection();

  const today = new Date().toLocaleDateString("bn-BD",{
    dateStyle: "full",
  })

  return <span className="mt-1 text-xs text-base-content/60">{today}</span>;
}

async function CategoryNavigation() {
  let categories = [];

  try {
    const response = await fetch(CATEGORIES_URL, {
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
    });

    if (response.ok) {
      const data = await response.json();
      categories = Array.isArray(data) ? data : [];
    }
  } catch {
    categories = [];
  }

  return (
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
  );
}

function CategoryNavigationFallback() {
  return (
    <nav aria-label="পণ্যের বিভাগ" className="border-t border-base-200">
      <div className="mx-auto flex h-12 max-w-6xl items-center px-4 text-sm text-base-content/50 sm:px-6">
        বিভাগগুলো লোড হচ্ছে...
      </div>
    </nav>
  );
}

function Header() {
  return (
    <header className="border-b border-base-300 bg-base-100">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-3 text-base-content">
          <span className="flex size-10 items-center justify-center rounded-lg bg-emerald-700 text-white">
            <Image src={logoIcon} alt="" className="size-4.5 brightness-0 invert" />
          </span>
          <span className="flex flex-col leading-tight">
            <span className="text-lg font-bold">বাজার দর</span>
            <Suspense fallback={<span className="mt-1 text-xs text-base-content/60">আজ</span>}>
              <TodayDate />
            </Suspense>
          </span>
        </Link>

        <HeaderActions />
      </div>

      <Suspense fallback={<CategoryNavigationFallback />}>
        <CategoryNavigation />
      </Suspense>
    </header>
  );
}

export default Header;
