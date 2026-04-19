"use client";

import Link from "next/link";
import { ConnectButton } from "@/components/web3/connect-button";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-[#2a2d3a] bg-[#0f1117]/90 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-[900px] items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 text-lg font-bold tracking-tight text-white">
            EasyDAO
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            <Link href="/explore" className="text-sm text-[#8b8fa3] transition-colors hover:text-white">
              Explore
            </Link>
            <Link href="/create" className="text-sm text-[#8b8fa3] transition-colors hover:text-white">
              Create
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <a
            href="https://notebooklm.huntington-analytics.com"
            className="hidden text-xs text-[#8b8fa3] transition-colors hover:text-[#6c7bff] sm:block"
          >
            Huntington Analytics
          </a>
          <ConnectButton />
        </div>
      </div>
    </header>
  );
}
