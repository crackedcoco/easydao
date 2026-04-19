"use client";

import { useAccount, useWaitForTransactionReceipt } from "wagmi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useProposalState, useProposalVotes, useCastVote, useQueueProposal, useExecuteProposal, governorAbi } from "@/lib/contracts/hooks";
import { ProposalState, PROPOSAL_STATE_LABELS, PROPOSAL_STATE_COLORS } from "@/types/dao";
import { formatEther } from "viem";

export default function ProposalDetailPage({ governorAddress, proposalId: proposalIdStr }: { governorAddress: `0x${string}`; proposalId: string }) {
  const { isConnected } = useAccount();

  let proposalId: bigint | undefined;
  try { proposalId = BigInt(proposalIdStr); } catch {
    return <div className="mx-auto max-w-2xl py-12 text-center"><h2 className="text-xl font-semibold text-red-400">Invalid Proposal ID</h2></div>;
  }

  const { data: stateData } = useProposalState(governorAddress, proposalId);
  const { data: votesData } = useProposalVotes(governorAddress, proposalId);
  const state = typeof stateData === "number" ? stateData : null;
  const votes = Array.isArray(votesData) && votesData.length === 3 ? (votesData as [bigint, bigint, bigint]) : undefined;

  const { writeContract: castVote, data: voteTxHash, isPending: isVoting } = useCastVote();
  const { isLoading: isVoteConfirming } = useWaitForTransactionReceipt({ hash: voteTxHash });

  function handleVote(support: number) {
    castVote({ address: governorAddress, abi: governorAbi, functionName: "castVote", args: [proposalId!, support] });
  }

  function votePercent(v: bigint, total: bigint): number {
    return total === BigInt(0) ? 0 : Number((v * BigInt(100)) / total);
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <h2 className="text-xl font-semibold">Proposal #{proposalIdStr}</h2>
        {state !== null && <Badge className={PROPOSAL_STATE_COLORS[state as ProposalState]} variant="outline">{PROPOSAL_STATE_LABELS[state as ProposalState]}</Badge>}
      </div>
      {votes && (
        <Card className="border-white/10 bg-white/[0.02]">
          <CardHeader><CardTitle className="text-lg">Votes</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {[
              { label: "Against", color: "bg-red-500", textColor: "text-red-400", value: votes[0] },
              { label: "For", color: "bg-green-500", textColor: "text-green-400", value: votes[1] },
              { label: "Abstain", color: "bg-gray-500", textColor: "text-gray-400", value: votes[2] },
            ].map((item) => {
              const total = votes[0] + votes[1] + votes[2];
              return (
                <div key={item.label}>
                  <div className="flex justify-between text-sm"><span className={item.textColor}>{item.label}</span><span>{Number(formatEther(item.value)).toLocaleString()}</span></div>
                  <div className="mt-1 h-2 rounded-full bg-white/5"><div className={`h-full rounded-full ${item.color}`} style={{ width: `${votePercent(item.value, total)}%` }} /></div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}
      {state === ProposalState.Active && isConnected && (
        <Card className="border-white/10 bg-white/[0.02]">
          <CardHeader><CardTitle className="text-lg">Cast Your Vote</CardTitle></CardHeader>
          <CardContent className="flex gap-3">
            <Button onClick={() => handleVote(1)} disabled={isVoting || isVoteConfirming} className="flex-1 bg-green-600 hover:bg-green-500">Vote For</Button>
            <Button onClick={() => handleVote(0)} disabled={isVoting || isVoteConfirming} className="flex-1 bg-red-600 hover:bg-red-500">Vote Against</Button>
            <Button onClick={() => handleVote(2)} disabled={isVoting || isVoteConfirming} variant="outline" className="flex-1 border-white/10">Abstain</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
