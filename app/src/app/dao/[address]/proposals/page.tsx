"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function ProposalsPage() {
  const params = useParams();
  const governorAddress = params.address as string;

  // In production, we'd index ProposalCreated events from the governor contract.
  // For now, show an empty state with the ability to create new proposals.

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Proposals</h2>
        <Link href={`/dao/${governorAddress}/proposals/new`}>
          <Button className="bg-indigo-500 hover:bg-indigo-400">
            New Proposal
          </Button>
        </Link>
      </div>

      {/* Empty state */}
      <Card className="border-white/10 bg-white/[0.02]">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <svg
            className="h-12 w-12 text-gray-600"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
            />
          </svg>
          <p className="mt-4 text-gray-400">No proposals yet</p>
          <p className="text-sm text-gray-500">
            Create the first proposal to get your DAO started.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
