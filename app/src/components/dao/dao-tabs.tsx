"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useGovernorName } from "@/lib/contracts/hooks";

export function DAOTabs({ governorAddress, children }: { governorAddress: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: name } = useGovernorName(governorAddress as `0x${string}`);

  const basePath = `/dao/${governorAddress}`;
  const tabs = [
    { label: "Overview", href: basePath },
    { label: "Proposals", href: `${basePath}/proposals` },
    { label: "Treasury", href: `${basePath}/treasury` },
    { label: "Members", href: `${basePath}/members` },
  ];

  return (
    <div className="mx-auto max-w-[900px] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{(name as string) || "DAO"}</h1>
        <p className="mt-1 font-mono text-sm text-[#8b8fa3]">
          {governorAddress}
        </p>
      </div>

      <div className="mb-8 flex gap-1 rounded-lg border border-[#2a2d3a] bg-[#1a1d27] p-1">
        {tabs.map((tab) => {
          const isActive =
            tab.href === basePath
              ? pathname === basePath
              : pathname.startsWith(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-[#6c7bff]/10 text-[#6c7bff]"
                  : "text-[#8b8fa3] hover:text-white"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>

      {children}
    </div>
  );
}
