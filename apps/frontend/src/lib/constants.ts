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
    name: "Points & Rewards",
    description: "Custom points system with configurable name and supply",
    icon: "Coins",
  },
  nft: {
    name: "Digital Collectibles",
    description: "Unique digital items with metadata and limited supply",
    icon: "Image",
  },
  game: {
    name: "Mini Game",
    description: "Simple game with entry fees and prizes",
    icon: "Gamepad2",
  },
  tipping: {
    name: "Tips & Payments",
    description: "Accept tips and payments with optional fee splitting",
    icon: "Heart",
  },
};

export const SUGGESTED_PROMPTS = [
  {
    label: "Loyalty Program",
    prompt:
      "Create a loyalty points system called CafePoints for my coffee shop with 1 million points",
  },
  {
    label: "Fan Membership",
    prompt: "Create a digital membership called PixelPals for my art community with 100 spots",
  },
  {
    label: "Coin Flip Game",
    prompt: "Create a coin flip game where players can bet and win prizes",
  },
  {
    label: "Tipping Page",
    prompt: "Create a tipping page for my podcast where fans can send tips",
  },
];
