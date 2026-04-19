"use client";

import { useParams } from "next/navigation";
import { formatEther } from "viem";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  useVotingDelay,
  useVotingPeriod,
  useProposalThreshold,
} from "@/lib/contracts/hooks";
import { blocksToTime } from "@/types/dao";

export default function DAOOverviewPage() {
  const params = useParams();
  const governorAddress = params.address as `0x${string}`;

  const { data: votingDelay } = useVotingDelay(governorAddress);
  const { data: votingPeriod } = useVotingPeriod(governorAddress);
  const { data: proposalThreshold } = useProposalThreshold(governorAddress);

  const stats = [
    {
      label: "Voting Delay",
      value: votingDelay !== undefined ? blocksToTime(Number(votingDelay)) : "...",
    },
    {
      label: "Voting Period",
      value: votingPeriod !== undefined ? blocksToTime(Number(votingPeriod)) : "...",
    },
    {
      label: "Proposal Threshold",
      value:
        proposalThreshold !== undefined
          ? Number(proposalThreshold) === 0
            ? "Any holder"
            : `${Number(formatEther(proposalThreshold as bigint)).toLocaleString()} tokens`
          : "...",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-white/10 bg-white/[0.02]">
            <CardContent className="p-6">
              <p className="text-sm text-gray-400">{stat.label}</p>
              <p className="mt-1 text-2xl font-bold">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Card className="border-white/10 bg-white/[0.02]">
          <CardHeader>
            <CardTitle className="text-lg">Governor Contract</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="break-all font-mono text-sm text-gray-400">
              {governorAddress}
            </p>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-white/[0.02]">
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <a
              href={`https://basescan.org/address/${governorAddress}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-sm text-indigo-400 hover:text-indigo-300"
            >
              View on Basescan
            </a>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
