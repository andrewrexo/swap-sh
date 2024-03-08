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
import { useEffect, useState } from "react";
import { LoadingSpinner } from "./ui/loading-spinner";
import { Button } from "./ui/button";
import { ArrowDownUpIcon } from "lucide-react";
import { motion, useAnimationControls } from "framer-motion";
import { Animate } from "./ui/animate";

export function SwapWidgetQuote({
  assets,
  currency,
  fromAmount,
  toAmount,
  minimum,
  maximum,
  fromAsset,
  toAsset,
  exchangeRate,
  buttonCallback,
  assetCallback,
  amountCallback,
  minimumCallback,
  maximumCallback,
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
  exchangeRate: any;
  assetCallback: (asset: Asset, direction: SwapDirection) => void;
  amountCallback: (amount: number, direction: SwapDirection) => void;
  minimumCallback: (amount: number) => void;
  maximumCallback: (amount: number) => void;
}) {
  const controls = useAnimationControls();
  const [isAnimating, setIsAnimating] = useState(false);

  const [limitWarning, setLimitWarning] = useState<{
    active: boolean;
    size: "maximum" | "minimum" | "";
  }>({
    active: false,
    size: "",
  });

  useEffect(() => {
    if (fromAmount == 0 || !fromAmount) {
      setLimitWarning({
        active: false,
        size: "",
      });
    } else if (fromAmount >= maximum) {
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
  }, [fromAmount, minimum, maximum]);

  return (
    <Card className="max-w-[500px]">
      <CardHeader className="pb-4 flex flex-row justify-between items-start">
        <div className="space-y-1">
          <CardTitle>XOSwap</CardTitle>
          <CardDescription>rapid swaps, low fees. no b.s.</CardDescription>
        </div>
        <div className="mt-0">
          {exchangeRate.pairId === `${fromAsset.id}_${toAsset.id}` ? null : (
            <LoadingSpinner />
          )}
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-8 items-center">
        <Animate
          animateKey="swap-quote-switch"
          className="flex flex-col gap-1 items-center"
        >
          <motion.div
            className="flex items-center justify-between gap-2"
            animate={isAnimating ? { y: 100 } : {}}
            onAnimationComplete={() => {
              if (isAnimating) {
                const fromAssetOld = fromAsset;
                const toAssetOld = toAsset;

                amountCallback(toAmount, "from");
                amountCallback(fromAmount, "to");
                assetCallback(toAssetOld, "from");
                assetCallback(fromAssetOld, "to");
                minimumCallback(0);
                maximumCallback(100000);

                setIsAnimating(false);
              }
            }}
          >
            <SwapSelectionDialog
              assets={assets}
              currency={currency}
              fromAsset={fromAsset}
              toAsset={toAsset}
              fromAmount={fromAmount}
              toAmount={toAmount}
              minimum={minimum}
              maximum={maximum}
              disabled={!exchangeRate}
              assetCallback={assetCallback}
              amountCallback={amountCallback}
              direction="from"
            >
              from
            </SwapSelectionDialog>
          </motion.div>
          <motion.div
            className="flex justify-center w-fit mt-2 hover:cursor-pointer"
            onClick={() => setIsAnimating(true)}
            animate={
              isAnimating ? { rotate: 360, transition: { duration: 0.5 } } : {}
            }
            onAnimationComplete={() => setIsAnimating(false)}
          >
            <ArrowDownUpIcon className="w-6 h-6 text-primary hover:cursor-pointer" />
          </motion.div>
          <motion.div
            className="flex items-center justify-between w-full"
            animate={isAnimating ? { y: -100 } : {}}
            onAnimationComplete={() => {
              setIsAnimating(false);
            }}
          >
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
          </motion.div>
        </Animate>
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
