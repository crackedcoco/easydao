// Contract addresses — update after deploying to Base Sepolia / Base mainnet
export const CONTRACTS = {
  // Base Sepolia testnet (chain ID 84532)
  84532: {
    factory: "0x0000000000000000000000000000000000000000" as `0x${string}`,
  },
  // Base mainnet (chain ID 8453)
  8453: {
    factory: "0x0000000000000000000000000000000000000000" as `0x${string}`,
  },
} as const;

export type SupportedChainId = keyof typeof CONTRACTS;
