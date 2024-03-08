import { SwapError, SwapErrorType } from "@/lib/errors";
import { preparePostRequest } from "@/lib/fetch";
import { ExodusOrder } from "@/lib/swap/order";

export async function POST(req: Request) {
  try {
    const orderParams: ExodusOrder = await req.json();
    console.error({ orderParams });
    const response = await fetch(
      preparePostRequest("orders", "POST", orderParams)
    );
    const json = await response.json();

    console.error(json);

    if (!response.ok) {
      throw new Error(
        "Order creation unsuccessful. Request to Exodus Exchange API has failed"
      );
    }

    return Response.json(json);
  } catch (error) {
    throw new SwapError({
      type: SwapErrorType.ExodusApiFailure,
      message: "Order failed to create.",
      error: error,
    });
  }
}
