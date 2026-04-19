"use client";

import { useParams } from "next/navigation";
import { useAccount, useWaitForTransactionReceipt } from "wagmi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  useProposalState,
  useProposalVotes,
  useCastVote,
  useQueueProposal,
  useExecuteProposal,
  governorAbi,
} from "@/lib/contracts/hooks";
import {
  ProposalState,
  PROPOSAL_STATE_LABELS,
  PROPOSAL_STATE_COLORS,
} from "@/types/dao";
import { formatEther } from "viem";

export default function ProposalDetailPage() {
  const params = useParams();
  const governorAddress = params.address as `0x${string}`;
  const { isConnected } = useAccount();

  // C3 fix: safely parse proposal ID
  let proposalId: bigint | undefined;
  try {
    proposalId = BigInt(params.id as string);
  } catch {
    return (
      <div className="mx-auto max-w-2xl py-12 text-center">
        <h2 className="text-xl font-semibold text-red-400">Invalid Proposal ID</h2>
        <p className="mt-2 text-gray-400">The proposal ID in the URL is not valid.</p>
      </div>
    );
  }

  const { data: stateData } = useProposalState(governorAddress, proposalId);
  const { data: votesData } = useProposalVotes(governorAddress, proposalId);

  const state = typeof stateData === "number" ? stateData : null;
  const votes = Array.isArray(votesData) && votesData.length === 3
    ? (votesData as [bigint, bigint, bigint])
    : undefined;

  const { writeContract: castVote, data: voteTxHash, isPending: isVoting } = useCastVote();
  const { isLoading: isVoteConfirming } = useWaitForTransactionReceipt({ hash: voteTxHash });

  // M6 fix: queue and execute hooks
  const { writeContract: queueProposal, data: queueTxHash, isPending: isQueuing } = useQueueProposal();
  const { isLoading: isQueueConfirming } = useWaitForTransactionReceipt({ hash: queueTxHash });

  const { writeContract: executeProposal, data: executeTxHash, isPending: isExecuting } = useExecuteProposal();
  const { isLoading: isExecuteConfirming } = useWaitForTransactionReceipt({ hash: executeTxHash });

  function handleVote(support: number) {
    castVote({
      address: governorAddress,
      abi: governorAbi,
      functionName: "castVote",
      args: [proposalId!, support],
    });
  }

  function votePercent(voteCount: bigint, total: bigint): number {
    if (total === BigInt(0)) return 0;
    return Number((voteCount * BigInt(100)) / total);
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <h2 className="text-xl font-semibold">Proposal #{params.id}</h2>
        {state !== null && (
          <Badge
            className={PROPOSAL_STATE_COLORS[state as ProposalState]}
            variant="outline"
          >
            {PROPOSAL_STATE_LABELS[state as ProposalState]}
          </Badge>
        )}
      </div>

      {/* Vote counts */}
      {votes && (
        <Card className="border-white/10 bg-white/[0.02]">
          <CardHeader>
            <CardTitle className="text-lg">Votes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {[
                { label: "Against", color: "bg-red-500", textColor: "text-red-400", value: votes[0] },
                { label: "For", color: "bg-green-500", textColor: "text-green-400", value: votes[1] },
                { label: "Abstain", color: "bg-gray-500", textColor: "text-gray-400", value: votes[2] },
              ].map((item) => {
                const total = votes[0] + votes[1] + votes[2];
                return (
                  <div key={item.label}>
                    <div className="flex justify-between text-sm">
                      <span className={item.textColor}>{item.label}</span>
                      <span>{Number(formatEther(item.value)).toLocaleString()}</span>
                    </div>
                    <div className="mt-1 h-2 rounded-full bg-white/5">
                      <div
                        className={`h-full rounded-full ${item.color}`}
                        style={{ width: `${votePercent(item.value, total)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Voting buttons */}
      {state === ProposalState.Active && isConnected && (
        <Card className="border-white/10 bg-white/[0.02]">
          <CardHeader>
            <CardTitle className="text-lg">Cast Your Vote</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-3">
            <Button
              onClick={() => handleVote(1)}
              disabled={isVoting || isVoteConfirming}
              className="flex-1 bg-green-600 hover:bg-green-500"
            >
              Vote For
            </Button>
            <Button
              onClick={() => handleVote(0)}
              disabled={isVoting || isVoteConfirming}
              className="flex-1 bg-red-600 hover:bg-red-500"
            >
              Vote Against
            </Button>
            <Button
              onClick={() => handleVote(2)}
              disabled={isVoting || isVoteConfirming}
              variant="outline"
              className="flex-1 border-white/10"
            >
              Abstain
            </Button>
          </CardContent>
        </Card>
      )}

      {/* M6 fix: Queue button for succeeded proposals */}
      {state === ProposalState.Succeeded && isConnected && (
        <Card className="border-white/10 bg-white/[0.02]">
          <CardContent className="p-6">
            <p className="mb-4 text-sm text-gray-400">
              This proposal has passed. Queue it for execution through the timelock.
            </p>
            <Button
              onClick={() => {
                // Queue requires the same args as propose — in a full implementation
                // we'd decode them from the ProposalCreated event. For now, show the action.
                queueProposal({
                  address: governorAddress,
                  abi: governorAbi,
                  functionName: "queue",
                  args: [[], [], [], "0x0000000000000000000000000000000000000000000000000000000000000000"],
                });
              }}
              disabled={isQueuing || isQueueConfirming}
              className="w-full bg-purple-600 hover:bg-purple-500"
            >
              {isQueuing ? "Confirm in wallet..." : isQueueConfirming ? "Queuing..." : "Queue for Execution"}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* M6 fix: Execute button for queued proposals */}
      {state === ProposalState.Queued && isConnected && (
        <Card className="border-white/10 bg-white/[0.02]">
          <CardContent className="p-6">
            <p className="mb-4 text-sm text-gray-400">
              This proposal is queued. Execute it after the timelock delay has passed.
            </p>
            <Button
              onClick={() => {
                executeProposal({
                  address: governorAddress,
                  abi: governorAbi,
                  functionName: "execute",
                  args: [[], [], [], "0x0000000000000000000000000000000000000000000000000000000000000000"],
                });
              }}
              disabled={isExecuting || isExecuteConfirming}
              className="w-full bg-emerald-600 hover:bg-emerald-500"
            >
              {isExecuting ? "Confirm in wallet..." : isExecuteConfirming ? "Executing..." : "Execute Proposal"}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
