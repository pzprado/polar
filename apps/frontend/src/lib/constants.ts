export const FUJI_CHAIN_CONFIG = {
  chainId: 43113,
  chainName: "Avalanche Fuji Testnet",
  rpcUrl: process.env.NEXT_PUBLIC_FUJI_RPC || "https://api.avax-test.network/ext/bc/C/rpc",
  explorerUrl: process.env.NEXT_PUBLIC_EXPLORER_URL || "https://testnet.snowtrace.io",
  nativeCurrency: {
    name: "AVAX",
    symbol: "AVAX",
    decimals: 18,
  },
};

export const TEMPLATE_SUMMARIES: Record<
  string,
  { name: string; description: string; icon: string }
> = {
  token: {
    name: "Token (ERC-20)",
    description: "Fungible token with customizable name, symbol, and supply",
    icon: "Coins",
  },
  nft: {
    name: "NFT Collection (ERC-721)",
    description: "Non-fungible token collection with metadata and minting",
    icon: "Image",
  },
  game: {
    name: "On-Chain Game",
    description: "Simple betting/lottery game with entry fees and prizes",
    icon: "Gamepad2",
  },
  tipping: {
    name: "Tipping / Payments",
    description: "Accept tips and payments with optional fee splitting",
    icon: "Heart",
  },
};

export const SUGGESTED_PROMPTS = [
  {
    label: "Loyalty Token",
    prompt:
      "Create a loyalty token called CafePoints for my coffee shop with 1 million initial supply",
  },
  {
    label: "NFT Collection",
    prompt: "Create an NFT collection called PixelPals for digital art with a max supply of 100",
  },
  {
    label: "Betting Game",
    prompt: "Create a coin flip betting game where players can wager AVAX",
  },
  {
    label: "Tipping Page",
    prompt: "Create a tipping page for my podcast where fans can send tips",
  },
];
