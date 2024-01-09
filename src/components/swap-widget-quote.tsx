import { Asset, AssetNetworkRecord, FiatCurrency, SwapDirection } from "@/lib/swap/types";
import { SwapSelectionDialog } from "./swap-selection-dialog";
import { SwapWidgetButton } from "./swap-widget-button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "./ui/card";
import { SwapWidgetSettingsDialog } from "./swap-widget-settings-dialog";

export function SwapWidgetQuote({
  assets,
  currency,
  fromAmount,
  toAmount,
  fromAsset,
  toAsset,
  buttonCallback,
  assetCallback,
  amountCallback,
}: {
  assets: AssetNetworkRecord;
  buttonCallback: () => void;
  currency: FiatCurrency;
  fromAmount: number;
  toAmount: number;
  fromAsset: Asset | undefined;
  toAsset: Asset | undefined;
  assetCallback: (asset: Asset, direction: SwapDirection) => void;
  amountCallback: (amount: number, direction: SwapDirection) => void;
}) {
  return (
    <Card className="max-w-[500px]">
      <CardHeader className="pb-4 flex flex-row justify-between items-start">
        <div className="space-y-1">
          <CardTitle>XOSwap</CardTitle>
          <CardDescription>rapid swaps, low fees. no b.s.</CardDescription>
        </div>
        <div className="mt-0">
          <SwapWidgetSettingsDialog />
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-2">
          <SwapSelectionDialog
            assets={assets}
            currency={currency}
            fromAsset={fromAsset}
            toAsset={toAsset}
            fromAmount={fromAmount}
            toAmount={toAmount}
            assetCallback={assetCallback}
            amountCallback={amountCallback}
            direction="from"
          >
            from
          </SwapSelectionDialog>
        </div>
        <div className="flex items-center justify-between w-full">
          <SwapSelectionDialog
            assets={assets}
            currency={currency}
            fromAsset={fromAsset}
            toAsset={toAsset}
            fromAmount={fromAmount}
            toAmount={toAmount}
            assetCallback={assetCallback}
            amountCallback={amountCallback}
            disabled={true}
            direction="to"
          >
            to
          </SwapSelectionDialog>
        </div>
      </CardContent>
      <CardFooter>
        <SwapWidgetButton buttonCallback={buttonCallback} />
      </CardFooter>
    </Card>
  );
}
