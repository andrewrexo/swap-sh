"use server";
import { SwapWidgetConfirm } from "@/components/swap-widget-confirm";
import { Animate } from "@/components/ui/animate";
import { getAssetsFromExodusByNetwork } from "@/lib/swap/assets";
import { SwapStageEvent, getExodusOrder, getProviderOrder } from "@/lib/swap/order";
import { AssetNetwork } from "@/lib/swap/types";
import { findBalanceFromProvider } from "@/lib/swap/utils";
import { notFound } from "next/navigation";

export default async function OrderPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const order = await getExodusOrder(id);

  if (!order) {
    notFound();
  }

  const providerOrder = await getProviderOrder(id);
  const [from, to] = order.pairId.split("_");
  const assets = await getAssetsFromExodusByNetwork([AssetNetwork.Ethereum, AssetNetwork.Solana]);
  const flatAssets = Object.values(assets).flatMap((element) => [...element]);
  const fromAsset = flatAssets.find((asset) => asset.id === from);
  const toAsset = flatAssets.find((asset) => asset.id === to);
  const fromAmount = order.amount.value;
  const { toAmount } = findBalanceFromProvider(providerOrder.response);

  if (!order) {
    console.error("Failed to fetch order.");
  } else {
    return (
      <div className="flex h-lvh w-full justify-center p-8">
        <Animate animateKey="swap-confirm">
          <SwapWidgetConfirm
            fromAmount={fromAmount}
            toAmount={Number(toAmount)}
            fromAsset={fromAsset}
            toAsset={toAsset}
            order={order}
            swapStage={SwapStageEvent.WaitingForProvider}
          />
        </Animate>
      </div>
    );
  }
}
