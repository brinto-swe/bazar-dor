import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { connection } from "next/server";
import HeaderActions from "./HeaderActions";
import logoIcon from "../../assets/logo-icon.png";
import { getCategories } from "@/lib/products";

async function TodayDate() {
  await connection();

  const today = new Date().toLocaleDateString("bn-BD", {
    dateStyle: "full",
  });

  return <span className="mt-1 text-xs text-base-content/60">{today}</span>;
}

async function CategoryNavigation() {
  await connection();

  let categories = [];

  try {
    categories = await getCategories();
  } catch {
    categories = [];
  }

  return (
    <nav id="categories" aria-label="পণ্যের বিভাগ" className="border-t border-[#edf1ee]">
      <ul className="mx-auto flex h-12 max-w-6xl items-center gap-1 overflow-x-auto px-4 sm:px-6">
        {categories.map((category) => (
          <li key={category.id} className="shrink-0">
            <Link
              href={`/categories/${category.id}`}
              className="flex h-9 items-center gap-2 rounded-lg px-3 text-sm font-semibold text-[#34413a] transition-colors hover:bg-emerald-700 hover:text-white"
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
    <header className="border-b border-[#e3e9e5] bg-white">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-3 text-base-content">
          <span className="flex size-10 items-center justify-center rounded-xl bg-emerald-700 text-white">
            <Image src={logoIcon} alt="" className="size-5 brightness-0 invert" />
          </span>
          <span className="flex flex-col leading-tight">
            <span className="text-xl font-extrabold text-[#26332c]">বাজার দর</span>
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
