export interface DAOInfo {
  id: number;
  name: string;
  token: `0x${string}`;
  timelock: `0x${string}`;
  governor: `0x${string}`;
  creator: `0x${string}`;
  createdAt: bigint;
}

export interface ProposalInfo {
  id: bigint;
  proposer: `0x${string}`;
  targets: `0x${string}`[];
  values: bigint[];
  calldatas: `0x${string}`[];
  description: string;
  startBlock: bigint;
  endBlock: bigint;
  state: ProposalState;
}

export enum ProposalState {
  Pending = 0,
  Active = 1,
  Canceled = 2,
  Defeated = 3,
  Succeeded = 4,
  Queued = 5,
  Expired = 6,
  Executed = 7,
}

export const PROPOSAL_STATE_LABELS: Record<ProposalState, string> = {
  [ProposalState.Pending]: "Pending",
  [ProposalState.Active]: "Active",
  [ProposalState.Canceled]: "Canceled",
  [ProposalState.Defeated]: "Defeated",
  [ProposalState.Succeeded]: "Succeeded",
  [ProposalState.Queued]: "Queued",
  [ProposalState.Expired]: "Expired",
  [ProposalState.Executed]: "Executed",
};

export const PROPOSAL_STATE_COLORS: Record<ProposalState, string> = {
  [ProposalState.Pending]: "bg-yellow-500/10 text-yellow-500",
  [ProposalState.Active]: "bg-blue-500/10 text-blue-500",
  [ProposalState.Canceled]: "bg-gray-500/10 text-gray-500",
  [ProposalState.Defeated]: "bg-red-500/10 text-red-500",
  [ProposalState.Succeeded]: "bg-green-500/10 text-green-500",
  [ProposalState.Queued]: "bg-purple-500/10 text-purple-500",
  [ProposalState.Expired]: "bg-gray-500/10 text-gray-500",
  [ProposalState.Executed]: "bg-emerald-500/10 text-emerald-500",
};

// Governance defaults for the create wizard
export const GOVERNANCE_DEFAULTS = {
  votingDelay: 7200, // ~1 day on Base (2s blocks). Contract min: 1 block.
  votingPeriod: 50400, // ~7 days on Base. Contract min: 7200 blocks (~1 day).
  proposalThreshold: 0,
  quorumNumerator: 4, // 4%
  timelockDelay: 86400, // 1 day in seconds. Contract min: 3600 (1 hour).
};

// Convert blocks to human-readable time (Base = 2 second blocks)
export function blocksToTime(blocks: number): string {
  const seconds = blocks * 2;
  if (seconds === 0) return "No delay";
  if (seconds < 3600) return `${Math.round(seconds / 60)} minutes`;
  if (seconds < 86400) return `${Math.round(seconds / 3600)} hours`;
  return `${Math.round(seconds / 86400)} days`;
}

export function secondsToTime(secs: number): string {
  if (secs === 0) return "No delay";
  if (secs < 3600) return `${Math.round(secs / 60)} minutes`;
  if (secs < 86400) return `${Math.round(secs / 3600)} hours`;
  return `${Math.round(secs / 86400)} days`;
}
