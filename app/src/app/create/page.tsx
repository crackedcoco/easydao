"use client";

import { useState, useEffect } from "react";
import { useAccount, useChainId, useWaitForTransactionReceipt } from "wagmi";
import { parseEther, isAddress, decodeEventLog } from "viem";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useFactoryAddress, useCreateDAO, factoryAbi } from "@/lib/contracts/hooks";
import { GOVERNANCE_DEFAULTS, blocksToTime, secondsToTime } from "@/types/dao";

interface Member {
  address: string;
  amount: string;
}

export default function CreateDAOPage() {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const factoryAddress = useFactoryAddress();

  const [step, setStep] = useState(0);

  // DAO info
  const [daoName, setDaoName] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [members, setMembers] = useState<Member[]>([
    { address: "", amount: "100000" },
  ]);

  // Governance (hidden by default)
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [votingDelay, setVotingDelay] = useState(GOVERNANCE_DEFAULTS.votingDelay);
  const [votingPeriod, setVotingPeriod] = useState(GOVERNANCE_DEFAULTS.votingPeriod);
  const [quorum, setQuorum] = useState(GOVERNANCE_DEFAULTS.quorumNumerator);
  const [proposalThreshold, setProposalThreshold] = useState(GOVERNANCE_DEFAULTS.proposalThreshold);
  const [timelockDelay, setTimelockDelay] = useState(GOVERNANCE_DEFAULTS.timelockDelay);

  // Deploy
  const { writeContract, data: txHash, isPending, error: writeError } = useCreateDAO();
  const { isLoading: isConfirming, isSuccess, data: receipt } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  useEffect(() => {
    if (isSuccess && receipt?.logs) {
      try {
        for (const log of receipt.logs) {
          try {
            const decoded = decodeEventLog({
              abi: factoryAbi,
              data: log.data,
              topics: log.topics,
            });
            if (decoded.eventName === "DAOCreated") {
              const args = decoded.args as { governor?: `0x${string}` };
              if (args.governor) {
                router.push(`/dao/${args.governor}`);
                return;
              }
            }
          } catch {
            // not our event
          }
        }
      } catch {
        // fallback
      }
    }
  }, [isSuccess, receipt, router]);

  // Auto-generate symbol from name
  function handleNameChange(name: string) {
    setDaoName(name);
    if (!tokenSymbol || tokenSymbol === deriveSymbol(daoName)) {
      setTokenSymbol(deriveSymbol(name));
    }
  }

  function deriveSymbol(name: string): string {
    const words = name.trim().split(/\s+/).filter(w => w.toLowerCase() !== "dao");
    if (words.length === 0) return "";
    if (words.length === 1) return words[0].slice(0, 4).toUpperCase();
    return words.map(w => w[0]).join("").slice(0, 5).toUpperCase();
  }

  function addMember() {
    setMembers([...members, { address: "", amount: "100000" }]);
  }

  function removeMember(index: number) {
    if (members.length <= 1) return;
    setMembers(members.filter((_, i) => i !== index));
  }

  function updateMember(index: number, field: keyof Member, value: string) {
    const updated = [...members];
    updated[index] = { ...updated[index], [field]: value };
    setMembers(updated);
  }

  // Auto-fill connected wallet as first member
  useEffect(() => {
    if (isConnected && address && members.length === 1 && !members[0].address) {
      setMembers([{ address, amount: "100000" }]);
    }
  }, [isConnected, address]);

  const totalSupply = members.reduce((sum, m) => sum + (Number(m.amount) || 0), 0);

  const step1Valid =
    daoName.length > 0 &&
    tokenSymbol.length > 0 &&
    members.length > 0 &&
    members.every((m) => isAddress(m.address) && Number(m.amount) > 0);

  function handleDeploy() {
    if (!factoryAddress || !address) return;
    writeContract({
      address: factoryAddress,
      abi: factoryAbi,
      functionName: "createDAO",
      args: [
        {
          name: daoName,
          tokenSymbol,
          tokenRecipients: members.map((m) => m.address as `0x${string}`),
          tokenAmounts: members.map((m) => parseEther(m.amount)),
          votingDelay,
          votingPeriod,
          proposalThreshold: BigInt(proposalThreshold),
          quorumNumerator: BigInt(quorum),
          timelockDelay: BigInt(timelockDelay),
        },
      ],
    });
  }

  return (
    <div className="mx-auto max-w-[600px] px-4 py-10 sm:px-6">
      {/* Step indicator */}
      <div className="mb-8 flex items-center justify-center gap-3">
        <button
          onClick={() => step > 0 && setStep(0)}
          className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
            step === 0 ? "bg-[#6c7bff] text-white" : "bg-[#6c7bff]/20 text-[#6c7bff]"
          }`}
        >
          {step > 0 ? "\u2713" : "1"}
        </button>
        <div className="h-px w-10 bg-[#2a2d3a]" />
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
            step === 1 ? "bg-[#6c7bff] text-white" : "bg-[#1a1d27] text-[#8b8fa3]"
          }`}
        >
          2
        </div>
      </div>

      {/* Step 1: Everything */}
      {step === 0 && (
        <div className="space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white">Set up your DAO</h1>
            <p className="mt-1 text-sm text-[#8b8fa3]">Name it and add members</p>
          </div>

          {/* Name */}
          <div className="rounded-xl border border-[#2a2d3a] bg-[#1a1d27] p-5">
            <div className="space-y-4">
              <div>
                <Label htmlFor="daoName" className="text-xs text-[#8b8fa3]">DAO Name</Label>
                <Input
                  id="daoName"
                  placeholder="Acme DAO"
                  value={daoName}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="mt-1.5 border-[#2a2d3a] bg-[#0f1117]"
                />
              </div>
              <div>
                <Label htmlFor="tokenSymbol" className="text-xs text-[#8b8fa3]">Token Symbol</Label>
                <Input
                  id="tokenSymbol"
                  placeholder="ACME"
                  value={tokenSymbol}
                  onChange={(e) => setTokenSymbol(e.target.value.toUpperCase())}
                  maxLength={5}
                  className="mt-1.5 border-[#2a2d3a] bg-[#0f1117]"
                />
              </div>
            </div>
          </div>

          {/* Members */}
          <div className="rounded-xl border border-[#2a2d3a] bg-[#1a1d27] p-5">
            <div className="mb-4 flex items-center justify-between">
              <Label className="text-xs text-[#8b8fa3]">
                Members &middot; {totalSupply.toLocaleString()} {tokenSymbol || "tokens"} total
              </Label>
              <button
                onClick={addMember}
                className="text-xs font-medium text-[#6c7bff] transition-colors hover:text-white"
              >
                + Add
              </button>
            </div>

            <div className="space-y-2">
              {members.map((member, i) => (
                <div key={i} className="flex gap-2">
                  <Input
                    placeholder="0x..."
                    value={member.address}
                    onChange={(e) => updateMember(i, "address", e.target.value)}
                    className="flex-1 border-[#2a2d3a] bg-[#0f1117] font-mono text-xs"
                  />
                  <Input
                    type="number"
                    value={member.amount}
                    onChange={(e) => updateMember(i, "amount", e.target.value)}
                    className="w-28 border-[#2a2d3a] bg-[#0f1117] text-sm"
                  />
                  {members.length > 1 && (
                    <button
                      onClick={() => removeMember(i)}
                      className="px-2 text-[#8b8fa3] transition-colors hover:text-[#ff6b9d]"
                    >
                      &times;
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Advanced governance — collapsed by default */}
          <div className="rounded-xl border border-[#2a2d3a] bg-[#1a1d27]">
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex w-full items-center justify-between px-5 py-4 text-left"
            >
              <span className="text-xs text-[#8b8fa3]">
                Advanced governance settings
              </span>
              <svg
                className={`h-4 w-4 text-[#8b8fa3] transition-transform ${showAdvanced ? "rotate-180" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
              </svg>
            </button>

            {showAdvanced && (
              <div className="space-y-6 border-t border-[#2a2d3a] px-5 pb-5 pt-4">
                <div>
                  <div className="flex justify-between">
                    <Label className="text-xs">Voting Delay</Label>
                    <span className="text-xs text-[#6c7bff]">{blocksToTime(votingDelay)}</span>
                  </div>
                  <Slider
                    value={[votingDelay]}
                    onValueChange={(v) => setVotingDelay(Array.isArray(v) ? v[0] : v)}
                    min={1} max={50400} step={1800}
                    className="mt-2"
                  />
                </div>
                <div>
                  <div className="flex justify-between">
                    <Label className="text-xs">Voting Duration</Label>
                    <span className="text-xs text-[#6c7bff]">{blocksToTime(votingPeriod)}</span>
                  </div>
                  <Slider
                    value={[votingPeriod]}
                    onValueChange={(v) => setVotingPeriod(Array.isArray(v) ? v[0] : v)}
                    min={7200} max={302400} step={7200}
                    className="mt-2"
                  />
                </div>
                <div>
                  <div className="flex justify-between">
                    <Label className="text-xs">Quorum</Label>
                    <span className="text-xs text-[#6c7bff]">{quorum}%</span>
                  </div>
                  <Slider
                    value={[quorum]}
                    onValueChange={(v) => setQuorum(Array.isArray(v) ? v[0] : v)}
                    min={1} max={50} step={1}
                    className="mt-2"
                  />
                </div>
                <div>
                  <div className="flex justify-between">
                    <Label className="text-xs">Proposal Threshold</Label>
                    <span className="text-xs text-[#6c7bff]">
                      {proposalThreshold === 0 ? "Any holder" : `${proposalThreshold.toLocaleString()} tokens`}
                    </span>
                  </div>
                  <Slider
                    value={[proposalThreshold]}
                    onValueChange={(v) => setProposalThreshold(Array.isArray(v) ? v[0] : v)}
                    min={0} max={Math.max(1, Math.floor(totalSupply * 0.01))} step={Math.max(1, Math.floor(totalSupply * 0.001))}
                    className="mt-2"
                  />
                </div>
                <div>
                  <div className="flex justify-between">
                    <Label className="text-xs">Execution Delay</Label>
                    <span className="text-xs text-[#6c7bff]">{secondsToTime(timelockDelay)}</span>
                  </div>
                  <Slider
                    value={[timelockDelay]}
                    onValueChange={(v) => setTimelockDelay(Array.isArray(v) ? v[0] : v)}
                    min={3600} max={604800} step={3600}
                    className="mt-2"
                  />
                </div>
              </div>
            )}
          </div>

          <Button
            onClick={() => setStep(1)}
            disabled={!step1Valid}
            className="w-full bg-[#6c7bff] py-6 text-base font-semibold hover:bg-[#5a6aee]"
          >
            Review
          </Button>
        </div>
      )}

      {/* Step 2: Review & Deploy */}
      {step === 1 && (
        <div className="space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white">Review & Deploy</h1>
            <p className="mt-1 text-sm text-[#8b8fa3]">Everything look right?</p>
          </div>

          <div className="rounded-xl border border-[#2a2d3a] bg-[#1a1d27] p-5">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs text-[#8b8fa3]">DAO Name</p>
                <p className="mt-0.5 font-medium text-white">{daoName}</p>
              </div>
              <div>
                <p className="text-xs text-[#8b8fa3]">Token</p>
                <p className="mt-0.5 font-medium text-white">{tokenSymbol}</p>
              </div>
              <div>
                <p className="text-xs text-[#8b8fa3]">Members</p>
                <p className="mt-0.5 font-medium text-white">{members.length}</p>
              </div>
              <div>
                <p className="text-xs text-[#8b8fa3]">Total Supply</p>
                <p className="mt-0.5 font-medium text-white">{totalSupply.toLocaleString()} {tokenSymbol}</p>
              </div>
            </div>

            <div className="mt-4 border-t border-[#2a2d3a] pt-4">
              <p className="mb-2 text-xs text-[#8b8fa3]">Members</p>
              {members.map((m, i) => (
                <div key={i} className="flex items-center justify-between py-1 text-xs">
                  <span className="font-mono text-[#8b8fa3]">{m.address.slice(0, 6)}...{m.address.slice(-4)}</span>
                  <span className="text-white">{Number(m.amount).toLocaleString()} {tokenSymbol}</span>
                </div>
              ))}
            </div>

            {showAdvanced && (
              <div className="mt-4 grid grid-cols-2 gap-3 border-t border-[#2a2d3a] pt-4 text-xs">
                <div><span className="text-[#8b8fa3]">Voting Delay:</span> <span className="text-white">{blocksToTime(votingDelay)}</span></div>
                <div><span className="text-[#8b8fa3]">Voting Duration:</span> <span className="text-white">{blocksToTime(votingPeriod)}</span></div>
                <div><span className="text-[#8b8fa3]">Quorum:</span> <span className="text-white">{quorum}%</span></div>
                <div><span className="text-[#8b8fa3]">Execution Delay:</span> <span className="text-white">{secondsToTime(timelockDelay)}</span></div>
              </div>
            )}
          </div>

          {!isConnected && (
            <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/10 p-3 text-center text-sm text-yellow-300">
              Connect your wallet to deploy
            </div>
          )}

          {isSuccess && (
            <div className="rounded-lg border border-green-500/20 bg-green-500/10 p-3 text-center text-sm text-green-300">
              DAO created! Redirecting...
            </div>
          )}

          {writeError && (
            <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-300">
              Failed: {writeError.message.slice(0, 200)}
            </div>
          )}

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setStep(0)}
              className="border-[#2a2d3a]"
            >
              Back
            </Button>
            {isConnected && !isSuccess && (
              <Button
                onClick={handleDeploy}
                disabled={isPending || isConfirming}
                className="flex-1 bg-[#6c7bff] py-6 text-base font-semibold hover:bg-[#5a6aee]"
              >
                {isPending ? "Confirm in wallet..." : isConfirming ? "Deploying..." : "Deploy DAO"}
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
