"use client";
import {
  Asset,
  AssetNetworkRecord,
  FiatCurrency,
  SwapDirection,
} from "@/lib/swap/types";
import { useEffect, useState } from "react";
import { SwapWidgetQuote } from "./swap-widget-quote";
import { SwapWidgetConfirm } from "./swap-widget-confirm";
import { AnimatePresence, motion } from "framer-motion";
import { Animate } from "./ui/animate";
import {
  ExodusOrderResponse,
  SwapStageEvent,
  getExodusOrder,
  getProviderOrder,
} from "@/lib/swap/order";
import { getRateForPair } from "@/lib/swap/rates";

export function SwapWidget({ assets }: { assets: AssetNetworkRecord }) {
  const [currency, setCurrency] = useState<FiatCurrency>(FiatCurrency.USD);
  const [exchangeRate, setExchangeRate] = useState<any>(0);
  const [minimum, setMinimum] = useState<number>(0);
  const [maximum, setMaximum] = useState<number>(0);
  const [order, setOrder] = useState<ExodusOrderResponse>();
  const [fromAmount, setFromAmount] = useState<number>(1);
  const [toAmount, setToAmount] = useState<number>(0);
  const [fromAsset, setFromAsset] = useState<Asset | undefined>(
    assets.solana.find((asset) => asset.id === "SOL")
  );
  const [toAsset, setToAsset] = useState<Asset | undefined>(
    assets.solana.find((asset) => asset.id === "USDCSOL")
  );
  const [swapStage, setSwapStage] = useState<SwapStageEvent>(
    SwapStageEvent.Draft
  );
  const [swapUiProgress, setSwapUiProgress] = useState<SwapStageEvent>(
    SwapStageEvent.Draft
  );

  const placeOrderWithProvider = () => {
    setSwapStage((stage) => SwapStageEvent.Pending);
  };

  const handleAssetChange = (asset: Asset, direction: SwapDirection) => {
    if (direction === "from") {
      setFromAsset(asset);
    } else {
      setToAsset(asset);
    }
  };

  const handleAmountChange = (amount: number, direction: SwapDirection) => {
    if (direction === "from") {
      setFromAmount(amount);
    } else {
      setToAmount(amount);
    }
  };

  const handleSwap = (
    swapStage: SwapStageEvent,
    orderResponse?: ExodusOrderResponse
  ) => {
    if (orderResponse && orderResponse.payInAddress !== "") {
      setOrder(orderResponse);
    }

    setSwapStage(swapStage);
  };

  useEffect(() => {
    if (fromAsset && toAsset) {
      const rates = getRateForPair(fromAsset.id, toAsset.id);

      rates.then((value) => {
        if (value.length > 0) {
          const lastRate = value.shift();
          setExchangeRate(lastRate);
          setFromAmount(lastRate.min.value * 1.05);
          setMinimum(lastRate.min.value * 1.03);
          setMaximum(lastRate.max.value * 0.97);
        } else {
          setExchangeRate(0);
          setMinimum(0);
          setMaximum(0);
        }
      });
    }
  }, [fromAsset, toAsset]);

  useEffect(() => {
    if (exchangeRate) {
      const toAmount = parseFloat(
        (
          fromAmount * exchangeRate.amount.value -
          exchangeRate.minerFee.value
        ).toFixed(8)
      );

      if (toAmount < 0) {
        setToAmount(0);
      } else {
        setToAmount(toAmount);
      }
    }

    if (fromAmount === 0 || fromAmount.toString() == "") {
      setToAmount(0);
    }
  }, [fromAmount, exchangeRate]);

  useEffect(() => {
    if (swapStage === SwapStageEvent.Pending) {
      setSwapUiProgress(SwapStageEvent.Pending);
    } else if (swapStage === SwapStageEvent.Draft) {
      setSwapUiProgress(SwapStageEvent.Draft);
    }
  }, [swapStage]);

  const renderWidget = () => {
    switch (swapUiProgress) {
      case SwapStageEvent.Draft: {
        return (
          <Animate animateKey="swap-quote">
            <SwapWidgetQuote
              assets={assets}
              buttonCallback={placeOrderWithProvider}
              currency={currency}
              fromAmount={fromAmount}
              minimum={minimum}
              maximum={maximum}
              toAmount={toAmount}
              fromAsset={fromAsset}
              toAsset={toAsset}
              exchangeRate={exchangeRate}
              assetCallback={handleAssetChange}
              amountCallback={handleAmountChange}
            />
          </Animate>
        );
      }
      case SwapStageEvent.Pending: {
        return (
          <Animate animateKey="swap-confirm">
            <SwapWidgetConfirm
              fromAmount={fromAmount}
              toAmount={toAmount}
              fromAsset={fromAsset}
              toAsset={toAsset}
              order={order}
              swapCallback={handleSwap}
              swapStage={swapStage}
            />
          </Animate>
        );
      }
      case SwapStageEvent.Created: {
        return (
          <Animate animateKey="swap-confirm">
            <SwapWidgetConfirm
              fromAmount={fromAmount}
              toAmount={toAmount}
              fromAsset={fromAsset}
              toAsset={toAsset}
              order={order}
              swapCallback={handleSwap}
              swapStage={swapStage}
            />
          </Animate>
        );
      }
      case SwapStageEvent.WaitingForDeposit: {
        return (
          <Animate animateKey="swap-confirm">
            <SwapWidgetConfirm
              fromAmount={fromAmount}
              toAmount={toAmount}
              fromAsset={fromAsset}
              toAsset={toAsset}
              order={order}
              swapCallback={handleSwap}
              swapStage={swapStage}
            />
          </Animate>
        );
      }
    }
  };

  return (
    <div className="mt-auto mb-auto">
      <AnimatePresence mode="wait">{renderWidget()}</AnimatePresence>
    </div>
  );
}
