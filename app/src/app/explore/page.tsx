"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useDAOCount, useDAOInfo } from "@/lib/contracts/hooks";

function DAOCard({ daoId }: { daoId: number }) {
  const { data } = useDAOInfo(daoId);

  if (!data) return null;

  const [name, token, timelock, governor, creator, createdAt] = data as [
    string,
    string,
    string,
    string,
    string,
    bigint,
  ];

  return (
    <Link href={`/dao/${governor}`}>
      <Card className="border-white/10 bg-white/[0.02] transition-all hover:border-indigo-500/20 hover:bg-white/[0.04]">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold">{name}</h3>
              <p className="mt-1 font-mono text-xs text-gray-500">
                {(governor as string).slice(0, 6)}...
                {(governor as string).slice(-4)}
              </p>
            </div>
            <Badge variant="outline" className="border-indigo-500/20 text-indigo-400">
              Active
            </Badge>
          </div>
          <div className="mt-4 flex gap-4 text-sm text-gray-400">
            <span>
              Created{" "}
              {new Date(Number(createdAt) * 1000).toLocaleDateString()}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export default function ExplorePage() {
  const { data: count } = useDAOCount();
  const daoCount = count ? Number(count) : 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Explore DAOs</h1>
          <p className="mt-2 text-gray-400">
            Browse all DAOs created on EasyDAO.
          </p>
        </div>
        <Link
          href="/create"
          className="rounded-xl bg-indigo-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all hover:bg-indigo-400"
        >
          Create DAO
        </Link>
      </div>

      {daoCount === 0 ? (
        <Card className="mt-12 border-white/10 bg-white/[0.02]">
          <CardContent className="flex flex-col items-center justify-center py-24">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-500/10">
              <svg
                className="h-8 w-8 text-indigo-400"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
            </div>
            <p className="mt-4 text-lg font-medium text-gray-300">
              No DAOs created yet
            </p>
            <p className="mt-1 text-gray-500">
              Be the first to create a DAO on EasyDAO.
            </p>
            <Link
              href="/create"
              className="mt-6 rounded-xl bg-indigo-500 px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-indigo-400"
            >
              Create Your DAO
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: daoCount }, (_, i) => (
            <DAOCard key={i} daoId={i} />
          ))}
        </div>
      )}
    </div>
  );
}
