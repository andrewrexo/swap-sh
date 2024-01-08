import {
  getAssetPricing,
  getAssetsFromExodusByNetwork,
} from "@/lib/swap/assets";
import { getRateForPair } from "@/lib/swap/rates";
import { AssetNetwork } from "@/lib/swap/types";
import { ThemeSwitchButton } from "@/components/theme-switch-button";
import { SwapWidget } from "@/components/swap-widget";
import { whitelistedAssets } from "@/lib/swap/constants";
import { useState } from "react";

export default async function Swap() {
  const assets = await getAssetsFromExodusByNetwork([
    AssetNetwork.Bitcoin,
    AssetNetwork.Monero,
    AssetNetwork.Ethereum,
    AssetNetwork.Tezos,
    AssetNetwork.AvalancheC,
    AssetNetwork.Solana,
  ]);

  return (
    <div className="flex flex-col h-svh justify-stretch p-6 gap-6">
      <div className="h-fit-content">
        <ThemeSwitchButton />
      </div>
      <div className="flex justify-center pb-6">
        <SwapWidget assets={assets} />
      </div>
    </div>
  );
}
