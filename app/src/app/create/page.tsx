"use client";

import { useState, useEffect } from "react";
import { useAccount, useChainId, useWaitForTransactionReceipt } from "wagmi";
import { parseEther, isAddress, decodeEventLog } from "viem";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useFactoryAddress, useCreateDAO, factoryAbi } from "@/lib/contracts/hooks";
import { GOVERNANCE_DEFAULTS, blocksToTime, secondsToTime } from "@/types/dao";

interface Member {
  address: string;
  amount: string;
}

const STEPS = ["Name & Token", "Members", "Governance", "Review & Deploy"];

export default function CreateDAOPage() {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const factoryAddress = useFactoryAddress();

  const [step, setStep] = useState(0);

  // Step 1: Name & Token
  const [daoName, setDaoName] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");

  // Step 2: Members
  const [members, setMembers] = useState<Member[]>([
    { address: "", amount: "100000" },
  ]);

  // Step 3: Governance
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

  // C1 fix: redirect to new DAO after successful creation
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
            // not our event, skip
          }
        }
      } catch {
        // fallback: stay on page with success message
      }
    }
  }, [isSuccess, receipt, router]);

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

  function handleCSVPaste(text: string) {
    const lines = text.trim().split("\n");
    const parsed: Member[] = [];
    for (const line of lines) {
      const [addr, amt] = line.split(",").map((s) => s.trim());
      if (addr && amt) {
        parsed.push({ address: addr, amount: amt });
      }
    }
    if (parsed.length > 0) setMembers(parsed);
  }

  const canProceed = () => {
    switch (step) {
      case 0:
        return daoName.length > 0 && tokenSymbol.length > 0;
      case 1:
        return (
          members.length > 0 &&
          members.every(
            (m) =>
              isAddress(m.address) &&
              Number(m.amount) > 0
          )
        );
      case 2:
        return true;
      case 3:
        return isConnected;
      default:
        return false;
    }
  };

  function handleDeploy() {
    if (!factoryAddress || !address) return;

    const tokenRecipients = members.map((m) => m.address as `0x${string}`);
    const tokenAmounts = members.map((m) => parseEther(m.amount));

    writeContract({
      address: factoryAddress,
      abi: factoryAbi,
      functionName: "createDAO",
      args: [
        {
          name: daoName,
          tokenSymbol,
          tokenRecipients,
          tokenAmounts,
          votingDelay,
          votingPeriod,
          proposalThreshold: BigInt(proposalThreshold),
          quorumNumerator: BigInt(quorum),
          timelockDelay: BigInt(timelockDelay),
        },
      ],
    });
  }

  const totalSupply = members.reduce(
    (sum, m) => sum + (Number(m.amount) || 0),
    0
  );

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold">Create Your DAO</h1>
      <p className="mt-2 text-gray-400">
        Set up your decentralized organization in a few simple steps.
      </p>

      {/* Step indicator */}
      <div className="mt-8 flex items-center gap-2">
        {STEPS.map((label, i) => (
          <div key={label} className="flex items-center gap-2">
            <button
              onClick={() => i < step && setStep(i)}
              className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors ${
                i === step
                  ? "bg-indigo-500 text-white"
                  : i < step
                    ? "bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30"
                    : "bg-white/5 text-gray-500"
              }`}
            >
              {i < step ? (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
              ) : (
                i + 1
              )}
            </button>
            <span
              className={`hidden text-sm sm:block ${
                i === step ? "text-white" : "text-gray-500"
              }`}
            >
              {label}
            </span>
            {i < STEPS.length - 1 && (
              <div className="mx-2 h-px w-8 bg-white/10" />
            )}
          </div>
        ))}
      </div>

      {/* Step content */}
      <Card className="mt-8 border-white/10 bg-white/[0.02]">
        <CardContent className="p-6">
          {/* Step 1: Name & Token */}
          {step === 0 && (
            <div className="space-y-6">
              <div>
                <Label htmlFor="daoName">DAO Name</Label>
                <Input
                  id="daoName"
                  placeholder="My Awesome DAO"
                  value={daoName}
                  onChange={(e) => setDaoName(e.target.value)}
                  className="mt-2 border-white/10 bg-white/5"
                />
                <p className="mt-1 text-xs text-gray-500">
                  This will also be used as the governance token name.
                </p>
              </div>
              <div>
                <Label htmlFor="tokenSymbol">Token Symbol</Label>
                <Input
                  id="tokenSymbol"
                  placeholder="DAO"
                  value={tokenSymbol}
                  onChange={(e) => setTokenSymbol(e.target.value.toUpperCase())}
                  maxLength={10}
                  className="mt-2 border-white/10 bg-white/5"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Short ticker symbol for your governance token (e.g., DAO, GOV).
                </p>
              </div>
            </div>
          )}

          {/* Step 2: Members */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Members & Token Distribution</h3>
                  <p className="text-sm text-gray-400">
                    Add wallet addresses and the number of tokens each member receives.
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addMember}
                  className="border-white/10"
                >
                  + Add Member
                </Button>
              </div>

              <div className="space-y-3">
                {members.map((member, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="flex-1">
                      <Input
                        placeholder="0x..."
                        value={member.address}
                        onChange={(e) => updateMember(i, "address", e.target.value)}
                        className="border-white/10 bg-white/5 font-mono text-sm"
                      />
                    </div>
                    <div className="w-36">
                      <Input
                        type="number"
                        placeholder="Tokens"
                        value={member.amount}
                        onChange={(e) => updateMember(i, "amount", e.target.value)}
                        className="border-white/10 bg-white/5"
                      />
                    </div>
                    {members.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeMember(i)}
                        className="shrink-0 text-gray-500 hover:text-red-400"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                        </svg>
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              <div className="rounded-lg border border-white/5 bg-white/[0.02] p-4">
                <p className="text-sm text-gray-400">
                  Total supply: <span className="font-medium text-white">{totalSupply.toLocaleString()}</span> {tokenSymbol || "tokens"}
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  Tip: Paste CSV data (address,amount per line) into the first address field.
                </p>
              </div>
            </div>
          )}

          {/* Step 3: Governance */}
          {step === 2 && (
            <div className="space-y-8">
              <div>
                <div className="flex items-center justify-between">
                  <Label>Voting Delay</Label>
                  <span className="text-sm text-indigo-400">{blocksToTime(votingDelay)}</span>
                </div>
                <p className="mb-3 text-xs text-gray-500">
                  Review period before voting starts after a proposal is created.
                </p>
                <Slider
                  value={[votingDelay]}
                  onValueChange={(v) => setVotingDelay(Array.isArray(v) ? v[0] : v)}
                  min={1}
                  max={50400}
                  step={1800}
                />
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <Label>Voting Duration</Label>
                  <span className="text-sm text-indigo-400">{blocksToTime(votingPeriod)}</span>
                </div>
                <p className="mb-3 text-xs text-gray-500">
                  How long members can vote on proposals.
                </p>
                <Slider
                  value={[votingPeriod]}
                  onValueChange={(v) => setVotingPeriod(Array.isArray(v) ? v[0] : v)}
                  min={7200}
                  max={302400}
                  step={7200}
                />
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <Label>Quorum</Label>
                  <span className="text-sm text-indigo-400">{quorum}% of total supply</span>
                </div>
                <p className="mb-3 text-xs text-gray-500">
                  Minimum percentage of tokens that must vote for a proposal to pass.
                </p>
                <Slider
                  value={[quorum]}
                  onValueChange={(v) => setQuorum(Array.isArray(v) ? v[0] : v)}
                  min={1}
                  max={50}
                  step={1}
                />
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <Label>Proposal Threshold</Label>
                  <span className="text-sm text-indigo-400">
                    {proposalThreshold === 0 ? "Any holder" : `${proposalThreshold.toLocaleString()} tokens`}
                  </span>
                </div>
                <p className="mb-3 text-xs text-gray-500">
                  Minimum tokens needed to create a proposal.
                </p>
                <Slider
                  value={[proposalThreshold]}
                  onValueChange={(v) => setProposalThreshold(Array.isArray(v) ? v[0] : v)}
                  min={0}
                  max={Math.floor(totalSupply * 0.01)}
                  step={Math.max(1, Math.floor(totalSupply * 0.001))}
                />
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <Label>Execution Delay</Label>
                  <span className="text-sm text-indigo-400">{secondsToTime(timelockDelay)}</span>
                </div>
                <p className="mb-3 text-xs text-gray-500">
                  Mandatory waiting period after a vote passes before it can be executed.
                </p>
                <Slider
                  value={[timelockDelay]}
                  onValueChange={(v) => setTimelockDelay(Array.isArray(v) ? v[0] : v)}
                  min={3600}
                  max={604800}
                  step={3600}
                />
              </div>
            </div>
          )}

          {/* Step 4: Review & Deploy */}
          {step === 3 && (
            <div className="space-y-6">
              <h3 className="font-medium">Review Your DAO</h3>

              <div className="space-y-4 rounded-lg border border-white/5 bg-white/[0.02] p-6">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">DAO Name</p>
                    <p className="font-medium">{daoName}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Token Symbol</p>
                    <p className="font-medium">{tokenSymbol}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Members</p>
                    <p className="font-medium">{members.length}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Total Supply</p>
                    <p className="font-medium">{totalSupply.toLocaleString()} {tokenSymbol}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Voting Delay</p>
                    <p className="font-medium">{blocksToTime(votingDelay)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Voting Duration</p>
                    <p className="font-medium">{blocksToTime(votingPeriod)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Quorum</p>
                    <p className="font-medium">{quorum}%</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Execution Delay</p>
                    <p className="font-medium">{secondsToTime(timelockDelay)}</p>
                  </div>
                </div>
              </div>

              {!isConnected && (
                <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/10 p-4 text-sm text-yellow-300">
                  Connect your wallet to deploy.
                </div>
              )}

              {isSuccess && (
                <div className="rounded-lg border border-green-500/20 bg-green-500/10 p-4 text-sm text-green-300">
                  DAO created successfully! Redirecting to your dashboard...
                </div>
              )}

              {writeError && (
                <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
                  Transaction failed: {writeError.message.slice(0, 200)}
                </div>
              )}

              {isConnected && !isSuccess && (
                <Button
                  onClick={handleDeploy}
                  disabled={isPending || isConfirming}
                  className="w-full bg-indigo-500 hover:bg-indigo-400"
                  size="lg"
                >
                  {isPending
                    ? "Confirm in wallet..."
                    : isConfirming
                      ? "Deploying..."
                      : "Deploy DAO"}
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      {step < 3 && (
        <div className="mt-6 flex justify-between">
          <Button
            variant="outline"
            onClick={() => setStep(step - 1)}
            disabled={step === 0}
            className="border-white/10"
          >
            Back
          </Button>
          <Button
            onClick={() => setStep(step + 1)}
            disabled={!canProceed()}
            className="bg-indigo-500 hover:bg-indigo-400"
          >
            Next
          </Button>
        </div>
      )}
      {step === 3 && !isSuccess && (
        <div className="mt-6">
          <Button
            variant="outline"
            onClick={() => setStep(step - 1)}
            className="border-white/10"
          >
            Back
          </Button>
        </div>
      )}
    </div>
  );
}
