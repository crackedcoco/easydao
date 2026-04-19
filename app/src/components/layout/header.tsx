"use client";

import Link from "next/link";
import { ConnectButton } from "@/components/web3/connect-button";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-gray-950/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500 text-sm font-black">
              E
            </div>
            <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              EasyDAO
            </span>
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            <Link
              href="/explore"
              className="text-sm text-gray-400 transition-colors hover:text-white"
            >
              Explore
            </Link>
            <Link
              href="/create"
              className="text-sm text-gray-400 transition-colors hover:text-white"
            >
              Create
            </Link>
          </nav>
        </div>
        <ConnectButton />
      </div>
    </header>
  );
}
