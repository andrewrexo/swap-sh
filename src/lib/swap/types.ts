export enum FiatCurrency {
  USD = "USD",
  EUR = "EUR",
  GBP = "GBP",
}

export type Asset = {
  id: string;
  name: string;
  decimals: number;
  symbol: string;
  network: AssetNetwork;
  pricing?: AssetPrice;
  logo: string;
};

export type AssetPrice = {
  [key in FiatCurrency]: number;
};

export type AssetWithPrice = {
  id: string;
} & {
  [key in FiatCurrency]: number;
};

export enum AssetNetwork {
  Ethereum = "ethereum",
  ArbitrumOne = "ethereumarbone",
  AvalancheC = "avalanchec",
  Bitcoin = "bitcoin",
  Solana = "solana",
  Monero = "monero",
  Tezos = "tezos",
}

export type AssetNetworkRecord = {
  [key in AssetNetwork]: Asset[];
};

export type SwapDirection = "from" | "to";
