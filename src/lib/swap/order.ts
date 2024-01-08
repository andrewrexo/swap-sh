import { ExodusOrderUpdate } from "@/app/api/order/update/route";

import { SwapError, SwapErrorType } from "../errors";
import { baseUrl } from "../config";

export const getExodusOrder = async (
  id: string
): Promise<ExodusOrderResponse> => {
  try {
    const request = `${baseUrl}/order/${id}`;
    const response = await fetch(request, {
      cache: 'no-store'
    });

    if (!response.ok) {
      console.error(
        "Request to Exodus Exchange orders API has failed",
        response.status
      );
    }

    const order = await response.json();

    if(!order.id) {
      return;
    }

    return order;
  } catch (error) {
    throw new SwapError({
      type: SwapErrorType.ExodusApiFailure,
      message: "Failed to fetch order.",
      error: error,
    });
  }
};

export const getProviderOrder = async (id: string): Promise<any> => {
  try {
    const request = `${baseUrl}/order/${id}/provider`;
    const response = await fetch(request);

    if (!response.ok) {
      console.error(
        "Request to Exodus Exchange orders API has failed",
        response.status
      );
    }

    const order = await response.json();
    return order;
  } catch (error) {
    throw new SwapError({
      type: SwapErrorType.ExodusApiFailure,
      message: "Failed to fetch provider order ID.",
      error: error,
    });
  }
};

export const createExodusOrder = async (
  params: ExodusOrder
): Promise<ExodusOrderResponse> => {
  try {
    const request = `${baseUrl}/order/create`;
    const response = await fetch(request, {
      body: JSON.stringify(params),
      method: "POST",
    });

    const json = await response.json();

    if (!response.ok) {
      console.error(
        "Orders creation unsuccessful. Request to Exodus Exchange API has failed",
        response.status
      );
    }

    return json;
  } catch (error) {
    throw new SwapError({
      type: SwapErrorType.ExodusApiFailure,
      message: "Order failed to create.",
      error: error,
    });
  }
};

export const updateExodusOrder = async (
  params: ExodusOrderUpdate
): Promise<ExodusOrderResponse> => {
  try {
    const request = `${baseUrl}/order/update`;
    const response = await fetch(request, {
      body: JSON.stringify(params),
      method: "POST",
    });

    const json = await response.json();

    if (!response.ok) {
      console.error(
        "Orders creation unsuccessful. Request to Exodus Exchange API has failed",
        response.status
      );
    }

    return json;
  } catch (error) {
    throw new SwapError({
      type: SwapErrorType.ExodusApiFailure,
      message: "Order failed to create.",
      error: error,
    });
  }
};

export enum SwapStageEvent {
  Draft = 1,
  WaitingForProvider = 2,
  Created = 3,
  WaitingForDeposit = 4,
  Pending = 5,
  Complete = 6,
}

export interface Amount {
  assetId: string;
  value: number;
}

export interface ExtraFeatures {
  pid: string;
  stringAmounts: string;
}

export interface ExodusOrder {
  fromAmount: string;
  fromAddress: string;
  fromAddressTag?: string;
  toAddress: string;
  toAddressTag?: string;
  pairId: string;
  toAmount: string;
  slippage?: number;
  referrerCode?: string;
}

export interface ExodusOrderResponse {
  amount: Amount;
  createdAt: string;
  fromAddress: string;
  fromAddressTag: string;
  fromTransactionId: string;
  id: string;
  pairId: string;
  payInAddress: string;
  payInAddressTag: string;
  providerOrderId: string;
  rateId: string;
  toAddress: string;
  toAddressTag: string;
  toTransactionId: string;
  updatedAt: string;
  status: OrderStatus;
  extraFeatures: ExtraFeatures;
}

export enum OrderStatus {
  Complete = "complete",
  Expired = "expired",
  InProgress = "inProgress",
  Failed = "failed",
  Refunded = "refunded",
  Swapped = "swapped",
}
