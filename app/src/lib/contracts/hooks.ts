"use client";

import { useReadContract, useWriteContract, useChainId } from "wagmi";
import { type Abi } from "viem";
import { CONTRACTS, type SupportedChainId } from "./addresses";
import DAOFactoryABI from "./abis/DAOFactory.json";
import DAOTokenABI from "./abis/DAOToken.json";
import DAOGovernorABI from "./abis/DAOGovernor.json";
import DAOTimelockABI from "./abis/DAOTimelock.json";

// Re-export ABIs for direct use
export const factoryAbi = DAOFactoryABI as Abi;
export const tokenAbi = DAOTokenABI as Abi;
export const governorAbi = DAOGovernorABI as Abi;
export const timelockAbi = DAOTimelockABI as Abi;

export function useFactoryAddress() {
  const chainId = useChainId();
  return CONTRACTS[chainId as SupportedChainId]?.factory;
}

// --- Factory hooks ---

export function useDAOCount() {
  const address = useFactoryAddress();
  return useReadContract({
    address,
    abi: factoryAbi,
    functionName: "daoCount",
  });
}

export function useDAOInfo(daoId: number) {
  const address = useFactoryAddress();
  return useReadContract({
    address,
    abi: factoryAbi,
    functionName: "daos",
    args: [BigInt(daoId)],
  });
}

export function usePredictAddresses(deployer: `0x${string}` | undefined, daoId: bigint | undefined) {
  const address = useFactoryAddress();
  return useReadContract({
    address,
    abi: factoryAbi,
    functionName: "predictAddresses",
    args: deployer && daoId !== undefined ? [deployer, daoId] : undefined,
    query: { enabled: !!deployer && daoId !== undefined },
  });
}

export function useCreateDAO() {
  return useWriteContract();
}

// --- Token hooks ---

export function useTokenName(tokenAddress: `0x${string}` | undefined) {
  return useReadContract({
    address: tokenAddress,
    abi: tokenAbi,
    functionName: "name",
    query: { enabled: !!tokenAddress },
  });
}

export function useTokenSymbol(tokenAddress: `0x${string}` | undefined) {
  return useReadContract({
    address: tokenAddress,
    abi: tokenAbi,
    functionName: "symbol",
    query: { enabled: !!tokenAddress },
  });
}

export function useTokenTotalSupply(tokenAddress: `0x${string}` | undefined) {
  return useReadContract({
    address: tokenAddress,
    abi: tokenAbi,
    functionName: "totalSupply",
    query: { enabled: !!tokenAddress },
  });
}

export function useTokenBalance(tokenAddress: `0x${string}` | undefined, account: `0x${string}` | undefined) {
  return useReadContract({
    address: tokenAddress,
    abi: tokenAbi,
    functionName: "balanceOf",
    args: account ? [account] : undefined,
    query: { enabled: !!tokenAddress && !!account },
  });
}

export function useVotingPower(tokenAddress: `0x${string}` | undefined, account: `0x${string}` | undefined) {
  return useReadContract({
    address: tokenAddress,
    abi: tokenAbi,
    functionName: "getVotes",
    args: account ? [account] : undefined,
    query: { enabled: !!tokenAddress && !!account },
  });
}

// --- Governor hooks ---

export function useGovernorName(governorAddress: `0x${string}` | undefined) {
  return useReadContract({
    address: governorAddress,
    abi: governorAbi,
    functionName: "name",
    query: { enabled: !!governorAddress },
  });
}

export function useGovernorTimelock(governorAddress: `0x${string}` | undefined) {
  return useReadContract({
    address: governorAddress,
    abi: governorAbi,
    functionName: "timelock",
    query: { enabled: !!governorAddress },
  });
}

export function useGovernorToken(governorAddress: `0x${string}` | undefined) {
  return useReadContract({
    address: governorAddress,
    abi: governorAbi,
    functionName: "token",
    query: { enabled: !!governorAddress },
  });
}

export function useVotingDelay(governorAddress: `0x${string}` | undefined) {
  return useReadContract({
    address: governorAddress,
    abi: governorAbi,
    functionName: "votingDelay",
    query: { enabled: !!governorAddress },
  });
}

export function useVotingPeriod(governorAddress: `0x${string}` | undefined) {
  return useReadContract({
    address: governorAddress,
    abi: governorAbi,
    functionName: "votingPeriod",
    query: { enabled: !!governorAddress },
  });
}

export function useProposalThreshold(governorAddress: `0x${string}` | undefined) {
  return useReadContract({
    address: governorAddress,
    abi: governorAbi,
    functionName: "proposalThreshold",
    query: { enabled: !!governorAddress },
  });
}

export function useProposalState(governorAddress: `0x${string}` | undefined, proposalId: bigint | undefined) {
  return useReadContract({
    address: governorAddress,
    abi: governorAbi,
    functionName: "state",
    args: proposalId !== undefined ? [proposalId] : undefined,
    query: { enabled: !!governorAddress && proposalId !== undefined },
  });
}

export function useProposalVotes(governorAddress: `0x${string}` | undefined, proposalId: bigint | undefined) {
  return useReadContract({
    address: governorAddress,
    abi: governorAbi,
    functionName: "proposalVotes",
    args: proposalId !== undefined ? [proposalId] : undefined,
    query: { enabled: !!governorAddress && proposalId !== undefined },
  });
}

export function usePropose() {
  return useWriteContract();
}

export function useCastVote() {
  return useWriteContract();
}

export function useQueueProposal() {
  return useWriteContract();
}

export function useExecuteProposal() {
  return useWriteContract();
}
