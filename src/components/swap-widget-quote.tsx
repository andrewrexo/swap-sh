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
import { ArrowDownUpIcon } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "./ui/button";

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
    } else if (fromAmount > maximum) {
      setLimitWarning({
        active: true,
        size: "maximum",
      });
    } else if (fromAmount < minimum) {
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

  const onSetMaximum = () => {
    amountCallback(maximum, "from");
  };

  const onSetMinimum = () => {
    amountCallback(minimum, "from");
  };

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
        <div className="flex flex-col gap-1 items-center">
          <motion.div
            className="flex items-center justify-between gap-2"
            animate={
              isAnimating
                ? {
                    y: 132,
                    transitionEnd: {
                      y: 0,
                    },
                    transition: {
                      duration: 0.2,
                      type: "tween",
                    },
                  }
                : {}
            }
            onAnimationComplete={() => {
              if (isAnimating) {
                setIsAnimating(false);

                assetCallback(toAsset, "from");
                assetCallback(fromAsset, "to");
                minimumCallback(0);
                maximumCallback(100000);
                amountCallback(toAmount, "from");
                amountCallback(fromAmount, "to");
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
          <div className="flex justify-center w-fit mt-4 mb-2 items-center gap-x-8">
            <Button variant="link" onClick={onSetMinimum}>
              min
            </Button>
            <motion.div
              className="hover:cursor-pointer"
              onClick={() => {
                if (!isAnimating) setIsAnimating(true);
              }}
              animate={
                isAnimating
                  ? {
                      rotate: 180,
                      transition: {
                        duration: 0.2,
                        type: "tween",
                      },
                      transitionEnd: { rotate: 0 },
                    }
                  : {}
              }
            >
              <ArrowDownUpIcon className="w-6 h-6 text-primary hover:cursor-pointer" />
            </motion.div>
            <Button
              variant="link"
              className="border-primary"
              onClick={onSetMaximum}
            >
              max
            </Button>
          </div>

          <motion.div
            className="flex items-center justify-between w-full"
            animate={
              isAnimating
                ? {
                    y: -132,
                    transitionEnd: {
                      y: 0,
                    },
                    transition: {
                      duration: 0.2,
                      type: "tween",
                    },
                  }
                : {}
            }
            onAnimationComplete={() => {
              if (isAnimating) {
                setIsAnimating(false);
              }
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
