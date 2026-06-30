"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth-context";

export default function Navbar() {
  const { token, logout, isLoading } = useAuth();

  return (
    <nav className="border-b border-stone-200 bg-stone-50">
      <div className="mx-auto flex max-w-2xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-serif text-lg text-stone-800">
          Recipe Box
        </Link>
        {!isLoading && (
          <div className="flex items-center gap-4 text-sm">
            {token ? (
              <>
                <Link href="/recipes" className="text-stone-600 hover:text-stone-900">
                  My recipes
                </Link>
                <button
                  onClick={logout}
                  className="rounded-md border border-stone-300 px-3 py-1.5 text-stone-700 hover:bg-stone-100"
                >
                  Log out
                </button>
              </>
            ) : (
              <Link href="/" className="text-stone-600 hover:text-stone-900">
                Log in
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
