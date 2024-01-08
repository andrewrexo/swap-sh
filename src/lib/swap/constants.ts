import { AssetNetwork } from "./types";

export const whitelistedAssets = [
  { id: "BTC", network: AssetNetwork.Bitcoin },
  { id: "ETH", network: AssetNetwork.Ethereum },
  { id: "USDT", network: AssetNetwork.Ethereum },
  { id: "USDC", network: AssetNetwork.Ethereum },
  { id: "LINK", network: AssetNetwork.Ethereum },
  { id: "AVAXC", network: AssetNetwork.AvalancheC },
  { id: "USDTavalanchecD80C1AFA", network: AssetNetwork.AvalancheC },
  { id: "SOL", network: AssetNetwork.Solana },
  { id: "USDCSOL", network: AssetNetwork.Solana },
  { id: "USDTSOL", network: AssetNetwork.Solana },
  { id: "XMR", network: AssetNetwork.Monero },
  { id: "XTZ", network: AssetNetwork.Tezos },
];

export const networkToColorMap: Map<AssetNetwork, string> = new Map([
  [AssetNetwork.Ethereum, "text-blue-800"],
  [AssetNetwork.ArbitrumOne, "text-blue-600"],
  [AssetNetwork.AvalancheC, "text-red-500"],
  [AssetNetwork.Bitcoin, "text-yellow-500"],
  [AssetNetwork.Solana, "text-purple-500"],
  [AssetNetwork.Monero, "text-orange-500"],
  [AssetNetwork.Tezos, "text-blue-300"],
]);

export const networkBlockExplorerMap: Map<AssetNetwork, string> = new Map([
  [AssetNetwork.Ethereum, "https://etherscan.io/tx/"],
  [AssetNetwork.ArbitrumOne, "https://arbiscan.io/tx/"],
  [AssetNetwork.AvalancheC, "https://snowtrace.io/tx/"],
  [AssetNetwork.Bitcoin, "https://mempool.space/tx/"],
  [AssetNetwork.Solana, "https://solscan.io/tx/"],
  [AssetNetwork.Monero, "https://exploremonero.com/transaction/"],
  [AssetNetwork.Tezos, "https://tzkt.io/"],
]);
