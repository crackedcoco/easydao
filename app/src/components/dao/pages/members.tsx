"use client";

import { useState } from "react";
import { useAccount, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { isAddress } from "viem";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGovernorToken, tokenAbi } from "@/lib/contracts/hooks";

export default function MembersPage({ governorAddress }: { governorAddress: `0x${string}` }) {
  const { address, isConnected } = useAccount();
  const [delegateAddress, setDelegateAddress] = useState("");

  const { data: tokenData } = useGovernorToken(governorAddress);
  const tokenAddress = tokenData as `0x${string}` | undefined;

  const { writeContract: delegate, data: delegateTxHash, isPending: isDelegating, error: delegateError } = useWriteContract();
  const { isLoading: isDelegateConfirming, isSuccess: isDelegateSuccess } = useWaitForTransactionReceipt({ hash: delegateTxHash });

  function handleDelegate() {
    if (!tokenAddress || !isAddress(delegateAddress)) return;
    delegate({ address: tokenAddress, abi: tokenAbi, functionName: "delegate", args: [delegateAddress as `0x${string}`] });
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Members</h2>
      <Card className="border-[#2a2d3a] bg-[#1a1d27]">
        <CardHeader><CardTitle className="text-lg">Delegate Voting Power</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-[#8b8fa3]">Delegate your voting power to another member. You can reclaim it at any time by delegating back to yourself.</p>
          <div className="flex gap-3">
            <Input placeholder="Delegate address (0x...)" value={delegateAddress} onChange={(e) => setDelegateAddress(e.target.value)} className="border-[#2a2d3a] bg-[#0f1117] font-mono text-sm" />
            <Button disabled={!isConnected || !isAddress(delegateAddress) || isDelegating || isDelegateConfirming} onClick={handleDelegate} className="bg-[#6c7bff] hover:bg-[#5a6aee]">
              {isDelegating ? "Confirm..." : isDelegateConfirming ? "Delegating..." : "Delegate"}
            </Button>
          </div>
          {isConnected && address && <Button variant="outline" size="sm" onClick={() => setDelegateAddress(address)} className="border-[#2a2d3a] text-xs">Delegate to myself</Button>}
          {isDelegateSuccess && <div className="rounded-lg border border-green-500/20 bg-green-500/10 p-4 text-sm text-green-300">Delegation successful!</div>}
          {delegateError && <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">Failed: {delegateError.message.slice(0, 200)}</div>}
        </CardContent>
      </Card>
      <Card className="border-[#2a2d3a] bg-[#1a1d27]">
        <CardHeader><CardTitle className="text-lg">Token Holders</CardTitle></CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12">
            <svg className="h-12 w-12 text-[#8b8fa3]" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
            </svg>
            <p className="mt-4 text-[#8b8fa3]">Member data is indexed from on-chain events.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
