"use client";

import { useBalance } from "wagmi";
import { formatEther } from "viem";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGovernorTimelock } from "@/lib/contracts/hooks";

export default function TreasuryPage({ governorAddress }: { governorAddress: `0x${string}` }) {
  const { data: timelockData } = useGovernorTimelock(governorAddress);
  const timelockAddress = timelockData as `0x${string}` | undefined;
  const { data: balance } = useBalance({ address: timelockAddress, query: { enabled: !!timelockAddress } });

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Treasury</h2>
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-white/10 bg-white/[0.02]"><CardContent className="p-6"><p className="text-sm text-gray-400">ETH Balance</p><p className="mt-1 text-3xl font-bold">{balance ? Number(formatEther(balance.value)).toFixed(4) : "0.0000"}</p><p className="mt-1 text-sm text-gray-500">ETH</p></CardContent></Card>
        <Card className="border-white/10 bg-white/[0.02]"><CardContent className="p-6"><p className="text-sm text-gray-400">Total Value</p><p className="mt-1 text-3xl font-bold">--</p><p className="mt-1 text-sm text-gray-500">USD</p></CardContent></Card>
        <Card className="border-white/10 bg-white/[0.02]"><CardContent className="p-6"><p className="text-sm text-gray-400">Transactions</p><p className="mt-1 text-3xl font-bold">0</p><p className="mt-1 text-sm text-gray-500">Total</p></CardContent></Card>
      </div>
      <Card className="border-white/10 bg-white/[0.02]">
        <CardHeader><CardTitle className="text-lg">Assets</CardTitle></CardHeader>
        <CardContent>
          <div className="flex items-center justify-between rounded-lg border border-white/5 bg-white/[0.02] p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/20 text-sm font-bold text-blue-400">E</div>
              <div><p className="font-medium">Ethereum</p><p className="text-sm text-gray-500">ETH</p></div>
            </div>
            <p className="font-medium">{balance ? Number(formatEther(balance.value)).toFixed(4) : "0.0000"}</p>
          </div>
        </CardContent>
      </Card>
      <Card className="border-white/10 bg-white/[0.02]">
        <CardHeader><CardTitle className="text-lg">Treasury Info</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm text-gray-400">The treasury is controlled by the DAO&apos;s timelock contract. Funds can only be moved through approved proposals.</p>
          {timelockAddress && (
            <>
              <p className="break-all font-mono text-xs text-gray-500">{timelockAddress}</p>
              <a href={`https://basescan.org/address/${timelockAddress}`} target="_blank" rel="noopener noreferrer" className="text-sm text-indigo-400 hover:text-indigo-300">View on Basescan</a>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
