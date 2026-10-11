"use client";

import Image from "next/image";
import Link from "next/link";
import { signOut, useSession } from "@/lib/auth-client";

export default function HeaderActions() {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return <div className="skeleton h-10 w-36" aria-label="সেশন লোড হচ্ছে" />;
  }

  if (!session) {
    return (
      <div className="flex items-center gap-2">
        <Link className="btn btn-ghost btn-sm" href="/sign-in">সাইন ইন</Link>
        <Link className="btn bg-emerald-700 text-white btn-sm hover:bg-emerald-800" href="/sign-up">সাইন আপ</Link>
      </div>
    );
  }

  const user = session.user;
  const userInitial = user.name?.trim().charAt(0) || user.email.charAt(0);
  const shortName = user.name?.trim().split(/\s+/)[0] || user.email.split("@")[0];

  return (
    <details className="dropdown dropdown-end">
      <summary className="flex cursor-pointer list-none items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-base-200 [&::-webkit-details-marker]:hidden">
        <span className="relative flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-emerald-100 font-semibold text-emerald-800">
          {user.image ? (
            <Image src={user.image} alt="" fill sizes="36px" unoptimized className="object-cover" />
          ) : (
            userInitial
          )}
        </span>
        <span className="hidden max-w-36 truncate text-base sm:inline">
          {shortName}
        </span>
        <span aria-hidden="true" className="text-base-content/50">⌄</span>
      </summary>
      <div className="dropdown-content z-50 mt-2 w-64 rounded-xl border border-base-300 bg-base-100 p-4 shadow-lg">
        <p className="truncate text-base font-semibold text-base-content">{user.name || "আমার অ্যাকাউন্ট"}</p>
        <p className="mt-1 truncate text-sm text-base-content/60">{user.email}</p>
        <div className="mt-3 border-t border-base-200 pt-2">
          <Link href="/profile" className="block rounded-md px-2 py-2 text-sm hover:bg-base-200">
            আমার প্রোফাইল
          </Link>
        </div>
        <button
          type="button"
          onClick={() => signOut()}
          className="btn btn-ghost btn-sm mt-1 w-full justify-start text-error"
        >
          সাইন আউট
        </button>
      </div>
    </details>
  );
}