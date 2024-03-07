import {
  Asset,
  AssetNetworkRecord,
  FiatCurrency,
  SwapDirection,
} from "@/lib/swap/types";
import { SwapSelectionDialog } from "./swap-selection-dialog";
import { SwapWidgetButton } from "./swap-widget-button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "./ui/card";
import { SwapWidgetSettingsDialog } from "./swap-widget-settings-dialog";
import { useEffect, useState } from "react";

export function SwapWidgetQuote({
  assets,
  currency,
  fromAmount,
  toAmount,
  minimum,
  maximum,
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
  minimum: number;
  maximum: number;
  fromAsset: Asset | undefined;
  toAsset: Asset | undefined;
  assetCallback: (asset: Asset, direction: SwapDirection) => void;
  amountCallback: (amount: number, direction: SwapDirection) => void;
}) {
  const [limitWarning, setLimitWarning] = useState<{
    active: boolean;
    size: "maximum" | "minimum" | "";
  }>({
    active: false,
    size: "",
  });

  useEffect(() => {
    if (fromAmount >= maximum) {
      setLimitWarning({
        active: true,
        size: "maximum",
      });
    } else if (fromAmount <= minimum) {
      setLimitWarning({
        active: true,
        size: "minimum",
      });
    } else {
      setLimitWarning({
        active: false,
        size: "",
      });
    }

    console.log({ minimum, maximum });
  }, [fromAmount, minimum, maximum]);

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
            minimum={minimum}
            maximum={maximum}
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
            minimum={minimum}
            maximum={maximum}
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
      <CardFooter className="flex flex-col gap-y-6">
        {limitWarning.active && minimum != 0 ? (
          <p className="text-red-400">{`${
            limitWarning.size === "maximum"
              ? `Amount exceeds ${limitWarning.size}`
              : `Amount is below ${limitWarning.size}`
          } `}</p>
        ) : (
          ""
        )}
        <SwapWidgetButton
          buttonCallback={buttonCallback}
          disabled={limitWarning.active}
        />
      </CardFooter>
    </Card>
  );
}
