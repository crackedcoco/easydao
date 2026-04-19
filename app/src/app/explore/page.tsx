"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useDAOCount, useDAOInfo } from "@/lib/contracts/hooks";

function DAOCard({ daoId }: { daoId: number }) {
  const { data } = useDAOInfo(daoId);

  if (!data) return null;

  const [name, token, timelock, governor, creator, createdAt] = data as [
    string, string, string, string, string, bigint,
  ];

  return (
    <Link href={`/dao/${governor}`}>
      <div className="rounded-xl border border-[#2a2d3a] bg-[#1a1d27] p-5 transition-all hover:border-[#6c7bff]/30 hover:bg-[#1e2130]">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-white">{name}</h3>
            <p className="mt-1 font-mono text-xs text-[#8b8fa3]">
              {(governor as string).slice(0, 6)}...{(governor as string).slice(-4)}
            </p>
          </div>
          <Badge variant="outline" className="border-[#00d4aa]/30 text-[#00d4aa]">
            Active
          </Badge>
        </div>
        <div className="mt-3 text-xs text-[#8b8fa3]">
          Created {new Date(Number(createdAt) * 1000).toLocaleDateString()}
        </div>
      </div>
    </Link>
  );
}

export default function ExplorePage() {
  const { data: count } = useDAOCount();
  const daoCount = count ? Number(count) : 0;

  return (
    <div className="mx-auto max-w-[900px] px-4 py-12 sm:px-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Explore DAOs</h1>
          <p className="mt-1 text-sm text-[#8b8fa3]">
            Browse all DAOs created on EasyDAO.
          </p>
        </div>
        <Link
          href="/create"
          className="rounded-lg bg-[#6c7bff] px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#5a6aee]"
        >
          Create DAO
        </Link>
      </div>

      {daoCount === 0 ? (
        <div className="mt-12 rounded-xl border border-[#2a2d3a] bg-[#1a1d27] py-20 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-[#6c7bff]/10">
            <svg className="h-7 w-7 text-[#6c7bff]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </div>
          <p className="mt-4 font-medium text-white">No DAOs created yet</p>
          <p className="mt-1 text-sm text-[#8b8fa3]">Be the first to create a DAO on EasyDAO.</p>
          <Link
            href="/create"
            className="mt-6 inline-block rounded-lg bg-[#6c7bff] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#5a6aee]"
          >
            Create Your DAO
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: daoCount }, (_, i) => (
            <DAOCard key={i} daoId={i} />
          ))}
        </div>
      )}
    </div>
  );
}
