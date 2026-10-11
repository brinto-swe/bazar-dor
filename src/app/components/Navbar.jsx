"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-zinc-200 bg-white/70 backdrop-blur-lg">
      <header className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <button
            type="button"
            className="md:hidden"
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            <span className="sr-only">Menu</span>
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
          <div className="flex items-center gap-3">
            <p className="font-bold text-zinc-900">ACME</p>
          </div>
        </div>

        <ul className="hidden items-center gap-4 md:flex">
          <li>
            <Link href="#" className="text-zinc-700 transition hover:text-zinc-900">
              Features
            </Link>
          </li>
          <li>
            <Link
              href="#"
              className="font-medium text-black"
              aria-current="page"
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link href="#" className="text-zinc-700 transition hover:text-zinc-900">
              Pricing
            </Link>
          </li>
        </ul>

        <div className="hidden items-center gap-4 md:flex">
          <Link href="#" className="text-zinc-700 transition hover:text-zinc-900">
            Login
          </Link>
          <button
            type="button"
            className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-700"
          >
            Sign Up
          </button>
        </div>
      </header>

      {isMenuOpen && (
        <div className="border-t border-zinc-200 md:hidden">
          <ul className="flex flex-col gap-2 p-4">
            <li>
              <Link href="#" className="block py-2 text-zinc-700">
                Features
              </Link>
            </li>
            <li>
              <Link href="#" className="block py-2 font-medium text-black">
                Dashboard
              </Link>
            </li>
            <li>
              <Link href="#" className="block py-2 text-zinc-700">
                Pricing
              </Link>
            </li>
            <li className="mt-4 flex flex-col gap-2 border-t border-zinc-200 pt-4">
              <Link href="#" className="block py-2 text-zinc-700">
                Login
              </Link>
              <button
                type="button"
                className="w-full rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white"
              >
                Sign Up
              </button>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}