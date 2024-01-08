import { SwapError, SwapErrorType } from "@/lib/errors";
import { preparePostRequest } from "@/lib/fetch";

export interface ExodusOrderUpdate {
  id: string;
  transactionId: string;
}

export async function POST(req: Request) {
  try {
    const updateParams: ExodusOrderUpdate = await req.json();
    const response = await fetch(preparePostRequest(`orders/${updateParams.id}`, "PATCH", updateParams));
    const json = await response.json();

    if (!response.ok) {
      throw new Error("Order update unsuccessful. Request to Exodus Exchange API has failed");
    }

    return Response.json(json);
  } catch (error) {
    throw new SwapError({
      type: SwapErrorType.ExodusApiFailure,
      message: "Order failed to update with deposit.",
      error: error,
    });
  }
}
