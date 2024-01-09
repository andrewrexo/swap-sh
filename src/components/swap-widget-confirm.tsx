"use client";
import { ArrowBigLeftDash, ArrowBigRightDash, ArrowLeftRightIcon, BellRing, Check } from "lucide-react";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import QRCode from "react-qr-code";
import { cn, formatDate } from "@/lib/utils";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Asset } from "@/lib/swap/types";
import { QuestionMarkCircledIcon, QuestionMarkIcon, ReloadIcon } from "@radix-ui/react-icons";
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  ExodusOrderResponse,
  OrderStatus,
  SwapStageEvent,
  createExodusOrder,
  getExodusOrder,
  updateExodusOrder,
} from "@/lib/swap/order";
import { AnimatePresence, motion } from "framer-motion";
import { Animate } from "@/components/ui/animate";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { SwapWidgetDepositDialog } from "./swap-widget-deposit-dialog";
import { LabeledInput } from "./ui/labeled-input";
import { networkBlockExplorerMap } from "@/lib/swap/constants";

const blankNotification = {
  title: "",
};

type CardProps = React.ComponentProps<typeof Card>;

export function SwapWidgetConfirm({
  className,
  fromAmount,
  toAmount,
  fromAsset,
  toAsset,
  order,
  //setOrder,
  swapCallback,
  swapStage,
  ...props
}: {
  fromAmount: number;
  toAmount: number;
  toAsset: Asset | undefined;
  fromAsset: Asset | undefined;
  order: ExodusOrderResponse | undefined;
  //setOrder: () => void;
  swapCallback?: (swapStage: SwapStageEvent, orderResponse?: ExodusOrderResponse) => void;
  swapStage: SwapStageEvent;
} & CardProps) {
  const [exodusOrder, setExodusOrder] = useState(order);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [deposit, setDeposit] = useState("");
  const [swapEvents, setSwapEvents] = useState<
    Array<{
      title: string;
      time?: number;
    }>
  >(Array(4).fill(blankNotification));

  const updateSwapEvents = (event: { title: string; time: number }) => {
    console.log({ swapEvents, events: [event, ...swapEvents] });
    setSwapEvents([event, ...swapEvents]);
  };

  const formSchema = z.object({
    refundAddress: z.string().min(24, {
      message: `Please enter a valid ${fromAsset?.id} address.`,
    }),
    payoutAddress: z.string().min(24, {
      message: `Please enter a valid ${toAsset?.id} address.`,
    }),
    emailAddress: z.string().min(8, {
      message: `Please enter a valid email address.`,
    }),
  });

  useEffect(() => {
    let interval;

    const fetchOrders: () => Promise<OrderStatus> = async () => {
      const exodusOrder = await getExodusOrder(order.id);
      setExodusOrder(exodusOrder);
      order = exodusOrder;

      if (exodusOrder.status === OrderStatus.Complete) {
        updateSwapEvents({
          title: `Your ${fromAsset.id}_${toAsset.id} order has completed!`,
          time: Date.now(),
        });
        toast(`zr ${fromAsset.id}_${toAsset.id} order has completed! TXID: ${exodusOrder.toTransactionId}`);
        clearInterval(interval);
      } else if (exodusOrder.status === OrderStatus.Failed) {
        updateSwapEvents({
          title: `Your ${fromAsset.id}_${toAsset.id} order has failed.`,
          time: Date.now(),
        });

        toast(`Your ${fromAsset.id}_${toAsset.id} order has failed.`);
      }

      return exodusOrder.status;
    };

    if (order && order.status !== OrderStatus.Complete) {
      interval = setInterval(() => {
        fetchOrders();
      }, 15000);

      return () => {
        clearInterval(interval);
      };
    }
  }, [order]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      payoutAddress: "",
      refundAddress: "",
      emailAddress: "",
    },
  });

  useEffect(() => {
    console.log(swapEvents);
  }, [swapEvents]);

  const handleMarkPaid = (deposit: string) => {
    setButtonDisabled(true);
    setDeposit(deposit);

    const uOrder = updateExodusOrder({ id: order.id, transactionId: deposit });

    uOrder
      .then((o) => {
        setButtonDisabled(false);
        swapCallback(SwapStageEvent.WaitingForProvider);
        toast(`Deposited ${fromAsset?.id}. TXID: ${deposit}`);
        updateSwapEvents({
          title: `Deposited ${fromAsset?.id}`,
          time: Date.now(),
        });
      })
      .catch((e) => {
        toast(`Failed to detect deposit. Please try again.`);
        setButtonDisabled(false);
      });
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
    const { payoutAddress, refundAddress } = values;
    const order = createExodusOrder({
      fromAddress: refundAddress,
      toAddress: payoutAddress,
      fromAmount: fromAmount.toString(),
      toAmount: toAmount.toString(),
      pairId: `${fromAsset?.id}_${toAsset?.id}`,
      slippage: 5.0,
    });

    setButtonDisabled(true);

    order
      .then((o) => {
        if (o.providerOrderId) {
          setButtonDisabled(false);
          swapCallback(SwapStageEvent.WaitingForDeposit, o);
          updateSwapEvents({ title: "Swap in progress", time: Date.now() });
          toast(`Your ${fromAsset?.id}_${toAsset?.id} swap has been created. Please send your deposit.`);
        }
      })
      .catch((e) => {
        toast(`Your ${fromAsset?.id}_${toAsset?.id} swap has failed to create.`);
        console.log(e);
        setButtonDisabled(false);
      });
  };

  const renderPanel = () => {
    switch (swapStage) {
      case SwapStageEvent.WaitingForProvider: {
        return (
          <Animate animateKey="swap-show-progress" className="flex flex-col h-full w-full gap-8 md:gap-4 items-center">
            <h1 className="font-semibold text-primary text-center text-lg">
              {order.status === OrderStatus.Complete
                ? `Your swap is complete!`
                : `Your swap is in progress, the provider will send your funds shortly.`}
            </h1>
            <div className="flex gap-2, items-center">
              <div className="flex flex-col items-center gap-1">
                <Image width={48} height={48} src={fromAsset.logo ?? ""} alt={fromAsset.symbol} className="w-10 h-10" />
                <p className="text-xs">{`${fromAmount} ${fromAsset.id}`}</p>
              </div>
              <motion.div
                className="mb-5"
                initial={{
                  scale: 1,
                }}
                animate={{
                  rotate: 180,
                  scale: [1.2, 1],
                }}
                transition={{ delay: 1.0, type: "spring", stiffness: 100, duration: 0.75, times: [0, 0.5, 1] }}
              >
                <ArrowLeftRightIcon className="text-primary w-7 h-7" />
              </motion.div>
              <div className="flex flex-col items-center gap-1">
                <Image width={24} height={24} src={toAsset.logo ?? ""} alt={toAsset.symbol} className="w-10 h-10" />
                <p className="text-xs">{`${toAmount} ${toAsset.id}`}</p>
              </div>
            </div>
            <a
              className="text-muted-foreground max-w-[300px] break-words text-sm text-center"
              href={`${networkBlockExplorerMap.get(toAsset.network)}${order.toTransactionId}`}
              target="_blank"
            >
              {order.toTransactionId}
            </a>
            <p className="text-xs break-words text-center mt-auto">
              If you have any issues with your swap, please contact us with your Order ID.
            </p>
          </Animate>
        );
      }
      case SwapStageEvent.WaitingForDeposit: {
        return (
          <Animate animateKey="swap-show-qr">
            <div className="flex flex-col gap-3 items-center pb-4 md:pb-0">
              <div className="w-full max-w-40 bg-white p-2 h-auto">
                {order && order.status === OrderStatus.InProgress && order?.payInAddress && (
                  <QRCode value={order.payInAddress} className="h-auto max-w-full w-full" />
                )}
              </div>
              <p className="text-xs font-medium text-muted-foreground">{`${order?.payInAddress}`}</p>
              <p className="font-medium text-xs">{`Please send ${fromAmount} ${fromAsset?.id} to the address above.`}</p>

              <p className="text-xs text-center">{`${fromAmount} ${fromAsset?.id} for ${toAmount.toFixed(8)} ${
                toAsset?.id
              }`}</p>
            </div>
          </Animate>
        );
      }
      case SwapStageEvent.Pending: {
        return (
          <Animate animateKey="swap-form" initial={false}>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} id="customerForm">
                <div className="w-full h-full pt-2">
                  <div className="flex flex-col space-y-8 [&>*:first-child]:mt-2">
                    <FormField
                      control={form.control}
                      name="payoutAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <LabeledInput id="payoutAddress" inputKey="payoutAddress" type="text" {...field}>
                              <div className="flex gap-2 items-center">
                                <FormLabel className=" text-xs">Payout Address</FormLabel>
                              </div>
                            </LabeledInput>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="refundAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <LabeledInput id="refundAddress" inputKey="refundAddress" type="text" {...field}>
                              <div className="flex gap-2 items-center">
                                <FormLabel className=" text-xs">Refund Address</FormLabel>
                              </div>
                            </LabeledInput>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="emailAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <LabeledInput id="emailAddress" inputKey="emailAddress" type="text" {...field}>
                              <div className="flex gap-1 items-center">
                                <FormLabel className="text-xs">Email Address</FormLabel>
                              </div>
                            </LabeledInput>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </form>
            </Form>
            <p className="text-xs text-center mt-6 md:mb-0 mb-1 md:mt-6 text-muted-foreground">
              Please verify your information before initiating an exchange.
            </p>
          </Animate>
        );
      }
    }
  };

  return (
    <Card className={cn("md:w-[700px] space-y-2", className)} {...props}>
      <CardHeader className="flex justify-between flex-col gap-4 pb-3 p-5">
        <div className="flex justify-between">
          <div className="flex flex-col">
            <p className="text-lg font-semibold">Swap</p>
          </div>
          <div className="flex flex-col text-right pt-[6px]">
            <CardTitle className="text-primary">
              <CardDescription className="text-muted-foreground font-normal">
                {order
                  ? `${formatDate(new Date(order.createdAt))}`
                  : `${fromAmount} ${fromAsset?.id} for ${toAmount.toFixed(2)} ${toAsset?.id}`}
              </CardDescription>
            </CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent
        className={`grid grid-rows-1 ${
          swapStage !== SwapStageEvent.Pending &&
          swapEvents.filter((event) => !isNaN(event.time)).length > 0 &&
          `md:grid-cols-[auto_10px_40%]`
        } md:gap-3 pb-0 gap-6`}
      >
        <AnimatePresence mode="wait">{renderPanel()}</AnimatePresence>
        {swapStage !== SwapStageEvent.Pending && swapStage !== SwapStageEvent.Complete && (
          <span className="hidden md:block" />
        )}
        <div
          className={`${
            swapStage === SwapStageEvent.Pending || (order.status === OrderStatus.Complete && `hidden`)
          } flex flex-col justify-center`}
        >
          {swapEvents.slice(0, 4).map((notification, index) => (
            <div key={index} className="mb-2 grid grid-cols-[20px_1fr] items-start last:pb-0">
              <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
              <div className="space-y-1">
                <div className="text-sm font-medium leading-none">
                  {notification.title || <Skeleton className="w-full h-[20px] rounded-full" />}
                </div>
                <div className="text-sm text-muted-foreground">
                  {(notification.time && new Date(notification.time).toLocaleString()) || (
                    <Skeleton className="w-[100px] h-[20px] rounded-full" />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-2 space-y-4 p-5">
        <Separator orientation="horizontal" className="" />
        <div className=" flex items-center space-x-4 rounded-md border p-4 w-full">
          <BellRing />
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium leading-none">Alerts</p>
            <p className="text-sm text-muted-foreground">Notify me when there&#39;s an update with my exchange.</p>
          </div>
          <Switch checked />
        </div>
        {swapStage === SwapStageEvent.WaitingForDeposit && (
          <SwapWidgetDepositDialog submitCallback={handleMarkPaid}>
            <Button className="w-full mt-4" disabled={buttonDisabled}>
              {buttonDisabled ? (
                <>
                  <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                  Verifying Deposit...
                </>
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Mark as Paid
                </>
              )}
            </Button>
          </SwapWidgetDepositDialog>
        )}
        {![SwapStageEvent.WaitingForDeposit, SwapStageEvent.WaitingForProvider].includes(swapStage) ? (
          <Button type="submit" form="customerForm" className="w-full mt-4" disabled={buttonDisabled}>
            {buttonDisabled ? (
              <>
                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                {swapStage === SwapStageEvent.WaitingForDeposit ? "Verifying deposit..." : "Placing swap..."}
              </>
            ) : (
              <>
                <Check className="mr-2 h-4 w-4" />
                Confirm Swap
              </>
            )}
          </Button>
        ) : undefined}
      </CardFooter>
    </Card>
  );
}
