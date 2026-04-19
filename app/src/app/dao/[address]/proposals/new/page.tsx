"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAccount, useWaitForTransactionReceipt } from "wagmi";
import { parseEther, isAddress } from "viem";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePropose, governorAbi } from "@/lib/contracts/hooks";

export default function NewProposalPage() {
  const params = useParams();
  const router = useRouter();
  const governorAddress = params.address as `0x${string}`;
  const { isConnected } = useAccount();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [targetAddress, setTargetAddress] = useState("");
  const [ethAmount, setEthAmount] = useState("");
  const [calldata, setCalldata] = useState("");

  const { writeContract, data: txHash, isPending } = usePropose();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  function handleSubmit() {
    if (!targetAddress || !isAddress(targetAddress)) return;

    const targets = [targetAddress as `0x${string}`];
    const values = [ethAmount ? parseEther(ethAmount) : BigInt(0)];
    const calldatas = [(calldata || "0x") as `0x${string}`];
    const fullDescription = `# ${title}\n\n${description}`;

    writeContract({
      address: governorAddress,
      abi: governorAbi,
      functionName: "propose",
      args: [targets, values, calldatas, fullDescription],
    });
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h2 className="text-xl font-semibold">Create Proposal</h2>

      <Card className="border-white/10 bg-white/[0.02]">
        <CardContent className="space-y-6 p-6">
          <div>
            <Label htmlFor="title">Proposal Title</Label>
            <Input
              id="title"
              placeholder="Transfer funds for design work"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-2 border-white/10 bg-white/5"
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              placeholder="Describe what this proposal does and why..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="mt-2 w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div className="border-t border-white/5 pt-6">
            <h3 className="mb-4 text-sm font-medium text-gray-400">
              Transaction Details
            </h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="target">Target Address</Label>
                <Input
                  id="target"
                  placeholder="0x..."
                  value={targetAddress}
                  onChange={(e) => setTargetAddress(e.target.value)}
                  className="mt-2 border-white/10 bg-white/5 font-mono text-sm"
                />
              </div>
              <div>
                <Label htmlFor="ethAmount">ETH Amount (optional)</Label>
                <Input
                  id="ethAmount"
                  type="number"
                  step="0.001"
                  placeholder="0.0"
                  value={ethAmount}
                  onChange={(e) => setEthAmount(e.target.value)}
                  className="mt-2 border-white/10 bg-white/5"
                />
              </div>
              <div>
                <Label htmlFor="calldata">Calldata (optional)</Label>
                <Input
                  id="calldata"
                  placeholder="0x"
                  value={calldata}
                  onChange={(e) => setCalldata(e.target.value)}
                  className="mt-2 border-white/10 bg-white/5 font-mono text-sm"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Leave empty for a simple ETH transfer.
                </p>
              </div>
            </div>
          </div>

          {isSuccess && (
            <div className="rounded-lg border border-green-500/20 bg-green-500/10 p-4 text-sm text-green-300">
              Proposal created successfully!
            </div>
          )}

          {!isConnected ? (
            <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/10 p-4 text-sm text-yellow-300">
              Connect your wallet to create a proposal.
            </div>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={!title || !targetAddress || isPending || isConfirming}
              className="w-full bg-indigo-500 hover:bg-indigo-400"
              size="lg"
            >
              {isPending
                ? "Confirm in wallet..."
                : isConfirming
                  ? "Submitting..."
                  : "Submit Proposal"}
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
