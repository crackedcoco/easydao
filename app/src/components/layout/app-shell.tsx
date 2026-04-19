"use client";

import dynamic from "next/dynamic";
import { Footer } from "@/components/layout/footer";

const Web3Provider = dynamic(
  () => import("@/components/web3/providers").then((m) => m.Web3Provider),
  { ssr: false }
);

const Header = dynamic(
  () => import("@/components/layout/header").then((m) => m.Header),
  { ssr: false }
);

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <Web3Provider>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </Web3Provider>
  );
}
