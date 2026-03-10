import { CommunityTemplate } from "@/lib/types";

export const communityTemplates: CommunityTemplate[] = [
  {
    id: "coin-flip",
    title: "Coin Flip",
    description: "A simple heads-or-tails betting game where players wager AVAX",
    category: "game",
    prompt:
      "Create a coin flip betting game where players can wager AVAX with a 50/50 chance of doubling their bet",
  },
  {
    id: "nft-gallery",
    title: "NFT Gallery",
    description: "Mint and showcase a collection of unique digital artworks",
    category: "nft",
    prompt:
      "Create an NFT collection called ArtVault for digital art with a max supply of 50 and a mint price of 0.1 AVAX",
  },
  {
    id: "rewards-token",
    title: "Rewards Token",
    description: "Launch a loyalty or rewards token for your community",
    category: "token",
    prompt:
      "Create a rewards token called StarPoints with 500,000 initial supply for a community loyalty program",
  },
  {
    id: "tip-jar",
    title: "Tip Jar",
    description: "Accept crypto tips from fans and supporters",
    category: "tipping",
    prompt:
      "Create a tipping page for my music channel where fans can send AVAX tips with optional messages",
  },
  {
    id: "lottery",
    title: "Mini Lottery",
    description: "A lottery game where players buy tickets for a chance to win the pot",
    category: "game",
    prompt:
      "Create a lottery game where players buy tickets for 0.05 AVAX and one random winner takes the pot",
  },
  {
    id: "membership-nft",
    title: "Membership Pass",
    description: "NFT-based membership passes for exclusive access",
    category: "nft",
    prompt:
      "Create an NFT membership pass collection called VIPPass with 200 max supply for exclusive community access",
  },
];
